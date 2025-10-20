import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type SubscriptionTier = Database['public']['Enums']['subscription_tier'];

interface SubscriptionData {
  tier: SubscriptionTier;
  monthlyChapterCredits: number;
  monthlyImageCredits: number;
  creditsUsedThisMonth: number;
  imagesUsedThisMonth: number;
  loading: boolean;
}

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<SubscriptionData>({
    tier: 'free',
    monthlyChapterCredits: 5,
    monthlyImageCredits: 30,
    creditsUsedThisMonth: 0,
    imagesUsedThisMonth: 0,
    loading: true,
  });

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setSubscription(prev => ({ ...prev, loading: false }));
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('subscription_tier, monthly_chapter_credits, monthly_image_credits, credits_used_this_month, images_used_this_month')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      if (profile) {
        setSubscription({
          tier: profile.subscription_tier || 'free',
          monthlyChapterCredits: profile.monthly_chapter_credits || 5,
          monthlyImageCredits: profile.monthly_image_credits || 30,
          creditsUsedThisMonth: profile.credits_used_this_month || 0,
          imagesUsedThisMonth: profile.images_used_this_month || 0,
          loading: false,
        });
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setSubscription(prev => ({ ...prev, loading: false }));
    }
  };

  const hasFeature = (feature: 'pro' | 'studio'): boolean => {
    if (feature === 'pro') {
      return subscription.tier === 'pro' || subscription.tier === 'studio';
    }
    if (feature === 'studio') {
      return subscription.tier === 'studio';
    }
    return false;
  };

  const canGenerateChapter = (): boolean => {
    return subscription.creditsUsedThisMonth < subscription.monthlyChapterCredits;
  };

  const canGenerateImage = (): boolean => {
    return subscription.imagesUsedThisMonth < subscription.monthlyImageCredits;
  };

  const refreshSubscription = () => {
    fetchSubscription();
  };

  return {
    ...subscription,
    hasFeature,
    canGenerateChapter,
    canGenerateImage,
    refreshSubscription,
  };
};

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getUserFriendlyError, logError } from "@/lib/errorHandler";
import { z } from "zod";
import { useSubscription } from "@/hooks/useSubscription";

// Input validation schema
const promptInputSchema = z.object({
  prompt: z.string()
    .trim()
    .min(1, "Prompt cannot be empty")
    .max(2000, "Prompt must be less than 2000 characters"),
  tone: z.string().trim().min(1).max(50),
  projectId: z.string().uuid("Invalid project ID"),
  chapterId: z.string().uuid("Invalid chapter ID"),
});

interface AIAssistantProps {
  projectId: string;
  currentChapter: any;
  tone: string;
  onGenerate: (text: string) => void;
}

const AIAssistant = ({ projectId, currentChapter, tone, onGenerate }: AIAssistantProps) => {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const subscription = useSubscription();

  const handleGenerate = async () => {
    // Check if user has credits
    if (!subscription.canGenerateChapter()) {
      toast.error(`You've used all ${subscription.monthlyChapterCredits} credits this month. Upgrade to get more!`);
      return;
    }

    setGenerating(true);
    try {
      // Validate input before sending
      const validatedInput = promptInputSchema.parse({
        prompt,
        tone,
        projectId,
        chapterId: currentChapter.id,
      });

      const { data, error } = await supabase.functions.invoke("generate-story", {
        body: validatedInput,
      });

      if (error) throw error;
      
      if (data?.text) {
        onGenerate(data.text);
        setPrompt("");
        toast.success("Content generated!");
        subscription.refreshSubscription(); // Refresh to update credit count
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        // Handle validation errors with user-friendly messages
        const firstError = error.errors[0];
        toast.error(firstError.message);
      } else {
        toast.error(getUserFriendlyError(error));
      }
    } finally {
      setGenerating(false);
    }
  };

  // Debug logging (only in development)
  if (import.meta.env.DEV) {
    console.log('Subscription state:', {
      loading: subscription.loading,
      tier: subscription.tier,
      creditsUsed: subscription.creditsUsedThisMonth,
      creditsAllowed: subscription.monthlyChapterCredits,
      canGenerate: subscription.canGenerateChapter()
    });
  }

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-6 pb-4 border-b border-border/30">
        <h3 className="flex items-center gap-2 font-semibold text-lg mb-2">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          AI Assistant
        </h3>
        <p className="text-xs text-muted-foreground mb-3">Generate and enhance your story with AI</p>
        
        <div className="glass-card p-3 space-y-2">
          <div className="text-xs text-muted-foreground">
            {subscription.loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Loading credits...</span>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Credits Used</span>
                  <span className="font-semibold gradient-text">
                    {subscription.creditsUsedThisMonth} / {subscription.monthlyChapterCredits}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Plan</span>
                  <span className="text-primary font-medium">
                    {subscription.tier === 'free' && '✨ Free'}
                    {subscription.tier === 'pro' && '🚀 Pro'}
                    {subscription.tier === 'studio' && '💎 Studio'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <Textarea
          placeholder="Describe what you want to write... Be specific for better results! ✨"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="mb-3 flex-1 min-h-[200px] resize-none transition-all focus:shadow-elevated"
          maxLength={2000}
        />
        <div className="flex items-center justify-between mb-4 text-xs text-muted-foreground">
          <span>Be detailed for best results</span>
          <span>{prompt.length}/2000</span>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={generating || !subscription.canGenerateChapter()}
          className="w-full hover-lift transition-spring"
          size="lg"
        >
          {!subscription.canGenerateChapter() ? (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Out of Credits
            </>
          ) : generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Magic...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Content
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AIAssistant;

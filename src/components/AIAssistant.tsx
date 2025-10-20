import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getUserFriendlyError } from "@/lib/errorHandler";
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

  // Debug logging
  console.log('Subscription state:', {
    loading: subscription.loading,
    tier: subscription.tier,
    creditsUsed: subscription.creditsUsedThisMonth,
    creditsAllowed: subscription.monthlyChapterCredits,
    canGenerate: subscription.canGenerateChapter()
  });

  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-4">
        <h3 className="flex items-center gap-2 font-semibold">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Assistant
        </h3>
        <p className="text-xs text-muted-foreground">Generate and enhance your story</p>
        <div className="mt-2 text-xs text-muted-foreground">
          {subscription.loading ? (
            <span>Loading credits...</span>
          ) : (
            <span>
              {subscription.creditsUsedThisMonth} / {subscription.monthlyChapterCredits} credits used this month
              {subscription.tier === 'free' && ' (Free)'}
              {subscription.tier === 'pro' && ' (Pro)'}
              {subscription.tier === 'studio' && ' (Studio)'}
            </span>
          )}
        </div>
      </div>

      <Textarea
        placeholder="Describe what you want to write..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="mb-4 flex-1"
        maxLength={2000}
      />
      <p className="mb-2 text-xs text-muted-foreground">
        {prompt.length}/2000 characters
      </p>

      <Button
        onClick={handleGenerate}
        disabled={generating || !subscription.canGenerateChapter()}
        className="w-full bg-primary"
      >
        {!subscription.canGenerateChapter() ? (
          <>
            <Lock className="mr-2 h-4 w-4" />
            Out of Credits
          </>
        ) : generating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate
          </>
        )}
      </Button>
    </div>
  );
};

export default AIAssistant;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getUserFriendlyError } from "@/lib/errorHandler";

interface AIAssistantProps {
  projectId: string;
  currentChapter: any;
  tone: string;
  onGenerate: (text: string) => void;
}

const AIAssistant = ({ projectId, currentChapter, tone, onGenerate }: AIAssistantProps) => {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-story", {
        body: { prompt, tone, projectId, chapterId: currentChapter.id },
      });

      if (error) throw error;
      
      if (data?.text) {
        onGenerate(data.text);
        setPrompt("");
        toast.success("Content generated!");
      }
    } catch (error: any) {
      toast.error(getUserFriendlyError(error));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-4">
        <h3 className="flex items-center gap-2 font-semibold">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Assistant
        </h3>
        <p className="text-xs text-muted-foreground">Generate and enhance your story</p>
      </div>

      <Textarea
        placeholder="Describe what you want to write..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="mb-4 flex-1"
      />

      <Button
        onClick={handleGenerate}
        disabled={generating}
        className="w-full bg-primary"
      >
        {generating ? (
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

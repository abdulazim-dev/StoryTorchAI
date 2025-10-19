import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Sparkles, Plus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import CharacterVault from "@/components/CharacterVault";
import ChapterList from "@/components/ChapterList";
import AIAssistant from "@/components/AIAssistant";
import { getUserFriendlyError, logError } from "@/lib/errorHandler";

interface Project {
  id: string;
  title: string;
  tone: string;
  story_memory: any;
}

interface Chapter {
  id: string;
  title: string;
  content: string | null;
  chapter_number: number;
}

const Editor = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    checkAuth();
    if (projectId) {
      loadProject();
      loadChapters();
    }
  }, [projectId]);

  const checkAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        logError('Editor.checkAuth', error);
        navigate("/auth");
        return;
      }

      if (!session) {
        navigate("/auth");
      }
    } catch (error) {
      logError('Editor.checkAuth', error);
      navigate("/auth");
    }
  };

  const loadProject = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error: any) {
      toast.error(getUserFriendlyError(error));
      logError('Editor.loadProject', error);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const loadChapters = async () => {
    try {
      const { data, error } = await supabase
        .from("chapters")
        .select("*")
        .eq("project_id", projectId)
        .order("chapter_number", { ascending: true });

      if (error) throw error;
      setChapters(data || []);
      
      // Load first chapter if available
      if (data && data.length > 0) {
        setCurrentChapter(data[0]);
        setContent(data[0].content || "");
      }
    } catch (error: any) {
      toast.error(getUserFriendlyError(error));
      logError('Editor.loadChapters', error);
    }
  };

  const handleCreateChapter = async () => {
    if (!projectId) return;
    
    try {
      const nextNumber = chapters.length + 1;
      const { data, error } = await supabase
        .from("chapters")
        .insert({
          project_id: projectId,
          title: `Chapter ${nextNumber}`,
          content: "",
          chapter_number: nextNumber,
          word_count: 0,
        })
        .select()
        .single();

      if (error) throw error;
      
      setChapters([...chapters, data]);
      setCurrentChapter(data);
      setContent("");
      toast.success("Chapter created!");
    } catch (error: any) {
      toast.error(getUserFriendlyError(error));
      logError('Editor.handleCreateChapter', error);
    }
  };

  const handleSaveChapter = async () => {
    if (!currentChapter) return;
    
    setSaving(true);
    try {
      const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
      
      const { error } = await supabase
        .from("chapters")
        .update({
          content,
          word_count: wordCount,
        })
        .eq("id", currentChapter.id);

      if (error) throw error;
      
      toast.success("Chapter saved!");
      
      // Update local state
      setChapters(chapters.map(ch => 
        ch.id === currentChapter.id 
          ? { ...ch, content }
          : ch
      ));
    } catch (error: any) {
      toast.error(getUserFriendlyError(error));
      logError('Editor.handleSaveChapter', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSelectChapter = (chapter: Chapter) => {
    setCurrentChapter(chapter);
    setContent(chapter.content || "");
  };

  const handleAIGenerate = async (generatedText: string) => {
    setContent(prev => prev + "\n\n" + generatedText);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border/50 bg-card/30 px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{project.title}</h1>
            <p className="text-sm text-muted-foreground capitalize">{project.tone} tone</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveChapter}
            disabled={saving || !currentChapter}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Chapters & Characters */}
        <div className="w-80 border-r border-border/50 bg-card/20">
          <Tabs defaultValue="chapters" className="h-full">
            <TabsList className="w-full rounded-none border-b border-border/50">
              <TabsTrigger value="chapters" className="flex-1">Chapters</TabsTrigger>
              <TabsTrigger value="characters" className="flex-1">Characters</TabsTrigger>
            </TabsList>

            <TabsContent value="chapters" className="h-[calc(100%-48px)] overflow-y-auto p-4">
              <Button
                onClick={handleCreateChapter}
                className="mb-4 w-full"
                variant="outline"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Chapter
              </Button>
              
              <ChapterList
                chapters={chapters}
                currentChapter={currentChapter}
                onSelectChapter={handleSelectChapter}
              />
            </TabsContent>

            <TabsContent value="characters" className="h-[calc(100%-48px)] overflow-y-auto p-4">
              <CharacterVault projectId={projectId!} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Editor Area */}
        <div className="flex flex-1 flex-col">
          {currentChapter ? (
            <div className="flex flex-1 overflow-hidden">
              {/* Text Editor */}
              <div className="flex-1 p-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold">{currentChapter.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {content.trim().split(/\s+/).filter(Boolean).length} words
                  </p>
                </div>

                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing your story..."
                  className="min-h-[calc(100vh-250px)] resize-none border-none bg-transparent text-base leading-relaxed focus-visible:ring-0"
                />
              </div>

              {/* AI Assistant */}
              <div className="w-96 border-l border-border/50 bg-card/20">
                <AIAssistant
                  projectId={projectId!}
                  currentChapter={currentChapter}
                  tone={project.tone}
                  onGenerate={handleAIGenerate}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <Sparkles className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
                <p className="text-lg text-muted-foreground">
                  Create a chapter to start writing
                </p>
                <Button onClick={handleCreateChapter} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Chapter
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Editor;

import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Sparkles, Plus, Loader2, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import CharacterVault from "@/components/CharacterVault";
import ChapterList from "@/components/ChapterList";
import AIAssistant from "@/components/AIAssistant";
import EditorStats from "@/components/EditorStats";
import AutoSaveIndicator from "@/components/AutoSaveIndicator";
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
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saving" | "saved" | "idle">("idle");
  const [lastSaved, setLastSaved] = useState<Date | undefined>();
  const autoSaveTimeout = useRef<NodeJS.Timeout>();

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

  const handleSelectChapter = async (chapter: Chapter) => {
    // Auto-save current chapter before switching
    if (currentChapter && content !== currentChapter.content) {
      try {
        const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
        
        await supabase
          .from("chapters")
          .update({
            content,
            word_count: wordCount,
          })
          .eq("id", currentChapter.id);
        
        // Update local state
        setChapters(chapters.map(ch => 
          ch.id === currentChapter.id 
            ? { ...ch, content }
            : ch
        ));
      } catch (error: any) {
        logError('Editor.handleSelectChapter.autoSave', error);
      }
    }
    
    setCurrentChapter(chapter);
    setContent(chapter.content || "");
  };

  const handleAIGenerate = async (generatedText: string) => {
    setContent(prev => prev + "\n\n" + generatedText);
  };

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!currentChapter || !content) return;
    
    setAutoSaveStatus("saving");
    try {
      const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
      
      await supabase
        .from("chapters")
        .update({
          content,
          word_count: wordCount,
        })
        .eq("id", currentChapter.id);
      
      setAutoSaveStatus("saved");
      setLastSaved(new Date());
      
      setChapters(chapters.map(ch => 
        ch.id === currentChapter.id 
          ? { ...ch, content }
          : ch
      ));
    } catch (error: any) {
      logError('Editor.autoSave', error);
      setAutoSaveStatus("idle");
    }
  }, [currentChapter, content, chapters]);

  // Trigger auto-save on content change
  useEffect(() => {
    if (autoSaveTimeout.current) {
      clearTimeout(autoSaveTimeout.current);
    }
    
    if (content && currentChapter) {
      autoSaveTimeout.current = setTimeout(() => {
        autoSave();
      }, 2000); // Auto-save after 2 seconds of inactivity
    }
    
    return () => {
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }
    };
  }, [content, autoSave]);

  // Calculate stats
  const totalWords = chapters.reduce((sum, ch) => {
    const words = ch.content?.trim().split(/\s+/).filter(Boolean).length || 0;
    return sum + words;
  }, 0);
  
  const averageWordsPerChapter = chapters.length > 0 
    ? Math.round(totalWords / chapters.length) 
    : 0;

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
      <header className="flex items-center justify-between border-b border-border/50 bg-card/30 px-6 py-4 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="hover-lift"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{project.title}</h1>
            <p className="text-sm text-muted-foreground capitalize">{project.tone} tone</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <AutoSaveIndicator status={autoSaveStatus} lastSaved={lastSaved} />
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveChapter}
            disabled={saving || !currentChapter}
            className="hover-lift"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Now
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Chapters & Characters */}
        <div className="w-80 border-r border-border/50 bg-card/20 backdrop-blur-sm">
          <Tabs defaultValue="chapters" className="h-full">
            <TabsList className="w-full rounded-none border-b border-border/50">
              <TabsTrigger value="chapters" className="flex-1">Chapters</TabsTrigger>
              <TabsTrigger value="characters" className="flex-1">Characters</TabsTrigger>
              <TabsTrigger value="stats" className="flex-1">
                <BarChart3 className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chapters" className="h-[calc(100%-48px)] overflow-y-auto p-4">
              <Button
                onClick={handleCreateChapter}
                className="mb-4 w-full hover-lift animate-scale-in"
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

            <TabsContent value="stats" className="h-[calc(100%-48px)] overflow-y-auto">
              <EditorStats
                totalWords={totalWords}
                totalChapters={chapters.length}
                averageWordsPerChapter={averageWordsPerChapter}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Editor Area */}
        <div className="flex flex-1 flex-col">
          {currentChapter ? (
            <div className="flex flex-1 overflow-hidden">
              {/* Text Editor */}
              <div className="flex-1 p-6 animate-slide-up">
                <div className="mb-6 pb-4 border-b border-border/30">
                  <h2 className="text-3xl font-bold mb-2">{currentChapter.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      📝 {content.trim().split(/\s+/).filter(Boolean).length} words
                    </span>
                    <span className="flex items-center gap-1">
                      📖 Chapter {currentChapter.chapter_number}
                    </span>
                  </div>
                </div>

                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing your story... ✨"
                  className="min-h-[calc(100vh-280px)] resize-none border-none bg-transparent text-base leading-relaxed focus-visible:ring-0 transition-all"
                  style={{ fontSize: '16px', lineHeight: '1.8' }}
                />
              </div>

              {/* AI Assistant */}
              <div className="w-96 border-l border-border/50 bg-card/20 backdrop-blur-sm animate-slide-up">
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

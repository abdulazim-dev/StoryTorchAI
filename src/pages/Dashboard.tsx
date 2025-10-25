import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, BookOpen, Clock, Sparkles, LogOut, Settings as SettingsIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getUserFriendlyError, logError } from "@/lib/errorHandler";
import { z } from "zod";

// Project creation validation schema
const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().trim().max(2000, "Description must be less than 2000 characters").optional(),
  genre: z.string().trim().max(100, "Genre must be less than 100 characters").optional(),
  tone: z.string().trim().min(1).max(50)
});

interface Project {
  id: string;
  title: string;
  description: string | null;
  genre: string | null;
  tone: string;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [userName, setUserName] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  // New project form
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    genre: "",
    tone: "anime",
  });

  useEffect(() => {
    checkUser();
    fetchProjects();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        logError('Dashboard.sessionError', sessionError);
        navigate("/auth");
        return;
      }

      if (!session) {
        navigate("/auth");
        return;
      }

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", session.user.id)
        .single();

      if (profileError) {
        logError('Dashboard.checkUser.fetchProfile', profileError);
      }

      if (profile) {
        setUserName(profile.full_name || session.user.email?.split("@")[0] || "Writer");
      }
    } catch (error) {
      logError('Dashboard.checkUser', error);
      navigate("/auth");
    }
  };

  const fetchProjects = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", session.user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast.error(getUserFriendlyError(error));
      logError('Dashboard.fetchProjects', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      // Validate inputs
      const validated = projectSchema.parse({
        title: newProject.title,
        description: newProject.description || undefined,
        genre: newProject.genre || undefined,
        tone: newProject.tone
      });

      const { data, error } = await supabase
        .from("projects")
        .insert({
          user_id: session.user.id,
          title: validated.title,
          description: validated.description || null,
          genre: validated.genre || null,
          tone: validated.tone,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Project created successfully!");
      setIsCreateOpen(false);
      setNewProject({ title: "", description: "", genre: "", tone: "anime" });
      fetchProjects();

      // Navigate to editor
      if (data) {
        navigate(`/editor/${data.id}`);
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(getUserFriendlyError(error));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
    toast.success("Signed out successfully");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Sparkles className="mx-auto mb-4 h-12 w-12 animate-pulse text-primary" />
          <p className="text-muted-foreground">Loading your stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 glass-card shadow-lg">
        <div className="container mx-auto flex items-center justify-between px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">StoryTorch</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">Welcome, <span className="text-foreground font-semibold">{userName}</span></span>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-primary/10"
              onClick={() => navigate("/settings")}
            >
              <SettingsIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-destructive/10"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="mb-6 gradient-text animate-fade-in">Your Stories</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Continue your creative journey or start a new adventure
          </p>
        </div>

        {/* Create New Project */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Card className="group mb-12 cursor-pointer border-2 border-dashed border-primary/30 glass-card p-12 text-center transition-all duration-500 hover:elevated-card hover:scale-[1.02] relative overflow-hidden">
              <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl group-hover:shadow-primary/30">
                  <Plus className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h3 className="mb-3 text-2xl font-bold group-hover:text-primary transition-colors">Start New Project</h3>
                  <p className="text-muted-foreground text-lg">Begin crafting your next masterpiece</p>
                </div>
              </div>
            </Card>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Start a new story and let AI help you bring it to life
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  placeholder="My Epic Story"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="A brief summary of your story..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="genre">Genre</Label>
                <Input
                  id="genre"
                  placeholder="Science Fiction, Fantasy, Romance..."
                  value={newProject.genre}
                  onChange={(e) => setNewProject({ ...newProject, genre: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">AI Writing Tone</Label>
                <Select value={newProject.tone} onValueChange={(value) => setNewProject({ ...newProject, tone: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anime">Anime</SelectItem>
                    <SelectItem value="thriller">Thriller</SelectItem>
                    <SelectItem value="romance">Romance</SelectItem>
                    <SelectItem value="mystery">Mystery</SelectItem>
                    <SelectItem value="script">Screenplay</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="py-12 text-center">
            <BookOpen className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
            <p className="text-lg text-muted-foreground">No projects yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="group cursor-pointer glass-card p-8 transition-all duration-500 hover:elevated-card hover:-translate-y-2 relative overflow-hidden"
                onClick={() => navigate(`/editor/${project.id}`)}
              >
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10">
                  <div className="mb-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-primary/30">
                        <BookOpen className="h-7 w-7 text-primary" />
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground capitalize bg-secondary/10 px-3 py-1.5 rounded-full">
                        {project.tone}
                      </span>
                    </div>
                    
                    <h3 className="mb-3 text-2xl font-bold line-clamp-1 group-hover:text-primary transition-colors">{project.title}</h3>
                    
                    {project.description && (
                      <p className="mb-4 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    )}
                    
                    {project.genre && (
                      <div className="mb-4">
                        <span className="inline-block rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 px-4 py-1.5 text-xs font-medium text-primary">
                          {project.genre}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t border-border/50">
                    <Clock className="h-3.5 w-3.5" />
                    Updated {new Date(project.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, BookOpen, Users, ArrowRight, Check, Star } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import featuresBg from "@/assets/features-bg.jpg";
import characterIllustration from "@/assets/character-illustration.jpg";
import aiStorytelling from "@/assets/ai-storytelling.jpg";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 mesh-gradient opacity-40" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_100%)]" />

      {/* Navigation */}
      <nav className="relative z-50 border-b border-border/40 backdrop-blur-xl bg-background/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold tracking-tight">StoryTorch</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/auth")} className="hover-lift">
                Sign In
              </Button>
              <Button onClick={() => navigate("/auth")} className="premium-glow hover-lift">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <Badge className="inline-flex gap-2 px-4 py-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                <Star className="h-3 w-3 fill-primary" />
                AI-Powered Story Creation
              </Badge>

              <div className="space-y-4">
                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                  Craft Epic Stories with
                  <span className="gradient-text block mt-2">
                    AI-Powered Magic
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
                  Transform your imagination into compelling narratives. Generate chapters, 
                  develop characters, and build immersive worlds—all powered by cutting-edge AI.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/auth")}
                  className="premium-glow hover-lift transition-spring text-lg px-8 h-14"
                >
                  Start Writing Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-border/50 hover:border-primary/50 hover:bg-primary/5 h-14 px-8 text-lg"
                >
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-gradient-to-br from-primary to-accent" />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="font-semibold">10,000+ Writers</div>
                  <div className="text-muted-foreground">Creating Amazing Stories</div>
                </div>
              </div>
            </div>

            <div className="relative lg:block animate-float">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl rounded-full" />
              <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
                <img 
                  src={heroBanner} 
                  alt="StoryTorch Hero" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 md:py-32">
        <div className="absolute inset-0 opacity-5">
          <img src={featuresBg} alt="" className="w-full h-full object-cover" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <Badge className="inline-flex px-4 py-1.5 bg-accent/10 text-accent border-accent/20">
              Powerful Features
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Everything you need to
              <span className="gradient-text block mt-2">create amazing stories</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Professional-grade tools designed for writers who demand excellence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                title: "AI Chapter Generation",
                description: "Generate compelling chapters with advanced AI that understands narrative structure and pacing.",
                color: "from-primary to-accent"
              },
              {
                icon: Users,
                title: "Character Vault",
                description: "Create detailed character profiles with AI-generated backgrounds, personalities, and relationships.",
                color: "from-accent to-primary"
              },
              {
                icon: BookOpen,
                title: "Smart World Building",
                description: "Build immersive worlds with interconnected locations, histories, and cultures.",
                color: "from-primary to-accent"
              },
              {
                icon: Zap,
                title: "Real-time Collaboration",
                description: "Work seamlessly with co-writers and get instant AI suggestions as you create.",
                color: "from-accent to-primary"
              },
              {
                icon: Star,
                title: "Version Control",
                description: "Never lose your work. Track changes, compare versions, and restore previous drafts.",
                color: "from-primary to-accent"
              },
              {
                icon: Check,
                title: "Export Anywhere",
                description: "Export your masterpiece in multiple formats: PDF, EPUB, DOCX, or HTML.",
                color: "from-accent to-primary"
              }
            ].map((feature, index) => (
              <Card 
                key={index}
                className="premium-card p-8 hover-lift transition-spring group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-display text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Section */}
      <section className="relative py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl rounded-3xl" />
              <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
                <img src={characterIllustration} alt="Character Development" className="w-full" />
              </div>
            </div>

            <div className="space-y-6 order-1 lg:order-2">
              <Badge className="inline-flex px-4 py-1.5 bg-primary/10 text-primary border-primary/20">
                Character Development
              </Badge>
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
                Bring your characters
                <span className="gradient-text block mt-2">to life</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Create multi-dimensional characters with rich backstories, complex personalities, 
                and meaningful relationships. Our AI helps you develop characters that readers 
                will remember long after they finish your story.
              </p>
              <ul className="space-y-4">
                {[
                  "AI-generated character profiles",
                  "Visual character cards",
                  "Relationship mapping",
                  "Character arc tracking"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-32">
        <div className="absolute inset-0 opacity-10">
          <img src={aiStorytelling} alt="" className="w-full h-full object-cover" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <Card className="premium-card p-12 md:p-16 text-center max-w-4xl mx-auto overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            <div className="relative space-y-8">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Ready to write your
                <span className="gradient-text block mt-2">masterpiece?</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of writers who are already creating amazing stories with StoryTorch
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  size="lg"
                  onClick={() => navigate("/auth")}
                  className="premium-glow hover-lift transition-spring text-lg px-10 h-14"
                >
                  Start Writing Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-border/50 hover:border-primary/50 hover:bg-primary/5 h-14 px-10 text-lg"
                >
                  View Pricing
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                No credit card required • Free forever plan available
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border/40 backdrop-blur-xl bg-background/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="font-display font-bold">StoryTorch</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering writers with AI-powered storytelling tools
              </p>
            </div>
            
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Templates", "Updates"]
              },
              {
                title: "Resources",
                links: ["Documentation", "Tutorials", "Blog", "Community"]
              },
              {
                title: "Company",
                links: ["About", "Careers", "Privacy", "Terms"]
              }
            ].map((section, i) => (
              <div key={i} className="space-y-4">
                <h3 className="font-semibold">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 StoryTorch. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Twitter
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Discord
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

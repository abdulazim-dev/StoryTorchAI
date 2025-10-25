import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, BookOpen, Users, Zap, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Writing",
      description: "Generate chapters, continue stories, and refine your prose with advanced AI models",
    },
    {
      icon: BookOpen,
      title: "Story Memory",
      description: "Maintain perfect continuity with AI that remembers your characters, plot, and world",
    },
    {
      icon: Users,
      title: "Character Vault",
      description: "Build rich character profiles that seamlessly integrate into your narrative",
    },
    {
      icon: Zap,
      title: "Instant Exports",
      description: "Export to PDF, EPUB, or screenplay format with one click",
    },
  ];

  const pricingTiers = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "5 AI chapter generations/month",
        "30 image generations/month",
        "Unlimited projects",
        "Basic character vault",
        "Text exports",
      ],
      cta: "Start Free",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$19",
      period: "/month",
      features: [
        "100 AI chapter generations/month",
        "500 image generations/month",
        "Advanced Story Memory",
        "PDF & EPUB exports",
        "Priority AI processing",
        "Collaboration features",
      ],
      cta: "Upgrade to Pro",
      highlighted: true,
    },
    {
      name: "Studio",
      price: "$49",
      period: "/month",
      features: [
        "Unlimited AI generations",
        "Unlimited image generations",
        "Team collaboration",
        "Custom AI training",
        "API access",
        "Priority support",
      ],
      cta: "Go Studio",
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <main>
        <div className="relative overflow-hidden min-h-[90vh] flex items-center">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM4YjVjZjYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEzIDAgNiAyLjY4NyA2IDZzLTIuNjg3IDYtNiA2LTYtMi42ODctNi02IDIuNjg3LTYgNi02ek0xOCAzNGMzLjMxMyAwIDYgMi42ODcgNiA2cy0yLjY4NyA2LTYgNi02LTIuNjg3LTYtNiAyLjY4Ny02IDYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
          
          <div className="container relative mx-auto px-4 py-24 md:py-32">
            <div className="mx-auto max-w-5xl text-center">
              {/* Badge */}
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-primary shadow-lg shadow-primary/20 animate-fade-in hover:scale-105 transition-transform">
                <Sparkles className="h-4 w-4 animate-pulse" />
                AI Story Architect
              </div>
              
              {/* Main Heading */}
              <h1 className="mb-8 text-5xl font-extrabold tracking-tight md:text-7xl lg:text-8xl animate-slide-up">
                Craft{" "}
                <span className="relative inline-block">
                  <span className="gradient-text">Epic Stories</span>
                  <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-full" />
                </span>
                <br />
                <span className="text-foreground/90">with AI Power</span>
              </h1>
              
              {/* Subheading */}
              <p className="mb-12 text-xl text-muted-foreground md:text-2xl lg:text-3xl max-w-3xl mx-auto leading-relaxed animate-fade-in">
                StoryTorch empowers authors, anime writers, and creative studios to build{" "}
                <span className="text-foreground font-semibold">immersive narratives</span> with AI-assisted world-building, character development, and seamless continuity.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center items-center animate-fade-in">
                <Button
                  size="lg"
                  variant="glow"
                  className="text-base px-8 py-6 h-auto shadow-2xl"
                  onClick={() => navigate("/auth")}
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Creating Free
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 py-6 h-auto border-2"
                  onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
                >
                  View Pricing
                </Button>
              </div>

              {/* Social Proof */}
              <div className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground animate-fade-in">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-background" />
                    ))}
                  </div>
                  <span>Trusted by 10,000+ writers</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-32 relative">
        {/* Background decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        
        <div className="mx-auto max-w-6xl relative">
          <div className="mb-20 text-center">
            <h2 className="mb-6 gradient-text">Everything You Need to Write</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional tools designed for serious storytellers
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group glass-card p-8 transition-all duration-500 hover:elevated-card hover:-translate-y-2 relative overflow-hidden"
              >
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10">
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-primary/30">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="container mx-auto px-4 py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        
        <div className="mx-auto max-w-6xl relative">
          <div className="mb-20 text-center">
            <h2 className="mb-6 gradient-text">Choose Your Plan</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start free, upgrade when you're ready to unlock unlimited creative potential
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {pricingTiers.map((tier, index) => (
              <Card
                key={index}
                className={`relative p-8 transition-all duration-500 ${
                  tier.highlighted
                    ? "elevated-card scale-105 bg-gradient-to-b from-card/80 to-card/60"
                    : "glass-card hover:-translate-y-2"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary via-accent to-secondary px-6 py-2 text-sm font-bold text-white shadow-lg shadow-primary/30 animate-glow">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="mb-3 text-3xl font-bold">{tier.name}</h3>
                  <div className="mb-6">
                    <span className="text-5xl font-extrabold gradient-text">{tier.price}</span>
                    <span className="text-lg text-muted-foreground">{tier.period}</span>
                  </div>
                  <Button
                    size="lg"
                    className={`w-full ${
                      tier.highlighted
                        ? ""
                        : ""
                    }`}
                    variant={tier.highlighted ? "glow" : "outline"}
                    onClick={() => navigate("/auth")}
                  >
                    {tier.cta}
                  </Button>
                </div>

                <ul className="space-y-4">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                      <span className="text-sm text-foreground/80 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-32">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 p-16 shadow-2xl shadow-primary/20">
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
            
            <div className="relative z-10 text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 backdrop-blur-sm">
                <Sparkles className="h-8 w-8 text-primary animate-pulse" />
              </div>
              <h2 className="mb-6 text-5xl font-extrabold gradient-text">Ready to Begin Your Story?</h2>
              <p className="mb-10 text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
                Join <span className="font-bold text-primary">10,000+ writers</span> crafting amazing narratives with AI assistance
              </p>
              <Button
                size="lg"
                variant="glow"
                className="text-lg px-10 py-7 h-auto shadow-2xl"
                onClick={() => navigate("/auth")}
              >
                <Sparkles className="mr-2 h-6 w-6" />
                Start Writing Now
              </Button>
            </div>
          </div>
        </div>
      </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">StoryTorch</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground mb-1">
                © 2025 StoryTorch. AI Story Architect for creators.
              </p>
              <p className="text-xs text-muted-foreground">
                Crafted with <span className="text-primary">♥</span> by Abdul Azim
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

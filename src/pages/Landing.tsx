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
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM4YjVjZjYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEzIDAgNiAyLjY4NyA2IDZzLTIuNjg3IDYtNiA2LTYtMi42ODctNi02IDIuNjg3LTYgNi02ek0xOCAzNGMzLjMxMyAwIDYgMi42ODcgNiA2cy0yLjY4NyA2LTYgNi02LTIuNjg3LTYtNiAyLjY4Ny02IDYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
          
          <div className="container relative mx-auto px-4 py-24 md:py-32">
            <div className="mx-auto max-w-4xl text-center animate-slide-up">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary">
                <Sparkles className="h-4 w-4" />
                AI Story Architect
              </div>
              
              <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
                Craft <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Epic Stories</span>
                <br />
                with AI Power
              </h1>
              
              <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
                StoryForge empowers authors, anime writers, and creative studios to build immersive narratives with AI-assisted world-building, character development, and seamless continuity.
              </p>
              
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30"
                  onClick={() => navigate("/auth")}
                >
                  Start Creating Free
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
                >
                  View Pricing
                </Button>
              </div>
            </div>
          </div>
        </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">Everything You Need to Write</h2>
            <p className="text-xl text-muted-foreground">
              Professional tools designed for serious storytellers
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group border-border/50 bg-card/50 p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">Choose Your Plan</h2>
            <p className="text-xl text-muted-foreground">
              Start free, upgrade when you're ready
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {pricingTiers.map((tier, index) => (
              <Card
                key={index}
                className={`relative p-8 ${
                  tier.highlighted
                    ? "border-2 border-primary shadow-xl shadow-primary/20"
                    : "border-border/50"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-1 text-sm font-semibold text-white">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="mb-2 text-2xl font-bold">{tier.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground">{tier.period}</span>
                  </div>
                  <Button
                    className={`w-full ${
                      tier.highlighted
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : ""
                    }`}
                    variant={tier.highlighted ? "default" : "outline"}
                    onClick={() => navigate("/auth")}
                  >
                    {tier.cta}
                  </Button>
                </div>

                <ul className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 shrink-0 text-primary" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10 p-12">
            <h2 className="mb-4 text-4xl font-bold">Ready to Begin Your Story?</h2>
            <p className="mb-8 text-xl text-muted-foreground">
              Join thousands of writers crafting amazing narratives with AI assistance
            </p>
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => navigate("/auth")}
            >
              Start Writing Now
            </Button>
          </div>
        </div>
      </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-semibold">StoryForge</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground">
                © 2025 StoryForge. AI Story Architect for creators.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Made by Abdul Azim
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Sparkles, Map, BarChart3, Zap, Globe, Code } from "lucide-react";
import logo from "@/assets/kultrip-logo.png";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Kultrip" className="h-10 w-10" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Kultrip
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-foreground/70 hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-foreground/70 hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-foreground/70 hover:text-foreground transition-colors">
              Pricing
            </a>
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Log In
            </Button>
            <Button variant="hero" onClick={() => navigate("/signup")}>
              Get Started Free
            </Button>
          </nav>
          <Button variant="hero" className="md:hidden" onClick={() => navigate("/signup")}>
            Sign Up
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-background" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Turn stories into{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                unforgettable journeys
              </span>{" "}
              ✨
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              With Kultrip, your agency can offer AI-generated travel guides inspired by books, movies, and series.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" onClick={() => navigate("/signup")}>
                Get Started Free
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/login")}>
                Log In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">See Kultrip in Action</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Watch how we help travel agencies create unforgettable experiences
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-2xl shadow-2xl"
                src="https://www.youtube.com/embed/QyccRi4G8vo"
                title="Kultrip Pitch Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Three simple steps to transform your travel agency
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 text-center hover:shadow-lg transition-shadow bg-gradient-to-b from-card to-card/50">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1️⃣ Choose a Theme</h3>
              <p className="text-muted-foreground">
                Travelers select from iconic stories: Harry Potter, Amélie, Game of Thrones, and more
              </p>
            </Card>
            <Card className="p-8 text-center hover:shadow-lg transition-shadow bg-gradient-to-b from-card to-card/50">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2️⃣ AI Magic</h3>
              <p className="text-muted-foreground">
                Kultrip's AI instantly generates the perfect trip itinerary tailored to the chosen story
              </p>
            </Card>
            <Card className="p-8 text-center hover:shadow-lg transition-shadow bg-gradient-to-b from-card to-card/50">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
                <Map className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3️⃣ Unique Product</h3>
              <p className="text-muted-foreground">
                Your agency offers it as an exclusive, memorable experience to your customers
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful features to grow your travel business
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">🧠 AI-Powered Generator</h3>
              <p className="text-muted-foreground text-sm">
                State-of-the-art AI creates personalized travel guides instantly
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 mb-4 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Code className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">🔗 Customizable Widget</h3>
              <p className="text-muted-foreground text-sm">
                Embed on your website with a single line of code
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 mb-4 rounded-xl bg-accent/10 flex items-center justify-center">
                <BarChart3 className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">📊 Analytics Dashboard</h3>
              <p className="text-muted-foreground text-sm">
                Track guides created, leads generated, and performance metrics
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                <Globe className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">🌍 Multilingual</h3>
              <p className="text-muted-foreground text-sm">
                Support for English, Spanish, and Portuguese markets
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 mb-4 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Zap className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">⚡ Instant Setup</h3>
              <p className="text-muted-foreground text-sm">
                Get started in minutes, no technical skills required
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 mb-4 rounded-xl bg-accent/10 flex items-center justify-center">
                <Map className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">🗺️ Rich Content</h3>
              <p className="text-muted-foreground text-sm">
                Detailed itineraries with locations, tips, and recommendations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose the plan that fits your agency's needs
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold mb-2">Pay-per-Lead</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">€5</span>
                <span className="text-muted-foreground">/lead</span>
              </div>
              <p className="text-muted-foreground mb-6">Perfect for testing the waters</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span className="text-sm">No monthly commitment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span className="text-sm">Pay only for results</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span className="text-sm">Flexible scaling</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full" onClick={() => navigate("/signup")}>
                Get Started
              </Button>
            </Card>
            <Card className="p-8 hover:shadow-xl transition-shadow border-2 border-primary relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Basic</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">€49</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-muted-foreground mb-6">For growing agencies</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span className="text-sm">Unlimited guides</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span className="text-sm">€2 per lead</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span className="text-sm">Analytics dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span className="text-sm">Email support</span>
                </li>
              </ul>
              <Button variant="hero" className="w-full" onClick={() => navigate("/signup")}>
                Get Started
              </Button>
            </Card>
            <Card className="p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">€149</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-muted-foreground mb-6">For established agencies</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span className="text-sm">Everything in Basic</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span className="text-sm">€1 per lead</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span className="text-sm">Priority support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span className="text-sm">Custom branding</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full" onClick={() => navigate("/signup")}>
                Get Started
              </Button>
            </Card>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-8">
            * Pricing and limits may change in the future
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={logo} alt="Kultrip" className="h-8 w-8" />
                <span className="text-xl font-bold">Kultrip</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Turn stories into unforgettable journeys
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#features" className="hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-foreground transition-colors">
                    How It Works
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 Kultrip. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

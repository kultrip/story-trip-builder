import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import WidgetPreview from "@/components/WidgetPreview";
import Calculator from "@/components/Calculator";
import logo from "@/assets/kultrip-logo.png";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();

  const handleRequestReport = (data: any) => {
    // TODO: Implement /api/leads or CRM integration to persist captured leads
    console.log("ROI Report requested:", data);
    toast.success("Request received! We'll send your personalized ROI report shortly.");
  };

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
          <nav className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Log In
            </Button>
            <Button variant="hero" onClick={() => navigate("/signup")}>
              Get Started
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Transform Stories into{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Travel Experiences
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Empower your travel agency with AI-generated itineraries inspired by books, movies, and series.
              Capture more leads and boost your revenue.
            </p>
          </div>

          {/* Widget Preview Section */}
          <div className="mb-20">
            <WidgetPreview />
          </div>

          {/* Calculator Section */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Calculate Your ROI
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See how Kultrip can increase your agency's revenue with interactive, story-driven travel guides
              </p>
            </div>
            <Calculator onRequestReport={handleRequestReport} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Travel Business?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join travel agencies worldwide who are already using Kultrip to create unique experiences and boost conversions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => navigate("/signup")}
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              onClick={() => navigate("/landing")}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Kultrip" className="h-8 w-8" />
              <span className="text-xl font-bold">Kultrip</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Kultrip. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

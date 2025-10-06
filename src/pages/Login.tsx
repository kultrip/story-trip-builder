import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/kultrip-logo.png";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        toast.success("Welcome back!");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("An error occurred during login");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center justify-center gap-3 mb-8">
          <img src={logo} alt="Kultrip" className="h-12 w-12" />
          <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Kultrip
          </span>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-2">Welcome back</h1>
        <p className="text-muted-foreground text-center mb-6">
          Log in to your agency dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@agency.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" variant="hero" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </button>
        </p>
      </Card>
    </div>
  );
};

export default Login;

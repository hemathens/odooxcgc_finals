import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth, type UserRole } from "@/context/AuthContext";
import { GraduationHat } from "@/components/ui/graduation-hat";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await login(email, password, role);
    
    if (success) {
      toast({
        title: "Login Successful",
        description: `Welcome to your ${role} dashboard!`,
      });
      
      // Navigate to appropriate dashboard based on role
      switch (role) {
        case "student":
          navigate("/student-dashboard");
          break;
        case "tpo":
          navigate("/tpo-dashboard");
          break;
        case "company":
          navigate("/company-dashboard");
          break;
      }
    } else {
      toast({
        title: "Login Failed",
        description: "Please check your credentials.",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-lime rounded-lg p-3">
              <GraduationHat className="w-6 h-6 text-purple-dark" />
            </div>
            <span className="text-3xl font-bold text-white">Placement Tracker</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Sign in to your account</h2>
          <p className="text-muted-foreground mt-2">Choose your role and enter your credentials</p>
        </div>

        {/* Login Form */}
        <Card className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Select Role
              </label>
              <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                <SelectTrigger className="bg-purple-medium/50 border-border text-white">
                  <SelectValue placeholder="Choose your role" />
                </SelectTrigger>
                <SelectContent className="bg-purple-medium border-border">
                  <SelectItem value="student" className="text-white hover:bg-purple-light">
                    Student
                  </SelectItem>
                  <SelectItem value="tpo" className="text-white hover:bg-purple-light">
                    TPO/Admin
                  </SelectItem>
                  <SelectItem value="company" className="text-white hover:bg-purple-light">
                    Company/Recruiter
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="bg-purple-medium/50 border-border text-white placeholder:text-muted-foreground"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-purple-medium/50 border-border text-white placeholder:text-muted-foreground"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Demo credentials: any email/password combination
            </p>
          </div>
        </Card>

        <div className="text-center">
          <button
            onClick={() => navigate("/")}
            className="text-lime hover:text-lime-dark transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
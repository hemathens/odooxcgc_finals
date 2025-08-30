import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth, type UserRole } from "@/context/AuthContext";
import { GraduationHat } from "@/components/ui/graduation-hat";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    setLoading(true);

    if (password.length < 8) {
      toast({ title: "Password too short", description: "Password must be at least 8 characters.", variant: "destructive" });
      setLoading(false);
      return;
    }

    const emailLower = email.trim().toLowerCase();
    if (role === 'company' && !companyName.trim()) {
      toast({ title: "Company name is required", description: "Please enter your company name.", variant: "destructive" });
      setLoading(false);
      return;
    }

    const res = await register(name.trim(), emailLower, password, role, companyName.trim());
    if (res.success) {
      toast({ title: "Account created", description: "Welcome! Let's complete your profile." });
      navigate("/profile");
    } else {
      toast({ title: "Sign up failed", description: res.error || "Please try again.", variant: "destructive" });
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
          <h2 className="text-2xl font-bold text-white">Create your account</h2>
          <p className="text-muted-foreground mt-2">It only takes a minute</p>
        </div>

        <Card className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Full Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="bg-purple-medium/50 border-border text-white placeholder:text-muted-foreground"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="bg-purple-medium/50 border-border text-white placeholder:text-muted-foreground"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-purple-medium/50 border-border text-white placeholder:text-muted-foreground"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
                <Input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="bg-purple-medium/50 border-border text-white placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Select Role</label>
              <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                <SelectTrigger className="bg-purple-medium/50 border-border text-white">
                  <SelectValue placeholder="Choose your role" />
                </SelectTrigger>
                <SelectContent className="bg-purple-medium border-border">
                  <SelectItem value="student" className="text-white hover:bg-purple-light">Student</SelectItem>
                  <SelectItem value="tpo" className="text-white hover:bg-purple-light">TPO</SelectItem>
                  <SelectItem value="company" className="text-white hover:bg-purple-light">Admin/Company</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {role === 'company' && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">Company Name</label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Corp"
                  className="bg-purple-medium/50 border-border text-white placeholder:text-muted-foreground"
                  required={role === 'company'}
                />
              </div>
            )}

            <Button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Already have an account? {" "}
              <Link to="/login" className="text-lime hover:text-lime-dark">Login</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;


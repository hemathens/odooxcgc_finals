import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import JobSearchToolkit from "@/components/JobSearchToolkit";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      const target =
        user.role === "student"
          ? "/student-dashboard"
          : user.role === "tpo"
          ? "/tpo-dashboard"
          : "/company-dashboard";
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <JobSearchToolkit />
    </div>
  );
};

export default Index;

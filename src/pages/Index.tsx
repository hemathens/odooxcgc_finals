import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import JobSearchToolkit from "@/components/JobSearchToolkit";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <JobSearchToolkit />
    </div>
  );
};

export default Index;
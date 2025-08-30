import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="min-h-[90vh] flex flex-col items-center justify-center px-6 text-center relative">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="hero-text">
          The Career Services Platform Students{" "}
          <span className="gradient-text italic">Actually</span> Use
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
          Make advisors 300% more efficient and 3x student engagement. Placement Tracker helps career service teams 
          to replace five tools with one platform that uses AI, community, and gamification to get students 
          hired 54% faster.
        </p>
        
        <div className="pt-4">
          <Button asChild className="btn-primary text-lg px-8 py-4">
            <Link to="/signup">Schedule Demo</Link>
          </Button>
        </div>
      </div>
      
      {/* Trusted partners section */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-full max-w-5xl">
        <div className="glass-card px-8 py-6">
          <p className="text-sm text-muted-foreground mb-4 text-center">
            Trusted by the most outcome-driven universities and bootcamps to run end-to-end career services
          </p>
          
          <div className="flex items-center justify-center gap-8 flex-wrap opacity-60">
            <div className="text-white font-semibold text-lg">MERCYHURST UNIVERSITY</div>
            <div className="text-white font-semibold text-lg">Fullstack Academy</div>
            <div className="text-white font-semibold text-lg">DeVry University</div>
            <div className="text-white font-semibold text-lg">Miami Dade College</div>
            <div className="text-white font-semibold text-lg">BREAK THROUGH TECH</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

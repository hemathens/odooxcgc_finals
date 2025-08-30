import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between relative z-50">
      <div className="flex items-center gap-3">
        <div className="bg-lime rounded-lg p-2">
          <Plus className="w-5 h-5 text-purple-dark" />
        </div>
        <span className="text-2xl font-bold text-white">Prentus</span>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={() => window.location.href = '/login'}
          className="text-foreground hover:text-lime transition-colors duration-300 font-medium"
        >
          Login
        </button>
        <Button className="btn-primary">
          Schedule Demo
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;
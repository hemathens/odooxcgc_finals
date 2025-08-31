import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between relative z-50">
      <div className="flex items-center gap-3">
        <div className="bg-lime rounded-lg p-2">
          <Logo className="w-5 h-5" size={20} />
        </div>
        <span className="text-2xl font-bold text-white">Placement Tracker</span>
      </div>
      
      <div className="flex items-center gap-4">
        <Link 
          to="/login"
          className="text-foreground hover:text-lime transition-colors duration-300 font-medium"
        >
          Login
        </Link>
        <Button asChild className="btn-primary">
          <Link to="/signup">Schedule Demo</Link>
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;

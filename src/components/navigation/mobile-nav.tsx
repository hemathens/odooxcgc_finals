import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, FileText, Briefcase, Calendar, User, Users, Building, TrendingUp, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  description?: string;
  roles: string[];
}

const navigationConfig: NavItem[] = [
  // Student Navigation
  {
    title: "Dashboard",
    href: "/student-dashboard",
    icon: Home,
    description: "Overview & stats",
    roles: ["student"]
  },
  {
    title: "Resume Builder",
    href: "/resume-builder", 
    icon: FileText,
    description: "Create ATS-friendly resume",
    roles: ["student"]
  },
  {
    title: "Application Tracker",
    href: "/application-tracker",
    icon: Briefcase,
    description: "Monitor applications",
    roles: ["student"]
  },
  {
    title: "Test Scheduler",
    href: "/test-scheduler",
    icon: Calendar,
    description: "Book assessment slots",
    roles: ["student"]
  },
  {
    title: "AI ChatBot",
    href: "/ai-chatbot",
    icon: Bot,
    description: "Get AI assistance",
    roles: ["student"]
  },
  
  // TPO Navigation
  {
    title: "Dashboard",
    href: "/tpo-dashboard",
    icon: Home,
    description: "Administrative overview",
    roles: ["tpo"]
  },
  {
    title: "Student Management",
    href: "/student-management",
    icon: Users,
    description: "Manage student records",
    roles: ["tpo"]
  },
  {
    title: "Company Portal",
    href: "/company-management",
    icon: Building,
    description: "Company partnerships",
    roles: ["tpo"]
  },
  {
    title: "Placement Reports",
    href: "/placement-reports",
    icon: TrendingUp,
    description: "Analytics & insights",
    roles: ["tpo"]
  },
  
  // Company Navigation
  {
    title: "Dashboard",
    href: "/company-dashboard",
    icon: Home,
    description: "Recruitment overview",
    roles: ["company"]
  },
  {
    title: "Job Management",
    href: "/job-management",
    icon: FileText,
    description: "Post & manage jobs",
    roles: ["company"]
  },
  {
    title: "Candidate Review",
    href: "/candidate-review",
    icon: Users,
    description: "Screen applications",
    roles: ["company"]
  },
  {
    title: "Interview Management",
    href: "/interview-management",
    icon: Calendar,
    description: "Schedule interviews",
    roles: ["company"]
  }
];

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  
  if (!user) return null;
  
  const userNavItems = navigationConfig.filter(item => 
    item.roles.includes(user.role)
  );

  const toggleNav = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden text-white hover:bg-purple-medium/50"
        onClick={toggleNav}
        aria-label="Toggle mobile menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="fixed top-0 right-0 h-full w-80 bg-purple-dark border-l border-border/20 z-50 md:hidden animate-slide-up">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="bg-lime rounded-lg p-2">
                    <User className="w-5 h-5 text-purple-dark" />
                  </div>
                  <span className="text-xl font-bold text-white">Menu</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-purple-medium/50"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <nav className="space-y-2">
                {userNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl transition-all duration-200",
                        isActive
                          ? "bg-lime text-primary-foreground shadow-button"
                          : "text-white hover:bg-purple-medium/50"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <div>
                        <div className="font-medium">{item.title}</div>
                        {item.description && (
                          <div className="text-sm opacity-70">{item.description}</div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export { MobileNav };
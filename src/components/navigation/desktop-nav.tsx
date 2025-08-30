import { Link, useLocation } from "react-router-dom";
import { Home, FileText, Briefcase, Calendar, Users, Building, TrendingUp, Settings, Bell, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
}

const navigationConfig: NavItem[] = [
  // Student Navigation
  {
    title: "Dashboard",
    href: "/student-dashboard",
    icon: Home,
    roles: ["student"]
  },
  {
    title: "Resume Builder", 
    href: "/resume-builder",
    icon: FileText,
    roles: ["student"]
  },
  {
    title: "Applications",
    href: "/application-tracker",
    icon: Briefcase,
    roles: ["student"]
  },
  {
    title: "Tests",
    href: "/test-scheduler",
    icon: Calendar,
    roles: ["student"]
  },
  
  // TPO Navigation
  {
    title: "Dashboard",
    href: "/tpo-dashboard",
    icon: Home,
    roles: ["tpo"]
  },
  {
    title: "Students",
    href: "/student-management",
    icon: Users,
    roles: ["tpo"]
  },
  {
    title: "Companies",
    href: "/company-management",
    icon: Building,
    roles: ["tpo"]
  },
  {
    title: "Reports",
    href: "/placement-reports",
    icon: TrendingUp,
    roles: ["tpo"]
  },
  {
    title: "Events",
    href: "/placement-events",
    icon: Calendar,
    roles: ["tpo"]
  },
  
  // Company Navigation
  {
    title: "Dashboard",
    href: "/company-dashboard",
    icon: Home,
    roles: ["company"]
  },
  {
    title: "Job Posts",
    href: "/job-management",
    icon: FileText,
    roles: ["company"]
  },
  {
    title: "Candidates",
    href: "/candidate-review",
    icon: Users,
    roles: ["company"]
  },
  {
    title: "Interviews",
    href: "/interview-management",
    icon: Calendar,
    roles: ["company"]
  },
  {
    title: "Analytics",
    href: "/recruitment-analytics",
    icon: TrendingUp,
    roles: ["company"]
  }
];

const DesktopNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  if (!user) return null;
  
  const userNavItems = navigationConfig.filter(item => 
    item.roles.includes(user.role)
  );

  return (
    <nav className="hidden md:flex items-center gap-1">
      {userNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium",
              isActive
                ? "bg-lime text-primary-foreground shadow-button"
                : "text-white hover:bg-purple-medium/50 hover:scale-105"
            )}
          >
            <Icon className="w-4 h-4" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export { DesktopNav };
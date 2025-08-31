import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Bell, User, Settings } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { DesktopNav } from "@/components/navigation/desktop-nav";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const DashboardLayout = ({ children, title, subtitle }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/20 bg-purple-dark/90 backdrop-blur-md">
        <div className="px-4 md:px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-lime rounded-lg p-2 shadow-button">
              <Logo className="w-5 h-5" size={20} />
            </div>
            <span className="text-2xl font-bold text-white">Placement Tracker</span>
          </div>

          {/* Desktop Navigation */}
          <DesktopNav />

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-purple-medium/50 transition-all duration-200 hover:scale-105"
                aria-label="Notifications"
                onClick={() => navigate("/notifications")}
              >
                <Bell className="w-5 h-5" />
              </Button>
              {/* Notification Badge */}
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{unreadCount}</span>
                </div>
              )}
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-purple-medium/50 hover:text-white gap-2 transition-all duration-200 hover:scale-105"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">{user?.name || 'Student'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="bg-purple-dark border-border text-white z-50 min-w-48 animate-scale-in"
              >
                <DropdownMenuItem 
                  className="hover:bg-purple-medium/50 hover:text-white cursor-pointer focus:bg-purple-medium/50 focus:text-white"
                  onClick={() => navigate("/profile")}
                >
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="hover:bg-purple-medium/50 hover:text-white cursor-pointer focus:bg-purple-medium/50 focus:text-white"
                  onClick={() => navigate("/settings")}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-border" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="hover:bg-red-500/20 cursor-pointer text-red-300 focus:bg-red-500/20 focus:text-red-200"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Navigation */}
            <MobileNav />
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="px-4 md:px-6 py-6 md:py-8 border-b border-border/20 bg-gradient-to-r from-purple-dark/50 to-purple-medium/30">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 animate-fade-in">{title}</h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-muted-foreground animate-fade-in" style={{ animationDelay: '0.1s' }}>{subtitle}</p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-6 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
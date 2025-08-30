import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Briefcase, 
  Calendar, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  ArrowRight,
  Target,
  Award
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Application {
  id: string;
  company: string;
  position: string;
  status: 'applied' | 'in-review' | 'interview' | 'selected' | 'rejected';
  appliedDate: string;
  deadline?: string;
}

interface Test {
  id: string;
  company: string;
  type: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'missed';
}

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [upcomingTests, setUpcomingTests] = useState<Test[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    // Simulate API loading
    const loadDashboardData = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data - in real app this would come from API
      setApplications([
        {
          id: '1',
          company: 'Tech Corp',
          position: 'Software Engineer',
          status: 'in-review',
          appliedDate: '2024-08-25',
          deadline: '2024-09-01'
        },
        {
          id: '2',
          company: 'StartupXYZ',
          position: 'Frontend Developer',
          status: 'interview',
          appliedDate: '2024-08-20',
        },
        {
          id: '3',
          company: 'BigTech Inc',
          position: 'Full Stack Developer',
          status: 'applied',
          appliedDate: '2024-08-28',
          deadline: '2024-09-05'
        }
      ]);

      setUpcomingTests([
        {
          id: '1',
          company: 'Tech Corp',
          type: 'Technical Assessment',
          date: '2024-09-02',
          time: '10:00 AM',
          status: 'scheduled'
        },
        {
          id: '2',
          company: 'StartupXYZ',
          type: 'Coding Challenge',
          date: '2024-09-03',
          time: '2:00 PM',
          status: 'scheduled'
        }
      ]);

      setNotifications([
        'Resume review scheduled for tomorrow',
        'New job opening at Microsoft',
        'Interview confirmed with Tech Corp'
      ]);

      setProfileCompletion(75);
      setIsLoading(false);
      
      // Show welcome toast
      toast({
        title: "Welcome back!",
        description: "Your dashboard has been updated with the latest information.",
      });
    };

    loadDashboardData();
  }, [toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-500';
      case 'in-review': return 'bg-yellow-500';
      case 'interview': return 'bg-purple-500';
      case 'selected': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout 
        title="Student Dashboard" 
        subtitle="Track your placement journey and manage applications"
      >
        <div className="space-y-6">
          {/* Loading skeleton for stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="loading-skeleton h-32 animate-pulse"></div>
            ))}
          </div>
          
          {/* Loading spinner */}
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-white">Loading your dashboard...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Student Dashboard" 
      subtitle="Track your placement journey and manage applications"
    >
      <div className="space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Applications"
            value={applications.length}
            icon={<Briefcase className="w-6 h-6 text-lime" />}
            trend={{ value: 12, label: "vs last month" }}
            delay={100}
          />
          <StatCard
            title="Upcoming Tests"
            value={upcomingTests.length}
            icon={<Calendar className="w-6 h-6 text-blue-400" />}
            trend={{ value: -5, label: "vs last month" }}
            delay={200}
          />
          <StatCard
            title="Interviews"
            value={applications.filter(app => app.status === 'interview').length}
            icon={<CheckCircle className="w-6 h-6 text-green-400" />}
            trend={{ value: 25, label: "vs last month" }}
            delay={300}
          />
          <StatCard
            title="Profile Complete"
            value={`${profileCompletion}%`}
            icon={<Target className="w-6 h-6 text-purple-400" />}
            delay={400}
          />
        </div>

        {/* Quick Actions */}
        <Card className="glass-card p-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-white">Quick Actions</h3>
            <Award className="w-6 h-6 text-lime" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Button 
              onClick={() => navigate('/resume-builder')}
              className="group btn-primary justify-start h-auto p-6 transition-all duration-300 hover:shadow-lg"
            >
              <FileText className="w-6 h-6 mr-4 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="font-semibold text-lg">Build Resume</div>
                <div className="text-sm opacity-90">Create ATS-friendly resume</div>
              </div>
              <ArrowRight className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button 
              onClick={() => navigate('/application-tracker')}
              className="group btn-secondary justify-start h-auto p-6 transition-all duration-300 hover:shadow-lg"
            >
              <Briefcase className="w-6 h-6 mr-4 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="font-semibold text-lg">Track Applications</div>
                <div className="text-sm opacity-90">Monitor application status</div>
              </div>
              <ArrowRight className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button 
              onClick={() => navigate('/test-scheduler')}
              className="group btn-secondary justify-start h-auto p-6 transition-all duration-300 hover:shadow-lg"
            >
              <Calendar className="w-6 h-6 mr-4 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="font-semibold text-lg">Schedule Tests</div>
                <div className="text-sm opacity-90">Book assessment slots</div>
              </div>
              <ArrowRight className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Applications */}
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Recent Applications</h3>
              <Button 
                onClick={() => navigate('/application-tracker')}
                size="sm" 
                className="btn-secondary"
              >
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {applications.slice(0, 3).map((app) => (
                <div key={app.id} className="bg-purple-medium/30 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{app.company}</h4>
                    <Badge className={`${getStatusColor(app.status)} text-white`}>
                      {app.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{app.position}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Applied: {new Date(app.appliedDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Tests */}
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Upcoming Tests</h3>
              <Button 
                onClick={() => navigate('/test-scheduler')}
                size="sm" 
                className="btn-secondary"
              >
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {upcomingTests.map((test) => (
                <div key={test.id} className="bg-purple-medium/30 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{test.company}</h4>
                    <Badge className="bg-blue-500 text-white">
                      {test.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{test.type}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {new Date(test.date).toLocaleDateString()} at {test.time}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Profile Completion */}
        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Complete Your Profile</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white">Profile Completion</span>
              <span className="text-lime font-semibold">{profileCompletion}%</span>
            </div>
            <Progress value={profileCompletion} className="h-2" />
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-white border-green-500">
                ✓ Basic Info
              </Badge>
              <Badge variant="outline" className="text-white border-green-500">
                ✓ Resume Uploaded
              </Badge>
              <Badge variant="outline" className="text-white border-yellow-500">
                ! Skills Assessment
              </Badge>
              <Badge variant="outline" className="text-white border-red-500">
                ✗ Portfolio Links
              </Badge>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Notifications</h3>
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-purple-medium/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-lime flex-shrink-0" />
                <span className="text-white">{notification}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
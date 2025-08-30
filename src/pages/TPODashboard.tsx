import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Building, 
  Calendar, 
  TrendingUp, 
  UserCheck, 
  Clock, 
  CheckCircle, 
  AlertTriangle
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  course: string;
  status: 'active' | 'placed' | 'inactive';
  applications: number;
  interviews: number;
}

interface Company {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'completed';
  positions: number;
  applications: number;
}

const TPODashboard = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    placedStudents: 0,
    activeCompanies: 0,
    upcomingTests: 0
  });

  useEffect(() => {
    // Mock data
    setStudents([
      {
        id: '1',
        name: 'John Doe',
        email: 'john@university.edu',
        course: 'Computer Science',
        status: 'active',
        applications: 5,
        interviews: 2
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@university.edu',
        course: 'Information Technology',
        status: 'placed',
        applications: 8,
        interviews: 4
      },
      {
        id: '3',
        name: 'Bob Johnson',
        email: 'bob@university.edu',
        course: 'Software Engineering',
        status: 'active',
        applications: 3,
        interviews: 1
      }
    ]);

    setCompanies([
      {
        id: '1',
        name: 'Tech Corp',
        status: 'active',
        positions: 5,
        applications: 25
      },
      {
        id: '2',
        name: 'StartupXYZ',
        status: 'pending',
        positions: 3,
        applications: 15
      },
      {
        id: '3',
        name: 'BigTech Inc',
        status: 'completed',
        positions: 2,
        applications: 30
      }
    ]);

    setStats({
      totalStudents: 150,
      placedStudents: 45,
      activeCompanies: 12,
      upcomingTests: 8
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500';
      case 'placed': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const placementRate = Math.round((stats.placedStudents / stats.totalStudents) * 100);

  return (
    <DashboardLayout 
      title="TPO Dashboard" 
      subtitle="Manage placement activities and student progress"
    >
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.totalStudents}</p>
                <p className="text-muted-foreground">Total Students</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-500/20 p-3 rounded-xl">
                <UserCheck className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.placedStudents}</p>
                <p className="text-muted-foreground">Placed Students</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="bg-lime/20 p-3 rounded-xl">
                <Building className="w-6 h-6 text-lime" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.activeCompanies}</p>
                <p className="text-muted-foreground">Active Companies</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500/20 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{placementRate}%</p>
                <p className="text-muted-foreground">Placement Rate</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="btn-primary justify-start h-auto p-4">
              <Users className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Manage Students</div>
                <div className="text-sm opacity-80">View and manage student profiles</div>
              </div>
            </Button>

            <Button className="btn-secondary justify-start h-auto p-4">
              <Building className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Company Portal</div>
                <div className="text-sm opacity-80">Manage company registrations</div>
              </div>
            </Button>

            <Button className="btn-secondary justify-start h-auto p-4">
              <Calendar className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Schedule Events</div>
                <div className="text-sm opacity-80">Organize placement drives</div>
              </div>
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Students */}
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Recent Student Activity</h3>
              <Button size="sm" className="btn-secondary">
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {students.map((student) => (
                <div key={student.id} className="bg-purple-medium/30 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{student.name}</h4>
                    <Badge className={`${getStatusColor(student.status)} text-white`}>
                      {student.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{student.course}</p>
                  <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                    <span>Applications: {student.applications}</span>
                    <span>Interviews: {student.interviews}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Company Status */}
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Company Partnerships</h3>
              <Button size="sm" className="btn-secondary">
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {companies.map((company) => (
                <div key={company.id} className="bg-purple-medium/30 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{company.name}</h4>
                    <Badge className={`${getStatusColor(company.status)} text-white`}>
                      {company.status}
                    </Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>Positions: {company.positions}</span>
                    <span>Applications: {company.applications}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Placement Timeline */}
        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Upcoming Placement Activities</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-purple-medium/30 rounded-lg">
              <div className="bg-lime/20 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-lime" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white">Tech Corp Campus Drive</h4>
                <p className="text-muted-foreground">September 5, 2024 • 10:00 AM</p>
              </div>
              <Badge className="bg-blue-500 text-white">Scheduled</Badge>
            </div>

            <div className="flex items-center gap-4 p-4 bg-purple-medium/30 rounded-lg">
              <div className="bg-yellow-500/20 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white">Resume Review Session</h4>
                <p className="text-muted-foreground">September 3, 2024 • 2:00 PM</p>
              </div>
              <Badge className="bg-yellow-500 text-white">Pending</Badge>
            </div>

            <div className="flex items-center gap-4 p-4 bg-purple-medium/30 rounded-lg">
              <div className="bg-green-500/20 p-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white">StartupXYZ Interview Round</h4>
                <p className="text-muted-foreground">August 30, 2024 • Completed</p>
              </div>
              <Badge className="bg-green-500 text-white">Completed</Badge>
            </div>
          </div>
        </Card>

        {/* Placement Rules & Notifications */}
        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4">System Alerts & Rules</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-red-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span className="text-white">5 students have not submitted resumes for upcoming drive</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <span className="text-white">Deadline reminder: Tech Corp applications close in 2 days</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <span className="text-white">New company registration: InnovateLabs approved</span>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TPODashboard;
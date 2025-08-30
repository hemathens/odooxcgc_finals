import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Calendar,
  Building,
  MapPin,
  Clock,
  ExternalLink
} from "lucide-react";
import { GraduationHat } from "@/components/ui/graduation-hat";

interface Application {
  id: string;
  company: string;
  position: string;
  location: string;
  appliedDate: string;
  deadline?: string;
  status: 'applied' | 'in-review' | 'interview-scheduled' | 'interviewed' | 'selected' | 'rejected' | 'withdrawn';
  nextStep?: string;
  notes?: string;
  jobUrl?: string;
  salary?: string;
}

const ApplicationTracker = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    // Mock data
    setApplications([
      {
        id: '1',
        company: 'Tech Corp',
        position: 'Software Engineer',
        location: 'San Francisco, CA',
        appliedDate: '2024-08-25',
        deadline: '2024-09-01',
        status: 'interview-scheduled',
        nextStep: 'Technical interview on Sept 2',
        salary: '$120,000 - $150,000',
        jobUrl: 'https://techcorp.com/jobs/123'
      },
      {
        id: '2',
        company: 'StartupXYZ',
        position: 'Frontend Developer',
        location: 'Remote',
        appliedDate: '2024-08-20',
        status: 'interviewed',
        nextStep: 'Waiting for final decision',
        salary: '$90,000 - $110,000',
        notes: 'Great culture fit, team seemed very collaborative'
      },
      {
        id: '3',
        company: 'BigTech Inc',
        position: 'Full Stack Developer',
        location: 'Seattle, WA',
        appliedDate: '2024-08-28',
        deadline: '2024-09-05',
        status: 'in-review',
        salary: '$130,000 - $160,000'
      },
      {
        id: '4',
        company: 'InnovateLabs',
        position: 'Backend Engineer',
        location: 'Austin, TX',
        appliedDate: '2024-08-15',
        status: 'rejected',
        notes: 'They were looking for more senior experience'
      },
      {
        id: '5',
        company: 'GrowthCorp',
        position: 'React Developer',
        location: 'New York, NY',
        appliedDate: '2024-08-30',
        status: 'applied',
        deadline: '2024-09-10',
        salary: '$100,000 - $130,000'
      }
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-500';
      case 'in-review': return 'bg-yellow-500';
      case 'interview-scheduled': return 'bg-purple-500';
      case 'interviewed': return 'bg-orange-500';
      case 'selected': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'withdrawn': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'interview-scheduled': return 'Interview Scheduled';
      case 'in-review': return 'In Review';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const updateApplicationStatus = (id: string, newStatus: Application['status']) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
  };

  return (
    <DashboardLayout title="Application Tracker" subtitle="Monitor your job applications">
      <div className="space-y-6">
        {/* Statistics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-white">{applications.length}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </Card>
          <Card className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{statusCounts.applied || 0}</div>
            <div className="text-sm text-muted-foreground">Applied</div>
          </Card>
          <Card className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{statusCounts['in-review'] || 0}</div>
            <div className="text-sm text-muted-foreground">In Review</div>
          </Card>
          <Card className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{statusCounts['interview-scheduled'] || 0}</div>
            <div className="text-sm text-muted-foreground">Interviews</div>
          </Card>
          <Card className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">{statusCounts.interviewed || 0}</div>
            <div className="text-sm text-muted-foreground">Interviewed</div>
          </Card>
          <Card className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{statusCounts.selected || 0}</div>
            <div className="text-sm text-muted-foreground">Selected</div>
          </Card>
          <Card className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{statusCounts.rejected || 0}</div>
            <div className="text-sm text-muted-foreground">Rejected</div>
          </Card>
        </div>

        {/* Controls */}
        <Card className="glass-card p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search companies or positions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-purple-medium/50 border-border text-white"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-purple-medium/50 border border-border rounded-lg text-white"
              >
                <option value="all">All Status</option>
                <option value="applied">Applied</option>
                <option value="in-review">In Review</option>
                <option value="interview-scheduled">Interview Scheduled</option>
                <option value="interviewed">Interviewed</option>
                <option value="selected">Selected</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <Button className="btn-primary">
              <GraduationHat className="w-4 h-4 mr-2" />
              Add Application
            </Button>
          </div>
        </Card>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <Card key={application.id} className="glass-card p-6 hover:bg-purple-medium/20 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Main Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{application.position}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building className="w-4 h-4" />
                        <span>{application.company}</span>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(application.status)} text-white`}>
                      {getStatusLabel(application.status)}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{application.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
                    </div>
                    {application.deadline && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Deadline: {new Date(application.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                    {application.salary && (
                      <div className="flex items-center gap-1">
                        <span>💰 {application.salary}</span>
                      </div>
                    )}
                  </div>

                  {application.nextStep && (
                    <div className="bg-lime/10 border border-lime/20 rounded-lg p-3 mb-3">
                      <p className="text-lime font-medium text-sm">Next Step: {application.nextStep}</p>
                    </div>
                  )}

                  {application.notes && (
                    <div className="bg-purple-medium/30 rounded-lg p-3">
                      <p className="text-white text-sm">{application.notes}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {application.jobUrl && (
                    <Button size="sm" variant="ghost" className="text-white hover:bg-purple-medium/50">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Job
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="text-white hover:bg-purple-medium/50">
                    <Eye className="w-4 h-4 mr-2" />
                    Details
                  </Button>
                  <Button size="sm" variant="ghost" className="text-white hover:bg-purple-medium/50">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <Card className="glass-card p-12 text-center">
            <div className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' 
                ? 'No applications match your search criteria.' 
                : 'No applications yet. Start by adding your first application!'}
            </div>
            <Button className="btn-primary mt-4">
              <GraduationHat className="w-4 h-4 mr-2" />
              Add Application
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ApplicationTracker;
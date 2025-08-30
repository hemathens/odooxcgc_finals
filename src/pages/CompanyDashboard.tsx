import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  FileText, 
  Calendar, 
  TrendingUp, 
  UserPlus, 
  Eye, 
  Download, 
  Filter
} from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  email: string;
  course: string;
  skills: string[];
  applicationDate: string;
  status: 'applied' | 'reviewed' | 'shortlisted' | 'interviewed' | 'selected' | 'rejected';
  resumeUrl?: string;
}

interface JobPosting {
  id: string;
  title: string;
  department: string;
  applicants: number;
  deadline: string;
  status: 'open' | 'closed' | 'draft';
}

const CompanyDashboard = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [stats, setStats] = useState({
    totalApplicants: 0,
    shortlisted: 0,
    interviewed: 0,
    selected: 0
  });

  useEffect(() => {
    // Mock data
    setCandidates([
      {
        id: '1',
        name: 'John Doe',
        email: 'john@university.edu',
        course: 'Computer Science',
        skills: ['React', 'Node.js', 'Python'],
        applicationDate: '2024-08-25',
        status: 'shortlisted'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@university.edu',
        course: 'Information Technology',
        skills: ['Java', 'Spring Boot', 'MySQL'],
        applicationDate: '2024-08-26',
        status: 'interviewed'
      },
      {
        id: '3',
        name: 'Bob Johnson',
        email: 'bob@university.edu',
        course: 'Software Engineering',
        skills: ['Angular', 'TypeScript', 'MongoDB'],
        applicationDate: '2024-08-27',
        status: 'applied'
      }
    ]);

    setJobPostings([
      {
        id: '1',
        title: 'Software Engineer',
        department: 'Engineering',
        applicants: 25,
        deadline: '2024-09-01',
        status: 'open'
      },
      {
        id: '2',
        title: 'Frontend Developer',
        department: 'Product',
        applicants: 18,
        deadline: '2024-09-05',
        status: 'open'
      },
      {
        id: '3',
        title: 'Data Analyst',
        department: 'Analytics',
        applicants: 12,
        deadline: '2024-08-30',
        status: 'closed'
      }
    ]);

    setStats({
      totalApplicants: 55,
      shortlisted: 15,
      interviewed: 8,
      selected: 3
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-500';
      case 'reviewed': return 'bg-yellow-500';
      case 'shortlisted': return 'bg-purple-500';
      case 'interviewed': return 'bg-orange-500';
      case 'selected': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'open': return 'bg-green-500';
      case 'closed': return 'bg-red-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const updateCandidateStatus = (candidateId: string, newStatus: Candidate['status']) => {
    setCandidates(candidates.map(candidate => 
      candidate.id === candidateId 
        ? { ...candidate, status: newStatus }
        : candidate
    ));
  };

  return (
    <DashboardLayout 
      title="Company Dashboard" 
      subtitle="Manage job postings and review candidates"
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
                <p className="text-2xl font-bold text-white">{stats.totalApplicants}</p>
                <p className="text-muted-foreground">Total Applicants</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500/20 p-3 rounded-xl">
                <UserPlus className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.shortlisted}</p>
                <p className="text-muted-foreground">Shortlisted</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500/20 p-3 rounded-xl">
                <Calendar className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.interviewed}</p>
                <p className="text-muted-foreground">Interviewed</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-500/20 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.selected}</p>
                <p className="text-muted-foreground">Selected</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="btn-primary justify-start h-auto p-4">
              <FileText className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Post New Job</div>
                <div className="text-sm opacity-80">Create a new job posting</div>
              </div>
            </Button>

            <Button className="btn-secondary justify-start h-auto p-4">
              <Users className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Review Candidates</div>
                <div className="text-sm opacity-80">Screen applications</div>
              </div>
            </Button>

            <Button className="btn-secondary justify-start h-auto p-4">
              <Calendar className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Schedule Interviews</div>
                <div className="text-sm opacity-80">Arrange candidate meetings</div>
              </div>
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Candidates */}
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Recent Applications</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" className="text-white hover:bg-purple-medium/50">
                  <Filter className="w-4 h-4" />
                </Button>
                <Button size="sm" className="btn-secondary">
                  View All
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              {candidates.map((candidate) => (
                <div key={candidate.id} className="bg-purple-medium/30 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{candidate.name}</h4>
                    <Badge className={`${getStatusColor(candidate.status)} text-white`}>
                      {candidate.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{candidate.course}</p>
                  <div className="flex flex-wrap gap-1 mt-2 mb-3">
                    {candidate.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} className="bg-lime/20 text-lime text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="btn-secondary text-xs"
                      onClick={() => updateCandidateStatus(candidate.id, 'shortlisted')}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Review
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-purple-medium/50 text-xs">
                      <Download className="w-3 h-3 mr-1" />
                      Resume
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Job Postings */}
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Active Job Postings</h3>
              <Button size="sm" className="btn-secondary">
                <FileText className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </div>
            <div className="space-y-3">
              {jobPostings.map((job) => (
                <div key={job.id} className="bg-purple-medium/30 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{job.title}</h4>
                    <Badge className={`${getStatusColor(job.status)} text-white`}>
                      {job.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{job.department}</p>
                  <div className="flex justify-between items-center mt-3 text-sm text-muted-foreground">
                    <span>{job.applicants} applicants</span>
                    <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Interview Pipeline */}
        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Interview Pipeline</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-blue-500/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-400">25</div>
              <div className="text-sm text-muted-foreground">Applied</div>
            </div>
            <div className="bg-yellow-500/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-400">20</div>
              <div className="text-sm text-muted-foreground">Reviewed</div>
            </div>
            <div className="bg-purple-500/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-400">15</div>
              <div className="text-sm text-muted-foreground">Shortlisted</div>
            </div>
            <div className="bg-orange-500/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-400">8</div>
              <div className="text-sm text-muted-foreground">Interviewed</div>
            </div>
            <div className="bg-green-500/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-400">3</div>
              <div className="text-sm text-muted-foreground">Selected</div>
            </div>
          </div>
        </Card>

        {/* Upcoming Events */}
        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-purple-medium/30 rounded-lg">
              <div className="bg-lime/20 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-lime" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white">Campus Interview Drive</h4>
                <p className="text-muted-foreground">September 5, 2024 • 10:00 AM - 4:00 PM</p>
              </div>
              <Badge className="bg-blue-500 text-white">Scheduled</Badge>
            </div>

            <div className="flex items-center gap-4 p-4 bg-purple-medium/30 rounded-lg">
              <div className="bg-orange-500/20 p-2 rounded-lg">
                <Users className="w-5 h-5 text-orange-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white">Technical Round - John Doe</h4>
                <p className="text-muted-foreground">September 2, 2024 • 2:00 PM</p>
              </div>
              <Badge className="bg-orange-500 text-white">Upcoming</Badge>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CompanyDashboard;
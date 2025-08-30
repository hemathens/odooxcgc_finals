import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ApplicationCard } from "@/components/ui/application-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Filter, 
  Download, 
  Users, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  FileText,
  Mail,
  Phone
} from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  university: string;
  gpa: number;
  skills: string[];
  experience: string;
  resumeUrl: string;
  applicationDate: string;
  status: 'pending' | 'shortlisted' | 'rejected' | 'interviewed' | 'selected';
  rating?: number;
  notes?: string;
}

const CandidateReview = () => {
  const { toast } = useToast();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPosition, setFilterPosition] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    const loadCandidates = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock candidates data
      setCandidates([
        {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@university.edu',
          phone: '+1 (555) 123-4567',
          position: 'Software Engineer',
          university: 'MIT',
          gpa: 3.8,
          skills: ['React', 'Node.js', 'Python', 'AWS'],
          experience: '2 years internship experience',
          resumeUrl: '/resumes/john-smith.pdf',
          applicationDate: '2024-08-25',
          status: 'pending',
          rating: 4.5
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah.j@stanford.edu',
          phone: '+1 (555) 987-6543',
          position: 'Frontend Developer',
          university: 'Stanford University',
          gpa: 3.9,
          skills: ['React', 'TypeScript', 'CSS', 'Figma'],
          experience: '1.5 years freelance experience',
          resumeUrl: '/resumes/sarah-johnson.pdf',
          applicationDate: '2024-08-28',
          status: 'shortlisted',
          rating: 4.7
        },
        {
          id: '3',
          name: 'Michael Chen',
          email: 'm.chen@berkeley.edu',
          phone: '+1 (555) 456-7890',
          position: 'Full Stack Developer',
          university: 'UC Berkeley',
          gpa: 3.7,
          skills: ['Java', 'Spring', 'React', 'PostgreSQL'],
          experience: 'Multiple project experiences',
          resumeUrl: '/resumes/michael-chen.pdf',
          applicationDate: '2024-08-30',
          status: 'interviewed',
          rating: 4.2
        }
      ]);
      setIsLoading(false);
    };

    loadCandidates();
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      'pending': 'bg-yellow-500',
      'shortlisted': 'bg-blue-500',
      'rejected': 'bg-red-500',
      'interviewed': 'bg-purple-500',
      'selected': 'bg-green-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      'pending': Clock,
      'shortlisted': Star,
      'rejected': XCircle,
      'interviewed': Users,
      'selected': CheckCircle
    };
    return icons[status as keyof typeof icons] || Clock;
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.university.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || candidate.status === filterStatus;
    const matchesPosition = filterPosition === 'all' || candidate.position === filterPosition;
    return matchesSearch && matchesStatus && matchesPosition;
  });

  const handleStatusChange = (candidateId: string, newStatus: string) => {
    setCandidates(prev => prev.map(candidate => 
      candidate.id === candidateId 
        ? { ...candidate, status: newStatus as Candidate['status'] }
        : candidate
    ));
    
    toast({
      title: "Status Updated",
      description: `Candidate status changed to ${newStatus}`,
    });
  };

  const handleDownloadResume = (candidate: Candidate) => {
    toast({
      title: "Resume Download",
      description: `Downloading resume for ${candidate.name}`,
    });
  };

  const positions = [...new Set(candidates.map(c => c.position))];

  return (
    <DashboardLayout 
      title="Candidate Review" 
      subtitle="Review and manage job applications"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-purple-medium/50 border-border text-white"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48 bg-purple-medium/50 border-border text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-purple-medium border-border">
                <SelectItem value="all" className="text-white">All Status</SelectItem>
                <SelectItem value="pending" className="text-white">Pending</SelectItem>
                <SelectItem value="shortlisted" className="text-white">Shortlisted</SelectItem>
                <SelectItem value="rejected" className="text-white">Rejected</SelectItem>
                <SelectItem value="interviewed" className="text-white">Interviewed</SelectItem>
                <SelectItem value="selected" className="text-white">Selected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPosition} onValueChange={setFilterPosition}>
              <SelectTrigger className="w-48 bg-purple-medium/50 border-border text-white">
                <SelectValue placeholder="Filter by position" />
              </SelectTrigger>
              <SelectContent className="bg-purple-medium border-border">
                <SelectItem value="all" className="text-white">All Positions</SelectItem>
                {positions.map(position => (
                  <SelectItem key={position} value={position} className="text-white">
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { label: 'Total Applications', value: candidates.length, color: 'bg-blue-500' },
            { label: 'Pending Review', value: candidates.filter(c => c.status === 'pending').length, color: 'bg-yellow-500' },
            { label: 'Shortlisted', value: candidates.filter(c => c.status === 'shortlisted').length, color: 'bg-purple-500' },
            { label: 'Interviewed', value: candidates.filter(c => c.status === 'interviewed').length, color: 'bg-indigo-500' },
            { label: 'Selected', value: candidates.filter(c => c.status === 'selected').length, color: 'bg-green-500' }
          ].map((stat, index) => (
            <Card key={index} className="glass-card p-4">
              <div className="text-center">
                <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <span className="text-white font-bold text-lg">{stat.value}</span>
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Candidates List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="loading-skeleton h-48 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCandidates.map((candidate) => {
              const StatusIcon = getStatusIcon(candidate.status);
              
              return (
                <Card key={candidate.id} className="glass-card p-6 hover:shadow-soft transition-all duration-300">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Candidate Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{candidate.name}</h3>
                          <p className="text-lime font-medium">{candidate.position}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(candidate.status)} text-white`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {candidate.status}
                          </Badge>
                          {candidate.rating && (
                            <Badge variant="outline" className="text-white border-lime">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              {candidate.rating}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          <span>{candidate.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          <span>{candidate.phone}</span>
                        </div>
                        <div className="text-muted-foreground">
                          <span className="font-medium">University:</span> {candidate.university}
                        </div>
                        <div className="text-muted-foreground">
                          <span className="font-medium">GPA:</span> {candidate.gpa}/4.0
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-white mb-2">Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {candidate.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs text-white border-lime">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-white mb-1">Experience:</p>
                        <p className="text-sm text-muted-foreground">{candidate.experience}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 min-w-48">
                      <Select
                        value={candidate.status}
                        onValueChange={(value) => handleStatusChange(candidate.id, value)}
                      >
                        <SelectTrigger className="bg-purple-medium/50 border-border text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-purple-medium border-border">
                          <SelectItem value="pending" className="text-white">Pending</SelectItem>
                          <SelectItem value="shortlisted" className="text-white">Shortlisted</SelectItem>
                          <SelectItem value="rejected" className="text-white">Rejected</SelectItem>
                          <SelectItem value="interviewed" className="text-white">Interviewed</SelectItem>
                          <SelectItem value="selected" className="text-white">Selected</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        onClick={() => handleDownloadResume(candidate)}
                        variant="outline"
                        className="text-white border-lime hover:bg-lime hover:text-purple-dark"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View Resume
                      </Button>

                      <Button
                        variant="outline"
                        className="text-white border-border hover:bg-purple-medium"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {filteredCandidates.length === 0 && !isLoading && (
          <Card className="glass-card p-12 text-center">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Candidates Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterStatus !== 'all' || filterPosition !== 'all'
                ? "No candidates match your search criteria."
                : "No applications received yet."}
            </p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CandidateReview;
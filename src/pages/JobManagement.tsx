import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SearchFilterBar } from "@/components/ui/search-filter-bar";
import { 
  FileText, 
  Users, 
  Calendar, 
  Edit, 
  Eye, 
  Copy,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  MapPin,
  Briefcase
} from "lucide-react";
import { GraduationHat } from "@/components/ui/graduation-hat";
import { useToast } from "@/hooks/use-toast";

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Internship' | 'Contract';
  experience: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  benefits: string[];
  status: 'draft' | 'published' | 'closed' | 'on-hold';
  postedDate: string;
  deadline: string;
  applicants: number;
  shortlisted: number;
  interviewed: number;
  selected: number;
}

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'closed', label: 'Closed' },
  { value: 'on-hold', label: 'On Hold' }
];

const JobManagement = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    // Mock data loading
    const loadJobs = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockJobs: JobPosting[] = [
        {
          id: '1',
          title: 'Senior Software Engineer',
          department: 'Engineering',
          location: 'Bangalore, India',
          type: 'Full-time',
          experience: '3-5 years',
          salary: { min: 15, max: 25, currency: 'INR (Lakhs)' },
          description: 'We are looking for an experienced Software Engineer to join our dynamic team. You will be responsible for developing high-quality software solutions and mentoring junior developers.',
          requirements: ['Bachelor\'s degree in Computer Science', '3+ years of experience with React/Angular', 'Strong knowledge of Node.js', 'Experience with cloud platforms (AWS/Azure)', 'Excellent problem-solving skills'],
          benefits: ['Competitive salary', 'Health insurance', 'Flexible work hours', 'Professional development budget', 'Stock options'],
          status: 'published',
          postedDate: '2024-08-15',
          deadline: '2024-09-15',
          applicants: 42,
          shortlisted: 15,
          interviewed: 8,
          selected: 2
        },
        {
          id: '2',
          title: 'Frontend Developer',
          department: 'Engineering',
          location: 'Mumbai, India',
          type: 'Full-time',
          experience: '1-3 years',
          salary: { min: 8, max: 15, currency: 'INR (Lakhs)' },
          description: 'Join our frontend team to create amazing user experiences. You\'ll work with modern technologies and collaborate with designers to bring interfaces to life.',
          requirements: ['Bachelor\'s degree in relevant field', 'Proficiency in React.js', 'Experience with TypeScript', 'Knowledge of CSS frameworks', 'Understanding of responsive design'],
          benefits: ['Competitive salary', 'Health insurance', 'Learning budget', 'Flexible hours'],
          status: 'published',
          postedDate: '2024-08-20',
          deadline: '2024-09-20',
          applicants: 28,
          shortlisted: 12,
          interviewed: 5,
          selected: 1
        },
        {
          id: '3',
          title: 'Data Science Intern',
          department: 'Analytics',
          location: 'Hyderabad, India',
          type: 'Internship',
          experience: '0-1 years',
          salary: { min: 30000, max: 50000, currency: 'INR (Per month)' },
          description: 'Exciting internship opportunity to work with our data science team. Perfect for students looking to gain hands-on experience in machine learning and data analysis.',
          requirements: ['Currently pursuing degree in Data Science/Statistics', 'Knowledge of Python/R', 'Basic understanding of ML algorithms', 'Strong analytical skills'],
          benefits: ['Mentorship program', 'Certificate upon completion', 'Potential for full-time offer', 'Learning resources'],
          status: 'published',
          postedDate: '2024-08-25',
          deadline: '2024-09-10',
          applicants: 65,
          shortlisted: 20,
          interviewed: 10,
          selected: 3
        },
        {
          id: '4',
          title: 'Product Manager',
          department: 'Product',
          location: 'Pune, India',
          type: 'Full-time',
          experience: '5-8 years',
          salary: { min: 25, max: 40, currency: 'INR (Lakhs)' },
          description: 'Lead product strategy and execution for our core platform. Work closely with engineering, design, and business teams to deliver exceptional products.',
          requirements: ['MBA or equivalent experience', '5+ years in product management', 'Experience with agile methodologies', 'Strong analytical skills', 'Excellent communication'],
          benefits: ['Competitive salary', 'Equity participation', 'Health benefits', 'Flexible work options'],
          status: 'draft',
          postedDate: '2024-08-28',
          deadline: '2024-10-01',
          applicants: 0,
          shortlisted: 0,
          interviewed: 0,
          selected: 0
        }
      ];
      
      setJobs(mockJobs);
      setFilteredJobs(mockJobs);
      setIsLoading(false);
    };

    loadJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilters.length > 0) {
      filtered = filtered.filter(job =>
        statusFilters.includes(job.status)
      );
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, statusFilters]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'published': return 'bg-green-500';
      case 'closed': return 'bg-red-500';
      case 'on-hold': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="w-4 h-4" />;
      case 'published': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <AlertCircle className="w-4 h-4" />;
      case 'on-hold': return <Clock className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const updateJobStatus = (jobId: string, newStatus: JobPosting['status']) => {
    setJobs(jobs.map(job => 
      job.id === jobId 
        ? { ...job, status: newStatus }
        : job
    ));
    
    toast({
      title: "Status Updated",
      description: "Job posting status has been updated successfully.",
    });
  };

  const duplicateJob = (jobId: string) => {
    const jobToDuplicate = jobs.find(job => job.id === jobId);
    if (jobToDuplicate) {
      const duplicatedJob = {
        ...jobToDuplicate,
        id: Date.now().toString(),
        title: `${jobToDuplicate.title} (Copy)`,
        status: 'draft' as const,
        postedDate: new Date().toISOString().split('T')[0],
        applicants: 0,
        shortlisted: 0,
        interviewed: 0,
        selected: 0
      };
      setJobs([duplicatedJob, ...jobs]);
      toast({
        title: "Job Duplicated",
        description: "Job posting has been duplicated as a draft.",
      });
    }
  };

  const stats = {
    total: jobs.length,
    published: jobs.filter(j => j.status === 'published').length,
    draft: jobs.filter(j => j.status === 'draft').length,
    totalApplicants: jobs.reduce((sum, job) => sum + job.applicants, 0)
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Job Management" subtitle="Create and manage job postings">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="loading-skeleton h-24 animate-pulse"></div>
            ))}
          </div>
          <div className="loading-skeleton h-96 animate-pulse"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Job Management" subtitle="Create and manage job postings">
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-muted-foreground">Total Jobs</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-500/20 p-3 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.published}</p>
                <p className="text-muted-foreground">Published</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="bg-gray-500/20 p-3 rounded-xl">
                <Edit className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.draft}</p>
                <p className="text-muted-foreground">Drafts</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="bg-lime/20 p-3 rounded-xl">
                <Users className="w-6 h-6 text-lime" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.totalApplicants}</p>
                <p className="text-muted-foreground">Total Applicants</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Controls */}
        <Card className="glass-card p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white">Job Postings</h3>
              <p className="text-muted-foreground">Create and manage your job openings</p>
            </div>
            <Button 
              onClick={() => setShowCreateForm(true)} 
              className="btn-primary"
            >
              <GraduationHat className="w-4 h-4 mr-2" />
              Create New Job
            </Button>
          </div>

          <SearchFilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilters.join(',')}
            onStatusFilterChange={(value) => setStatusFilters(value ? [value] : [])}
            filterOptions={statusOptions}
            placeholder="Search jobs by title, department, or location..."
          />
        </Card>

        {/* Job List */}
        <Card className="glass-card p-6">
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-purple-medium/30 p-6 rounded-lg hover:bg-purple-medium/40 transition-all duration-200">
                <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="text-xl font-semibold text-white">{job.title}</h4>
                      <Badge className={`${getStatusColor(job.status)} text-white flex items-center gap-1`}>
                        {getStatusIcon(job.status)}
                        {job.status}
                      </Badge>
                      <Badge className="bg-blue-500/20 text-blue-400">
                        {job.type}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        {job.department}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        {job.salary.min}-{job.salary.max} {job.salary.currency}
                      </div>
                    </div>

                    <p className="text-white text-sm mb-4 line-clamp-2">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.requirements.slice(0, 3).map((req, index) => (
                        <Badge key={index} className="bg-purple-light/20 text-purple-light text-xs">
                          {req}
                        </Badge>
                      ))}
                      {job.requirements.length > 3 && (
                        <Badge className="bg-gray-500/20 text-gray-400 text-xs">
                          +{job.requirements.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-blue-400 font-semibold">{job.applicants}</div>
                        <div className="text-muted-foreground">Applicants</div>
                      </div>
                      <div className="text-center">
                        <div className="text-purple-400 font-semibold">{job.shortlisted}</div>
                        <div className="text-muted-foreground">Shortlisted</div>
                      </div>
                      <div className="text-center">
                        <div className="text-orange-400 font-semibold">{job.interviewed}</div>
                        <div className="text-muted-foreground">Interviewed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-green-400 font-semibold">{job.selected}</div>
                        <div className="text-muted-foreground">Selected</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 xl:min-w-64">
                    <div className="flex gap-2">
                      <Button size="sm" className="btn-secondary flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" variant="ghost" className="text-white hover:bg-purple-medium/50">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => duplicateJob(job.id)}
                        className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 flex-1"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Duplicate
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-500/20">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {job.status === 'draft' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateJobStatus(job.id, 'published')}
                        className="bg-green-500/20 text-green-400 hover:bg-green-500/30 w-full"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Publish
                      </Button>
                    )}
                    
                    {job.status === 'published' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => updateJobStatus(job.id, 'on-hold')}
                          className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 flex-1"
                        >
                          <Clock className="w-4 h-4 mr-1" />
                          Hold
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => updateJobStatus(job.id, 'closed')}
                          className="bg-red-500/20 text-red-400 hover:bg-red-500/30 flex-1"
                        >
                          Close
                        </Button>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground text-center">
                      Posted: {new Date(job.postedDate).toLocaleDateString()}<br/>
                      Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Job Postings Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilters.length > 0 
                    ? "Try adjusting your search or filters"
                    : "Create your first job posting to get started"
                  }
                </p>
                <Button 
                  onClick={() => setShowCreateForm(true)} 
                  className="btn-primary mt-4"
                >
                  <GraduationHat className="w-4 h-4 mr-2" />
                  Create Job Posting
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default JobManagement;
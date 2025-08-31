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
  const [jobs, setJobs] = useState<JobPosting[]>(() => {
    try {
      const saved = localStorage.getItem('jobs');
      return saved ? JSON.parse(saved) as JobPosting[] : [];
    } catch {
      return [];
    }
  });
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    setFilteredJobs(jobs);
  }, []);

  useEffect(() => {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);

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

  const deleteJob = (jobId: string) => {
    setJobs(jobs.filter(job => job.id !== jobId));
    toast({
      title: "Job Deleted",
      description: "Job posting has been deleted successfully.",
    });
  };

  const viewJobDetails = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      toast({
        title: job.title,
        description: `${job.department} • ${job.location} • ${job.applicants} applicants`,
      });
    }
  };

  const stats = {
    total: jobs.length,
    published: jobs.filter(j => j.status === 'published').length,
    draft: jobs.filter(j => j.status === 'draft').length,
    totalApplicants: jobs.reduce((sum, job) => sum + job.applicants, 0)
  };


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

        {/* Create Form */}
        {showCreateForm && (
          <Card className="glass-card p-6">
            <JobCreateForm onCancel={() => setShowCreateForm(false)} onCreate={(job) => { setJobs([job, ...jobs]); setShowCreateForm(false); toast({ title: 'Job Created', description: 'New job has been added.'}); }} />
          </Card>
        )}

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
                      <Button 
                        size="sm" 
                        onClick={() => viewJobDetails(job.id)}
                        className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 flex-1"
                      >
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
                      <Button 
                        size="sm" 
                        onClick={() => deleteJob(job.id)}
                        className="bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      >
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

// Inline create form component
function JobCreateForm({ onCancel, onCreate }: { onCancel: () => void; onCreate: (job: JobPosting) => void }) {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<JobPosting['type']>('Full-time');
  const [experience, setExperience] = useState("");
  const [salaryMin, setSalaryMin] = useState<number>(0);
  const [salaryMax, setSalaryMax] = useState<number>(0);
  const [currency, setCurrency] = useState("INR (Lakhs)");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [benefits, setBenefits] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !department || !location || !experience || !deadline) return;
    const job: JobPosting = {
      id: Date.now().toString(),
      title,
      department,
      location,
      type,
      experience,
      salary: { min: Number(salaryMin) || 0, max: Number(salaryMax) || 0, currency },
      description,
      requirements: requirements.split(',').map(s => s.trim()).filter(Boolean),
      benefits: benefits.split(',').map(s => s.trim()).filter(Boolean),
      status: 'draft',
      postedDate: new Date().toISOString().split('T')[0],
      deadline,
      applicants: 0,
      shortlisted: 0,
      interviewed: 0,
      selected: 0,
    };
    onCreate(job);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white mb-2">Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-purple-medium/50 border-border text-white" />
        </div>
        <div>
          <label className="block text-sm text-white mb-2">Department</label>
          <Input value={department} onChange={(e) => setDepartment(e.target.value)} className="bg-purple-medium/50 border-border text-white" />
        </div>
        <div>
          <label className="block text-sm text-white mb-2">Location</label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} className="bg-purple-medium/50 border-border text-white" />
        </div>
        <div>
          <label className="block text-sm text-white mb-2">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value as JobPosting['type'])} className="w-full h-10 rounded-md bg-purple-medium/50 border border-border text-white px-3">
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-white mb-2">Experience</label>
          <Input value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="e.g., 3-5 years" className="bg-purple-medium/50 border-border text-white" />
        </div>
        <div>
          <label className="block text-sm text-white mb-2">Deadline</label>
          <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="bg-purple-medium/50 border-border text-white" />
        </div>
        <div>
          <label className="block text-sm text-white mb-2">Salary Min</label>
          <Input type="number" value={salaryMin} onChange={(e) => setSalaryMin(Number(e.target.value))} className="bg-purple-medium/50 border-border text-white" />
        </div>
        <div>
          <label className="block text-sm text-white mb-2">Salary Max</label>
          <Input type="number" value={salaryMax} onChange={(e) => setSalaryMax(Number(e.target.value))} className="bg-purple-medium/50 border-border text-white" />
        </div>
        <div>
          <label className="block text-sm text-white mb-2">Currency</label>
          <Input value={currency} onChange={(e) => setCurrency(e.target.value)} className="bg-purple-medium/50 border-border text-white" />
        </div>
      </div>
      <div>
        <label className="block text-sm text-white mb-2">Description</label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="bg-purple-medium/50 border-border text-white" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white mb-2">Requirements (comma separated)</label>
          <Input value={requirements} onChange={(e) => setRequirements(e.target.value)} className="bg-purple-medium/50 border-border text-white" />
        </div>
        <div>
          <label className="block text-sm text-white mb-2">Benefits (comma separated)</label>
          <Input value={benefits} onChange={(e) => setBenefits(e.target.value)} className="bg-purple-medium/50 border-border text-white" />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" className="text-white hover:bg-purple-medium/50" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="btn-primary">Create Job</Button>
      </div>
    </form>
  );
}

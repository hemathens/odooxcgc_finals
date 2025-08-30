import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Edit, 
  Calendar,
  Building,
  MapPin,
  Clock,
  ExternalLink,
  Trash2,
  CheckCircle
} from "lucide-react";
import { GraduationHat } from "@/components/ui/graduation-hat";
import { useApplications } from "@/context/ApplicationsContext";

const ApplicationTracker = () => {
  const { applications, addApplication, updateApplication, deleteApplication } = useApplications();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form fields
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [appliedDate, setAppliedDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState<'applied' | 'in-review' | 'interview' | 'selected' | 'rejected'>("applied");
  const [jobUrl, setJobUrl] = useState("");
  const [salary, setSalary] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [notes, setNotes] = useState("");

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

  const getStatusLabel = (status: string) => {
    switch (status) {
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

  const beginAdd = () => {
    setEditId(null);
    setCompany("");
    setPosition("");
    setLocation("");
    setAppliedDate("");
    setDeadline("");
    setStatus("applied");
    setJobUrl("");
    setSalary("");
    setNextStep("");
    setNotes("");
    setShowForm(true);
  };

  const beginEdit = (id: string) => {
    const app = applications.find(a => a.id === id);
    if (!app) return;
    setEditId(id);
    setCompany(app.company);
    setPosition(app.position);
    setLocation(app.location || "");
    setAppliedDate(app.appliedDate);
    setDeadline(app.deadline || "");
    setStatus(app.status as any);
    setJobUrl(app.jobUrl || "");
    setSalary(app.salary || "");
    setNextStep(app.nextStep || "");
    setNotes(app.notes || "");
    setShowForm(true);
  };

  const saveForm = () => {
    if (!company || !position || !appliedDate) {
      alert('Please fill Company, Position and Applied Date');
      return;
    }

    if (editId) {
      updateApplication(editId, { company, position, location, appliedDate, deadline, status, jobUrl, salary, nextStep, notes });
    } else {
      addApplication({ company, position, appliedDate, deadline, status, location, jobUrl, salary, nextStep, notes });
    }
    setShowForm(false);
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
            <div className="text-2xl font-bold text-purple-400">{statusCounts['interview'] || 0}</div>
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
                <option value="interview">Interview</option>
                <option value="selected">Selected</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <Button className="btn-primary" onClick={beginAdd}>
              <GraduationHat className="w-4 h-4 mr-2" />
              Add Application
            </Button>
          </div>
        </Card>

        {/* Add/Edit Form */}
        {showForm && (
          <Card className="glass-card p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Company</label>
                <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Tech Corp" className="bg-purple-medium/50 border-border text-white" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Position</label>
                <Input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Software Engineer" className="bg-purple-medium/50 border-border text-white" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Location</label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="San Francisco, CA / Remote" className="bg-purple-medium/50 border-border text-white" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-purple-medium/50 border border-border text-white rounded-md h-10 px-3"
                >
                  <option value="applied">Applied</option>
                  <option value="in-review">In Review</option>
                  <option value="interview">Interview</option>
                  <option value="selected">Selected</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Applied Date</label>
                <Input type="date" value={appliedDate} onChange={(e) => setAppliedDate(e.target.value)} className="bg-purple-medium/50 border-border text-white" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Deadline</label>
                <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="bg-purple-medium/50 border-border text-white" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Job URL</label>
                <Input value={jobUrl} onChange={(e) => setJobUrl(e.target.value)} placeholder="https://..." className="bg-purple-medium/50 border-border text-white" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Salary</label>
                <Input value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="$100,000 - $130,000" className="bg-purple-medium/50 border-border text-white" />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Next Step</label>
                <Input value={nextStep} onChange={(e) => setNextStep(e.target.value)} placeholder="Technical interview on ..." className="bg-purple-medium/50 border-border text-white" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Notes</label>
                <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any notes" className="bg-purple-medium/50 border-border text-white" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-6">
              <Button variant="ghost" className="text-white hover:bg-purple-medium/50" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button className="btn-primary" onClick={saveForm}>
                <CheckCircle className="w-4 h-4 mr-2" />
                {editId ? 'Save Changes' : 'Add Application'}
              </Button>
            </div>
          </Card>
        )}

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
                    {application.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{application.location}</span>
                      </div>
                    )}
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
                    <Button size="sm" variant="ghost" className="text-white hover:bg-purple-medium/50" onClick={() => window.open(application.jobUrl!, '_blank')}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Job
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="text-white hover:bg-purple-medium/50" onClick={() => beginEdit(application.id)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-300 hover:bg-red-500/20" onClick={() => deleteApplication(application.id)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
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
            <Button className="btn-primary mt-4" onClick={beginAdd}>
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
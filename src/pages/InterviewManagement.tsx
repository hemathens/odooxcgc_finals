import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Video, 
  MapPin,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Phone,
  MessageSquare
} from "lucide-react";

interface Interview {
  id: string;
  candidateName: string;
  candidateEmail: string;
  position: string;
  type: 'video' | 'phone' | 'in-person';
  date: string;
  time: string;
  duration: number; // in minutes
  location?: string;
  meetingLink?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  interviewers: string[];
  notes?: string;
  rating?: number;
  feedback?: string;
}

const InterviewManagement = () => {
  const { toast } = useToast();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>();

  useEffect(() => {
    // Simulate API loading
    const loadInterviews = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock interviews data
      setInterviews([
        {
          id: '1',
          candidateName: 'John Smith',
          candidateEmail: 'john.smith@university.edu',
          position: 'Software Engineer',
          type: 'video',
          date: '2024-09-15',
          time: '10:00 AM',
          duration: 60,
          meetingLink: 'https://meet.google.com/abc-def-ghi',
          status: 'scheduled',
          interviewers: ['Sarah Wilson', 'Mike Johnson'],
          rating: 4.5
        },
        {
          id: '2',
          candidateName: 'Sarah Johnson',
          candidateEmail: 'sarah.j@stanford.edu',
          position: 'Frontend Developer',
          type: 'in-person',
          date: '2024-09-16',
          time: '2:00 PM',
          duration: 45,
          location: 'Conference Room A',
          status: 'scheduled',
          interviewers: ['David Brown'],
        },
        {
          id: '3',
          candidateName: 'Michael Chen',
          candidateEmail: 'm.chen@berkeley.edu',
          position: 'Full Stack Developer',
          type: 'phone',
          date: '2024-09-14',
          time: '11:00 AM',
          duration: 30,
          status: 'completed',
          interviewers: ['Lisa Davis'],
          rating: 4.2,
          feedback: 'Strong technical skills, good communication'
        }
      ]);
      setIsLoading(false);
    };

    loadInterviews();
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      'scheduled': 'bg-blue-500',
      'completed': 'bg-green-500',
      'cancelled': 'bg-red-500',
      'no-show': 'bg-yellow-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      'video': Video,
      'phone': Phone,
      'in-person': MapPin
    };
    return icons[type as keyof typeof icons] || Video;
  };

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || interview.status === filterStatus;
    const matchesType = filterType === 'all' || interview.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleStatusChange = (interviewId: string, newStatus: string) => {
    setInterviews(prev => prev.map(interview => 
      interview.id === interviewId 
        ? { ...interview, status: newStatus as Interview['status'] }
        : interview
    ));
    
    toast({
      title: "Status Updated",
      description: `Interview status changed to ${newStatus}`,
    });
  };

  const handleCreateInterview = () => {
    toast({
      title: "Interview Scheduling",
      description: "Interview scheduling functionality will be implemented here.",
    });
    setIsCreateDialogOpen(false);
  };

  const upcomingInterviews = interviews.filter(i => i.status === 'scheduled' && new Date(i.date) >= new Date());
  const todayInterviews = interviews.filter(i => i.date === format(new Date(), 'yyyy-MM-dd'));

  return (
    <DashboardLayout 
      title="Interview Management" 
      subtitle="Schedule and manage candidate interviews"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search interviews..."
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
                <SelectItem value="scheduled" className="text-white">Scheduled</SelectItem>
                <SelectItem value="completed" className="text-white">Completed</SelectItem>
                <SelectItem value="cancelled" className="text-white">Cancelled</SelectItem>
                <SelectItem value="no-show" className="text-white">No Show</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48 bg-purple-medium/50 border-border text-white">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="bg-purple-medium border-border">
                <SelectItem value="all" className="text-white">All Types</SelectItem>
                <SelectItem value="video" className="text-white">Video Call</SelectItem>
                <SelectItem value="phone" className="text-white">Phone</SelectItem>
                <SelectItem value="in-person" className="text-white">In Person</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Schedule Interview
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-purple-dark border-border text-white max-w-md">
              <DialogHeader>
                <DialogTitle>Schedule New Interview</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Select Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left bg-purple-medium/50 border-border text-white">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-purple-medium border-border">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <p className="text-muted-foreground text-sm">Complete interview scheduling form will be implemented here.</p>
                <Button onClick={handleCreateInterview} className="btn-primary w-full">
                  Schedule Interview
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Interviews', value: interviews.length, color: 'bg-blue-500' },
            { label: 'Today\'s Interviews', value: todayInterviews.length, color: 'bg-green-500' },
            { label: 'Upcoming', value: upcomingInterviews.length, color: 'bg-purple-500' },
            { label: 'Completed', value: interviews.filter(i => i.status === 'completed').length, color: 'bg-gray-500' }
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

        {/* Interviews List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="loading-skeleton h-40 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInterviews.map((interview) => {
              const TypeIcon = getTypeIcon(interview.type);
              
              return (
                <Card key={interview.id} className="glass-card p-6 hover:shadow-soft transition-all duration-300">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Interview Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{interview.candidateName}</h3>
                          <p className="text-lime font-medium">{interview.position}</p>
                          <p className="text-sm text-muted-foreground">{interview.candidateEmail}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(interview.status)} text-white`}>
                            {interview.status}
                          </Badge>
                          <Badge variant="outline" className="text-white border-lime">
                            <TypeIcon className="w-3 h-3 mr-1" />
                            {interview.type}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{new Date(interview.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{interview.time} ({interview.duration} min)</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span>{interview.interviewers.join(', ')}</span>
                        </div>
                      </div>

                      {interview.location && (
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>Location: {interview.location}</span>
                        </div>
                      )}

                      {interview.meetingLink && (
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Video className="w-4 h-4" />
                          <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer" 
                             className="text-lime hover:text-lime-dark transition-colors">
                            {interview.meetingLink}
                          </a>
                        </div>
                      )}

                      {interview.feedback && (
                        <div>
                          <p className="text-sm font-medium text-white mb-1">Feedback:</p>
                          <p className="text-sm text-muted-foreground">{interview.feedback}</p>
                        </div>
                      )}

                      {interview.rating && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">Rating:</span>
                          <Badge variant="outline" className="text-white border-lime">
                            ⭐ {interview.rating}/5
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 min-w-48">
                      <Select
                        value={interview.status}
                        onValueChange={(value) => handleStatusChange(interview.id, value)}
                      >
                        <SelectTrigger className="bg-purple-medium/50 border-border text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-purple-medium border-border">
                          <SelectItem value="scheduled" className="text-white">Scheduled</SelectItem>
                          <SelectItem value="completed" className="text-white">Completed</SelectItem>
                          <SelectItem value="cancelled" className="text-white">Cancelled</SelectItem>
                          <SelectItem value="no-show" className="text-white">No Show</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="outline"
                        className="text-white border-lime hover:bg-lime hover:text-purple-dark"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>

                      <Button
                        variant="outline"
                        className="text-white border-border hover:bg-purple-medium"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Add Notes
                      </Button>

                      {interview.status === 'scheduled' && (
                        <Button
                          variant="outline"
                          className="text-red-400 border-red-400 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {filteredInterviews.length === 0 && !isLoading && (
          <Card className="glass-card p-12 text-center">
            <CalendarIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Interviews Found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                ? "No interviews match your search criteria."
                : "No interviews scheduled yet."}
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Schedule First Interview
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InterviewManagement;
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye
} from "lucide-react";

interface PlacementEvent {
  id: string;
  title: string;
  type: 'job-fair' | 'company-visit' | 'workshop' | 'seminar' | 'interview-drive';
  date: string;
  time: string;
  venue: string;
  description: string;
  maxParticipants: number;
  registeredParticipants: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  organizer: string;
  companies?: string[];
}

const PlacementEvents = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<PlacementEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    const loadEvents = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock events data
      setEvents([
        {
          id: '1',
          title: 'TechCorp Recruitment Drive',
          type: 'interview-drive',
          date: '2024-09-15',
          time: '09:00 AM',
          venue: 'Auditorium A',
          description: 'Technical interviews for Software Engineer positions',
          maxParticipants: 100,
          registeredParticipants: 85,
          status: 'upcoming',
          organizer: 'TPO Office',
          companies: ['TechCorp', 'InnovateTech']
        },
        {
          id: '2',
          title: 'Campus Job Fair 2024',
          type: 'job-fair',
          date: '2024-09-20',
          time: '10:00 AM',
          venue: 'Main Campus Ground',
          description: 'Annual placement fair with 50+ companies',
          maxParticipants: 500,
          registeredParticipants: 423,
          status: 'upcoming',
          organizer: 'TPO Office',
          companies: ['Microsoft', 'Google', 'Amazon', 'Meta']
        },
        {
          id: '3',
          title: 'Resume Writing Workshop',
          type: 'workshop',
          date: '2024-09-10',
          time: '02:00 PM',
          venue: 'Conference Room B',
          description: 'Learn to create ATS-friendly resumes',
          maxParticipants: 50,
          registeredParticipants: 45,
          status: 'completed',
          organizer: 'Career Services'
        }
      ]);
      setIsLoading(false);
    };

    loadEvents();
  }, []);

  const getEventTypeColor = (type: string) => {
    const colors = {
      'job-fair': 'bg-blue-500',
      'company-visit': 'bg-green-500',
      'workshop': 'bg-purple-500',
      'seminar': 'bg-orange-500',
      'interview-drive': 'bg-red-500'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'upcoming': 'bg-blue-500',
      'ongoing': 'bg-green-500',
      'completed': 'bg-gray-500',
      'cancelled': 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || event.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleCreateEvent = () => {
    toast({
      title: "Event Creation",
      description: "Event creation functionality will be implemented here.",
    });
    setIsCreateDialogOpen(false);
  };

  return (
    <DashboardLayout 
      title="Placement Events" 
      subtitle="Manage campus placement events and activities"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-purple-medium/50 border-border text-white"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48 bg-purple-medium/50 border-border text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="bg-purple-medium border-border">
                <SelectItem value="all" className="text-white">All Events</SelectItem>
                <SelectItem value="job-fair" className="text-white">Job Fairs</SelectItem>
                <SelectItem value="company-visit" className="text-white">Company Visits</SelectItem>
                <SelectItem value="workshop" className="text-white">Workshops</SelectItem>
                <SelectItem value="seminar" className="text-white">Seminars</SelectItem>
                <SelectItem value="interview-drive" className="text-white">Interview Drives</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-purple-dark border-border text-white">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-muted-foreground">Event creation form will be implemented here.</p>
                <Button onClick={handleCreateEvent} className="btn-primary w-full">
                  Create Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="loading-skeleton h-64 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="glass-card p-6 hover:shadow-soft transition-all duration-300">
                <div className="space-y-4">
                  {/* Event Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{event.title}</h3>
                      <div className="flex gap-2 mb-3">
                        <Badge className={`${getEventTypeColor(event.type)} text-white`}>
                          {event.type.replace('-', ' ')}
                        </Badge>
                        <Badge className={`${getStatusColor(event.status)} text-white`}>
                          {event.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{event.registeredParticipants}/{event.maxParticipants} registered</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {event.description}
                  </p>

                  {/* Companies (if applicable) */}
                  {event.companies && event.companies.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-white mb-2">Participating Companies:</p>
                      <div className="flex flex-wrap gap-1">
                        {event.companies.slice(0, 3).map((company, index) => (
                          <Badge key={index} variant="outline" className="text-xs text-white border-lime">
                            {company}
                          </Badge>
                        ))}
                        {event.companies.length > 3 && (
                          <Badge variant="outline" className="text-xs text-white border-lime">
                            +{event.companies.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="text-white border-lime hover:bg-lime hover:text-purple-dark">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="text-white border-border hover:bg-purple-medium">
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-400 border-red-400 hover:bg-red-500 hover:text-white">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {filteredEvents.length === 0 && !isLoading && (
          <Card className="glass-card p-12 text-center">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Events Found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || filterType !== 'all' 
                ? "No events match your search criteria." 
                : "No placement events scheduled yet."}
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create First Event
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PlacementEvents;
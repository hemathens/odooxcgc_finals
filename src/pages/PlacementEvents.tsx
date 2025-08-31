import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Eye,
  Building,
  CalendarDays
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

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || event.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleCreateEvent = (eventData: Omit<PlacementEvent, 'id' | 'registeredParticipants'>) => {
    const newEvent: PlacementEvent = {
      ...eventData,
      id: Date.now().toString(),
      registeredParticipants: 0
    };
    
    setEvents(prev => [newEvent, ...prev]);
    toast({
      title: "Event Created",
      description: `${eventData.title} has been successfully created.`,
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
            <DialogContent className="bg-purple-dark border-border text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <EventCreateForm onCancel={() => setIsCreateDialogOpen(false)} onCreate={handleCreateEvent} />
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="btn-secondary flex-1">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-purple-dark border-border text-white max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{event.title}</DialogTitle>
                        </DialogHeader>
                        <EventViewDialog event={event} />
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-green-500/20 text-green-400 hover:bg-green-500/30 flex-1">
                          <Edit2 className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-purple-dark border-border text-white max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Event</DialogTitle>
                        </DialogHeader>
                        <EventEditForm event={event} onCancel={() => {}} onUpdate={(updatedEvent) => {
                          setEvents(prev => prev.map(e => e.id === event.id ? updatedEvent : e));
                        }} />
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-400 border-red-400 hover:bg-red-500 hover:text-white"
                      onClick={() => {
                        setEvents(prev => prev.filter(e => e.id !== event.id));
                        toast({
                          title: "Event Deleted",
                          description: `${event.title} has been deleted.`,
                        });
                      }}
                    >
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

function EventViewDialog({ event }: { event: PlacementEvent }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Event Type</label>
          <Badge className={`${getEventTypeColor(event.type)} text-white`}>
            {event.type.replace('-', ' ')}
          </Badge>
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Status</label>
          <Badge className={`${getStatusColor(event.status)} text-white`}>
            {event.status}
          </Badge>
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Date</label>
          <p className="text-white">{new Date(event.date).toLocaleDateString()}</p>
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Time</label>
          <p className="text-white">{event.time}</p>
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Venue</label>
          <p className="text-white">{event.venue}</p>
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Organizer</label>
          <p className="text-white">{event.organizer}</p>
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Participants</label>
          <p className="text-white">{event.registeredParticipants}/{event.maxParticipants}</p>
        </div>
      </div>
      
      <div>
        <label className="block text-sm text-muted-foreground mb-2">Description</label>
        <p className="text-white bg-purple-medium/30 p-4 rounded-lg">{event.description}</p>
      </div>
      
      {event.companies && event.companies.length > 0 && (
        <div>
          <label className="block text-sm text-muted-foreground mb-2">Participating Companies</label>
          <div className="flex flex-wrap gap-2">
            {event.companies.map((company, index) => (
              <Badge key={index} variant="outline" className="text-white border-lime">
                {company}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EventEditForm({ event, onCancel, onUpdate }: { event: PlacementEvent; onCancel: () => void; onUpdate: (event: PlacementEvent) => void }) {
  const [title, setTitle] = useState(event.title);
  const [type, setType] = useState<PlacementEvent['type']>(event.type);
  const [date, setDate] = useState(event.date);
  const [time, setTime] = useState(event.time);
  const [venue, setVenue] = useState(event.venue);
  const [description, setDescription] = useState(event.description);
  const [maxParticipants, setMaxParticipants] = useState(event.maxParticipants.toString());
  const [organizer, setOrganizer] = useState(event.organizer);
  const [companies, setCompanies] = useState(event.companies?.join(', ') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time || !venue || !description || !maxParticipants) return;
    
    const updatedEvent: PlacementEvent = {
      ...event,
      title,
      type,
      date,
      time,
      venue,
      description,
      maxParticipants: parseInt(maxParticipants),
      organizer,
      companies: companies ? companies.split(',').map(c => c.trim()).filter(c => c) : undefined
    };
    
    onUpdate(updatedEvent);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm text-white mb-2">Event Name *</label>
          <Input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="bg-purple-medium/50 border-border text-white" 
          />
        </div>
        
        <div>
          <label className="block text-sm text-white mb-2">Event Type *</label>
          <Select value={type} onValueChange={(value) => setType(value as PlacementEvent['type'])}>
            <SelectTrigger className="bg-purple-medium/50 border-border text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-purple-medium border-border">
              <SelectItem value="job-fair" className="text-white">Job Fair</SelectItem>
              <SelectItem value="company-visit" className="text-white">Company Visit</SelectItem>
              <SelectItem value="workshop" className="text-white">Workshop</SelectItem>
              <SelectItem value="seminar" className="text-white">Seminar</SelectItem>
              <SelectItem value="interview-drive" className="text-white">Interview Drive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm text-white mb-2">Organizer</label>
          <Input 
            value={organizer} 
            onChange={(e) => setOrganizer(e.target.value)} 
            className="bg-purple-medium/50 border-border text-white" 
          />
        </div>
        
        <div>
          <label className="block text-sm text-white mb-2">Date *</label>
          <Input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            className="bg-purple-medium/50 border-border text-white" 
          />
        </div>
        
        <div>
          <label className="block text-sm text-white mb-2">Time *</label>
          <Input 
            type="time" 
            value={time} 
            onChange={(e) => setTime(e.target.value)} 
            className="bg-purple-medium/50 border-border text-white" 
          />
        </div>
        
        <div>
          <label className="block text-sm text-white mb-2">Venue *</label>
          <Input 
            value={venue} 
            onChange={(e) => setVenue(e.target.value)} 
            className="bg-purple-medium/50 border-border text-white" 
          />
        </div>
        
        <div>
          <label className="block text-sm text-white mb-2">Max Participants *</label>
          <Input 
            type="number" 
            value={maxParticipants} 
            onChange={(e) => setMaxParticipants(e.target.value)} 
            min="1"
            className="bg-purple-medium/50 border-border text-white" 
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm text-white mb-2">Description *</label>
          <Textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="bg-purple-medium/50 border-border text-white min-h-20"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm text-white mb-2">Participating Companies (optional)</label>
          <Input 
            value={companies} 
            onChange={(e) => setCompanies(e.target.value)} 
            placeholder="e.g., Microsoft, Google, Amazon (comma-separated)"
            className="bg-purple-medium/50 border-border text-white" 
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="ghost" className="text-white hover:bg-purple-medium/50" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="btn-primary">
          <Edit2 className="w-4 h-4 mr-2" />
          Update Event
        </Button>
      </div>
    </form>
  );
}

function EventCreateForm({ onCancel, onCreate }: { onCancel: () => void; onCreate: (event: Omit<PlacementEvent, 'id' | 'registeredParticipants'>) => void }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<PlacementEvent['type']>('job-fair');
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [organizer, setOrganizer] = useState("TPO Office");
  const [companies, setCompanies] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time || !venue || !description || !maxParticipants) return;
    
    const eventData: Omit<PlacementEvent, 'id' | 'registeredParticipants'> = {
      title,
      type,
      date,
      time,
      venue,
      description,
      maxParticipants: parseInt(maxParticipants),
      status: 'upcoming',
      organizer,
      companies: companies ? companies.split(',').map(c => c.trim()).filter(c => c) : undefined
    };
    
    onCreate(eventData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm text-white mb-2">Event Name *</label>
          <Input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="e.g., TechCorp Recruitment Drive"
            className="bg-purple-medium/50 border-border text-white" 
          />
        </div>
        
        <div>
          <label className="block text-sm text-white mb-2">Event Type *</label>
          <Select value={type} onValueChange={(value) => setType(value as PlacementEvent['type'])}>
            <SelectTrigger className="bg-purple-medium/50 border-border text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-purple-medium border-border">
              <SelectItem value="job-fair" className="text-white">Job Fair</SelectItem>
              <SelectItem value="company-visit" className="text-white">Company Visit</SelectItem>
              <SelectItem value="workshop" className="text-white">Workshop</SelectItem>
              <SelectItem value="seminar" className="text-white">Seminar</SelectItem>
              <SelectItem value="interview-drive" className="text-white">Interview Drive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm text-white mb-2">Organizer</label>
          <Input 
            value={organizer} 
            onChange={(e) => setOrganizer(e.target.value)} 
            className="bg-purple-medium/50 border-border text-white" 
          />
        </div>
        
        <div>
          <label className="block text-sm text-white mb-2">Date *</label>
          <Input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            className="bg-purple-medium/50 border-border text-white" 
          />
        </div>
        
        <div>
          <label className="block text-sm text-white mb-2">Time *</label>
          <Input 
            type="time" 
            value={time} 
            onChange={(e) => setTime(e.target.value)} 
            className="bg-purple-medium/50 border-border text-white" 
          />
        </div>
        
        <div>
          <label className="block text-sm text-white mb-2">Venue *</label>
          <Input 
            value={venue} 
            onChange={(e) => setVenue(e.target.value)} 
            placeholder="e.g., Auditorium A"
            className="bg-purple-medium/50 border-border text-white" 
          />
        </div>
        
        <div>
          <label className="block text-sm text-white mb-2">Max Participants *</label>
          <Input 
            type="number" 
            value={maxParticipants} 
            onChange={(e) => setMaxParticipants(e.target.value)} 
            min="1"
            className="bg-purple-medium/50 border-border text-white" 
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm text-white mb-2">Description *</label>
          <Textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Describe the event details..."
            className="bg-purple-medium/50 border-border text-white min-h-20"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm text-white mb-2">Participating Companies (optional)</label>
          <Input 
            value={companies} 
            onChange={(e) => setCompanies(e.target.value)} 
            placeholder="e.g., Microsoft, Google, Amazon (comma-separated)"
            className="bg-purple-medium/50 border-border text-white" 
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="ghost" className="text-white hover:bg-purple-medium/50" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="btn-primary">
          <CalendarDays className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>
    </form>
  );
}

export default PlacementEvents;
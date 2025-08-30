import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  Clock, 
  Plus, 
  Search,
  Edit,
  Trash2,
  Bell,
  CheckCircle,
  AlertCircle,
  CalendarX
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Test {
  id: string;
  company: string;
  position: string;
  type: 'aptitude' | 'technical' | 'coding' | 'interview' | 'group-discussion';
  date: string;
  time: string;
  duration: number; // in minutes
  location: string;
  meetingLink?: string;
  status: 'scheduled' | 'completed' | 'missed' | 'cancelled';
  instructions?: string;
  reminderSet: boolean;
}

const TestScheduler = () => {
  const { toast } = useToast();
  const [tests, setTests] = useState<Test[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    // Mock data
    setTests([
      {
        id: '1',
        company: 'Tech Corp',
        position: 'Software Engineer',
        type: 'technical',
        date: '2024-09-02',
        time: '10:00',
        duration: 120,
        location: 'Online',
        meetingLink: 'https://meet.google.com/abc-def-ghi',
        status: 'scheduled',
        instructions: 'Prepare for system design and coding questions',
        reminderSet: true
      },
      {
        id: '2',
        company: 'StartupXYZ',
        position: 'Frontend Developer',
        type: 'coding',
        date: '2024-09-03',
        time: '14:00',
        duration: 90,
        location: 'Online',
        meetingLink: 'https://codepair.com/session/xyz123',
        status: 'scheduled',
        instructions: 'React and JavaScript focused assessment',
        reminderSet: false
      },
      {
        id: '3',
        company: 'BigTech Inc',
        position: 'Full Stack Developer',
        type: 'interview',
        date: '2024-09-05',
        time: '11:30',
        duration: 60,
        location: 'Office - Building A, Floor 3',
        status: 'scheduled',
        reminderSet: true
      },
      {
        id: '4',
        company: 'InnovateLabs',
        position: 'Backend Engineer',
        type: 'aptitude',
        date: '2024-08-28',
        time: '09:00',
        duration: 60,
        location: 'Online',
        status: 'completed',
        reminderSet: false
      },
      {
        id: '5',
        company: 'DataCorp',
        position: 'Data Analyst',
        type: 'technical',
        date: '2024-08-25',
        time: '15:00',
        duration: 90,
        location: 'Online',
        status: 'missed',
        reminderSet: true
      }
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'missed': return 'bg-red-500';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'aptitude': return 'bg-purple-500';
      case 'technical': return 'bg-blue-500';
      case 'coding': return 'bg-green-500';
      case 'interview': return 'bg-orange-500';
      case 'group-discussion': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'group-discussion': return 'Group Discussion';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const toggleReminder = (testId: string) => {
    setTests(tests.map(test => 
      test.id === testId 
        ? { ...test, reminderSet: !test.reminderSet }
        : test
    ));
    
    const test = tests.find(t => t.id === testId);
    toast({
      title: test?.reminderSet ? "Reminder Removed" : "Reminder Set",
      description: test?.reminderSet 
        ? "You won't receive notifications for this test"
        : "You'll receive a notification 1 hour before the test",
    });
  };

  const markTestCompleted = (testId: string) => {
    setTests(tests.map(test => 
      test.id === testId 
        ? { ...test, status: 'completed' }
        : test
    ));
    
    toast({
      title: "Test Marked as Completed",
      description: "Great job! Don't forget to update your application status.",
    });
  };

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const upcomingTests = filteredTests.filter(test => {
    const testDate = new Date(test.date);
    const today = new Date();
    return test.status === 'scheduled' && testDate >= today;
  });

  const pastTests = filteredTests.filter(test => {
    const testDate = new Date(test.date);
    const today = new Date();
    return test.status !== 'scheduled' || testDate < today;
  });

  const statusCounts = tests.reduce((acc, test) => {
    acc[test.status] = (acc[test.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <DashboardLayout title="Test Scheduler" subtitle="Manage your placement tests and interviews">
      <div className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{statusCounts.scheduled || 0}</div>
            <div className="text-sm text-muted-foreground">Scheduled</div>
          </Card>
          <Card className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{statusCounts.completed || 0}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </Card>
          <Card className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{statusCounts.missed || 0}</div>
            <div className="text-sm text-muted-foreground">Missed</div>
          </Card>
          <Card className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-white">{tests.length}</div>
            <div className="text-sm text-muted-foreground">Total Tests</div>
          </Card>
        </div>

        {/* Controls */}
        <Card className="glass-card p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search tests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-purple-medium/50 border-border text-white"
                />
              </div>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-purple-medium/50 border-border text-white"
              />
            </div>
            <Button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Test
            </Button>
          </div>
        </Card>

        {/* Upcoming Tests */}
        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Upcoming Tests</h3>
          {upcomingTests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No upcoming tests scheduled
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingTests.map((test) => (
                <div key={test.id} className="bg-purple-medium/30 rounded-lg p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-white">{test.company}</h4>
                          <p className="text-muted-foreground">{test.position}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={`${getTypeColor(test.type)} text-white`}>
                            {getTypeLabel(test.type)}
                          </Badge>
                          <Badge className={`${getStatusColor(test.status)} text-white`}>
                            {test.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(test.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{test.time} ({test.duration} mins)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>📍 {test.location}</span>
                        </div>
                      </div>

                      {test.instructions && (
                        <div className="bg-lime/10 border border-lime/20 rounded-lg p-3 mb-3">
                          <p className="text-lime text-sm">{test.instructions}</p>
                        </div>
                      )}

                      {test.meetingLink && (
                        <div className="mb-3">
                          <a 
                            href={test.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lime hover:text-lime-dark text-sm underline"
                          >
                            Join Meeting Link
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleReminder(test.id)}
                        className={`text-white hover:bg-purple-medium/50 ${
                          test.reminderSet ? 'text-lime' : ''
                        }`}
                      >
                        <Bell className="w-4 h-4 mr-2" />
                        {test.reminderSet ? 'Reminder On' : 'Set Reminder'}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => markTestCompleted(test.id)}
                        className="btn-secondary"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark Complete
                      </Button>
                      <Button size="sm" variant="ghost" className="text-white hover:bg-purple-medium/50">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Past Tests */}
        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Past Tests</h3>
          {pastTests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No past tests found
            </div>
          ) : (
            <div className="space-y-4">
              {pastTests.map((test) => (
                <div key={test.id} className="bg-purple-medium/20 rounded-lg p-4 opacity-75">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-white">{test.company}</h4>
                          <p className="text-muted-foreground">{test.position}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={`${getTypeColor(test.type)} text-white`}>
                            {getTypeLabel(test.type)}
                          </Badge>
                          <Badge className={`${getStatusColor(test.status)} text-white`}>
                            {test.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(test.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{test.time} ({test.duration} mins)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {test.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-400" />}
                          {test.status === 'missed' && <AlertCircle className="w-4 h-4 text-red-400" />}
                          {test.status === 'cancelled' && <CalendarX className="w-4 h-4 text-gray-400" />}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="text-white hover:bg-purple-medium/50">
                        <Edit className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TestScheduler;
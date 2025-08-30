import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/context/NotificationContext";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, CheckCircle } from "lucide-react";
import { useTests, Test } from "@/context/TestsContext";

const CreateTest = () => {
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const { addTest } = useTests();
  const navigate = useNavigate();

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [type, setType] = useState<Test['type']>("technical");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [location, setLocation] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!company || !position || !date || !time) {
      toast({ title: "Missing details", description: "Please fill in company, position, date and time." });
      return;
    }

    // Save the test to local storage via context
    addTest({
      company,
      position,
      type,
      date,
      time,
      duration,
      location,
    });

    // After successful creation, add a notification and navigate.
    addNotification({
      type: 'interview',
      title: 'Test Scheduled',
      message: `Your ${type} test for ${position} at ${company} is scheduled on ${new Date(date).toLocaleDateString()} at ${time}. Location: ${location || 'Online'}. Duration: ${duration} mins.`,
      timestamp: 'Just now',
      read: false,
      priority: 'high'
    });

    toast({
      title: "Test created",
      description: "A notification has been added to your inbox.",
    });

    navigate('/test-scheduler');
  };

  return (
    <DashboardLayout title="Create Test" subtitle="Create and schedule a new assessment">
      <div className="max-w-3xl mx-auto">
        <Card className="glass-card p-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Company</label>
                <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Corp" className="bg-purple-medium/50 border-border text-white" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Position</label>
                <Input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Software Engineer" className="bg-purple-medium/50 border-border text-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-purple-medium/50 border border-border text-white rounded-md h-10 px-3"
                >
                  <option value="aptitude">Aptitude</option>
                  <option value="technical">Technical</option>
                  <option value="coding">Coding</option>
                  <option value="interview">Interview</option>
                  <option value="group-discussion">Group Discussion</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="pl-10 bg-purple-medium/50 border-border text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="pl-10 bg-purple-medium/50 border-border text-white" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Duration (mins)</label>
                <Input type="number" min={15} value={duration} onChange={(e) => setDuration(parseInt(e.target.value || '0', 10))} className="bg-purple-medium/50 border-border text-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-muted-foreground mb-2">Location</label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Online / Address" className="bg-purple-medium/50 border-border text-white" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => navigate('/test-scheduler')} className="text-white hover:bg-purple-medium/50">
                Cancel
              </Button>
              <Button type="submit" className="btn-primary">
                <CheckCircle className="w-4 h-4 mr-2" />
                Save Test
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateTest;


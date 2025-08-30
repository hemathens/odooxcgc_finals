import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Mail, 
  Calendar, 
  Building, 
  CheckCircle, 
  AlertCircle, 
  Info,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification
  } = useNotifications();

  const navigate = useNavigate();

  const [showRead, setShowRead] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'job': return <Building className="w-5 h-5 text-blue-400" />;
      case 'interview': return <Calendar className="w-5 h-5 text-green-400" />;
      case 'application': return <CheckCircle className="w-5 h-5 text-purple-400" />;
      case 'system': return <Info className="w-5 h-5 text-yellow-400" />;
      case 'reminder': return <AlertCircle className="w-5 h-5 text-orange-400" />;
      default: return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-400/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-400/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (!showRead && notif.read) return false;
    if (filterType !== 'all' && notif.type !== filterType) return false;
    return true;
  });

  return (
    <DashboardLayout title="Notifications" subtitle="Stay updated with your latest activities and opportunities">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-6">
          {/* Stats and Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-lime/20 text-lime border-lime/30">
                {unreadCount} unread
              </Badge>
              <Badge variant="secondary" className="bg-purple-medium/20 text-purple-light border-purple-light/30">
                {notifications.length} total
              </Badge>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => navigate('/tests/new')} 
                className="!bg-lime !text-black !border-lime hover:!bg-lime hover:!text-black focus:!bg-lime focus:!text-black active:!bg-lime active:!text-black"
              >
                <Bell className="w-4 h-4 mr-2" />
                Add Test
              </Button>
              <Button 
                onClick={markAllAsRead} 
                className="!bg-lime !text-black !border-lime hover:!bg-lime hover:!text-black focus:!bg-lime focus:!text-black active:!bg-lime active:!text-black"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
              <Button 
                onClick={() => setShowRead(!showRead)} 
                className="!bg-lime !text-black !border-lime hover:!bg-lime hover:!text-black focus:!bg-lime focus:!text-black active:!bg-lime active:!text-black"
              >
                {showRead ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showRead ? 'Hide Read' : 'Show Read'}
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setFilterType('all')}
            className="!bg-lime !text-black !border-lime hover:!bg-lime hover:!text-black focus:!bg-lime focus:!text-black active:!bg-lime active:!text-black"
          >
            All
          </Button>
          <Button
            onClick={() => setFilterType('job')}
            className="!bg-lime !text-black !border-lime hover:!bg-lime hover:!text-black focus:!bg-lime focus:!text-black active:!bg-lime active:!text-black"
          >
            Jobs
          </Button>
          <Button
            onClick={() => setFilterType('interview')}
            className="!bg-lime !text-black !border-lime hover:!bg-lime hover:!text-black focus:!bg-lime focus:!text-black active:!bg-lime active:!text-black"
          >
            Interviews
          </Button>
          <Button
            onClick={() => setFilterType('application')}
            className="!bg-lime !text-black !border-lime hover:!bg-lime hover:!text-black focus:!bg-lime focus:!text-black active:!bg-lime active:!text-black"
          >
            Applications
          </Button>
          <Button
            onClick={() => setFilterType('system')}
            className="!bg-lime !text-black !border-lime hover:!bg-lime hover:!text-black focus:!bg-lime focus:!text-black active:!bg-lime active:!text-black"
          >
            System
          </Button>
          <Button
            onClick={() => setFilterType('reminder')}
            className="!bg-lime !text-black !border-lime hover:!bg-lime hover:!text-black focus:!bg-lime focus:!text-black active:!bg-lime active:!text-black"
          >
            Reminders
          </Button>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card className="glass-card p-8 text-center">
              <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No notifications</h3>
              <p className="text-muted-foreground">You're all caught up! Check back later for new updates.</p>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`glass-card p-6 transition-all duration-200 hover:shadow-lg ${
                  !notification.read ? 'ring-2 ring-lime/30 bg-lime/5' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className={`font-semibold ${!notification.read ? 'text-white' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </h3>
                          <Badge className={getPriorityColor(notification.priority)}>
                            {notification.priority}
                          </Badge>
                        </div>
                        <p className={`text-sm ${!notification.read ? 'text-white' : 'text-muted-foreground'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {notification.timestamp}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        {!notification.read && (
                          <Button
                            onClick={() => markAsRead(notification.id)}
                            size="sm"
                            variant="outline"
                            className="text-lime border-lime hover:bg-lime hover:text-purple-dark"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Mark Read
                          </Button>
                        )}
                        <Button
                          onClick={() => deleteNotification(notification.id)}
                          size="sm"
                          variant="outline"
                          className="text-red-400 border-red-400 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;

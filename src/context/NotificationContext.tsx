import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Notification {
  id: string;
  type: 'job' | 'interview' | 'application' | 'system' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  updateNotifications: (notifications: Notification[]) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    // Load notifications from localStorage on initialization
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        return JSON.parse(savedNotifications);
      } catch (error) {
        console.error('Error parsing saved notifications:', error);
      }
    }
    
    // Default notifications if nothing is saved
    return [
      {
        id: '1',
        type: 'job',
        title: 'New Job Opportunity',
        message: 'A new Software Engineer position at Google has been posted that matches your profile.',
        timestamp: '2 hours ago',
        read: false,
        priority: 'high'
      },
      {
        id: '2',
        type: 'interview',
        title: 'Interview Scheduled',
        message: 'Your interview with Microsoft has been scheduled for tomorrow at 2:00 PM.',
        timestamp: '1 day ago',
        read: false,
        priority: 'high'
      },
      {
        id: '3',
        type: 'application',
        title: 'Application Status Update',
        message: 'Your application at Amazon has moved to the next round.',
        timestamp: '2 days ago',
        read: true,
        priority: 'medium'
      },
      {
        id: '4',
        type: 'reminder',
        title: 'Resume Update Reminder',
        message: 'It\'s been 3 months since you last updated your resume. Consider adding new skills and experiences.',
        timestamp: '3 days ago',
        read: true,
        priority: 'low'
      },
      {
        id: '5',
        type: 'system',
        title: 'Welcome to Placement Tracker',
        message: 'Thank you for joining Placement Tracker! Complete your profile to get started.',
        timestamp: '1 week ago',
        read: true,
        priority: 'low'
      }
    ];
  });

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const updateNotifications = (newNotifications: Notification[]) => {
    setNotifications(newNotifications);
  };

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

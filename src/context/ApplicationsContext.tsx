import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { API_BASE_URL } from '@/lib/config';

export interface Application {
  id: string;
  company: string;
  position: string;
  status: 'applied' | 'in-review' | 'interview' | 'selected' | 'rejected';
  appliedDate: string; // ISO date
  deadline?: string;   // ISO date
  location?: string;
  nextStep?: string;
  notes?: string;
  jobUrl?: string;
  salary?: string;
}

interface ApplicationsContextType {
  applications: Application[];
  addApplication: (app: Omit<Application, 'id'>) => Application;
  updateApplication: (id: string, patch: Partial<Omit<Application, 'id'>>) => void;
  deleteApplication: (id: string) => void;
}

const ApplicationsContext = createContext<ApplicationsContextType | undefined>(undefined);

export const useApplications = (): ApplicationsContextType => {
  const ctx = useContext(ApplicationsContext);
  if (!ctx) throw new Error('useApplications must be used within an ApplicationsProvider');
  return ctx;
};

interface ProviderProps { children: ReactNode }

export const ApplicationsProvider: React.FC<ProviderProps> = ({ children }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          // Use fallback data if not authenticated
          setApplications([
            {
              id: '1',
              company: 'Tech Corp',
              position: 'Software Engineer',
              status: 'in-review',
              appliedDate: '2024-08-25',
              deadline: '2024-09-01'
            },
            {
              id: '2',
              company: 'StartupXYZ',
              position: 'Frontend Developer',
              status: 'interview',
              appliedDate: '2024-08-20'
            },
            {
              id: '3',
              company: 'BigTech Inc',
              position: 'Full Stack Developer',
              status: 'applied',
              appliedDate: '2024-08-28',
              deadline: '2024-09-05'
            }
          ]);
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/applications/my`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setApplications(data || []);
        } else {
          // Use fallback data on API error
          setApplications([
            {
              id: '1',
              company: 'Demo Company',
              position: 'Software Engineer',
              status: 'in-review',
              appliedDate: '2024-08-25',
              deadline: '2024-09-01'
            }
          ]);
        }
      } catch (error) {
        console.error('Error loading applications:', error);
        // Use fallback data on network error
        setApplications([
          {
            id: '1',
            company: 'Demo Company',
            position: 'Software Engineer',
            status: 'in-review',
            appliedDate: '2024-08-25',
            deadline: '2024-09-01'
          }
        ]);
      }
      setIsLoading(false);
    };

    loadApplications();
  }, []);

  const addApplication: ApplicationsContextType['addApplication'] = (app) => {
    const newApp: Application = { id: Date.now().toString(), ...app };
    setApplications(prev => [newApp, ...prev]);
    return newApp;
  };

  const updateApplication: ApplicationsContextType['updateApplication'] = (id, patch) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a));
  };

  const deleteApplication: ApplicationsContextType['deleteApplication'] = (id) => {
    setApplications(prev => prev.filter(a => a.id !== id));
  };

  const value: ApplicationsContextType = {
    applications,
    addApplication,
    updateApplication,
    deleteApplication,
  };

  return (
    <ApplicationsContext.Provider value={value}>
      {children}
    </ApplicationsContext.Provider>
  );
};


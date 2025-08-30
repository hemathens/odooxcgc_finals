import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

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
  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('applications');
    if (saved) {
      try {
        return JSON.parse(saved) as Application[];
      } catch (e) {
        console.error('Failed to parse saved applications:', e);
      }
    }
    // Seed data if none saved
    return [
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
    ];
  });

  useEffect(() => {
    localStorage.setItem('applications', JSON.stringify(applications));
  }, [applications]);

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


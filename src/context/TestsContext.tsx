import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { API_BASE_URL } from '@/lib/config';

export interface Test {
  id: string;
  company: string;
  position: string;
  type: 'aptitude' | 'technical' | 'coding' | 'interview' | 'group-discussion';
  date: string; // ISO date (YYYY-MM-DD)
  time: string; // HH:mm
  duration: number; // in minutes
  location: string;
  meetingLink?: string;
  status: 'scheduled' | 'completed' | 'missed' | 'cancelled';
  instructions?: string;
  reminderSet: boolean;
}

export type NewTestInput = {
  company: string;
  position: string;
  type: Test['type'];
  date: string;
  time: string;
  duration: number;
  location: string;
  meetingLink?: string;
  instructions?: string;
  status?: Test['status'];
  reminderSet?: boolean;
};

interface TestsContextType {
  tests: Test[];
  addTest: (input: NewTestInput) => Test; // returns the created test
  updateTest: (id: string, patch: Partial<Omit<Test, 'id'>>) => void;
  deleteTest: (id: string) => void;
  toggleReminder: (id: string) => void;
  markTestCompleted: (id: string) => void;
}

const TestsContext = createContext<TestsContextType | undefined>(undefined);

export const useTests = () => {
  const ctx = useContext(TestsContext);
  if (!ctx) throw new Error('useTests must be used within a TestsProvider');
  return ctx;
};

interface TestsProviderProps { children: ReactNode }

export const TestsProvider: React.FC<TestsProviderProps> = ({ children }) => {
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTests = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          // Use fallback data if not authenticated
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
            }
          ]);
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/tests`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setTests(Array.isArray(data) ? data : []);
        } else {
          // Use fallback data on API error
          setTests([
            {
              id: '1',
              company: 'Demo Company',
              position: 'Software Engineer',
              type: 'technical',
              date: '2024-09-02',
              time: '10:00',
              duration: 120,
              location: 'Online',
              status: 'scheduled',
              reminderSet: true
            }
          ]);
        }
      } catch (error) {
        console.error('Error loading tests:', error);
        // Use fallback data on network error
        setTests([
          {
            id: '1',
            company: 'Demo Company',
            position: 'Software Engineer',
            type: 'technical',
            date: '2024-09-02',
            time: '10:00',
            duration: 120,
            location: 'Online',
            status: 'scheduled',
            reminderSet: true
          }
        ]);
      }
      setIsLoading(false);
    };

    loadTests();
  }, []);

  const addTest: TestsContextType['addTest'] = (input) => {
    const newTest: Test = {
      id: Date.now().toString(),
      company: input.company,
      position: input.position,
      type: input.type,
      date: input.date,
      time: input.time,
      duration: input.duration,
      location: input.location,
      meetingLink: input.meetingLink,
      instructions: input.instructions,
      status: input.status ?? 'scheduled',
      reminderSet: input.reminderSet ?? false,
    };
    setTests(prev => [newTest, ...prev]);
    return newTest;
  };

  const updateTest: TestsContextType['updateTest'] = (id, patch) => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
  };

  const deleteTest: TestsContextType['deleteTest'] = (id) => {
    setTests(prev => prev.filter(t => t.id !== id));
  };

  const toggleReminder: TestsContextType['toggleReminder'] = (id) => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, reminderSet: !t.reminderSet } : t));
  };

  const markTestCompleted: TestsContextType['markTestCompleted'] = (id) => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, status: 'completed' } : t));
  };

  const value: TestsContextType = {
    tests,
    addTest,
    updateTest,
    deleteTest,
    toggleReminder,
    markTestCompleted,
  };

  return (
    <TestsContext.Provider value={value}>
      {children}
    </TestsContext.Provider>
  );
};


import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  grade?: string;    // GPA or percentage
}

export interface Project {
  id: string;
  title: string;
  link?: string;
  description: string;
  technologies: string[];
}

export interface ResumeData {
  personal: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
}

interface ResumeContextType {
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
  updatePersonal: (patch: Partial<PersonalInfo>) => void;
  addExperience: () => string; // returns new id
  updateExperience: (id: string, patch: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addEducation: () => string;
  updateEducation: (id: string, patch: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addProject: () => string;
  updateProject: (id: string, patch: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
}

const defaultData: ResumeData = {
  personal: { fullName: '', email: '', phone: '', linkedin: '', github: '', portfolio: '' },
  experience: [],
  education: [],
  skills: [],
  projects: [],
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const useResume = (): ResumeContextType => {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error('useResume must be used within a ResumeProvider');
  return ctx;
};

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem('resume');
    if (saved) {
      try {
        return JSON.parse(saved) as ResumeData;
      } catch (e) {
        console.error('Failed to parse resume from localStorage:', e);
      }
    }
    return defaultData;
  });

  useEffect(() => {
    localStorage.setItem('resume', JSON.stringify(data));
  }, [data]);

  const updatePersonal: ResumeContextType['updatePersonal'] = (patch) => {
    setData(prev => ({ ...prev, personal: { ...prev.personal, ...patch } }));
  };

  const addExperience: ResumeContextType['addExperience'] = () => {
    const id = Date.now().toString();
    setData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id, company: '', position: '', startDate: '', endDate: '', description: '' },
      ],
    }));
    return id;
  };
  const updateExperience: ResumeContextType['updateExperience'] = (id, patch) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === id ? { ...e, ...patch } : e),
    }));
  };
  const removeExperience: ResumeContextType['removeExperience'] = (id) => {
    setData(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== id) }));
  };

  const addEducation: ResumeContextType['addEducation'] = () => {
    const id = (Date.now() + 1).toString();
    setData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { id, school: '', degree: '', field: '', startDate: '', endDate: '', grade: '' },
      ],
    }));
    return id;
  };
  const updateEducation: ResumeContextType['updateEducation'] = (id, patch) => {
    setData(prev => ({
      ...prev,
      education: prev.education.map(ed => ed.id === id ? { ...ed, ...patch } : ed),
    }));
  };
  const removeEducation: ResumeContextType['removeEducation'] = (id) => {
    setData(prev => ({ ...prev, education: prev.education.filter(ed => ed.id !== id) }));
  };

  const addProject: ResumeContextType['addProject'] = () => {
    const id = (Date.now() + 2).toString();
    setData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        { id, title: '', link: '', description: '', technologies: [] },
      ],
    }));
    return id;
  };
  const updateProject: ResumeContextType['updateProject'] = (id, patch) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, ...patch } : p),
    }));
  };
  const removeProject: ResumeContextType['removeProject'] = (id) => {
    setData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
  };

  const addSkill: ResumeContextType['addSkill'] = (skill) => {
    const s = skill.trim();
    if (!s) return;
    setData(prev => ({ ...prev, skills: prev.skills.includes(s) ? prev.skills : [...prev.skills, s] }));
  };
  const removeSkill: ResumeContextType['removeSkill'] = (skill) => {
    setData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const value: ResumeContextType = {
    data,
    setData,
    updatePersonal,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addProject,
    updateProject,
    removeProject,
    addSkill,
    removeSkill,
  };

  return (
    <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
  );
};


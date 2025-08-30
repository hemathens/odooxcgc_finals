import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Download, 
  Upload, 
  Eye, 
  Save, 
  Star,
  Plus,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResumeSection {
  id: string;
  type: 'personal' | 'education' | 'experience' | 'skills' | 'projects';
  title: string;
  completed: boolean;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

const ResumeBuilder = () => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [atsScore, setAtsScore] = useState(78);
  
  // Personal Information
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    portfolio: ''
  });

  // Experience
  const [experiences, setExperiences] = useState<Experience[]>([]);

  // Skills
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  const sections: ResumeSection[] = [
    { id: 'personal', type: 'personal', title: 'Personal Information', completed: !!personalInfo.fullName },
    { id: 'education', type: 'education', title: 'Education', completed: false },
    { id: 'experience', type: 'experience', title: 'Work Experience', completed: experiences.length > 0 },
    { id: 'skills', type: 'skills', title: 'Skills', completed: skills.length > 0 },
    { id: 'projects', type: 'projects', title: 'Projects', completed: false }
  ];

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    setExperiences([...experiences, newExp]);
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const saveResume = () => {
    toast({
      title: "Resume Saved",
      description: "Your resume has been saved successfully!",
    });
  };

  const analyzeResume = () => {
    // Mock ATS analysis
    const newScore = Math.floor(Math.random() * 30) + 70;
    setAtsScore(newScore);
    
    toast({
      title: "ATS Analysis Complete",
      description: `Your resume scored ${newScore}/100 for ATS compatibility.`,
    });
  };

  const renderPersonalSection = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Full Name</label>
          <Input
            value={personalInfo.fullName}
            onChange={(e) => setPersonalInfo({...personalInfo, fullName: e.target.value})}
            className="bg-purple-medium/50 border-border text-white"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Email</label>
          <Input
            value={personalInfo.email}
            onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
            className="bg-purple-medium/50 border-border text-white"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Phone</label>
          <Input
            value={personalInfo.phone}
            onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
            className="bg-purple-medium/50 border-border text-white"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">LinkedIn</label>
          <Input
            value={personalInfo.linkedin}
            onChange={(e) => setPersonalInfo({...personalInfo, linkedin: e.target.value})}
            className="bg-purple-medium/50 border-border text-white"
            placeholder="linkedin.com/in/johndoe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">GitHub</label>
          <Input
            value={personalInfo.github}
            onChange={(e) => setPersonalInfo({...personalInfo, github: e.target.value})}
            className="bg-purple-medium/50 border-border text-white"
            placeholder="github.com/johndoe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Portfolio</label>
          <Input
            value={personalInfo.portfolio}
            onChange={(e) => setPersonalInfo({...personalInfo, portfolio: e.target.value})}
            className="bg-purple-medium/50 border-border text-white"
            placeholder="johndoe.com"
          />
        </div>
      </div>
    </div>
  );

  const renderExperienceSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Work Experience</h3>
        <Button onClick={addExperience} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>
      
      {experiences.map((exp, index) => (
        <Card key={exp.id} className="glass-card p-6">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-white font-medium">Experience {index + 1}</h4>
            <Button
              onClick={() => removeExperience(exp.id)}
              size="sm"
              variant="ghost"
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Company</label>
              <Input
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                className="bg-purple-medium/50 border-border text-white"
                placeholder="Company Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Position</label>
              <Input
                value={exp.position}
                onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                className="bg-purple-medium/50 border-border text-white"
                placeholder="Job Title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Start Date</label>
              <Input
                type="date"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                className="bg-purple-medium/50 border-border text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">End Date</label>
              <Input
                type="date"
                value={exp.endDate}
                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                className="bg-purple-medium/50 border-border text-white"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">Description</label>
            <Textarea
              value={exp.description}
              onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
              className="bg-purple-medium/50 border-border text-white min-h-24"
              placeholder="Describe your responsibilities and achievements..."
            />
          </div>
        </Card>
      ))}
    </div>
  );

  const renderSkillsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Skills</h3>
        <div className="flex gap-2 mb-4">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            className="bg-purple-medium/50 border-border text-white"
            placeholder="Add a skill..."
          />
          <Button onClick={addSkill} className="btn-primary">
            Add
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge
              key={skill}
              className="bg-lime/20 text-lime border-lime cursor-pointer hover:bg-lime/30"
              onClick={() => removeSkill(skill)}
            >
              {skill} ×
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'personal':
        return renderPersonalSection();
      case 'experience':
        return renderExperienceSection();
      case 'skills':
        return renderSkillsSection();
      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">This section is coming soon!</p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout title="Resume Builder" subtitle="Create an ATS-friendly resume">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="glass-card p-4">
            <h3 className="font-semibold text-white mb-4">Resume Sections</h3>
            <div className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-lime/20 text-lime'
                      : 'text-muted-foreground hover:bg-purple-medium/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{section.title}</span>
                    {section.completed && (
                      <Badge className="bg-green-500 text-white">✓</Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* ATS Score */}
            <div className="mt-6 p-4 bg-purple-medium/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">ATS Score</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-lime font-bold">{atsScore}/100</span>
                </div>
              </div>
              <Progress value={atsScore} className="h-2 mb-3" />
              <Button
                onClick={analyzeResume}
                size="sm"
                className="btn-secondary w-full"
              >
                Re-analyze
              </Button>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {sections.find(s => s.id === activeSection)?.title}
              </h2>
              <div className="flex gap-2">
                <Button className="btn-secondary">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button onClick={saveResume} className="btn-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button className="btn-primary">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>

            {renderActiveSection()}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResumeBuilder;
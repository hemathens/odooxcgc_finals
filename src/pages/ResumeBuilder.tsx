import { useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Download, 
  Eye, 
  Save, 
  Star,
  Plus,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useResume } from "@/context/ResumeContext";

interface ResumeSection {
  id: string;
  type: 'personal' | 'education' | 'experience' | 'skills' | 'projects';
  title: string;
  completed: boolean;
}

const popularSkills = [
  "JavaScript","TypeScript","React","Node.js","Next.js","HTML","CSS","Tailwind CSS","Redux","Express",
  "Python","Django","Flask","Java","Spring","C#",".NET","C++","Go","SQL","PostgreSQL","MySQL","MongoDB",
  "Git","GitHub","Docker","Kubernetes","AWS","Azure","GCP","GraphQL","REST","CI/CD","Jest","Cypress",
  "Agile","Scrum","Data Structures","Algorithms"
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const cleanDigits = (s: string) => s.replace(/\D/g, "");

const ResumeBuilder = () => {
  const { toast } = useToast();
  const { data, updatePersonal, addExperience, updateExperience, removeExperience, addEducation, updateEducation, removeEducation, addProject, updateProject, removeProject, addSkill, removeSkill } = useResume();
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [atsScore, setAtsScore] = useState(78);
  const [newSkill, setNewSkill] = useState('');

  const personalComplete = useMemo(() => {
    const okName = !!data.personal.fullName?.trim();
    const okEmail = emailRegex.test(data.personal.email || '');
    const phoneDigits = cleanDigits(data.personal.phone || '');
    const okPhone = phoneDigits.length >= 7; // simple validation
    return okName && okEmail && okPhone;
  }, [data.personal]);

  const educationComplete = useMemo(() => (
    data.education.length > 0 &&
    data.education.every(ed =>
      !!ed.school?.trim() &&
      !!ed.degree?.trim() &&
      !!ed.field?.trim() &&
      !!ed.startDate?.trim() &&
      !!ed.endDate?.trim() &&
      !!ed.grade?.trim()
    )
  ), [data.education]);

  const experienceComplete = useMemo(() => (
    data.experience.length > 0 &&
    data.experience.every(exp =>
      !!exp.company?.trim() &&
      !!exp.position?.trim() &&
      !!exp.startDate?.trim() &&
      !!exp.endDate?.trim() &&
      !!exp.description?.trim()
    )
  ), [data.experience]);

  const skillsComplete = useMemo(() => data.skills.length > 0, [data.skills]);

  const projectsComplete = useMemo(() => (
    data.projects.length > 0 &&
    data.projects.every(p =>
      !!p.title?.trim() &&
      !!p.description?.trim() &&
      Array.isArray(p.technologies) && p.technologies.length > 0
      // link optional
    )
  ), [data.projects]);

  const sections: ResumeSection[] = [
    { id: 'personal', type: 'personal', title: 'Personal Information', completed: personalComplete },
    { id: 'education', type: 'education', title: 'Education', completed: educationComplete },
    { id: 'experience', type: 'experience', title: 'Work Experience', completed: experienceComplete },
    { id: 'skills', type: 'skills', title: 'Skills', completed: skillsComplete },
    { id: 'projects', type: 'projects', title: 'Projects', completed: projectsComplete }
  ];

  const analyzeResume = () => {
    // Deterministic scoring based on completeness
    let score = 0;
    // Personal info up to 30
    score += personalComplete ? 30 : 10;
    // Experience up to 30 (count and descriptions)
    const expWithDetails = data.experience.filter(e => e.company && e.position && (e.description?.length || 0) >= 30).length;
    score += Math.min(30, expWithDetails * 10);
    // Education up to 20
    score += Math.min(20, data.education.length * 10);
    // Skills up to 15
    score += Math.min(15, data.skills.length);
    // Projects up to 5
    const projWithDesc = data.projects.filter(p => p.title && (p.description?.length || 0) >= 30).length;
    score += Math.min(5, projWithDesc * 2);

    score = Math.max(0, Math.min(100, score));
    setAtsScore(score);

    toast({
      title: "ATS Analysis Complete",
      description: `Your resume scored ${score}/100 for ATS compatibility.`,
    });
  };

  const saveResume = () => {
    toast({
      title: "Resume Saved",
      description: "Your resume has been saved successfully!",
    });
  };

  const filteredSkillSuggestions = useMemo(() => {
    const q = newSkill.trim().toLowerCase();
    if (!q) return popularSkills.slice(0, 8);
    return popularSkills.filter(s => s.toLowerCase().includes(q)).slice(0, 8);
  }, [newSkill]);

  // Sections renderers
  const renderPersonalSection = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Full Name<span className="text-red-400"> *</span></label>
          <Input
            value={data.personal.fullName}
            onChange={(e) => updatePersonal({ fullName: e.target.value })}
            className="bg-purple-medium/50 border-border text-white"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Email<span className="text-red-400"> *</span></label>
          <Input
            value={data.personal.email}
            onChange={(e) => updatePersonal({ email: e.target.value })}
            className="bg-purple-medium/50 border-border text-white"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Phone<span className="text-red-400"> *</span></label>
          <Input
            value={data.personal.phone}
            onChange={(e) => updatePersonal({ phone: e.target.value })}
            className="bg-purple-medium/50 border-border text-white"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">LinkedIn</label>
          <Input
            value={data.personal.linkedin}
            onChange={(e) => updatePersonal({ linkedin: e.target.value })}
            className="bg-purple-medium/50 border-border text-white"
            placeholder="linkedin.com/in/johndoe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">GitHub</label>
          <Input
            value={data.personal.github}
            onChange={(e) => updatePersonal({ github: e.target.value })}
            className="bg-purple-medium/50 border-border text-white"
            placeholder="github.com/johndoe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Portfolio</label>
          <Input
            value={data.personal.portfolio}
            onChange={(e) => updatePersonal({ portfolio: e.target.value })}
            className="bg-purple-medium/50 border-border text-white"
            placeholder="johndoe.com"
          />
        </div>
      </div>
      {!personalComplete && (
        <p className="text-sm text-red-300">Full Name, a valid Email, and Phone are required to complete this section.</p>
      )}
    </div>
  );

  const renderExperienceSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Work Experience</h3>
        <Button onClick={() => addExperience()} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>
      
      {data.experience.map((exp, index) => (
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
              <label className="block text-sm font-medium text-white mb-2">Company<span className="text-red-400"> *</span></label>
              <Input
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                className="bg-purple-medium/50 border-border text-white"
                placeholder="Company Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Position<span className="text-red-400"> *</span></label>
              <Input
                value={exp.position}
                onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                className="bg-purple-medium/50 border-border text-white"
                placeholder="Job Title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Start Date<span className="text-red-400"> *</span></label>
              <Input
                type="date"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                className="bg-purple-medium/50 border-border text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">End Date<span className="text-red-400"> *</span></label>
              <Input
                type="date"
                value={exp.endDate}
                onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                className="bg-purple-medium/50 border-border text-white"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">Description<span className="text-red-400"> *</span></label>
            <Textarea
              value={exp.description}
              onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
              className="bg-purple-medium/50 border-border text-white min-h-24"
              placeholder="Describe your responsibilities and achievements..."
            />
          </div>
        </Card>
      ))}
      {data.experience.length > 0 && !experienceComplete && (
        <p className="text-sm text-red-300">All fields in each work experience entry are required.</p>
      )}
    </div>
  );

  const renderEducationSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Education</h3>
        <Button onClick={() => addEducation()} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </div>
      {data.education.map((ed, idx) => (
        <Card key={ed.id} className="glass-card p-6">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-white font-medium">Education {idx + 1}</h4>
            <Button
              onClick={() => removeEducation(ed.id)}
              size="sm"
              variant="ghost"
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">School/College Name<span className="text-red-400"> *</span></label>
              <Input value={ed.school} onChange={(e) => updateEducation(ed.id, { school: e.target.value })} className="bg-purple-medium/50 border-border text-white" placeholder="University Name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Degree<span className="text-red-400"> *</span></label>
              <Input value={ed.degree} onChange={(e) => updateEducation(ed.id, { degree: e.target.value })} className="bg-purple-medium/50 border-border text-white" placeholder="B.Tech / B.Sc / M.Sc" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Field of Study<span className="text-red-400"> *</span></label>
              <Input value={ed.field || ''} onChange={(e) => updateEducation(ed.id, { field: e.target.value })} className="bg-purple-medium/50 border-border text-white" placeholder="Computer Science" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Start Date<span className="text-red-400"> *</span></label>
              <Input type="date" value={ed.startDate} onChange={(e) => updateEducation(ed.id, { startDate: e.target.value })} className="bg-purple-medium/50 border-border text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">End Date<span className="text-red-400"> *</span></label>
              <Input type="date" value={ed.endDate} onChange={(e) => updateEducation(ed.id, { endDate: e.target.value })} className="bg-purple-medium/50 border-border text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Grade (GPA/%)<span className="text-red-400"> *</span></label>
              <Input value={ed.grade || ''} onChange={(e) => updateEducation(ed.id, { grade: e.target.value })} className="bg-purple-medium/50 border-border text-white" placeholder="8.5 / 85%" />
            </div>
          </div>
        </Card>
      ))}
      {data.education.length > 0 && !educationComplete && (
        <p className="text-sm text-red-300">All fields in each education entry are required.</p>
      )}
    </div>
  );

  const renderSkillsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Skills</h3>
        <div className="flex gap-2 mb-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && newSkill.trim() && (addSkill(newSkill), setNewSkill(''))}
            className="bg-purple-medium/50 border-border text-white"
            placeholder="Add a skill..."
          />
          <Button onClick={() => { if (newSkill.trim()) { addSkill(newSkill); setNewSkill(''); } }} className="btn-primary">
            Add
          </Button>
        </div>
        {/* LinkedIn-like suggestions */}
        <div className="flex flex-wrap gap-2 mb-4">
          {filteredSkillSuggestions.map(s => (
            <Badge key={s} onClick={() => addSkill(s)} className="bg-purple-medium/30 text-white border-border cursor-pointer hover:bg-purple-medium/50">
              + {s}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {data.skills.length === 0 && (
            <p className="text-sm text-red-300">Add at least one skill to complete this section.</p>
          )}
          {data.skills.map((skill) => (
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

  const renderProjectsSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Projects</h3>
        <Button onClick={() => addProject()} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>
      {data.projects.map((p, idx) => (
        <Card key={p.id} className="glass-card p-6">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-white font-medium">Project {idx + 1}</h4>
            <Button
              onClick={() => removeProject(p.id)}
              size="sm"
              variant="ghost"
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Title<span className="text-red-400"> *</span></label>
              <Input value={p.title} onChange={(e) => updateProject(p.id, { title: e.target.value })} className="bg-purple-medium/50 border-border text-white" placeholder="Portfolio Website" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Link (optional)</label>
              <Input value={p.link || ''} onChange={(e) => updateProject(p.id, { link: e.target.value })} className="bg-purple-medium/50 border-border text-white" placeholder="https://..." />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Description<span className="text-red-400"> *</span></label>
            <Textarea value={p.description} onChange={(e) => updateProject(p.id, { description: e.target.value })} className="bg-purple-medium/50 border-border text-white min-h-24" placeholder="Describe the project impact, features, achievements..." />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-white mb-2">Technologies<span className="text-red-400"> *</span></label>
            <div className="flex flex-wrap gap-2">
              {(p.technologies || []).map(tech => (
                <Badge key={tech} className="bg-purple-medium/30 text-white border-border cursor-pointer hover:bg-purple-medium/50" onClick={() => updateProject(p.id, { technologies: (p.technologies || []).filter(t => t !== tech) })}>
                  {tech} ×
                </Badge>
              ))}
              {popularSkills.slice(0, 10).map(s => (
                <Badge key={s} className="bg-lime/20 text-lime border-lime cursor-pointer hover:bg-lime/30" onClick={() => updateProject(p.id, { technologies: Array.from(new Set([...(p.technologies || []), s])) })}>
                  + {s}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      ))}
      {data.projects.length > 0 && !projectsComplete && (
        <p className="text-sm text-red-300">Title, Description and at least one Technology are required for each project. Link is optional.</p>
      )}
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'personal':
        return renderPersonalSection();
      case 'experience':
        return renderExperienceSection();
      case 'education':
        return renderEducationSection();
      case 'skills':
        return renderSkillsSection();
      case 'projects':
        return renderProjectsSection();
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

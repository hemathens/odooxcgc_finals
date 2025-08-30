import { Brain, Linkedin, Target, Zap } from "lucide-react";

const JobSearchToolkit = () => {
  const features = [
    {
      icon: Brain,
      title: "AI Resume Builder & Analyzer",
      description: "Build ATS-compliant resumes using school-defined rubrics. Then have AI score how well you did."
    },
    {
      icon: Linkedin,
      title: "AI LinkedIn Analyzer", 
      description: "Optimize your profile based on your target job title by getting scored based on 7 different sections."
    },
    {
      icon: Target,
      title: "Job Tracker & Chrome Extension",
      description: "One-click to track jobs across LinkedIn, Handshake, and anywhere else students find jobs."
    },
    {
      icon: Zap,
      title: "AI Application Tailoring",
      description: "Automatically customize your resume and cover letter for each specific job application."
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block bg-lime/20 text-lime px-4 py-2 rounded-full text-sm font-semibold mb-6">
            JOB SEARCH TOOLKIT
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Make career services accessible and{" "}
            <span className="gradient-text">fun for students</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Triple student engagement using gamification, AI-powered job search tools, 
            and community built into a single hub.
          </p>
        </div>

        <div className="mb-12">
          <div className="glass-card p-8 rounded-2xl">
            <div className="bg-gradient-to-r from-purple-light to-purple-accent rounded-xl p-6 mb-8">
              <div className="w-full h-64 bg-white/10 rounded-lg flex items-center justify-center">
                <p className="text-white/60 text-lg">Platform Interface Preview</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-center mb-8">
            Everything students wished Handshake did, Prentus does
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="glass-card p-6 hover:scale-105 transition-transform duration-300">
                <div className="flex items-start gap-4">
                  <div className="bg-lime/20 p-3 rounded-xl">
                    <feature.icon className="w-6 h-6 text-lime" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobSearchToolkit;
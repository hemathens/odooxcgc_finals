// Rule-based chatbot logic for placement guidance

export interface ChatResponse {
  content: string;
  suggestions?: string[];
}

// Keywords and patterns for different topics
const KEYWORDS = {
  // Resume related
  resume: ['resume', 'cv', 'curriculum vitae', 'profile', 'experience', 'skills', 'qualifications'],
  
  // Interview related
  interview: ['interview', 'questions', 'preparation', 'tips', 'behavioral', 'technical', 'hr round'],
  
  // Job search
  jobSearch: ['job', 'apply', 'application', 'company', 'position', 'role', 'search', 'finding'],
  
  // Career guidance
  career: ['career', 'guidance', 'path', 'future', 'goals', 'planning', 'development'],
  
  // Placement specific
  placement: ['placement', 'campus', 'drives', 'season', 'cell', 'officer'],
  
  // Skills and learning
  skills: ['skill', 'learn', 'course', 'certification', 'programming', 'technology', 'coding'],
  
  // Networking
  networking: ['network', 'connect', 'linkedin', 'professional', 'contacts', 'referral'],
  
  // Salary and negotiation
  salary: ['salary', 'package', 'negotiation', 'offer', 'compensation', 'pay', 'ctc'],
  
  // Internship
  internship: ['internship', 'intern', 'training', 'summer', 'industrial'],
  
  // Greetings
  greetings: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
  
  // Thanks
  thanks: ['thank', 'thanks', 'appreciate', 'grateful', 'helpful'],
  
  // Help
  help: ['help', 'assist', 'support', 'guide', 'what can you do']
};

// Response templates
const RESPONSES = {
  // Resume responses
  resume: {
    general: `Here are key tips for an effective resume:

📝 **Structure & Format:**
• Keep it to 1-2 pages maximum
• Use a clean, professional template
• Include: Contact info, Objective, Education, Skills, Projects, Experience
• Use consistent formatting and fonts

🎯 **Content Tips:**
• Start with a strong objective statement
• Highlight relevant projects and achievements
• Use action verbs (developed, implemented, designed, led)
• Quantify achievements with numbers when possible
• Tailor skills section to job requirements

💡 **ATS Optimization:**
• Use standard section headings
• Avoid graphics, tables, or unusual formatting
• Include keywords from job descriptions
• Save as both PDF and Word formats`,
    
    skills: `How to effectively showcase skills on your resume:

🔧 **Technical Skills:**
• Programming languages (Python, Java, C++, JavaScript)
• Frameworks and libraries (React, Django, Spring, Node.js)
• Databases (MySQL, PostgreSQL, MongoDB)
• Tools and platforms (Git, Docker, AWS, Linux)

💼 **Soft Skills:**
• Leadership and teamwork
• Communication and presentation
• Problem-solving and analytical thinking
• Time management and organization

📊 **How to Present:**
• Group by categories (Programming, Web Technologies, Databases)
• Rate proficiency levels (Beginner, Intermediate, Advanced)
• Provide context through projects and experience
• Include certifications and course completions`,

    format: `Professional resume formatting guidelines:

📐 **Layout:**
• Use 1-inch margins on all sides
• Choose professional fonts (Arial, Calibri, Times New Roman)
• Font size: 10-12pt for content, 14-16pt for headings
• Consistent spacing and alignment

📋 **Sections in Order:**
1. Header (Name, Contact Information)
2. Professional Summary/Objective
3. Education
4. Technical Skills
5. Projects
6. Work Experience/Internships
7. Achievements/Certifications
8. Extra-curricular Activities

✅ **Best Practices:**
• Use bullet points for easy scanning
• Keep consistent tense (past for completed, present for ongoing)
• Proofread for grammar and spelling errors
• Get feedback from seniors or mentors`
  },

  // Interview responses
  interview: {
    general: `Complete interview preparation guide:

🎯 **Before the Interview:**
• Research the company thoroughly (history, values, recent news)
• Review the job description and match your skills
• Prepare your elevator pitch (2-minute self-introduction)
• Practice common questions out loud
• Prepare questions to ask the interviewer

💭 **Common Questions to Prepare:**
• "Tell me about yourself"
• "Why do you want to work here?"
• "What are your strengths and weaknesses?"
• "Where do you see yourself in 5 years?"
• "Why should we hire you?"

🔧 **Technical Preparation:**
• Review fundamental concepts in your field
• Practice coding problems if applicable
• Prepare to explain your projects in detail
• Be ready for whiteboard/live coding sessions

👔 **Day of Interview:**
• Arrive 10-15 minutes early
• Dress professionally
• Bring multiple copies of your resume
• Stay calm and confident
• Ask thoughtful questions about the role`,

    technical: `Technical interview preparation:

💻 **Programming Interviews:**
• Practice data structures (Arrays, Linked Lists, Trees, Graphs)
• Master algorithms (Sorting, Searching, Dynamic Programming)
• Use platforms like LeetCode, HackerRank, CodeChef
• Practice coding on whiteboard or paper
• Explain your thought process while coding

🏗️ **System Design (for experienced roles):**
• Understand scalability concepts
• Learn about databases, caching, load balancing
• Practice designing systems like social media, chat apps
• Focus on trade-offs and decision reasoning

🔧 **Domain-Specific:**
• **Web Development:** HTML/CSS, JavaScript, React/Angular, REST APIs
• **Backend:** Databases, server architecture, API design
• **Data Science:** Statistics, ML algorithms, data preprocessing
• **Mobile:** Platform-specific knowledge (Android/iOS)

💡 **Tips:**
• Think out loud during problem-solving
• Ask clarifying questions before starting
• Start with a simple solution, then optimize
• Test your code with edge cases
• Don't panic if you don't know something - show your learning ability`,

    behavioral: `Behavioral interview preparation:

🎭 **STAR Method:**
Use this structure for answering behavioral questions:
• **Situation:** Set the context
• **Task:** Describe your responsibility
• **Action:** Explain what you did
• **Result:** Share the outcome

📚 **Common Behavioral Questions:**
• "Tell me about a time you faced a challenge"
• "Describe a time you worked in a team"
• "How do you handle pressure and deadlines?"
• "Tell me about a time you showed leadership"
• "Describe a failure and what you learned"

💡 **Preparation Tips:**
• Prepare 5-7 specific examples from your experience
• Include projects, internships, academic work, extracurriculars
• Focus on your role and impact
• Show growth and learning from experiences
• Practice storytelling - make it engaging but concise`
  },

  // Job search responses
  jobSearch: {
    general: `Effective job search strategies:

🌐 **Online Platforms:**
• LinkedIn (optimize your profile, connect with professionals)
• Company career pages
• Job portals (Naukri, Indeed, Glassdoor, AngelList)
• University placement portals

📈 **Application Strategy:**
• Apply early in the application cycle
• Customize resume and cover letter for each application
• Follow up professionally after applying
• Track applications in a spreadsheet
• Apply to 20-30 positions per week

🤝 **Networking:**
• Attend virtual career fairs and webinars
• Join professional groups on LinkedIn
• Connect with alumni in your field
• Participate in hackathons and competitions
• Build relationships with professors and mentors

📊 **Application Tracking:**
• Company name and position
• Application date and deadline
• Contact person details
• Interview dates and feedback
• Follow-up actions needed`,

    companies: `How to research and target companies:

🔍 **Company Research:**
• Visit company website and read about culture, values
• Check recent news and press releases
• Review glassdoor for employee reviews and salary info
• Look at their social media presence
• Understand their products/services and market position

🎯 **Target Company Types:**
• **Service Companies:** TCS, Infosys, Wipro, Accenture, Cognizant
• **Product Companies:** Google, Microsoft, Amazon, Adobe, Salesforce
• **Startups:** High growth potential, diverse responsibilities
• **Core Companies:** L&T, Reliance, BHEL (for core engineering)

📝 **Application Tips:**
• Tailor your resume to match company requirements
• Write personalized cover letters
• Apply through multiple channels (website, referrals, LinkedIn)
• Follow company pages for job updates
• Engage with their content professionally`
  },

  // Career guidance responses
  career: {
    general: `Career planning and development guide:

🎯 **Self-Assessment:**
• Identify your interests and passions
• Assess your strengths and areas for improvement
• Consider your values and work-life balance preferences
• Take career assessment tests if needed

📚 **Skill Development:**
• Identify in-demand skills in your field
• Take online courses (Coursera, edX, Udemy)
• Work on practical projects
• Contribute to open-source projects
• Build a portfolio showcasing your work

🛤️ **Career Paths:**
• **Technology:** Software Developer, Data Scientist, DevOps Engineer
• **Consulting:** Business Analyst, Management Consultant
• **Finance:** Financial Analyst, Investment Banking
• **Marketing:** Digital Marketing, Product Marketing
• **Entrepreneurship:** Start your own venture

🎓 **Continuous Learning:**
• Stay updated with industry trends
• Attend webinars and conferences
• Read industry publications and blogs
• Join professional associations
• Consider higher education or certifications`,

    planning: `Strategic career planning approach:

📅 **Short-term Goals (1-2 years):**
• Land your first job in preferred field
• Develop core technical and soft skills
• Build professional network
• Gain practical experience

🎯 **Medium-term Goals (3-5 years):**
• Achieve specific role or promotion
• Become expert in chosen specialization
• Lead projects or small teams
• Expand professional network
• Consider advanced certifications

🚀 **Long-term Goals (5+ years):**
• Senior leadership or specialist roles
• Industry recognition and expertise
• Mentoring and knowledge sharing
• Entrepreneurial opportunities
• Work-life balance and personal growth

💡 **Planning Tips:**
• Write down specific, measurable goals
• Review and adjust plans regularly
• Seek mentorship and guidance
• Track progress and celebrate milestones
• Stay flexible and adapt to opportunities`
  },

  // General responses
  greetings: [
    "Hello! I'm your AI placement assistant. How can I help you with your career journey today?",
    "Hi there! Ready to boost your placement prospects? What would you like to know?",
    "Hey! Great to see you here. What placement-related question can I help you with?",
    "Hello! I'm here to help with all things placement and career-related. What's on your mind?"
  ],

  thanks: [
    "You're very welcome! I'm here whenever you need placement guidance. Good luck with your career journey! 🌟",
    "Happy to help! Remember, consistent effort and preparation are key to placement success. You've got this! 💪",
    "Glad I could assist! Feel free to ask more questions anytime. Wishing you all the best for your placements! 🚀",
    "You're welcome! Keep practicing and preparing. Every step you take brings you closer to your dream job! ✨"
  ],

  help: `I'm your AI placement assistant! Here's how I can help you:

🎯 **Main Areas:**
• **Resume Help:** Writing, formatting, optimization tips
• **Interview Prep:** Technical, behavioral, HR round preparation
• **Job Search:** Strategies, company research, application tips
• **Career Guidance:** Planning, skill development, goal setting
• **Placement Process:** Campus drives, procedures, timeline

💬 **How to Ask:**
• Be specific about your questions
• Mention your field/branch if relevant
• Ask about particular companies or roles
• Request step-by-step guidance

🔄 **Quick Commands:**
• Type "resume tips" for resume guidance
• Type "interview prep" for interview help
• Type "job search" for application strategies
• Type "career planning" for long-term guidance

What specific area would you like help with today?`,

  default: `I understand you're looking for guidance! While I specialize in placement and career advice, I might not have caught the specific topic you're asking about.

💡 **I can help with:**
• Resume writing and optimization
• Interview preparation (all types)
• Job search strategies
• Career planning and development
• Company research and application tips
• Skill development guidance

🔄 **Try asking:**
• "How do I write a good resume?"
• "What should I expect in a technical interview?"
• "How do I search for jobs effectively?"
• "What skills should I develop for my career?"

Could you rephrase your question or ask about one of these topics?`
};

// Keyword matching function
function matchesKeywords(message: string, keywords: string[]): boolean {
  const lowerMessage = message.toLowerCase();
  return keywords.some(keyword => lowerMessage.includes(keyword.toLowerCase()));
}

// Main chatbot logic function
export function generateChatResponse(userMessage: string): ChatResponse {
  const message = userMessage.toLowerCase().trim();

  // Handle greetings
  if (matchesKeywords(message, KEYWORDS.greetings)) {
    const randomGreeting = RESPONSES.greetings[Math.floor(Math.random() * RESPONSES.greetings.length)];
    return {
      content: randomGreeting,
      suggestions: [
        "How do I write a strong resume?",
        "What should I expect in interviews?",
        "Tips for job searching",
        "Help with career planning"
      ]
    };
  }

  // Handle thanks
  if (matchesKeywords(message, KEYWORDS.thanks)) {
    const randomThanks = RESPONSES.thanks[Math.floor(Math.random() * RESPONSES.thanks.length)];
    return { content: randomThanks };
  }

  // Handle help requests
  if (matchesKeywords(message, KEYWORDS.help)) {
    return { content: RESPONSES.help };
  }

  // Resume related questions
  if (matchesKeywords(message, KEYWORDS.resume)) {
    if (matchesKeywords(message, ['skill', 'skills', 'technical', 'programming'])) {
      return {
        content: RESPONSES.resume.skills,
        suggestions: [
          "Resume format guidelines",
          "How to write project descriptions?",
          "Resume keywords for ATS"
        ]
      };
    }
    if (matchesKeywords(message, ['format', 'template', 'layout', 'design'])) {
      return {
        content: RESPONSES.resume.format,
        suggestions: [
          "Resume content tips",
          "How to highlight achievements?",
          "Common resume mistakes"
        ]
      };
    }
    return {
      content: RESPONSES.resume.general,
      suggestions: [
        "Resume formatting guidelines",
        "How to showcase skills effectively?",
        "Resume review checklist"
      ]
    };
  }

  // Interview related questions
  if (matchesKeywords(message, KEYWORDS.interview)) {
    if (matchesKeywords(message, ['technical', 'coding', 'programming', 'algorithm'])) {
      return {
        content: RESPONSES.interview.technical,
        suggestions: [
          "Behavioral interview tips",
          "How to handle interview nerves?",
          "Questions to ask interviewer"
        ]
      };
    }
    if (matchesKeywords(message, ['behavioral', 'hr', 'personal', 'soft skills'])) {
      return {
        content: RESPONSES.interview.behavioral,
        suggestions: [
          "Technical interview preparation",
          "Interview dress code tips",
          "How to research company culture?"
        ]
      };
    }
    return {
      content: RESPONSES.interview.general,
      suggestions: [
        "Technical interview tips",
        "Behavioral interview guidance",
        "Post-interview follow-up"
      ]
    };
  }

  // Job search related questions
  if (matchesKeywords(message, KEYWORDS.jobSearch)) {
    if (matchesKeywords(message, ['company', 'companies', 'research', 'target'])) {
      return {
        content: RESPONSES.jobSearch.companies,
        suggestions: [
          "Application tracking tips",
          "How to write cover letters?",
          "Networking strategies"
        ]
      };
    }
    return {
      content: RESPONSES.jobSearch.general,
      suggestions: [
        "Company research strategies",
        "How to track applications?",
        "LinkedIn optimization tips"
      ]
    };
  }

  // Career guidance questions
  if (matchesKeywords(message, KEYWORDS.career)) {
    if (matchesKeywords(message, ['plan', 'planning', 'goals', 'future', 'path'])) {
      return {
        content: RESPONSES.career.planning,
        suggestions: [
          "Skill development strategies",
          "How to find mentors?",
          "Industry trend analysis"
        ]
      };
    }
    return {
      content: RESPONSES.career.general,
      suggestions: [
        "Career planning strategies",
        "How to switch career paths?",
        "Professional development tips"
      ]
    };
  }

  // Placement specific questions
  if (matchesKeywords(message, KEYWORDS.placement)) {
    return {
      content: `Campus placement guidance:

📅 **Placement Timeline:**
• **Pre-placement talks:** July-August
• **Resume submission:** August-September  
• **Company visits:** September-February
• **Final selections:** March-April

📋 **Preparation Strategy:**
• Update and optimize your resume
• Practice aptitude and reasoning
• Prepare for group discussions
• Mock interviews with seniors
• Research visiting companies

🎯 **During Placement Season:**
• Attend all pre-placement talks
• Apply strategically (don't apply everywhere)
• Dress professionally for all interactions
• Be punctual and respectful
• Follow placement cell guidelines

💡 **Pro Tips:**
• Start preparation at least 6 months early
• Maintain good academic record
• Build relevant projects and skills
• Network with alumni and seniors
• Stay positive and persistent`,
      suggestions: [
        "Resume tips for placements",
        "How to ace group discussions?",
        "Company-wise preparation strategies"
      ]
    };
  }

  // Skills and learning questions
  if (matchesKeywords(message, KEYWORDS.skills)) {
    return {
      content: `Skill development for better placements:

💻 **Technical Skills (Computer Science):**
• **Programming:** Python, Java, C++, JavaScript
• **Web Development:** HTML/CSS, React, Node.js, databases
• **Data Science:** Python, R, SQL, machine learning
• **Mobile Development:** Android (Java/Kotlin), iOS (Swift)
• **DevOps:** Git, Docker, AWS, Linux

🏭 **Core Engineering Skills:**
• **Mechanical:** CAD software, manufacturing processes
• **Electrical:** Circuit design, power systems, embedded systems
• **Civil:** AutoCAD, structural design, project management
• **Chemical:** Process design, safety protocols

💼 **Soft Skills:**
• Communication and presentation
• Leadership and teamwork
• Problem-solving and critical thinking
• Time management and organization
• Adaptability and learning agility

📈 **Learning Resources:**
• Online courses (Coursera, edX, Udemy)
• YouTube tutorials and tech channels
• Practice platforms (LeetCode, HackerRank)
• Open source contributions
• Personal projects and portfolios`,
      suggestions: [
        "How to learn programming effectively?",
        "Best online courses for my field",
        "How to build a portfolio?"
      ]
    };
  }

  // Networking questions
  if (matchesKeywords(message, KEYWORDS.networking)) {
    return {
      content: `Professional networking for students:

🌐 **LinkedIn Optimization:**
• Professional profile photo
• Compelling headline and summary
• Detailed education and project sections
• Connect with classmates, professors, professionals
• Share relevant content and engage with posts

🤝 **Networking Strategies:**
• Attend virtual career fairs and webinars
• Join alumni networks and professional groups
• Participate in hackathons and competitions
• Reach out to professionals for informational interviews
• Be genuine and helpful in your interactions

📧 **Professional Communication:**
• Craft personalized connection requests
• Send thoughtful follow-up messages
• Share updates about your achievements
• Offer help and value to your network
• Maintain regular but not overwhelming contact

💡 **Building Relationships:**
• Be authentic and show genuine interest
• Ask thoughtful questions about their career journey
• Seek advice, not immediate job opportunities
• Express gratitude for their time and insights
• Keep connections updated on your progress`,
      suggestions: [
        "LinkedIn profile optimization",
        "How to reach out to professionals?",
        "Networking event strategies"
      ]
    };
  }

  // Salary and negotiation
  if (matchesKeywords(message, KEYWORDS.salary)) {
    return {
      content: `Salary expectations and negotiation:

💰 **Research Salary Ranges:**
• Use platforms like Glassdoor, PayScale, AmbitionBox
• Check industry reports and surveys
• Network with recent graduates in similar roles
• Consider location, company size, and industry

📊 **Factors Affecting Salary:**
• Your skills and experience level
• Company type (product vs service vs startup)
• Location (metro vs tier-2 cities)
• Industry demand and market conditions
• Educational background and certifications

🤝 **Negotiation Tips (for experienced professionals):**
• Research market rates thoroughly
• Highlight your unique value proposition
• Consider the entire package (salary, benefits, growth)
• Be professional and reasonable
• Have backup options

🎓 **For Fresh Graduates:**
• Focus more on learning opportunities than salary
• Standard packages: 3-8 LPA for most companies
• Gain experience first, then negotiate in future roles
• Consider joining good companies even at lower initial salary`,
      suggestions: [
        "How to research company packages?",
        "Benefits beyond salary to consider",
        "When is it appropriate to negotiate?"
      ]
    };
  }

  // Internship questions
  if (matchesKeywords(message, KEYWORDS.internship)) {
    return {
      content: `Internship guidance for students:

🎯 **Finding Internships:**
• Apply early (start 3-6 months before summer)
• Use platforms like Internshala, LinkedIn, company websites
• Leverage college placement cell and professor connections
• Apply to startups for diverse experience
• Consider remote internship opportunities

📝 **Application Tips:**
• Tailor resume for each application
• Write compelling cover letters
• Showcase relevant projects and coursework
• Highlight your eagerness to learn
• Follow up professionally after applying

💼 **Making the Most of Internships:**
• Set clear learning goals
• Ask questions and seek feedback
• Take initiative on additional projects
• Network with colleagues and mentors
• Document your achievements and learnings

🌟 **Converting Internship to Full-time:**
• Exceed expectations consistently
• Show enthusiasm and cultural fit
• Build strong relationships with team members
• Express interest in full-time opportunities
• Seek feedback and act on it promptly`,
      suggestions: [
        "How to find internship opportunities?",
        "Internship interview preparation",
        "How to excel during internship?"
      ]
    };
  }

  // Default response for unmatched queries
  return { content: RESPONSES.default };
}

// Additional utility functions
export function getRandomSuggestion(): string[] {
  const allSuggestions = [
    "How can I improve my resume?",
    "What should I expect in a technical interview?",
    "How do I track my job applications effectively?",
    "Tips for preparing for placement season",
    "How to develop relevant skills?",
    "Networking strategies for students",
    "How to research companies effectively?",
    "Career planning and goal setting",
    "Internship vs full-time job strategies",
    "How to handle interview nerves?"
  ];
  
  return allSuggestions.sort(() => 0.5 - Math.random()).slice(0, 4);
}

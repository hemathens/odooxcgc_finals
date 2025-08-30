import { useState, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Edit, 
  Save, 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Building,
  Calendar,
  Linkedin,
  Globe,
  Trash2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  university: string;
  degree: string;
  graduationYear: string;
  major: string;
  gpa: string;
  linkedin: string;
  website: string;
  bio: string;
  skills: string[];
  experience: string;
  interests: string[];
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(() => {
    // Try to load saved profile image from localStorage
    const savedImage = localStorage.getItem('profileImage');
    return savedImage || null;
  });
  const [profileData, setProfileData] = useState<ProfileData>(() => {
    // Try to load saved profile data from localStorage
    const savedData = localStorage.getItem('profileData');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.error('Error parsing saved profile data:', error);
      }
    }
    
    // Default data if nothing is saved
    return {
      firstName: user?.name?.split(' ')[0] || 'John',
      lastName: user?.name?.split(' ')[1] || 'Doe',
      email: user?.email || 'john.doe@university.edu',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      university: 'Stanford University',
      degree: 'Bachelor of Science',
      graduationYear: '2025',
      major: 'Computer Science',
      gpa: '3.8',
      linkedin: 'linkedin.com/in/johndoe',
      website: 'johndoe.dev',
      bio: 'Passionate computer science student with a focus on software engineering and machine learning. Seeking opportunities to apply my skills in real-world projects.',
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'Machine Learning', 'Data Structures'],
      experience: '2 years of software development experience through internships and personal projects.',
      interests: ['AI/ML', 'Web Development', 'Open Source', 'Hiking', 'Photography']
    };
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setProfileImage(imageData);
        // Save to localStorage
        localStorage.setItem('profileImage', imageData);
        toast({
          title: "Profile picture updated",
          description: "Your profile picture has been updated successfully"
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setProfileImage(null);
    // Remove from localStorage
    localStorage.removeItem('profileImage');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast({
      title: "Profile picture removed",
      description: "Your profile picture has been removed"
    });
  };

  const handleSave = () => {
    // Save profile data to localStorage
    localStorage.setItem('profileData', JSON.stringify(profileData));
    
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully"
    });
  };

  const handleCancel = () => {
    // Reload saved data from localStorage to discard changes
    const savedData = localStorage.getItem('profileData');
    if (savedData) {
      try {
        setProfileData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading saved profile data:', error);
      }
    }
    
    setIsEditing(false);
    toast({
      title: "Changes cancelled",
      description: "Your changes have been discarded"
    });
  };

  const addSkill = (skill: string) => {
    if (skill.trim() && !profileData.skills.includes(skill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addInterest = (interest: string) => {
    if (interest.trim() && !profileData.interests.includes(interest.trim())) {
      setProfileData(prev => ({
        ...prev,
        interests: [...prev.interests, interest.trim()]
      }));
    }
  };

  const removeInterest = (interestToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };

  return (
    <DashboardLayout title="Profile" subtitle="Manage your personal information and profile picture">
      <div className="space-y-6">
        {/* Profile Header */}
        <Card className="glass-card p-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-purple-medium/30 border-4 border-lime/20">
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-16 h-16 text-purple-light" />
                    </div>
                  )}
                </div>
                
                {/* Camera Icon Overlay */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-lime p-2 rounded-full shadow-lg hover:bg-lime-dark transition-colors"
                >
                  <Camera className="w-4 h-4 text-purple-dark" />
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  size="sm"
                  className="btn-primary"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Change Photo
                </Button>
                {profileImage && (
                  <Button
                    onClick={handleDeleteImage}
                    size="sm"
                    variant="outline"
                    className="text-red-400 border-red-400 hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    {profileData.firstName} {profileData.lastName}
                  </h2>
                  <p className="text-lime text-lg">{profileData.major} Student</p>
                  <p className="text-muted-foreground">{profileData.university}</p>
                </div>
                
                                 <div className="flex gap-2">
                   {isEditing ? (
                     <>
                       <Button onClick={handleSave} className="btn-primary">
                         <Save className="w-4 h-4 mr-2" />
                         Save
                       </Button>
                       <Button onClick={handleCancel} variant="outline" className="text-white border-border">
                         <X className="w-4 h-4 mr-2" />
                         Cancel
                       </Button>
                     </>
                   ) : (
                     <Button onClick={() => setIsEditing(true)} className="btn-primary">
                       <Edit className="w-4 h-4 mr-2" />
                       Edit Profile
                     </Button>
                   )}
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{profileData.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{profileData.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{profileData.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GraduationCap className="w-4 h-4" />
                  <span>Class of {profileData.graduationYear}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Personal Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card className="glass-card p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-lime" />
              Basic Information
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">First Name</label>
                  {isEditing ? (
                    <Input
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="bg-purple-medium/50 border-border text-white"
                    />
                  ) : (
                    <p className="text-muted-foreground">{profileData.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Last Name</label>
                  {isEditing ? (
                    <Input
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="bg-purple-medium/50 border-border text-white"
                    />
                  ) : (
                    <p className="text-muted-foreground">{profileData.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Email</label>
                {isEditing ? (
                  <Input
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-purple-medium/50 border-border text-white"
                  />
                ) : (
                  <p className="text-muted-foreground">{profileData.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Phone</label>
                {isEditing ? (
                  <Input
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-purple-medium/50 border-border text-white"
                  />
                ) : (
                  <p className="text-muted-foreground">{profileData.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Location</label>
                {isEditing ? (
                  <Input
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    className="bg-purple-medium/50 border-border text-white"
                  />
                ) : (
                  <p className="text-muted-foreground">{profileData.location}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Academic Information */}
          <Card className="glass-card p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-lime" />
              Academic Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">University</label>
                {isEditing ? (
                  <Input
                    value={profileData.university}
                    onChange={(e) => setProfileData(prev => ({ ...prev, university: e.target.value }))}
                    className="bg-purple-medium/50 border-border text-white"
                  />
                ) : (
                  <p className="text-muted-foreground">{profileData.university}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Degree</label>
                  {isEditing ? (
                    <Input
                      value={profileData.degree}
                      onChange={(e) => setProfileData(prev => ({ ...prev, degree: e.target.value }))}
                      className="bg-purple-medium/50 border-border text-white"
                    />
                  ) : (
                    <p className="text-muted-foreground">{profileData.degree}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Major</label>
                  {isEditing ? (
                    <Input
                      value={profileData.major}
                      onChange={(e) => setProfileData(prev => ({ ...prev, major: e.target.value }))}
                      className="bg-purple-medium/50 border-border text-white"
                    />
                  ) : (
                    <p className="text-muted-foreground">{profileData.major}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Graduation Year</label>
                  {isEditing ? (
                    <Input
                      value={profileData.graduationYear}
                      onChange={(e) => setProfileData(prev => ({ ...prev, graduationYear: e.target.value }))}
                      className="bg-purple-medium/50 border-border text-white"
                    />
                  ) : (
                    <p className="text-muted-foreground">{profileData.graduationYear}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">GPA</label>
                  {isEditing ? (
                    <Input
                      value={profileData.gpa}
                      onChange={(e) => setProfileData(prev => ({ ...prev, gpa: e.target.value }))}
                      className="bg-purple-medium/50 border-border text-white"
                    />
                  ) : (
                    <p className="text-muted-foreground">{profileData.gpa}</p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Skills and Interests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skills */}
          <Card className="glass-card p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Skills</h3>
            <div className="space-y-4">
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill..."
                    className="bg-purple-medium/50 border-border text-white"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addSkill(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Add a skill..."]') as HTMLInputElement;
                      if (input?.value) {
                        addSkill(input.value);
                        input.value = '';
                      }
                    }}
                    size="sm"
                    className="btn-primary"
                  >
                    Add
                  </Button>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <Badge key={index} className="bg-lime/20 text-lime border-lime/30">
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-2 hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>

          {/* Interests */}
          <Card className="glass-card p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Interests</h3>
            <div className="space-y-4">
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add an interest..."
                    className="bg-purple-medium/50 border-border text-white"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addInterest(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Add an interest..."]') as HTMLInputElement;
                      if (input?.value) {
                        addInterest(input.value);
                        input.value = '';
                      }
                    }}
                    size="sm"
                    className="btn-primary"
                  >
                    Add
                  </Button>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                {profileData.interests.map((interest, index) => (
                  <Badge key={index} className="bg-purple-light/20 text-purple-light border-purple-light/30">
                    {interest}
                    {isEditing && (
                      <button
                        onClick={() => removeInterest(interest)}
                        className="ml-2 hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Bio and Experience */}
        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4">About Me</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Bio</label>
              {isEditing ? (
                <Textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  className="bg-purple-medium/50 border-border text-white min-h-[100px]"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-muted-foreground">{profileData.bio}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Experience</label>
              {isEditing ? (
                <Textarea
                  value={profileData.experience}
                  onChange={(e) => setProfileData(prev => ({ ...prev, experience: e.target.value }))}
                  className="bg-purple-medium/50 border-border text-white min-h-[80px]"
                  placeholder="Describe your experience..."
                />
              ) : (
                <p className="text-muted-foreground">{profileData.experience}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Social Links */}
        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-blue-400" />
                LinkedIn
              </label>
              {isEditing ? (
                <Input
                  value={profileData.linkedin}
                  onChange={(e) => setProfileData(prev => ({ ...prev, linkedin: e.target.value }))}
                  className="bg-purple-medium/50 border-border text-white"
                  placeholder="linkedin.com/in/username"
                />
              ) : (
                <p className="text-muted-foreground">{profileData.linkedin}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4 text-green-400" />
                Website
              </label>
              {isEditing ? (
                <Input
                  value={profileData.website}
                  onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                  className="bg-purple-medium/50 border-border text-white"
                  placeholder="yourwebsite.com"
                />
              ) : (
                <p className="text-muted-foreground">{profileData.website}</p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Profile;

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Shield, 
  Palette, 
  User, 
  Lock, 
  Eye, 
  EyeOff,
  Save,
  Moon,
  Sun,
  Monitor,
  Mail,
  Smartphone,
  Globe,
  Database,
  Download,
  Trash2,
  Key,
  Smartphone as Mobile,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

interface SettingsData {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    jobAlerts: boolean;
    interviewReminders: boolean;
    applicationUpdates: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'connections';
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
    allowSearchEngines: boolean;
    dataSharing: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large';
    compactMode: boolean;
    animations: boolean;
  };
  account: {
    language: string;
    timezone: string;
    dateFormat: string;
    currency: string;
  };
}

const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [settings, setSettings] = useState<SettingsData>(() => {
    // Try to load saved settings from localStorage
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
    
    // Default settings if nothing is saved
    return {
      notifications: {
        email: true,
        push: true,
        sms: false,
        jobAlerts: true,
        interviewReminders: true,
        applicationUpdates: true,
        marketing: false,
      },
      privacy: {
        profileVisibility: 'connections',
        showEmail: true,
        showPhone: false,
        showLocation: true,
        allowSearchEngines: false,
        dataSharing: true,
      },
      appearance: {
        theme: 'dark',
        fontSize: 'medium',
        compactMode: false,
        animations: true,
      },
      account: {
        language: 'English',
        timezone: 'UTC-8 (Pacific Time)',
        dateFormat: 'MM/DD/YYYY',
        currency: 'USD',
      },
    };
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  const updateSetting = (category: keyof SettingsData, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    // Save settings to localStorage
    localStorage.setItem('userSettings', JSON.stringify(settings));
    
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully"
    });
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirm password do not match",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Password updated",
      description: "Your password has been changed successfully"
    });

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const exportData = () => {
    // Get profile data if available (per-user keys with legacy fallback)
    const profileData = localStorage.getItem(user ? `profileData:${user.id}` : 'profileData') || localStorage.getItem('profileData');
    const profileImage = localStorage.getItem(user ? `profileImage:${user.id}` : 'profileImage') || localStorage.getItem('profileImage');
    
    // Create a data object with all user settings and profile data
    const exportDataObj = {
      settings: settings,
      profile: profileData ? JSON.parse(profileData) : null,
      profileImage: profileImage ? 'Image data available' : null,
      timestamp: new Date().toISOString(),
      version: "1.0"
    };

    // Convert to JSON string
    const dataStr = JSON.stringify(exportDataObj, null, 2);
    
    // Create blob and download
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `placement-tracker-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Data exported successfully",
      description: "Your data has been downloaded as a JSON file"
    });
  };

  const deleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast({
        title: "Account deletion",
        description: "Your account deletion request has been submitted. You will receive a confirmation email.",
        variant: "destructive"
      });
    }
  };

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case 'light': return <Sun className="w-4 h-4" />;
      case 'dark': return <Moon className="w-4 h-4" />;
      case 'system': return <Monitor className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <DashboardLayout title="Settings" subtitle="Customize your experience and manage your account">
      <div className="space-y-6">
        {/* Notifications Settings */}
        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-lime" />
            Notifications
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-purple-medium/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span className="text-white">Email Notifications</span>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => updateSetting('notifications', 'email', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-medium/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-green-400" />
                  <span className="text-white">Push Notifications</span>
                </div>
                <Switch
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) => updateSetting('notifications', 'push', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-medium/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mobile className="w-5 h-5 text-purple-400" />
                  <span className="text-white">SMS Notifications</span>
                </div>
                <Switch
                  checked={settings.notifications.sms}
                  onCheckedChange={(checked) => updateSetting('notifications', 'sms', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-medium/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-orange-400" />
                  <span className="text-white">Job Alerts</span>
                </div>
                <Switch
                  checked={settings.notifications.jobAlerts}
                  onCheckedChange={(checked) => updateSetting('notifications', 'jobAlerts', checked)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-purple-medium/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-red-400" />
                  <span className="text-white">Interview Reminders</span>
                </div>
                <Switch
                  checked={settings.notifications.interviewReminders}
                  onCheckedChange={(checked) => updateSetting('notifications', 'interviewReminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-medium/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-cyan-400" />
                  <span className="text-white">Application Updates</span>
                </div>
                <Switch
                  checked={settings.notifications.applicationUpdates}
                  onCheckedChange={(checked) => updateSetting('notifications', 'applicationUpdates', checked)}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Privacy Settings */}
        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-lime" />
            Privacy & Security
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Profile Visibility</label>
              <Select
                value={settings.privacy.profileVisibility}
                onValueChange={(value) => updateSetting('privacy', 'profileVisibility', value)}
              >
                <SelectTrigger className="bg-purple-medium/50 border-border text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-purple-medium border-border">
                  <SelectItem value="public" className="text-white">Public - Anyone can view</SelectItem>
                  <SelectItem value="connections" className="text-white">Connections only</SelectItem>
                  <SelectItem value="private" className="text-white">Private - Only you</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-purple-medium/30 rounded-lg">
                <span className="text-white">Show Email Address</span>
                <Switch
                  checked={settings.privacy.showEmail}
                  onCheckedChange={(checked) => updateSetting('privacy', 'showEmail', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-medium/30 rounded-lg">
                <span className="text-white">Show Phone Number</span>
                <Switch
                  checked={settings.privacy.showPhone}
                  onCheckedChange={(checked) => updateSetting('privacy', 'showPhone', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-medium/30 rounded-lg">
                <span className="text-white">Show Location</span>
                <Switch
                  checked={settings.privacy.showLocation}
                  onCheckedChange={(checked) => updateSetting('privacy', 'showLocation', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-medium/30 rounded-lg">
                <span className="text-white">Allow Search Engines</span>
                <Switch
                  checked={settings.privacy.allowSearchEngines}
                  onCheckedChange={(checked) => updateSetting('privacy', 'allowSearchEngines', checked)}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Appearance Settings */}
        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-lime" />
            Appearance
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Theme</label>
              <Select
                value={settings.appearance.theme}
                onValueChange={(value) => updateSetting('appearance', 'theme', value)}
              >
                <SelectTrigger className="bg-purple-medium/50 border-border text-white">
                  <div className="flex items-center gap-2">
                    {getThemeIcon(settings.appearance.theme)}
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-purple-medium border-border">
                  <SelectItem value="light" className="text-white">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark" className="text-white">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system" className="text-white">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4" />
                      System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Font Size</label>
                <Select
                  value={settings.appearance.fontSize}
                  onValueChange={(value) => updateSetting('appearance', 'fontSize', value)}
                >
                  <SelectTrigger className="bg-purple-medium/50 border-border text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-purple-medium border-border">
                    <SelectItem value="small" className="text-white">Small</SelectItem>
                    <SelectItem value="medium" className="text-white">Medium</SelectItem>
                    <SelectItem value="large" className="text-white">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-medium/30 rounded-lg">
                <span className="text-white">Compact Mode</span>
                <Switch
                  checked={settings.appearance.compactMode}
                  onCheckedChange={(checked) => updateSetting('appearance', 'compactMode', checked)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-medium/30 rounded-lg">
              <span className="text-white">Enable Animations</span>
              <Switch
                checked={settings.appearance.animations}
                onCheckedChange={(checked) => updateSetting('appearance', 'animations', checked)}
              />
            </div>
          </div>
        </Card>

        {/* Account Settings */}
        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-lime" />
            Account Preferences
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Language</label>
              <Select
                value={settings.account.language}
                onValueChange={(value) => updateSetting('account', 'language', value)}
              >
                <SelectTrigger className="bg-purple-medium/50 border-border text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-purple-medium border-border">
                  <SelectItem value="English" className="text-white">English</SelectItem>
                  <SelectItem value="Spanish" className="text-white">Spanish</SelectItem>
                  <SelectItem value="French" className="text-white">French</SelectItem>
                  <SelectItem value="German" className="text-white">German</SelectItem>
                  <SelectItem value="Chinese" className="text-white">Chinese</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Timezone</label>
              <Select
                value={settings.account.timezone}
                onValueChange={(value) => updateSetting('account', 'timezone', value)}
              >
                <SelectTrigger className="bg-purple-medium/50 border-border text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-purple-medium border-border">
                  <SelectItem value="UTC-8 (Pacific Time)" className="text-white">UTC-8 (Pacific Time)</SelectItem>
                  <SelectItem value="UTC-5 (Eastern Time)" className="text-white">UTC-5 (Eastern Time)</SelectItem>
                  <SelectItem value="UTC+0 (GMT)" className="text-white">UTC+0 (GMT)</SelectItem>
                  <SelectItem value="UTC+1 (Central Europe)" className="text-white">UTC+1 (Central Europe)</SelectItem>
                  <SelectItem value="UTC+5:30 (India)" className="text-white">UTC+5:30 (India)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Date Format</label>
              <Select
                value={settings.account.dateFormat}
                onValueChange={(value) => updateSetting('account', 'dateFormat', value)}
              >
                <SelectTrigger className="bg-purple-medium/50 border-border text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-purple-medium border-border">
                  <SelectItem value="MM/DD/YYYY" className="text-white">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD/MM/YYYY" className="text-white">DD/MM/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD" className="text-white">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Currency</label>
              <Select
                value={settings.account.currency}
                onValueChange={(value) => updateSetting('account', 'currency', value)}
              >
                <SelectTrigger className="bg-purple-medium/50 border-border text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-purple-medium border-border">
                  <SelectItem value="USD" className="text-white">USD ($)</SelectItem>
                  <SelectItem value="EUR" className="text-white">EUR (€)</SelectItem>
                  <SelectItem value="GBP" className="text-white">GBP (£)</SelectItem>
                  <SelectItem value="INR" className="text-white">INR (₹)</SelectItem>
                  <SelectItem value="CAD" className="text-white">CAD (C$)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Password Change */}
        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-lime" />
            Change Password
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Current Password</label>
              <div className="relative">
                <Input
                  type={showPasswords ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-purple-medium/50 border-border text-white pr-10"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-white"
                >
                  {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">New Password</label>
                <Input
                  type={showPasswords ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-purple-medium/50 border-border text-white"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Confirm New Password</label>
                <Input
                  type={showPasswords ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-purple-medium/50 border-border text-white"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <Button onClick={handlePasswordChange} className="btn-primary">
              <Key className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          </div>
        </Card>

        {/* Data Management */}
        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Data Management</h3>
          
          <div className="space-y-4">
                         <div className="space-y-4">
               <div>
                 <h4 className="text-white font-medium mb-2">Export Your Data</h4>
                 <p className="text-muted-foreground text-sm mb-4">Download a copy of your personal data</p>
                 <Button onClick={exportData} className="btn-primary">
                   <Download className="w-4 h-4 mr-2" />
                   Export Data
                 </Button>
               </div>
             </div>

            <div className="flex items-center justify-between p-4 bg-red-500/20 rounded-lg border border-red-500/30">
              <div>
                <h4 className="text-red-400 font-medium">Delete Account</h4>
                <p className="text-red-300 text-sm">Permanently delete your account and all data</p>
              </div>
              <Button onClick={deleteAccount} variant="outline" className="text-red-400 border-red-400 hover:bg-red-500 hover:text-white">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} className="btn-primary">
            <Save className="w-4 h-4 mr-2" />
            Save All Settings
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;


import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { useRecruiterContext } from '@/contexts/RecruiterContext';
import { getRecruiterProfile, updateRecruiterProfile } from '@/services/api';
import { toast } from '@/components/ui/use-toast';

const Profile: React.FC = () => {
  const { profile, setProfile, updateProfileField, isLoading, setIsLoading } = useRecruiterContext();
  const [activeTab, setActiveTab] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const data = await getRecruiterProfile();
        setProfile(data);
      } catch (error) {
        toast({
          title: "Failed to load profile",
          description: "Your profile information could not be loaded. Please try again later.",
          variant: "destructive",
        });
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [setProfile, setIsLoading]);

  const handleSave = async () => {
    if (!profile) return;
    
    setIsSaving(true);
    try {
      await updateRecruiterProfile(profile);
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to save your profile information. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real app, we would upload the file to a server here
    // For now, we'll just use a local URL
    const fileUrl = URL.createObjectURL(file);
    updateProfileField('profilePicture', fileUrl);
  };

  const handleAgencyLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real app, we would upload the file to a server here
    // For now, we'll just use a local URL
    const fileUrl = URL.createObjectURL(file);
    updateProfileField('agencyLogo', fileUrl);
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-medium text-gray-700">Loading profile...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600 mb-6">Manage your account and agency information</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-md shadow-sm">
                <div className="p-4 border-b">
                  <Button
                    variant={activeTab === 'personal' ? 'default' : 'ghost'}
                    className={`w-full justify-start ${
                      activeTab === 'personal' ? 'bg-hireable-primary hover:bg-hireable-dark' : ''
                    }`}
                    onClick={() => setActiveTab('personal')}
                  >
                    Personal Information
                  </Button>
                </div>
                <div className="p-4 border-b">
                  <Button
                    variant={activeTab === 'agency' ? 'default' : 'ghost'}
                    className={`w-full justify-start ${
                      activeTab === 'agency' ? 'bg-hireable-primary hover:bg-hireable-dark' : ''
                    }`}
                    onClick={() => setActiveTab('agency')}
                  >
                    Agency Details
                  </Button>
                </div>
                <div className="p-4">
                  <Button
                    variant={activeTab === 'security' ? 'default' : 'ghost'}
                    className={`w-full justify-start ${
                      activeTab === 'security' ? 'bg-hireable-primary hover:bg-hireable-dark' : ''
                    }`}
                    onClick={() => setActiveTab('security')}
                  >
                    Security
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="personal" className="mt-0">
                  <Card>
                    <CardContent className="pt-6">
                      <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
                      
                      <div className="flex flex-col items-start mb-6">
                        <Label className="mb-2">Profile Picture</Label>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-20 w-20">
                            <AvatarImage src={profile.profilePicture} />
                            <AvatarFallback className="bg-hireable-gradient text-2xl text-white">
                              {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <Button
                              variant="outline"
                              className="mb-2"
                              onClick={() => document.getElementById('profile-picture')?.click()}
                            >
                              Change Photo
                            </Button>
                            <input
                              id="profile-picture"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleProfilePictureChange}
                            />
                            <p className="text-xs text-gray-500">Recommended: Square image, at least 400x400px</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">First Name</Label>
                          <Input 
                            id="first-name" 
                            value={profile.firstName} 
                            onChange={(e) => updateProfileField('firstName', e.target.value)} 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Last Name</Label>
                          <Input 
                            id="last-name" 
                            value={profile.lastName} 
                            onChange={(e) => updateProfileField('lastName', e.target.value)} 
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-6">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email"
                          value={profile.email} 
                          onChange={(e) => updateProfileField('email', e.target.value)} 
                        />
                        <p className="text-xs text-gray-500">Changing email will require confirmation from your current email address</p>
                      </div>
                      
                      <div className="space-y-2 mb-6">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          value={profile.phone} 
                          onChange={(e) => updateProfileField('phone', e.target.value)} 
                          placeholder="+44 123 456 7890"
                        />
                      </div>
                      
                      <Button 
                        className="bg-hireable-gradient hover:opacity-90" 
                        onClick={handleSave} 
                        disabled={isSaving}
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="agency" className="mt-0">
                  <Card>
                    <CardContent className="pt-6">
                      <h2 className="text-xl font-semibold mb-6">Agency Details</h2>
                      
                      <div className="space-y-2 mb-6">
                        <Label htmlFor="agency-name">Agency Name</Label>
                        <Input 
                          id="agency-name" 
                          value={profile.agencyName} 
                          onChange={(e) => updateProfileField('agencyName', e.target.value)} 
                        />
                      </div>
                      
                      <div className="flex flex-col items-start mb-6">
                        <Label className="mb-2">Agency Logo</Label>
                        <div className="flex items-center gap-4">
                          <div className="h-20 w-32 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden border">
                            {profile.agencyLogo ? (
                              <img 
                                src={profile.agencyLogo} 
                                alt="Agency Logo" 
                                className="max-h-full max-w-full object-contain" 
                              />
                            ) : (
                              <div className="text-gray-400 text-sm">No logo</div>
                            )}
                          </div>
                          
                          <div>
                            <Button
                              variant="outline"
                              className="mb-2"
                              onClick={() => document.getElementById('agency-logo')?.click()}
                            >
                              Upload Logo
                            </Button>
                            <input
                              id="agency-logo"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleAgencyLogoChange}
                            />
                            <p className="text-xs text-gray-500">Logo will appear on your branded CV exports</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-6">
                        <Label htmlFor="website">Website</Label>
                        <Input 
                          id="website" 
                          value={profile.website || ''} 
                          onChange={(e) => updateProfileField('website', e.target.value)} 
                          placeholder="https://your-agency.com"
                        />
                      </div>
                      
                      <Button 
                        className="bg-hireable-gradient hover:opacity-90" 
                        onClick={handleSave} 
                        disabled={isSaving}
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="security" className="mt-0">
                  <Card>
                    <CardContent className="pt-6">
                      <h2 className="text-xl font-semibold mb-6">Security</h2>
                      
                      <div className="space-y-2 mb-4">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      
                      <div className="space-y-2 mb-6">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                      
                      <Button className="bg-hireable-gradient hover:opacity-90">
                        Update Password
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-4 mt-8">
        <div className="container mx-auto px-4 text-sm text-gray-500 flex justify-between">
          <p>© 2023 Hireable. All rights reserved.</p>
          <div className="space-x-4">
            <a href="#" className="hover:text-gray-700">Privacy Policy</a>
            <a href="#" className="hover:text-gray-700">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Profile;

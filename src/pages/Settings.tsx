
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { GripVertical, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useSettingsContext } from '@/contexts/SettingsContext';

const Settings: React.FC = () => {
  const { settings, updateSettings, setSectionVisibility, saveSettings, isLoading, error } = useSettingsContext();
  const [activeTab, setActiveTab] = useState('sections');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSettings();
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportFormatChange = (format: 'PDF' | 'DOCX') => {
    console.log('Changing export format to:', format);
    updateSettings({ defaultExportFormat: format });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-hireable-primary mb-4" />
            <h2 className="text-xl font-medium text-gray-700">Loading settings...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-medium text-gray-700 mb-4">Error Loading Settings</h2>
            <p className="text-red-500">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-hireable-primary hover:bg-hireable-dark"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Add a safety check to prevent rendering before settings are loaded
  if (!settings || !settings.defaultSectionVisibility) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-hireable-primary mb-4" />
            <h2 className="text-xl font-medium text-gray-700">Initializing settings...</h2>
          </div>
        </div>
      </div>
    );
  }

  const sectionOrder = [
    { key: 'personalInfo', label: 'Personal Information' },
    { key: 'profileStatement', label: 'Professional Summary' },
    { key: 'skills', label: 'Skills' },
    { key: 'experience', label: 'Work Experience' },
    { key: 'education', label: 'Education' },
    { key: 'achievements', label: 'Key Achievements' },
    { key: 'certifications', label: 'Certifications' },
    { key: 'languages', label: 'Languages' },
    { key: 'professionalMemberships', label: 'Professional Memberships' },
    { key: 'publications', label: 'Publications' },
    { key: 'earlierCareer', label: 'Earlier Career' },
    { key: 'additionalDetails', label: 'Additional Details' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600 mb-6">Configure your default CV processing preferences</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-md shadow-sm">
                <div className="p-4 border-b">
                  <Button
                    variant={activeTab === 'sections' ? 'default' : 'ghost'}
                    className={`w-full justify-start ${
                      activeTab === 'sections' ? 'bg-hireable-primary hover:bg-hireable-dark' : ''
                    }`}
                    onClick={() => setActiveTab('sections')}
                  >
                    CV Sections
                  </Button>
                </div>
                <div className="p-4 border-b">
                  <Button
                    variant={activeTab === 'anonymization' ? 'default' : 'ghost'}
                    className={`w-full justify-start ${
                      activeTab === 'anonymization' ? 'bg-hireable-primary hover:bg-hireable-dark' : ''
                    }`}
                    onClick={() => setActiveTab('anonymization')}
                  >
                    Anonymization
                  </Button>
                </div>
                <div className="p-4">
                  <Button
                    variant={activeTab === 'export' ? 'default' : 'ghost'}
                    className={`w-full justify-start ${
                      activeTab === 'export' ? 'bg-hireable-primary hover:bg-hireable-dark' : ''
                    }`}
                    onClick={() => setActiveTab('export')}
                  >
                    Export Format
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="sections" className="mt-0">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">CV Section Arrangement</h2>
                        <Button className="bg-gray-900 hover:bg-gray-800">
                          Save Order
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        {sectionOrder.map((section) => (
                          <div
                            key={section.key}
                            className="flex items-center justify-between p-3 border rounded-md bg-white"
                          >
                            <div className="flex items-center">
                              <div className="cursor-move px-1 mr-2">
                                <GripVertical className="h-5 w-5 text-gray-400" />
                              </div>
                              <Label htmlFor={`section-${section.key}`} className="font-medium">
                                {section.label}
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  className="text-gray-500 hover:text-gray-700"
                                  onClick={() => setSectionVisibility(
                                    section.key as keyof typeof settings.defaultSectionVisibility,
                                    !settings.defaultSectionVisibility[section.key as keyof typeof settings.defaultSectionVisibility]
                                  )}
                                >
                                  {settings.defaultSectionVisibility[section.key as keyof typeof settings.defaultSectionVisibility] ? (
                                    <Eye className="h-4 w-4" />
                                  ) : (
                                    <EyeOff className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                              
                              <Switch
                                id={`section-${section.key}`}
                                checked={settings.defaultSectionVisibility[section.key as keyof typeof settings.defaultSectionVisibility]}
                                onCheckedChange={(checked) => setSectionVisibility(
                                  section.key as keyof typeof settings.defaultSectionVisibility,
                                  checked
                                )}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        className="mt-6 bg-gradient-to-r from-hireable-secondary to-hireable-primary hover:opacity-90" 
                        onClick={handleSave}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save All Settings'
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="anonymization" className="mt-0">
                  <Card>
                    <CardContent className="pt-6">
                      <h2 className="text-xl font-semibold mb-6">Default Anonymization Settings</h2>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="auto-anonymize">Auto-anonymize all CVs</Label>
                            <p className="text-sm text-gray-500">
                              Automatically remove personal information from uploaded CVs
                            </p>
                          </div>
                          <Switch
                            id="auto-anonymize"
                            checked={settings.defaultAnonymize}
                            onCheckedChange={(checked) => updateSettings({ defaultAnonymize: checked })}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="keep-original">Keep original files</Label>
                            <p className="text-sm text-gray-500">
                              Store original CV files alongside anonymized versions
                            </p>
                          </div>
                          <Switch
                            id="keep-original"
                            checked={settings.keepOriginalFiles}
                            onCheckedChange={(checked) => updateSettings({ keepOriginalFiles: checked })}
                          />
                        </div>
                      </div>
                      
                      <Button 
                        className="mt-6 bg-gradient-to-r from-hireable-secondary to-hireable-primary hover:opacity-90" 
                        onClick={handleSave}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save All Settings'
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="export" className="mt-0">
                  <Card>
                    <CardContent className="pt-6">
                      <h2 className="text-xl font-semibold mb-6">Default Export Format</h2>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="pdf-format"
                            checked={settings.defaultExportFormat === 'PDF'}
                            onCheckedChange={() => handleExportFormatChange('PDF')}
                          />
                          <Label htmlFor="pdf-format">PDF</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="docx-format"
                            checked={settings.defaultExportFormat === 'DOCX'}
                            onCheckedChange={() => handleExportFormatChange('DOCX')}
                          />
                          <Label htmlFor="docx-format">DOCX</Label>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-500 mt-2">
                        Select your preferred export format(s) for processed CVs
                      </p>
                      
                      <Button 
                        className="mt-6 bg-gradient-to-r from-hireable-secondary to-hireable-primary hover:opacity-90" 
                        onClick={handleSave}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save All Settings'
                        )}
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

export default Settings;

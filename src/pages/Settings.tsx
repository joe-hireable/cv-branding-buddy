import React, { useState, useRef, useCallback, useEffect } from 'react';
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
import { GripVertical, Eye, EyeOff, Loader2, Sun, Moon, Laptop } from 'lucide-react';
import { useSettingsContext } from '@/contexts/SettingsContext';
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';
import { CustomButton } from '@/components/ui/custom-button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface DragItem {
  index: number;
  id: string;
  type: string;
}

interface SectionItemProps {
  id: string;
  text: string;
  index: number;
  isVisible: boolean;
  moveSection: (dragIndex: number, hoverIndex: number) => void;
  toggleVisibility: (key: string) => void;
  isDraggable?: boolean;
}

const SectionItem = ({ id, text, index, isVisible, moveSection, toggleVisibility, isDraggable = true }: SectionItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: 'section',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current || !isDraggable) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveSection(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'section',
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => isDraggable,
  });

  // Only apply drag and drop refs if the section is draggable
  const dragDropRef = isDraggable ? (ref: HTMLDivElement | null) => {
    drag(drop(ref));
  } : ref;

  return (
    <div
      ref={dragDropRef}
      className={`flex items-center justify-between p-3 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 mb-2 ${
        isDragging ? 'opacity-50 border-dashed border-2 border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-900' : ''
      }`}
      data-handler-id={handlerId}
    >
      <div className="flex items-center">
        {isDraggable && (
          <div className="cursor-move px-1 mr-2">
            <GripVertical className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
        )}
        <Label htmlFor={`section-${id}`} className="font-medium dark:text-white">
          {text}
        </Label>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            onClick={() => toggleVisibility(id)}
          >
            {isVisible ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </button>
        </div>
        
        <Switch
          id={`section-${id}`}
          checked={isVisible}
          onCheckedChange={() => toggleVisibility(id)}
        />
      </div>
    </div>
  );
};

const Settings = () => {
  const { settings, updateSettings, setSectionVisibility, setSectionOrder, saveSettings, isLoading, error, setTheme } = useSettingsContext();
  const [activeTab, setActiveTab] = useState('sections');
  const [isSaving, setIsSaving] = useState(false);
  const [sections, setSections] = useState([
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
  ]);

  useEffect(() => {
    if (settings?.defaultSectionOrder?.sections) {
      const orderedSections = [...sections];
      
      orderedSections.sort((a, b) => {
        const aIndex = settings.defaultSectionOrder.sections.indexOf(a.key);
        const bIndex = settings.defaultSectionOrder.sections.indexOf(b.key);
        return aIndex - bIndex;
      });
      
      setSections(orderedSections);
    }
  }, [settings?.defaultSectionOrder]);

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

  const moveSection = useCallback((dragIndex: number, hoverIndex: number) => {
    setSections((prevSections) => {
      const newSections = [...prevSections];
      const [removed] = newSections.splice(dragIndex, 1);
      newSections.splice(hoverIndex, 0, removed);
      return newSections;
    });
  }, []);

  const toggleSectionVisibility = (key: string) => {
    setSectionVisibility(
      key as keyof typeof settings.defaultSectionVisibility,
      !settings.defaultSectionVisibility[key as keyof typeof settings.defaultSectionVisibility]
    );
  };

  const saveSectionOrder = () => {
    console.log('Saving section order:', sections);
    const sectionKeys = sections.map(section => section.key);
    setSectionOrder(sectionKeys);
    handleSave();
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setTheme(theme);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-hireable-primary mb-4" />
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">Loading settings...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-4">Error Loading Settings</h2>
            <p className="text-red-500 dark:text-red-400">{error}</p>
            <CustomButton 
              variant="primary"
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Retry
            </CustomButton>
          </div>
        </div>
      </div>
    );
  }

  if (!settings || !settings.defaultSectionVisibility) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-hireable-primary mb-4" />
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">Initialising settings...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Configure your default CV processing preferences</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm">
                <div className="p-4 border-b dark:border-gray-700">
                  <CustomButton
                    variant={activeTab === 'sections' ? 'primary' : 'secondary'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('sections')}
                  >
                    CV Sections
                  </CustomButton>
                </div>
                <div className="p-4 border-b dark:border-gray-700">
                  <CustomButton
                    variant={activeTab === 'anonymisation' ? 'primary' : 'secondary'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('anonymisation')}
                  >
                    Anonymisation
                  </CustomButton>
                </div>
                <div className="p-4 border-b dark:border-gray-700">
                  <CustomButton
                    variant={activeTab === 'export' ? 'primary' : 'secondary'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('export')}
                  >
                    Export Format
                  </CustomButton>
                </div>
                <div className="p-4">
                  <CustomButton
                    variant={activeTab === 'appearance' ? 'primary' : 'secondary'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('appearance')}
                  >
                    Appearance
                  </CustomButton>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="sections" className="mt-0">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">CV Section Arrangement</h2>
                        <CustomButton 
                          variant="primary"
                          onClick={saveSectionOrder}
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            'Save Order'
                          )}
                        </CustomButton>
                      </div>
                      
                      <div className="space-y-2">
                        {sections.map((section, index) => (
                          <SectionItem
                            key={section.key}
                            id={section.key}
                            text={section.label}
                            index={index}
                            isVisible={settings.defaultSectionVisibility[section.key as keyof typeof settings.defaultSectionVisibility]}
                            moveSection={moveSection}
                            toggleVisibility={toggleSectionVisibility}
                            isDraggable={section.key !== 'personalInfo'}
                          />
                        ))}
                      </div>
                      
                      <CustomButton 
                        variant="primary"
                        className="mt-6" 
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
                      </CustomButton>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="anonymisation" className="mt-0">
                  <Card>
                    <CardContent className="pt-6">
                      <h2 className="text-xl font-semibold mb-6">Default Anonymisation Settings</h2>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="auto-anonymise">Auto-anonymise all CVs</Label>
                            <p className="text-sm text-gray-500">
                              Automatically anonymise personal information in all uploaded CVs
                            </p>
                          </div>
                          <Switch
                            id="auto-anonymise"
                            checked={settings.defaultAnonymise}
                            onCheckedChange={(checked) => updateSettings({ defaultAnonymise: checked })}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="keep-original">Keep original files</Label>
                            <p className="text-sm text-gray-500">
                              Store original CV files alongside anonymised versions
                            </p>
                          </div>
                          <Switch
                            id="keep-original"
                            checked={settings.keepOriginalFiles}
                            onCheckedChange={(checked) => updateSettings({ keepOriginalFiles: checked })}
                          />
                        </div>
                      </div>
                      
                      <CustomButton 
                        variant="primary"
                        className="mt-6" 
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
                      </CustomButton>
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
                        Choose your preferred format for exporting CVs
                      </p>
                      
                      <CustomButton 
                        variant="primary"
                        className="mt-6" 
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
                      </CustomButton>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="appearance" className="mt-0">
                  <Card>
                    <CardContent className="pt-6">
                      <h2 className="text-xl font-semibold mb-6 dark:text-white">Appearance Settings</h2>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium dark:text-gray-200">Theme</h3>
                        <RadioGroup 
                          defaultValue={settings.theme} 
                          onValueChange={(value) => handleThemeChange(value as 'light' | 'dark' | 'system')}
                          className="flex flex-col space-y-3"
                        >
                          <div className="flex items-center space-x-2 rounded-md border p-4 dark:border-gray-700">
                            <RadioGroupItem value="light" id="theme-light" />
                            <Sun className="h-5 w-5 text-orange-500 mr-2" />
                            <Label htmlFor="theme-light" className="flex-1">
                              <div className="font-medium dark:text-white">Light</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">Use light theme</div>
                            </Label>
                          </div>
                          
                          <div className="flex items-center space-x-2 rounded-md border p-4 dark:border-gray-700">
                            <RadioGroupItem value="dark" id="theme-dark" />
                            <Moon className="h-5 w-5 text-indigo-500 mr-2" />
                            <Label htmlFor="theme-dark" className="flex-1">
                              <div className="font-medium dark:text-white">Dark</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">Use dark theme</div>
                            </Label>
                          </div>
                          
                          <div className="flex items-center space-x-2 rounded-md border p-4 dark:border-gray-700">
                            <RadioGroupItem value="system" id="theme-system" />
                            <Laptop className="h-5 w-5 text-gray-500 mr-2" />
                            <Label htmlFor="theme-system" className="flex-1">
                              <div className="font-medium dark:text-white">System</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">Follow system preference</div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <CustomButton 
                        variant="primary"
                        className="mt-6" 
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
                      </CustomButton>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t dark:border-gray-800 py-4 mt-8">
        <div className="container mx-auto px-4 text-sm text-gray-500 dark:text-gray-400 flex justify-between">
          <span>© 2024 CV Branding Buddy. All rights reserved.</span>
          <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Privacy Policy</a>
          <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default Settings;

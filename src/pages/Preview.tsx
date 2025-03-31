import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import CVSection from '@/components/CVSection';
import CVPreview from '@/components/CVPreview';
import ChatEditor from '@/components/ChatEditor';
import { useCVContext } from '@/contexts/CVContext';
import { useRecruiterContext } from '@/contexts/RecruiterContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { DownloadCloud, MessageSquareText } from 'lucide-react';
import { 
  optimizeProfileStatement, 
  optimizeSkills, 
  optimizeAchievements,
  optimizeExperience,
  generateDocument 
} from '@/services/api';
import { toast } from '@/components/ui/use-toast';

const Preview: React.FC = () => {
  const [isOptimizingProfileStatement, setIsOptimizingProfileStatement] = useState(false);
  const [isOptimizingSkills, setIsOptimizingSkills] = useState(false);
  const [isOptimizingAchievements, setIsOptimizingAchievements] = useState(false);
  const [optimizingExperienceIndex, setOptimizingExperienceIndex] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const {
    cv,
    sectionVisibility,
    sectionOrder,
    isAnonymized,
    updateCvField,
    setSectionVisibility,
    setSectionOrder,
    setIsAnonymized,
  } = useCVContext();
  
  const { profile } = useRecruiterContext();
  const navigate = useNavigate();

  const moveSection = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const draggedSection = sectionOrder.sections[dragIndex];
      const newSections = [...sectionOrder.sections];
      newSections.splice(dragIndex, 1);
      newSections.splice(hoverIndex, 0, draggedSection);
      setSectionOrder(newSections);
    },
    [sectionOrder, setSectionOrder]
  );

  const handleOptimizeProfileStatement = async () => {
    if (!cv) return;
    
    setIsOptimizingProfileStatement(true);
    
    try {
      const response = await optimizeProfileStatement('mock-cv-id');
      
      if (response.status === 'success') {
        updateCvField('profileStatement', response.data.optimizedText);
        toast({
          title: "Profile statement optimized",
          description: response.data.feedback,
        });
      } else {
        throw new Error(response.errors?.[0] || 'Failed to optimize profile statement');
      }
    } catch (error) {
      toast({
        title: "Optimization failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsOptimizingProfileStatement(false);
    }
  };

  const handleOptimizeSkills = async () => {
    if (!cv) return;
    
    setIsOptimizingSkills(true);
    
    try {
      const response = await optimizeSkills('mock-cv-id');
      
      if (response.status === 'success') {
        updateCvField('skills', response.data.optimizedSkills);
        toast({
          title: "Skills optimized",
          description: response.data.feedback,
        });
      } else {
        throw new Error(response.errors?.[0] || 'Failed to optimize skills');
      }
    } catch (error) {
      toast({
        title: "Optimization failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsOptimizingSkills(false);
    }
  };

  const handleOptimizeAchievements = async () => {
    if (!cv) return;
    
    setIsOptimizingAchievements(true);
    
    try {
      const response = await optimizeAchievements('mock-cv-id');
      
      if (response.status === 'success') {
        updateCvField('achievements', response.data.optimizedAchievements);
        toast({
          title: "Achievements optimized",
          description: response.data.feedback,
        });
      } else {
        throw new Error(response.errors?.[0] || 'Failed to optimize achievements');
      }
    } catch (error) {
      toast({
        title: "Optimization failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsOptimizingAchievements(false);
    }
  };

  const handleOptimizeExperience = async (index: number) => {
    if (!cv) return;
    
    setOptimizingExperienceIndex(index);
    
    try {
      const response = await optimizeExperience('mock-cv-id', index);
      
      if (response.status === 'success') {
        const updatedExperiences = [...cv.experience];
        updatedExperiences[index] = {
          ...updatedExperiences[index],
          highlights: response.data.optimizedExperience.highlights,
        };
        
        updateCvField('experience', updatedExperiences);
        toast({
          title: "Experience optimized",
          description: response.data.feedback,
        });
      } else {
        throw new Error(response.errors?.[0] || 'Failed to optimize experience');
      }
    } catch (error) {
      toast({
        title: "Optimization failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setOptimizingExperienceIndex(null);
    }
  };

  const handleExport = async (format: 'PDF' | 'DOCX') => {
    if (!cv || !profile) return;
    
    setIsExporting(true);
    
    try {
      const documentUrl = await generateDocument(cv, format, profile);
      
      toast({
        title: `CV exported as ${format}`,
        description: "Your document has been generated successfully.",
      });
      
      // In a real app, we would trigger the download here
      window.open(documentUrl, '_blank');
    } catch (error) {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (!cv) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-medium text-gray-700">No CV data available</h2>
            <p className="text-gray-500 mt-2">Please upload a CV to preview and optimize it.</p>
            <Button 
              className="mt-4 bg-hireable-gradient hover:opacity-90"
              onClick={() => navigate('/')}
            >
              Upload CV
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">CV Preview</h1>
            <p className="text-gray-600 text-sm">Drag sections to reorder • Click section icons to edit or hide</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="anonymize"
                checked={isAnonymized}
                onCheckedChange={setIsAnonymized}
              />
              <Label htmlFor="anonymize">Anonymize</Label>
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <DownloadCloud className="h-4 w-4" /> Export
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Export CV</SheetTitle>
                  <SheetDescription>
                    Choose a format to export the CV. The document will be generated with your agency branding.
                  </SheetDescription>
                </SheetHeader>
                
                <div className="space-y-4 mt-6">
                  <Button
                    onClick={() => handleExport('PDF')}
                    className="w-full bg-hireable-gradient hover:opacity-90"
                    disabled={isExporting}
                  >
                    <DownloadCloud className="mr-2 h-4 w-4" /> 
                    {isExporting ? 'Generating...' : 'Export as PDF'}
                  </Button>
                  
                  <Button
                    onClick={() => handleExport('DOCX')}
                    variant="outline"
                    className="w-full"
                    disabled={isExporting}
                  >
                    <DownloadCloud className="mr-2 h-4 w-4" /> 
                    {isExporting ? 'Generating...' : 'Export as DOCX'}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Sections to drag and arrange */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-md shadow-sm p-4 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-medium">CV Sections</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsChatOpen(!isChatOpen)}
                  className="text-hireable-primary"
                >
                  <MessageSquareText className="h-4 w-4 mr-1" />
                  Edit with Chat
                </Button>
              </div>
              
              {isChatOpen && (
                <div className="mb-4">
                  <ChatEditor onClose={() => setIsChatOpen(false)} />
                </div>
              )}
              
              <div className="space-y-3">
                {sectionOrder.sections.map((sectionKey, index) => {
                  let sectionTitle = '';
                  let sectionContent = null;
                  let canOptimize = false;
                  const isVisible = sectionVisibility[sectionKey as keyof typeof sectionVisibility];
                  
                  switch(sectionKey) {
                    case 'personalInfo':
                      sectionTitle = 'Personal Information';
                      sectionContent = (
                        <div className="text-sm">
                          <p className="font-medium">Name</p>
                          <p className="text-gray-500">{isAnonymized ? '[Anonymized]' : `${cv.firstName || ''} ${cv.surname || ''}`}</p>
                          
                          <p className="font-medium mt-2">Contact</p>
                          <p className="text-gray-500">{isAnonymized ? '[Hidden]' : (cv.email || cv.phone || 'No contact info')}</p>
                        </div>
                      );
                      break;
                    
                    case 'profileStatement':
                      sectionTitle = 'Professional Summary';
                      canOptimize = true;
                      sectionContent = (
                        <p className="text-sm text-gray-600 line-clamp-3">{cv.profileStatement}</p>
                      );
                      break;
                    
                    case 'skills':
                      sectionTitle = 'Skills';
                      canOptimize = true;
                      sectionContent = (
                        <div className="flex flex-wrap gap-1">
                          {cv.skills.slice(0, 3).map((skill, idx) => (
                            <div key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {skill.name}
                            </div>
                          ))}
                          {cv.skills.length > 3 && (
                            <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                              +{cv.skills.length - 3} more
                            </div>
                          )}
                        </div>
                      );
                      break;
                    
                    case 'experience':
                      sectionTitle = 'Work Experience';
                      sectionContent = (
                        <div className="space-y-2">
                          {cv.experience.map((exp, idx) => (
                            <div key={idx} className="text-sm">
                              <div className="flex justify-between">
                                <p className="font-medium">{exp.title}</p>
                                <Button
                                  variant="ghost" 
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => handleOptimizeExperience(idx)}
                                  disabled={optimizingExperienceIndex === idx}
                                >
                                  {optimizingExperienceIndex === idx ? 'Optimizing...' : 'Optimize'}
                                </Button>
                              </div>
                              <p className="text-gray-500 text-xs">{exp.company}</p>
                            </div>
                          ))}
                        </div>
                      );
                      break;
                    
                    case 'achievements':
                      sectionTitle = 'Key Achievements';
                      canOptimize = true;
                      sectionContent = (
                        <ul className="text-sm text-gray-600 ml-4 list-disc">
                          {cv.achievements.slice(0, 2).map((achievement, idx) => (
                            <li key={idx} className="line-clamp-1">{achievement}</li>
                          ))}
                          {cv.achievements.length > 2 && (
                            <li className="text-gray-400">+{cv.achievements.length - 2} more achievements</li>
                          )}
                        </ul>
                      );
                      break;
                    
                    case 'education':
                      sectionTitle = 'Education';
                      sectionContent = (
                        <div className="text-sm">
                          {cv.education && cv.education.map((edu, idx) => (
                            <div key={idx} className="mb-1">
                              <p className="font-medium">{edu.institution}</p>
                              {edu.qualifications && edu.qualifications[0] && (
                                <p className="text-gray-500 text-xs">
                                  {edu.qualifications[0].qualification} in {edu.qualifications[0].course}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      );
                      break;
                    
                    default:
                      sectionTitle = sectionKey
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, str => str.toUpperCase());
                      sectionContent = (
                        <p className="text-sm text-gray-500">Section preview not available</p>
                      );
                  }
                  
                  return (
                    <CVSection
                      key={sectionKey}
                      id={sectionKey}
                      title={sectionTitle}
                      isVisible={isVisible}
                      onVisibilityToggle={() => setSectionVisibility(
                        sectionKey as keyof typeof sectionVisibility,
                        !isVisible
                      )}
                      onOptimize={
                        canOptimize
                          ? sectionKey === 'profileStatement'
                            ? handleOptimizeProfileStatement
                            : sectionKey === 'skills'
                              ? handleOptimizeSkills
                              : sectionKey === 'achievements'
                                ? handleOptimizeAchievements
                                : undefined
                          : undefined
                      }
                      isOptimizing={
                        (sectionKey === 'profileStatement' && isOptimizingProfileStatement) ||
                        (sectionKey === 'skills' && isOptimizingSkills) ||
                        (sectionKey === 'achievements' && isOptimizingAchievements)
                      }
                      index={index}
                      moveSection={moveSection}
                    >
                      {sectionContent}
                    </CVSection>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Right column - CV Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-md shadow-sm p-6">
              <CVPreview 
                cv={cv} 
                isAnonymized={isAnonymized} 
                sectionVisibility={sectionVisibility}
                sectionOrder={sectionOrder.sections}
              />
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-4">
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

export default Preview;

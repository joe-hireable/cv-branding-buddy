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
import { cvParserService } from '@/services/cvParserApi';
import { toast } from '@/components/ui/use-toast';

const Preview = (): JSX.Element => {
  const [isOptimizingProfileStatement, setIsOptimizingProfileStatement] = useState(false);
  const [isOptimizingSkills, setIsOptimizingSkills] = useState(false);
  const [isOptimizingAchievements, setIsOptimizingAchievements] = useState(false);
  const [optimizingExperienceIndex, setOptimizingExperienceIndex] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Add state for tracking original and optimized content
  const [optimizedContent, setOptimizedContent] = useState<{
    profileStatement?: { original: string; optimized: string; feedback: string };
    skills?: { original: any[]; optimized: any[]; feedback: string };
    achievements?: { original: string[]; optimized: string[]; feedback: string };
    experience?: { [key: number]: { original: any; optimized: any; feedback: string } };
  }>({});
  
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

  const formatFeedback = (feedback: any): string => {
    if (!feedback) return 'Operation completed successfully';
    if (typeof feedback === 'string') return feedback;
    if (feedback.strengths && feedback.areas_to_improve) {
      const strengthsText = Array.isArray(feedback.strengths) 
        ? feedback.strengths.join(', ') 
        : feedback.strengths;
      const areasToImproveText = Array.isArray(feedback.areas_to_improve) 
        ? feedback.areas_to_improve.join(', ') 
        : feedback.areas_to_improve;
      return `Strengths: ${strengthsText}\nAreas to improve: ${areasToImproveText}`;
    }
    return 'Operation completed successfully';
  };

  const handleOptimizeProfileStatement = async () => {
    if (!cv) {
      toast({
        title: "Optimisation failed",
        description: "No CV data available. Please upload a CV first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsOptimizingProfileStatement(true);
    
    try {
      // If we have a CV file in the context, use it
      const cvInput = cv.file || cv.id;
      if (!cvInput) {
        throw new Error('No CV file or ID available');
      }

      // Log the request parameters for debugging
      console.debug('Optimizing profile statement with:', {
        cvType: cvInput instanceof File ? 'file' : 'id',
        hasJobDescription: !!cv.jobDescription
      });

      const response = await optimizeProfileStatement(
        cvInput,
        cv.jobDescription // Pass job description if available
      );
      
      console.debug('Profile statement optimization response:', response);
      
      if (response.status === 'success') {
        // Check if we have the optimized text
        const optimizedText = response.data?.optimizedText;
        
        if (!optimizedText) {
          console.error('Response missing optimizedText:', response);
          throw new Error('Failed to optimise profile statement: Missing optimized text in response');
        }
        
        // Store both original and optimized content
        setOptimizedContent(prev => ({
          ...prev,
          profileStatement: {
            original: cv.profileStatement,
            optimized: optimizedText,
            feedback: formatFeedback(response.data?.feedback)
          }
        }));
        
        toast({
          title: "Profile statement optimised",
          description: formatFeedback(response.data?.feedback),
        });
      } else {
        throw new Error(response.errors?.[0] || 'Failed to optimise profile statement: Invalid response format');
      }
    } catch (error) {
      console.error('Profile statement optimization error:', error);
      
      // Provide more specific error messages based on the error type
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An unexpected error occurred while optimising the profile statement";
      
      toast({
        title: "Optimisation failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsOptimizingProfileStatement(false);
    }
  };

  const handleOptimizeSkills = async () => {
    if (!cv) {
      toast({
        title: "Optimisation failed",
        description: "No CV data available. Please upload a CV first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsOptimizingSkills(true);
    
    try {
      const cvInput = cv.file || cv.id;
      if (!cvInput) {
        throw new Error('No CV file or ID available');
      }

      // Log the request parameters for debugging
      console.debug('Optimizing skills with:', {
        cvType: cvInput instanceof File ? 'file' : 'id',
        hasJobDescription: !!cv.jobDescription
      });

      const response = await optimizeSkills(
        cvInput,
        cv.jobDescription
      );
      
      console.debug('Skills optimization response:', response);
      
      if (response.status === 'success') {
        // Check if we have the optimized skills
        const optimizedSkills = response.data?.optimizedSkills;
        
        if (!optimizedSkills) {
          console.error('Response missing optimizedSkills:', response);
          throw new Error('Failed to optimise skills: Missing optimized skills in response');
        }
        
        // Store both original and optimized content
        setOptimizedContent(prev => ({
          ...prev,
          skills: {
            original: cv.skills,
            optimized: optimizedSkills,
            feedback: formatFeedback(response.data?.feedback)
          }
        }));
        
        toast({
          title: "Skills optimised",
          description: formatFeedback(response.data?.feedback),
        });
      } else {
        throw new Error(response.errors?.[0] || 'Failed to optimise skills: Invalid response format');
      }
    } catch (error) {
      console.error('Skills optimization error:', error);
      
      // Provide more specific error messages based on the error type
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An unexpected error occurred while optimising the skills";
      
      toast({
        title: "Optimisation failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsOptimizingSkills(false);
    }
  };

  const handleOptimizeAchievements = async () => {
    if (!cv) {
      toast({
        title: "Optimisation failed",
        description: "No CV data available. Please upload a CV first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsOptimizingAchievements(true);
    
    try {
      const cvInput = cv.file || cv.id;
      if (!cvInput) {
        throw new Error('No CV file or ID available');
      }

      // Log the request parameters for debugging
      console.debug('Optimizing achievements with:', {
        cvType: cvInput instanceof File ? 'file' : 'id',
        hasJobDescription: !!cv.jobDescription
      });

      const response = await optimizeAchievements(
        cvInput,
        cv.jobDescription
      );
      
      console.debug('Achievements optimization response:', response);
      
      if (response.status === 'success') {
        // Check if we have the optimized achievements
        const optimizedAchievements = response.data?.optimizedAchievements;
        
        if (!optimizedAchievements) {
          console.error('Response missing optimizedAchievements:', response);
          throw new Error('Failed to optimise achievements: Missing optimized achievements in response');
        }
        
        // Store both original and optimized content
        setOptimizedContent(prev => ({
          ...prev,
          achievements: {
            original: cv.achievements,
            optimized: optimizedAchievements,
            feedback: formatFeedback(response.data?.feedback)
          }
        }));
        
        toast({
          title: "Achievements optimised",
          description: formatFeedback(response.data?.feedback),
        });
      } else {
        throw new Error(response.errors?.[0] || 'Failed to optimise achievements: Invalid response format');
      }
    } catch (error) {
      console.error('Achievements optimization error:', error);
      
      // Provide more specific error messages based on the error type
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An unexpected error occurred while optimising the achievements";
      
      toast({
        title: "Optimisation failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsOptimizingAchievements(false);
    }
  };

  const handleOptimizeExperience = async (experienceIndex: number) => {
    if (!cv) {
      toast({
        title: "Optimisation failed",
        description: "No CV data available. Please upload a CV first.",
        variant: "destructive",
      });
      return;
    }

    setOptimizingExperienceIndex(experienceIndex);

    try {
      const response = await cvParserService.optimizeExperience(cv.file || cv.id, experienceIndex);
      
      if (response.status === "success") {
        setOptimizedContent((prev) => ({
          ...prev,
          experience: {
            ...prev.experience,
            [experienceIndex]: {
              original: cv.experience[experienceIndex],
              optimized: {
                ...cv.experience[experienceIndex],
                summary: response.data.optimizedExperience?.summary || response.data.data?.summary || '',
                highlights: response.data.optimizedExperience?.highlights || response.data.data?.highlights || []
              },
              feedback: formatFeedback(response.data.feedback)
            }
          }
        }));
      } else {
        toast({
          title: "Optimisation failed",
          description: response.errors?.[0] || "Failed to optimise experience",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Optimisation failed",
        description: "An error occurred while optimising the experience",
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

  const handleAcceptChange = (section: string, index?: number) => {
    if (!cv) return;

    switch (section) {
      case 'profileStatement':
        if (optimizedContent.profileStatement) {
          updateCvField('profileStatement', optimizedContent.profileStatement.optimized);
          setOptimizedContent(prev => ({ ...prev, profileStatement: undefined }));
        }
        break;
      case 'skills':
        if (optimizedContent.skills) {
          updateCvField('skills', optimizedContent.skills.optimized);
          setOptimizedContent(prev => ({ ...prev, skills: undefined }));
        }
        break;
      case 'achievements':
        if (optimizedContent.achievements) {
          updateCvField('achievements', optimizedContent.achievements.optimized);
          setOptimizedContent(prev => ({ ...prev, achievements: undefined }));
        }
        break;
      case 'experience':
        if (index !== undefined && optimizedContent.experience?.[index]) {
          const updatedExperiences = [...cv.experience];
          updatedExperiences[index] = {
            ...updatedExperiences[index],
            highlights: optimizedContent.experience[index].optimized.highlights,
          };
          updateCvField('experience', updatedExperiences);
          setOptimizedContent(prev => ({
            ...prev,
            experience: {
              ...prev.experience,
              [index]: undefined
            }
          }));
        }
        break;
    }
  };

  const handleRevertChange = (section: string, index?: number) => {
    switch (section) {
      case 'profileStatement':
        setOptimizedContent(prev => ({ ...prev, profileStatement: undefined }));
        break;
      case 'skills':
        setOptimizedContent(prev => ({ ...prev, skills: undefined }));
        break;
      case 'achievements':
        setOptimizedContent(prev => ({ ...prev, achievements: undefined }));
        break;
      case 'experience':
        if (index !== undefined) {
          setOptimizedContent(prev => ({
            ...prev,
            experience: {
              ...prev.experience,
              [index]: undefined
            }
          }));
        }
        break;
    }
  };

  const renderSectionContent = (sectionKey: string, index?: number) => {
    switch(sectionKey) {
      case 'profileStatement':
        return (
          <div className="space-y-4">
            <div className="text-sm">
              <h4 className="font-medium mb-2">Current Content:</h4>
              <p className="text-gray-600">{cv.profileStatement}</p>
            </div>
            {optimizedContent.profileStatement && (
              <div className="space-y-2">
                <h4 className="font-medium">Suggested Changes:</h4>
                <p className="text-gray-600">{optimizedContent.profileStatement.optimized}</p>
                <p className="text-sm text-gray-500">{optimizedContent.profileStatement.feedback}</p>
                <div className="flex space-x-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleAcceptChange('profileStatement')}
                  >
                    Accept Changes
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRevertChange('profileStatement')}
                  >
                    Revert
                  </Button>
                </div>
              </div>
            )}
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-4">
            <div className="text-sm">
              <h4 className="font-medium mb-2">Current Skills:</h4>
              <div className="flex flex-wrap gap-1">
                {cv.skills.map((skill, idx) => (
                  <div key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
            {optimizedContent.skills && (
              <div className="space-y-2">
                <h4 className="font-medium">Suggested Skills:</h4>
                <div className="flex flex-wrap gap-1">
                  {optimizedContent.skills.optimized.map((skill, idx) => (
                    <div key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {skill.name}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500">{optimizedContent.skills.feedback}</p>
                <div className="flex space-x-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleAcceptChange('skills')}
                  >
                    Accept Changes
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRevertChange('skills')}
                  >
                    Revert
                  </Button>
                </div>
              </div>
            )}
          </div>
        );

      case 'achievements':
        return (
          <div className="space-y-4">
            <div className="text-sm">
              <h4 className="font-medium mb-2">Current Achievements:</h4>
              <ul className="list-disc pl-5 text-gray-600">
                {cv.achievements.map((achievement, idx) => (
                  <li key={idx}>{achievement}</li>
                ))}
              </ul>
            </div>
            {optimizedContent.achievements && (
              <div className="space-y-2">
                <h4 className="font-medium">Suggested Achievements:</h4>
                <ul className="list-disc pl-5 text-gray-600">
                  {optimizedContent.achievements.optimized.map((achievement, idx) => (
                    <li key={idx}>{achievement}</li>
                  ))}
                </ul>
                <p className="text-sm text-gray-500">{optimizedContent.achievements.feedback}</p>
                <div className="flex space-x-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleAcceptChange('achievements')}
                  >
                    Accept Changes
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRevertChange('achievements')}
                  >
                    Revert
                  </Button>
                </div>
              </div>
            )}
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-4">
            {cv.experience.map((exp, idx) => (
              <div key={idx} className="space-y-4">
                <div className="text-sm">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{exp.title}</h4>
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
                  <ul className="list-disc pl-5 text-gray-600 mt-2">
                    {exp.highlights && exp.highlights.map((highlight, hIdx) => (
                      <li key={hIdx}>{highlight}</li>
                    ))}
                  </ul>
                </div>
                {optimizedContent.experience?.[idx] && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Suggested Changes:</h4>
                    <ul className="list-disc pl-5 text-gray-600">
                      {optimizedContent.experience[idx].optimized.highlights && 
                        optimizedContent.experience[idx].optimized.highlights.map((highlight, hIdx) => (
                          <li key={hIdx}>{highlight}</li>
                        ))}
                    </ul>
                    <p className="text-sm text-gray-500">{optimizedContent.experience[idx].feedback}</p>
                    <div className="flex space-x-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleAcceptChange('experience', idx)}
                      >
                        Accept Changes
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRevertChange('experience', idx)}
                      >
                        Revert
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      default:
        return null;
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
                  let canOptimize = false;
                  const isVisible = sectionVisibility[sectionKey as keyof typeof sectionVisibility];
                  
                  switch(sectionKey) {
                    case 'personalInfo':
                      sectionTitle = 'Personal Information';
                      break;
                    case 'profileStatement':
                      sectionTitle = 'Professional Summary';
                      canOptimize = true;
                      break;
                    case 'skills':
                      sectionTitle = 'Skills';
                      canOptimize = true;
                      break;
                    case 'experience':
                      sectionTitle = 'Work Experience';
                      break;
                    case 'achievements':
                      sectionTitle = 'Key Achievements';
                      canOptimize = true;
                      break;
                    case 'education':
                      sectionTitle = 'Education';
                      break;
                    default:
                      sectionTitle = sectionKey
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, str => str.toUpperCase());
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
                      {renderSectionContent(sectionKey)}
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

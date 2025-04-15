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
import { DownloadCloud, MessageSquareText, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import { 
  optimiseProfileStatement, 
  optimiseSkills, 
  optimiseAchievements,
  optimiseExperience,
  generateDocument 
} from '@/services/api';
import { cvParserService } from '@/services/cvParserApi';
import { toast } from '@/components/ui/use-toast';
import { 
  GradientText,
  GradientButton,
  SecondaryGradientButton,
  GradientBadge
} from '@/components/ui/brand-components';
import { GradientSwitch } from '@/components/ui/gradient-form-components';
import { Card } from '@/components/ui/card';

const Preview = (): JSX.Element => {
  const [isOptimisingProfileStatement, setIsOptimisingProfileStatement] = useState(false);
  const [isOptimisingSkills, setIsOptimisingSkills] = useState(false);
  const [isOptimisingAchievements, setIsOptimisingAchievements] = useState(false);
  const [optimisingExperienceIndex, setOptimisingExperienceIndex] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Add state for tracking original and optimised content
  const [optimisedContent, setOptimisedContent] = useState<{
    profileStatement?: { original: string; optimised: string; feedback: string };
    skills?: { original: any[]; optimised: any[]; feedback: string };
    achievements?: { original: string[]; optimised: string[]; feedback: string };
    experience?: { [key: number]: { original: any; optimised: any; feedback: string } };
  }>({});
  
  const {
    cv,
    sectionVisibility,
    sectionOrder,
    isAnonymised,
    updateCvField,
    setSectionVisibility,
    setSectionOrder,
    setIsAnonymised,
  } = useCVContext();
  
  const { profile } = useRecruiterContext();
  const navigate = useNavigate();

  const moveSection = useCallback((dragIndex: number, hoverIndex: number) => {
    // Get only non-personal info sections
    const draggableSections = sectionOrder.sections.filter(key => key !== 'personalInfo');
    
    // Get the sections being dragged and where it's being moved to
    const draggedSection = draggableSections[dragIndex];
    const newSections = [...draggableSections];
    
    // Remove from old position and insert at new position
    newSections.splice(dragIndex, 1);
    newSections.splice(hoverIndex, 0, draggedSection);
    
    // Update the section order while preserving personalInfo if it exists
    const personalInfoSection = sectionOrder.sections.find(key => key === 'personalInfo');
    const finalOrder = personalInfoSection 
      ? [personalInfoSection, ...newSections]
      : newSections;
    
    setSectionOrder(finalOrder);
  }, [sectionOrder, setSectionOrder]);

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

  const handleOptimiseProfileStatement = async () => {
    if (!cv) {
      toast({
        title: "Optimisation failed",
        description: "No CV data available. Please upload a CV first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsOptimisingProfileStatement(true);
    
    try {
      console.debug('Optimising profile statement with:', cv.profileStatement);
      
      const response = await optimiseProfileStatement(cv.profileStatement);
      
      if (response.status === 'success') {
        // Check if we have the optimised text
        const optimisedText = response.data?.optimisedText;
        
        if (!optimisedText) {
          console.error('Response missing optimisedText:', response);
          throw new Error('Failed to optimise profile statement: Missing optimised text in response');
        }
        
        // Store both original and optimised content
        setOptimisedContent(prev => ({
          ...prev,
          profileStatement: {
            original: cv.profileStatement,
            optimised: optimisedText,
            feedback: formatFeedback(response.data?.feedback)
          }
        }));
        
        toast({
          title: "Profile Statement Optimised",
          description: "Your profile statement has been enhanced.",
        });
      }
    } catch (error) {
      console.error('Error optimising profile statement:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to optimise profile statement. Please try again.",
      });
    } finally {
      setIsOptimisingProfileStatement(false);
    }
  };

  const handleOptimiseSkills = async () => {
    if (!cv?.skills?.length) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No skills found to optimise.",
      });
      return;
    }
    
    setIsOptimisingSkills(true);
    
    try {
      console.debug('Optimising skills:', cv.skills);
      
      const response = await optimiseSkills(cv.skills);
      
      if (response.status === 'success') {
        setOptimisedContent(prev => ({
          ...prev,
          skills: {
            original: cv.skills,
            optimised: response.data.optimisedSkills,
            feedback: formatFeedback(response.data?.feedback)
          }
        }));
        
        toast({
          title: "Skills Optimised",
          description: "Your skills have been enhanced.",
        });
      }
    } catch (error) {
      console.error('Error optimising skills:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to optimise skills. Please try again.",
      });
    } finally {
      setIsOptimisingSkills(false);
    }
  };

  const handleOptimiseAchievements = async () => {
    if (!cv?.achievements?.length) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No achievements found to optimise.",
      });
      return;
    }
    
    setIsOptimisingAchievements(true);
    
    try {
      console.debug('Optimising achievements:', cv.achievements);
      
      const response = await optimiseAchievements(cv.achievements);
      
      if (response.status === 'success') {
        setOptimisedContent(prev => ({
          ...prev,
          achievements: {
            original: cv.achievements,
            optimised: response.data.optimisedAchievements,
            feedback: formatFeedback(response.data?.feedback)
          }
        }));
        
        toast({
          title: "Achievements Optimised",
          description: "Your achievements have been enhanced.",
        });
      }
    } catch (error) {
      console.error('Error optimising achievements:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to optimise achievements. Please try again.",
      });
    } finally {
      setIsOptimisingAchievements(false);
    }
  };

  const handleOptimiseExperience = async (index: number) => {
    if (!cv?.experience?.[index]) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No experience found to optimise.",
      });
      return;
    }
    
    setOptimisingExperienceIndex(index);
    
    try {
      console.debug('Optimising experience:', cv.experience[index]);
      
      const response = await optimiseExperience(cv.experience[index]);
      
      if (response.status === 'success') {
        setOptimisedContent(prev => ({
          ...prev,
          experience: {
            ...prev.experience,
            [index]: {
              original: cv.experience[index],
              optimised: response.data.optimisedExperience,
              feedback: formatFeedback(response.data?.feedback)
            }
          }
        }));
        
        toast({
          title: "Experience Optimised",
          description: "Your experience has been enhanced.",
        });
      }
    } catch (error) {
      console.error('Error optimising experience:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to optimise experience. Please try again.",
      });
    } finally {
      setOptimisingExperienceIndex(null);
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
          setOptimisedContent(prev => ({ ...prev, profileStatement: undefined }));
        }
        break;
      case 'skills':
        if (optimizedContent.skills) {
          updateCvField('skills', optimizedContent.skills.optimized);
          setOptimisedContent(prev => ({ ...prev, skills: undefined }));
        }
        break;
      case 'achievements':
        if (optimizedContent.achievements) {
          updateCvField('achievements', optimizedContent.achievements.optimized);
          setOptimisedContent(prev => ({ ...prev, achievements: undefined }));
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
          setOptimisedContent(prev => ({
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
        setOptimisedContent(prev => ({ ...prev, profileStatement: undefined }));
        break;
      case 'skills':
        setOptimisedContent(prev => ({ ...prev, skills: undefined }));
        break;
      case 'achievements':
        setOptimisedContent(prev => ({ ...prev, achievements: undefined }));
        break;
      case 'experience':
        if (index !== undefined) {
          setOptimisedContent(prev => ({
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
              <h4 className="font-medium mb-2 text-foreground">Current Content:</h4>
              <p className="text-muted-foreground">{cv.profileStatement}</p>
            </div>
            {optimisedContent.profileStatement && (
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Suggested Changes:</h4>
                <p className="text-muted-foreground">{optimisedContent.profileStatement.optimized}</p>
                <p className="text-sm text-muted-foreground">{optimisedContent.profileStatement.feedback}</p>
                <div className="flex space-x-2">
                  <GradientButton
                    size="sm"
                    onClick={() => handleAcceptChange('profileStatement')}
                  >
                    Accept Changes
                  </GradientButton>
                  <SecondaryGradientButton
                    size="sm"
                    onClick={() => handleRevertChange('profileStatement')}
                  >
                    Revert
                  </SecondaryGradientButton>
                </div>
              </div>
            )}
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-4">
            <div className="text-sm">
              <h4 className="font-medium mb-2 text-foreground">Current Skills:</h4>
              <div className="flex flex-wrap gap-1">
                {cv.skills.map((skill, idx) => (
                  <GradientBadge key={idx} variant="outline">
                    {skill.name}
                  </GradientBadge>
                ))}
              </div>
            </div>
            {optimisedContent.skills && (
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Suggested Skills:</h4>
                <div className="flex flex-wrap gap-1">
                  {optimisedContent.skills.optimized.map((skill, idx) => (
                    <GradientBadge key={idx}>
                      {skill.name}
                    </GradientBadge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{optimisedContent.skills.feedback}</p>
                <div className="flex space-x-2">
                  <GradientButton
                    size="sm"
                    onClick={() => handleAcceptChange('skills')}
                  >
                    Accept Changes
                  </GradientButton>
                  <SecondaryGradientButton
                    size="sm"
                    onClick={() => handleRevertChange('skills')}
                  >
                    Revert
                  </SecondaryGradientButton>
                </div>
              </div>
            )}
          </div>
        );

      case 'achievements':
        return (
          <div className="space-y-4">
            <div className="text-sm">
              <h4 className="font-medium mb-2 text-foreground">Current Achievements:</h4>
              <ul className="list-disc pl-5 text-muted-foreground">
                {cv.achievements.map((achievement, idx) => (
                  <li key={idx}>{achievement}</li>
                ))}
              </ul>
            </div>
            {optimisedContent.achievements && (
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Suggested Achievements:</h4>
                <ul className="list-disc pl-5 text-muted-foreground">
                  {optimisedContent.achievements.optimized.map((achievement, idx) => (
                    <li key={idx}>{achievement}</li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground">{optimisedContent.achievements.feedback}</p>
                <div className="flex space-x-2">
                  <GradientButton
                    size="sm"
                    onClick={() => handleAcceptChange('achievements')}
                  >
                    Accept Changes
                  </GradientButton>
                  <SecondaryGradientButton
                    size="sm"
                    onClick={() => handleRevertChange('achievements')}
                  >
                    Revert
                  </SecondaryGradientButton>
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
                    <h4 className="font-medium text-foreground">{exp.title}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs hover:text-primary"
                      onClick={() => handleOptimiseExperience(idx)}
                      disabled={optimisingExperienceIndex === idx}
                    >
                      {optimisingExperienceIndex === idx ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Optimising...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3 w-3 mr-1" />
                          Optimise
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-muted-foreground text-xs">{exp.company}</p>
                  <ul className="list-disc pl-5 text-muted-foreground mt-2">
                    {exp.highlights && exp.highlights.map((highlight, hIdx) => (
                      <li key={hIdx}>{highlight}</li>
                    ))}
                  </ul>
                </div>
                {optimisedContent.experience?.[idx] && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Suggested Changes:</h4>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      {optimisedContent.experience[idx].optimized.highlights && 
                        optimisedContent.experience[idx].optimized.highlights.map((highlight, hIdx) => (
                          <li key={hIdx}>{highlight}</li>
                        ))}
                    </ul>
                    <p className="text-sm text-muted-foreground">{optimisedContent.experience[idx].feedback}</p>
                    <div className="flex space-x-2">
                      <GradientButton
                        size="sm"
                        onClick={() => handleAcceptChange('experience', idx)}
                      >
                        Accept Changes
                      </GradientButton>
                      <SecondaryGradientButton
                        size="sm"
                        onClick={() => handleRevertChange('experience', idx)}
                      >
                        Revert
                      </SecondaryGradientButton>
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
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-medium text-foreground mb-2">No CV data available</h2>
            <p className="text-muted-foreground mb-6">Please upload a CV to preview and optimise it.</p>
            <GradientButton onClick={() => navigate('/')}>
              Upload CV
            </GradientButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              <GradientText>CV Preview</GradientText>
            </h1>
            <p className="text-muted-foreground text-sm">
              Drag sections to reorder • Click section icons to edit or hide
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <GradientSwitch
                id="anonymise"
                checked={isAnonymised}
                onCheckedChange={setIsAnonymised}
              />
              <Label htmlFor="anonymise" className="text-foreground">Anonymise</Label>
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <GradientButton className="gap-2">
                  <DownloadCloud className="h-4 w-4" /> Export
                </GradientButton>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Export CV</SheetTitle>
                  <SheetDescription>
                    Choose a format to export the CV. The document will be generated with your agency branding.
                  </SheetDescription>
                </SheetHeader>
                
                <div className="space-y-4 mt-6">
                  <GradientButton
                    onClick={() => handleExport('PDF')}
                    className="w-full"
                    disabled={isExporting}
                  >
                    <DownloadCloud className="mr-2 h-4 w-4" /> 
                    {isExporting ? 'Generating...' : 'Export as PDF'}
                  </GradientButton>
                  
                  <SecondaryGradientButton
                    onClick={() => handleExport('DOCX')}
                    className="w-full"
                    disabled={isExporting}
                  >
                    <DownloadCloud className="mr-2 h-4 w-4" /> 
                    {isExporting ? 'Generating...' : 'Export as DOCX'}
                  </SecondaryGradientButton>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Sections to drag and arrange */}
          <div className="lg:col-span-1">
            <Card className="p-4 mb-4 bg-card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-medium text-foreground">CV Sections</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsChatOpen(!isChatOpen)}
                  className="text-foreground hover:text-primary"
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
                {sectionOrder.sections
                  .filter(sectionKey => sectionKey !== 'personalInfo')
                  .map((sectionKey, index) => {
                    let sectionTitle = '';
                    let canOptimize = false;
                    const isVisible = sectionVisibility[sectionKey as keyof typeof sectionVisibility];
                    
                    switch(sectionKey) {
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
                              ? handleOptimiseProfileStatement
                              : sectionKey === 'skills'
                                ? handleOptimiseSkills
                                : sectionKey === 'achievements'
                                  ? handleOptimiseAchievements
                                  : undefined
                            : undefined
                        }
                        isOptimizing={
                          (sectionKey === 'profileStatement' && isOptimisingProfileStatement) ||
                          (sectionKey === 'skills' && isOptimisingSkills) ||
                          (sectionKey === 'achievements' && isOptimisingAchievements)
                        }
                        index={index}
                        moveSection={moveSection}
                      >
                        {renderSectionContent(sectionKey)}
                      </CVSection>
                    );
                  })}
              </div>
            </Card>
          </div>
          
          {/* Right column - CV Preview */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-card">
              <CVPreview 
                cv={cv} 
                isAnonymised={isAnonymised} 
                sectionVisibility={sectionVisibility}
                sectionOrder={sectionOrder.sections}
              />
            </Card>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-border py-4">
        <div className="container mx-auto px-4 text-sm text-muted-foreground flex justify-between">
          <p>© 2023 Hireable. All rights reserved.</p>
          <div className="space-x-4">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Preview;

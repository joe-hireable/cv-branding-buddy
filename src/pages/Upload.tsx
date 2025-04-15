import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadIcon, FileText, UserCheck, Loader2 } from 'lucide-react';
import { GradientIcon } from '@/components/ui/gradient-icon';
import { useCVContext } from '@/contexts/CVContext';
import { useSettingsContext } from '@/contexts/SettingsContext';
import { toast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAuth } from '@/contexts/AuthContext';
import { cvService } from '@/services/cvService';
import { cvParserService } from '@/services/cvParserApi';
import { candidateService } from '@/integrations/supabase/services/candidates';
import { storageService } from '@/integrations/supabase/services/storage';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GradientText, GradientButton, SecondaryGradientButton, GradientCard } from '@/components/ui/brand-components';

const UploadPage: React.FC = () => {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [matchToJD, setMatchToJD] = useState(false);
  const { setCv, setIsLoading: setCvIsLoading, setSectionVisibility, setSectionOrder, setIsAnonymised } = useCVContext();
  const { settings } = useSettingsContext();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCvUpload = (file: File) => {
    setCvFile(file);
  };

  const handleJdUpload = (file: File) => {
    setJdFile(file);
  };

  const handleSubmit = async () => {
    if (!cvFile) {
      toast({
        title: "No file selected",
        description: "Please select a CV file to upload",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to upload a CV.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setCvIsLoading(true);

    try {
      // First, create a candidate record
      const candidateData = {
        owner_id: user.id,
        first_name: null,
        last_name: null,
        current_position: null,
        current_company: null,
      };

      const candidate = await candidateService.create(candidateData);

      // Then parse the CV using the CV Parser service
      const formData = new FormData();
      formData.append('cv_file', cvFile);
      formData.append('candidate_id', candidate.id);

      const response = await cvParserService.parseCV(cvFile, jdFile || undefined);

      if (response.status === 'success') {
        // Apply default settings from SettingsContext
        if (settings) {
          // Apply visibility settings
          if (settings.defaultSectionVisibility) {
            Object.entries(settings.defaultSectionVisibility).forEach(([section, isVisible]) => {
              setSectionVisibility(section as any, isVisible);
            });
          }
          
          // Apply section order
          if (settings.defaultSectionOrder && settings.defaultSectionOrder.sections) {
            setSectionOrder(settings.defaultSectionOrder.sections);
          }
          
          // Apply anonymisation setting
          setIsAnonymised(settings.defaultAnonymise || false);
        }

        // Save the CV to Supabase with the candidate_id
        const cvData = {
          candidate_id: candidate.id,
          uploader_id: user.id,
          original_filename: cvFile.name,
          original_file_storage_path: `cvs/${candidate.id}/${cvFile.name}`,
          parsed_data: response.data,
          status: "Parsed" as const
        };
        
        const savedCV = await cvService.create(cvData);
        
        // Set the CV data with file, ID, and job description
        setCv({
          ...response.data,
          id: savedCV.id,
          file: cvFile,
          jobDescription: jdFile ? await jdFile.text() : undefined
        });
        
        // Handle feedback data properly
        const feedbackMessage = response.data.feedback 
          ? typeof response.data.feedback === 'string'
            ? response.data.feedback
            : response.data.feedback.strengths 
              ? `Strengths: ${response.data.feedback.strengths}\nAreas to improve: ${response.data.feedback.areas_to_improve}`
              : 'CV processed successfully'
          : 'CV processed successfully';
        
        toast({
          title: "CV uploaded successfully",
          description: feedbackMessage,
        });
        
        navigate('/preview');
      } else {
        throw new Error(response.errors?.[0] || 'Failed to process CV');
      }
    } catch (error) {
      console.error('Error processing CV:', error);
      toast({
        title: "Error processing CV",
        description: "There was an error processing your CV. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setCvIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 font-heading">
            <GradientText>Upload Your CV</GradientText>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 font-sans">
            Upload your CV to get started with CV Branding Buddy. We'll analyze it and provide suggestions for improvement.
          </p>
          
          <GradientCard className="mb-8">
            <CardHeader>
              <CardTitle className="font-heading">CV Upload</CardTitle>
              <CardDescription className="font-sans">
                Upload your CV in PDF, DOCX, or TXT format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload 
                onFileSelected={handleCvUpload} 
                accept=".pdf,.docx,.txt"
                label="Upload your CV"
                icon={<FileText className="w-6 h-6" />}
              />
              
              <div className="mt-6">
                <Checkbox 
                  id="match-to-jd" 
                  checked={matchToJD} 
                  onCheckedChange={(checked) => setMatchToJD(checked as boolean)}
                  className="mb-2"
                />
                <Label htmlFor="match-to-jd" className="font-sans">
                  Match to Job Description (Optional)
                </Label>
                
                {matchToJD && (
                  <div className="mt-4">
                    <FileUpload 
                      onFileSelected={handleJdUpload} 
                      accept=".pdf,.docx,.txt"
                      label="Upload Job Description"
                      icon={<FileText className="w-6 h-6" />}
                    />
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <GradientButton 
                  onClick={handleSubmit} 
                  disabled={!cvFile || isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <UploadIcon className="mr-2 h-4 w-4" />
                      Upload and Process
                    </>
                  )}
                </GradientButton>
              </div>
            </CardContent>
          </GradientCard>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">AI-Powered Analysis</CardTitle>
                <CardDescription className="font-sans">
                  Our AI analyzes your CV and provides personalized suggestions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 font-sans">
                  <li className="flex items-center">
                    <UserCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Content analysis</span>
                  </li>
                  <li className="flex items-center">
                    <UserCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Keyword optimization</span>
                  </li>
                  <li className="flex items-center">
                    <UserCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Formatting suggestions</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Branding Enhancement</CardTitle>
                <CardDescription className="font-sans">
                  Enhance your CV with professional branding elements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 font-sans">
                  <li className="flex items-center">
                    <UserCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Professional styling</span>
                  </li>
                  <li className="flex items-center">
                    <UserCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Color schemes</span>
                  </li>
                  <li className="flex items-center">
                    <UserCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Layout optimization</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
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

export default UploadPage;

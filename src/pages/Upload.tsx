import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadIcon, FileText, UserCheck, Loader2 } from 'lucide-react';
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

const UploadPage: React.FC = () => {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [matchToJD, setMatchToJD] = useState(false);
  const { setCv, setIsLoading: setCvIsLoading, setSectionVisibility, setSectionOrder, setIsAnonymized } = useCVContext();
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
          
          // Apply anonymization setting
          setIsAnonymized(settings.defaultAnonymize || false);
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
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setCvIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">Upload CV/Resume</h1>
          <p className="text-gray-600 mb-8 text-center">
            Upload your CV file and we'll automatically process, anonymize, and format it for you.
          </p>
          
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-800 mb-3">CV/Resume File</h2>
            <FileUpload 
              onFileSelected={handleCvUpload} 
              isLoading={isLoading} 
              label="Upload CV"
              accept=".pdf,.doc,.docx"
            />
          </div>
          
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox 
                id="matchToJD" 
                checked={matchToJD}
                onCheckedChange={(checked) => setMatchToJD(checked === true)}
              />
              <label
                htmlFor="matchToJD"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Match to Job Description?
              </label>
            </div>
            
            {matchToJD && (
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-3">Job Description</h2>
                <p className="text-sm text-gray-500 mb-3">
                  Adding a job description allows our AI to optimize the CV specifically for this role.
                </p>
                <FileUpload 
                  onFileSelected={handleJdUpload} 
                  isLoading={isLoading} 
                  label="Upload Job Description"
                  accept=".pdf,.doc,.docx,.txt"
                />
              </div>
            )}
          </div>
          
          <Button 
            onClick={handleSubmit} 
            disabled={!cvFile || isLoading}
            className="w-full py-6 text-lg bg-hireable-gradient hover:opacity-90"
          >
            <UploadIcon className="mr-2 h-5 w-5" /> Upload & Process
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-purple-100 p-3 rounded-full mb-3">
                    <UserCheck className="h-6 w-6 text-hireable-primary" />
                  </div>
                  <h3 className="font-medium mb-2">Auto Anonymization</h3>
                  <p className="text-sm text-gray-500">
                    Automatically removes personal information for unbiased recruitment
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-purple-100 p-3 rounded-full mb-3">
                    <FileText className="h-6 w-6 text-hireable-primary" />
                  </div>
                  <h3 className="font-medium mb-2">Smart Formatting</h3>
                  <p className="text-sm text-gray-500">
                    Consistently formats CVs to your agency's template
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-purple-100 p-3 rounded-full mb-3">
                    <UploadIcon className="h-6 w-6 text-hireable-primary" />
                  </div>
                  <h3 className="font-medium mb-2">Instant Processing</h3>
                  <p className="text-sm text-gray-500">
                    Process multiple CVs in seconds, not hours
                  </p>
                </div>
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


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UploadIcon, FileText, UserCheck } from 'lucide-react';
import { useCVContext } from '@/contexts/CVContext';
import { uploadCV } from '@/services/api';
import { toast } from '@/components/ui/use-toast';

const UploadPage: React.FC = () => {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setCv, setIsLoading: setCvIsLoading } = useCVContext();
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
        title: "Please upload a CV",
        description: "A CV file is required to proceed.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setCvIsLoading(true);

    try {
      // In a real app, we would upload the file to a server here
      const response = await uploadCV(cvFile);
      
      if (response.status === 'success') {
        setCv(response.data);
        toast({
          title: "CV uploaded successfully",
          description: "Your CV has been processed.",
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
            <h2 className="text-lg font-medium text-gray-800 mb-3">Job Description (Optional)</h2>
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

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, FileText, Download, Edit, Trash2 } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { cvService } from '@/services/cvService';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useCVContext } from '@/contexts/CVContext';
import { useSettingsContext } from '@/contexts/SettingsContext';

interface CV {
  id: string;
  candidate_id: string;
  uploader_id: string;
  original_filename: string;
  original_file_storage_path: string;
  parsed_data: {
    profileStatement?: string;
    skills?: Array<{ name: string; proficiency?: string; skillType?: string }>;
    achievements?: string[];
    experience?: Array<{
      title: string;
      company: string;
      start: string;
      end?: string;
      current?: boolean;
      summary?: string;
      highlights?: string[];
    }>;
    education?: Array<{
      institution: string;
      location?: string;
      qualifications?: Array<{
        qualification: string;
        course?: string;
        start: string;
        end?: string;
        grade?: string;
      }>;
    }>;
  };
  status: string;
  created_at: string;
  updated_at: string;
}

const History: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { setCv, setSectionVisibility, setSectionOrder, setIsAnonymised } = useCVContext();
  const { settings } = useSettingsContext();
  const [cvs, setCvs] = useState<CV[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCVs = async () => {
      if (!user?.id) return;
      
      try {
        const { data: cvs, error } = await supabase
          .from('cvs')
          .select('*')
          .eq('uploader_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Parse the parsed_data from JSON string to object
        const parsedCVs = (cvs || []).map(cv => ({
          ...cv,
          parsed_data: typeof cv.parsed_data === 'string' 
            ? JSON.parse(cv.parsed_data)
            : cv.parsed_data
        }));
        
        setCvs(parsedCVs);
      } catch (error) {
        console.error('Error fetching CVs:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load CV history. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCVs();
  }, [user?.id, toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleViewCV = async (id: string) => {
    try {
      // Fetch the CV data
      const { data: cv, error } = await supabase
        .from('cvs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!cv) throw new Error('CV not found');

      // Parse the parsed_data from JSON string to object
      const parsedData = typeof cv.parsed_data === 'string'
        ? JSON.parse(cv.parsed_data)
        : cv.parsed_data;

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

      // Set the CV data in the context
      if (parsedData) {
        setCv({
          ...parsedData,
          id: cv.id
        });
      }

      // Navigate to the preview page
      navigate(`/preview?id=${id}`);
    } catch (error) {
      console.error('Error loading CV:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load CV. Please try again.",
      });
    }
  };

  const handleExportCV = async (id: string) => {
    try {
      // TODO: Implement export functionality
      toast({
        title: "Exporting CV",
        description: "Your document will download shortly",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to export CV. Please try again.",
      });
    }
  };

  const handleEditCV = (id: string) => {
    navigate(`/preview?id=${id}&edit=true`);
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCV = async () => {
    if (!itemToDelete) return;
    
    try {
      // Delete the CV from Supabase
      const { error } = await supabase
        .from('cvs')
        .delete()
        .eq('id', itemToDelete);

      if (error) throw error;

      // Update the local state to remove the deleted CV
      setCvs(cvs.filter(cv => cv.id !== itemToDelete));
      
      toast({
        title: "CV Deleted",
        description: "The CV has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting CV:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete CV. Please try again.",
      });
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="h-24 bg-gray-200 dark:bg-gray-800" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">History</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">View and manage your previously processed CVs</p>
          
          <div className="space-y-4">
            {cvs.map((cv) => (
              <Card key={cv.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center p-4">
                    <div className="flex-shrink-0 mr-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-hireable-gradient text-black dark:text-white">
                          {cv.original_filename?.split('_')[0]?.[0] || 'CV'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {cv.original_filename || 'Untitled CV'}
                      </h2>
                      <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 dark:text-gray-400">
                        <p className="truncate">Status: {cv.status}</p>
                        <span className="hidden sm:inline mx-2">•</span>
                        <p>Processed: {formatDate(cv.created_at)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center ml-4 space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="hidden sm:flex dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                        onClick={() => handleViewCV(cv.id)}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="hidden sm:flex dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                        onClick={() => handleExportCV(cv.id)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="dark:text-gray-200 dark:hover:bg-gray-800">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
                          <DropdownMenuLabel className="dark:text-white">Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator className="dark:border-gray-700" />
                          <DropdownMenuItem 
                            className="sm:hidden dark:text-gray-200 dark:hover:bg-gray-700"
                            onClick={() => handleViewCV(cv.id)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="sm:hidden dark:text-gray-200 dark:hover:bg-gray-700"
                            onClick={() => handleExportCV(cv.id)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="dark:text-gray-200 dark:hover:bg-gray-700"
                            onClick={() => handleEditCV(cv.id)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600 dark:text-red-400 dark:hover:bg-gray-700"
                            onClick={() => confirmDelete(cv.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {cvs.length === 0 && (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">No history yet</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                You haven't processed any CVs yet. Upload a CV to get started.
              </p>
              <Button 
                className="mt-4 bg-hireable-gradient hover:opacity-90"
                onClick={() => navigate('/')}
              >
                Upload CV
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <footer className="border-t dark:border-gray-800 py-4 mt-8">
        <div className="container mx-auto px-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            <div className="text-center sm:text-left">
              <p>© 2024 CV Branding Buddy. All rights reserved.</p>
            </div>
            <div className="text-center">
              <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Privacy Policy</a>
            </div>
            <div className="text-center sm:text-right">
              <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-white">Delete CV</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-400">
              Are you sure you want to delete this CV? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCV}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default History;

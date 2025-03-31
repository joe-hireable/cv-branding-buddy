
import React from 'react';
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

// Mock data for the history page
const historyItems = [
  {
    id: '1',
    candidateName: 'Sarah Johnson',
    originalFilename: 'sarah_johnson_cv.pdf',
    position: 'Senior Frontend Developer',
    processedAt: new Date('2023-06-10T14:30:00'),
    anonymous: true,
  },
  {
    id: '2',
    candidateName: 'Michael Chen',
    originalFilename: 'michael_chen_resume.docx',
    position: 'DevOps Engineer',
    processedAt: new Date('2023-06-08T09:15:00'),
    anonymous: false,
  },
  {
    id: '3',
    candidateName: 'Emily Rodriguez',
    originalFilename: 'emily_rodriguez_cv.pdf',
    position: 'Product Manager',
    processedAt: new Date('2023-06-05T16:45:00'),
    anonymous: true,
  },
  {
    id: '4',
    candidateName: 'James Wilson',
    originalFilename: 'james_wilson_resume.pdf',
    position: 'Full Stack Developer',
    processedAt: new Date('2023-06-01T11:20:00'),
    anonymous: false,
  },
];

const History: React.FC = () => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">History</h1>
          <p className="text-gray-600 mb-6">View and manage your previously processed CVs</p>
          
          <div className="space-y-4">
            {historyItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center p-4">
                    <div className="flex-shrink-0 mr-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-hireable-gradient text-white">
                          {item.candidateName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold text-gray-900 truncate">
                        {item.anonymous ? '[Anonymous Candidate]' : item.candidateName}
                      </h2>
                      <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500">
                        <p className="truncate">{item.position}</p>
                        <span className="hidden sm:inline mx-2">•</span>
                        <p className="truncate">{item.originalFilename}</p>
                        <span className="hidden sm:inline mx-2">•</span>
                        <p>Processed: {formatDate(item.processedAt)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center ml-4 space-x-2">
                      <Button variant="outline" size="sm" className="hidden sm:flex">
                        <FileText className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="hidden sm:flex">
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="sm:hidden">
                            <FileText className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem className="sm:hidden">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
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
          
          {historyItems.length === 0 && (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium text-gray-700">No history yet</h2>
              <p className="text-gray-500 mt-2">
                You haven't processed any CVs yet. Upload a CV to get started.
              </p>
              <Button 
                className="mt-4 bg-hireable-gradient hover:opacity-90"
                onClick={() => window.location.href = '/'}
              >
                Upload CV
              </Button>
            </div>
          )}
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

export default History;


import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
  isLoading?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelected,
  label = 'Upload file',
  accept = '.pdf,.doc,.docx',
  maxSize = 10, // Default 10MB
  isLoading = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (isLoading) return;
    
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoading) return;
    const files = e.target.files;
    if (files) handleFiles(files);
  };

  const handleFiles = (files: FileList) => {
    if (files.length === 0) return;
    
    const selectedFile = files[0];
    const fileSizeMB = selectedFile.size / (1024 * 1024);
    
    if (fileSizeMB > maxSize) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${maxSize}MB.`,
        variant: "destructive",
      });
      return;
    }
    
    // Check file type
    const fileType = selectedFile.name.split('.').pop()?.toLowerCase();
    const acceptableTypes = accept.split(',').map(type => type.replace('.', '').toLowerCase());
    
    if (fileType && !acceptableTypes.includes(fileType)) {
      toast({
        title: "Invalid file type",
        description: `Please upload a file of type: ${accept}`,
        variant: "destructive",
      });
      return;
    }
    
    setFile(selectedFile);
    onFileSelected(selectedFile);
  };

  const handleBrowseClick = () => {
    if (!isLoading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-md p-6 text-center transition-all ${
        isDragging ? 'border-hireable-primary bg-purple-50' : 'border-gray-300'
      } ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleBrowseClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept={accept}
        className="hidden"
        disabled={isLoading}
      />
      
      <div className="flex flex-col items-center justify-center gap-2">
        {file ? (
          <>
            <FileText className="h-12 w-12 text-hireable-primary mb-2" />
            <p className="text-sm font-medium text-gray-700">{file.name}</p>
            <p className="text-xs text-gray-500">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </>
        ) : (
          <>
            <div className="bg-purple-100 rounded-full p-3 mb-2">
              <Upload className="h-6 w-6 text-hireable-primary" />
            </div>
            <p className="text-sm font-medium text-gray-700">
              Drag and drop your file here, or
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 text-hireable-primary border-hireable-primary hover:bg-purple-50"
              disabled={isLoading}
              type="button"
            >
              Browse Files
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: {accept} (Max size: {maxSize}MB)
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;

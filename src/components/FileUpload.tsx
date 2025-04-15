import React, { useState, useRef } from 'react';
import { CustomButton } from '@/components/ui/custom-button';
import { Upload, FileText } from 'lucide-react';
import { GradientIcon } from '@/components/ui/gradient-icon';
import { toast } from '@/components/ui/use-toast';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelected,
  label = 'Upload file',
  accept = '.pdf,.doc,.docx',
  maxSize = 10, // Default 10MB
  isLoading = false,
  icon,
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
            <GradientIcon icon={FileText} size={20} className="mb-2" />
            <p className="text-sm font-medium text-gray-700">{file.name}</p>
            <p className="text-xs text-gray-500">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </>
        ) : (
          <>
            <GradientIcon icon={Upload} size={20} className="mb-2" />
            <p className="text-sm font-medium text-gray-700 dark:text-white">
              Drag and drop your file here, or
            </p>
            <CustomButton 
              variant="primary" 
              size="sm" 
              disabled={isLoading}
              type="button"
            >
              Browse Files
            </CustomButton>
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

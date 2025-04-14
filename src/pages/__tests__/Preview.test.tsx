import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Preview from '@/pages/Preview';
import { useCVContext } from '@/contexts/CVContext';
import { useRecruiterContext } from '@/contexts/RecruiterContext';
import * as api from '@/services/api';
import { toast } from '@/components/ui/use-toast';

// Mock the contexts
jest.mock('@/contexts/CVContext');
jest.mock('@/contexts/RecruiterContext');
jest.mock('@/services/api');
jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn()
}));

// Mock components
jest.mock('@/components/Header', () => {
  return function MockHeader() {
    return <div data-testid="mock-header" />;
  };
});
jest.mock('@/components/CVSection', () => {
  return function MockCVSection({ onOptimize, children }: { onOptimize?: () => void; children?: React.ReactNode }) {
    return (
      <div data-testid="mock-cv-section">
        {onOptimize && (
          <button
            data-testid="optimize-button"
            onClick={onOptimize}
          >
            Optimize
          </button>
        )}
        {children}
      </div>
    );
  };
});
jest.mock('@/components/CVPreview', () => {
  return function MockCVPreview() {
    return <div data-testid="mock-cv-preview" />;
  };
});
jest.mock('@/components/ChatEditor', () => 'mock-chat-editor');

describe('Preview Component', () => {
  const mockCv = {
    id: 'test-cv-id',
    file: new File(['test content'], 'test.pdf', { type: 'application/pdf' }),
    profileStatement: 'Original profile statement',
    jobDescription: 'Test job description',
    skills: [],
    achievements: [],
    experience: []
  };

  const mockProfile = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    agencyName: 'Test Agency'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the context hooks
    (useCVContext as jest.Mock).mockReturnValue({
      cv: mockCv,
      sectionVisibility: { profileStatement: true },
      sectionOrder: { sections: ['profileStatement'] },
      isAnonymized: false,
      updateCvField: jest.fn(),
      setSectionVisibility: jest.fn(),
      setSectionOrder: jest.fn(),
      setIsAnonymized: jest.fn()
    });
    
    (useRecruiterContext as jest.Mock).mockReturnValue({
      profile: mockProfile
    });
  });

  it('renders the Preview component correctly', () => {
    render(
      <BrowserRouter>
        <Preview />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-cv-preview')).toBeInTheDocument();
    expect(screen.getByTestId('mock-cv-section')).toBeInTheDocument();
  });

  describe('Profile Statement Optimization', () => {
    it('should successfully optimize the profile statement', async () => {
      // Mock the API response
      const mockResponse = {
        status: 'success',
        errors: null,
        data: {
          optimizedText: 'Optimized profile statement',
          feedback: 'Great improvements made'
        }
      };
      
      (api.optimizeProfileStatement as jest.Mock).mockResolvedValueOnce(mockResponse);
      
      render(
        <BrowserRouter>
          <Preview />
        </BrowserRouter>
      );
      
      // Find and click the optimize button
      const optimizeButton = screen.getByTestId('optimize-button');
      fireEvent.click(optimizeButton);
      
      // Wait for the optimization to complete
      await waitFor(() => {
        expect(api.optimizeProfileStatement).toHaveBeenCalledWith(
          mockCv.file,
          mockCv.jobDescription
        );
      });
      
      // Check that the toast was called with success message
      expect(toast).toHaveBeenCalledWith({
        title: 'Profile statement optimised',
        description: 'Great improvements made'
      });
    });
    
    it('should handle API errors during optimization', async () => {
      // Mock the API error
      (api.optimizeProfileStatement as jest.Mock).mockRejectedValueOnce(
        new Error('Failed to optimise profile statement')
      );
      
      render(
        <BrowserRouter>
          <Preview />
        </BrowserRouter>
      );
      
      // Find and click the optimize button
      const optimizeButton = screen.getByTestId('optimize-button');
      fireEvent.click(optimizeButton);
      
      // Wait for the optimization to complete
      await waitFor(() => {
        expect(api.optimizeProfileStatement).toHaveBeenCalledWith(
          mockCv.file,
          mockCv.jobDescription
        );
      });
      
      // Check that the toast was called with error message
      expect(toast).toHaveBeenCalledWith({
        title: 'Optimisation failed',
        description: 'Failed to optimise profile statement',
        variant: 'destructive'
      });
    });
    
    it('should handle missing CV data', () => {
      // Mock the context with no CV
      (useCVContext as jest.Mock).mockReturnValue({
        cv: null,
        sectionVisibility: { profileStatement: true },
        sectionOrder: { sections: ['profileStatement'] },
        isAnonymized: false,
        updateCvField: jest.fn(),
        setSectionVisibility: jest.fn(),
        setSectionOrder: jest.fn(),
        setIsAnonymized: jest.fn()
      });
      
      render(
        <BrowserRouter>
          <Preview />
        </BrowserRouter>
      );
      
      // Verify that the optimize button is not present
      expect(screen.queryByTestId('optimize-button')).not.toBeInTheDocument();
      
      // Verify that we show the "No CV data" message
      expect(screen.getByText('No CV data available')).toBeInTheDocument();
      expect(screen.getByText('Please upload a CV to preview and optimize it.')).toBeInTheDocument();
    });
    
    it('should handle missing CV file and ID', async () => {
      // Mock the context with CV but no file or ID
      (useCVContext as jest.Mock).mockReturnValue({
        cv: { ...mockCv, id: undefined, file: undefined },
        sectionVisibility: { profileStatement: true },
        sectionOrder: { sections: ['profileStatement'] },
        isAnonymized: false,
        updateCvField: jest.fn(),
        setSectionVisibility: jest.fn(),
        setSectionOrder: jest.fn(),
        setIsAnonymized: jest.fn()
      });
      
      render(
        <BrowserRouter>
          <Preview />
        </BrowserRouter>
      );
      
      // Find and click the optimize button
      const optimizeButton = screen.getByTestId('optimize-button');
      fireEvent.click(optimizeButton);
      
      // Wait for the error to be handled
      await waitFor(() => {
        expect(toast).toHaveBeenCalledWith({
          title: 'Optimisation failed',
          description: 'No CV file or ID available',
          variant: 'destructive'
        });
      });
      
      // Check that the API was not called
      expect(api.optimizeProfileStatement).not.toHaveBeenCalled();
    });
  });
}); 
import { cvParserService, cvParserApi } from '../cvParserApi';
import { BackendResponse } from '@/types/cv';

// Mock axios
jest.mock('axios', () => {
  const actualAxios = jest.requireActual('axios');
  return {
    ...actualAxios,
    create: () => ({
      post: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() }
      }
    })
  };
});

// Mock supabase
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: { access_token: 'test-token' } },
        error: null
      })
    }
  },
  PARSE_CV_ENDPOINT: 'https://test-api.example.com'
}));

describe('cvParserApi', () => {
  let mockPost: jest.Mock;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Get the mock post function
    mockPost = (cvParserApi.post as jest.Mock);
  });
  
  describe('optimizeProfileStatement', () => {
    it('should successfully optimize a profile statement with a CV file', async () => {
      // Arrange
      const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
      const mockJobDescription = 'Test job description';
      const mockResponse: BackendResponse = {
        status: 'success',
        errors: null,
        data: {
          optimizedText: 'Optimized profile statement',
          feedback: 'Great improvements made'
        }
      };
      
      mockPost.mockResolvedValueOnce({ data: mockResponse });
      
      // Act
      const result = await cvParserService.optimizeProfileStatement(mockFile, mockJobDescription);
      
      // Assert
      expect(mockPost).toHaveBeenCalledTimes(1);
      expect(mockPost).toHaveBeenCalledWith('', expect.any(FormData));
      
      // Check FormData contents
      const formData = mockPost.mock.calls[0][1];
      expect(formData.get('task')).toBe('ps');
      expect(formData.get('cv_file')).toBe(mockFile);
      expect(formData.get('jd')).toBe(mockJobDescription);
      
      expect(result).toEqual(mockResponse);
    });
    
    it('should successfully optimize a profile statement with a CV ID', async () => {
      // Arrange
      const mockCvId = 'test-cv-id';
      const mockJobDescription = 'Test job description';
      const mockResponse: BackendResponse = {
        status: 'success',
        errors: null,
        data: {
          optimizedText: 'Optimized profile statement',
          feedback: 'Great improvements made'
        }
      };
      
      mockPost.mockResolvedValueOnce({ data: mockResponse });
      
      // Act
      const result = await cvParserService.optimizeProfileStatement(mockCvId, mockJobDescription);
      
      // Assert
      expect(mockPost).toHaveBeenCalledTimes(1);
      expect(mockPost).toHaveBeenCalledWith('', expect.any(FormData));
      
      // Check FormData contents
      const formData = mockPost.mock.calls[0][1];
      expect(formData.get('task')).toBe('ps');
      expect(formData.get('cv_id')).toBe(mockCvId);
      expect(formData.get('jd')).toBe(mockJobDescription);
      
      expect(result).toEqual(mockResponse);
    });
    
    it('should handle a 500 server error gracefully', async () => {
      // Arrange
      const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
      const mockError = {
        response: {
          status: 500,
          data: {
            errors: ['Internal server error']
          }
        }
      };
      
      mockPost.mockRejectedValueOnce(mockError);
      
      // Act & Assert
      await expect(cvParserService.optimizeProfileStatement(mockFile))
        .rejects
        .toThrow('Server error occurred while optimising profile statement. Please try again later.');
    });
    
    it('should handle an error response from the API', async () => {
      // Arrange
      const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
      const mockResponse: BackendResponse = {
        status: 'error',
        errors: ['Invalid CV format'],
        data: null
      };
      
      mockPost.mockResolvedValueOnce({ data: mockResponse });
      
      // Act & Assert
      await expect(cvParserService.optimizeProfileStatement(mockFile))
        .rejects
        .toThrow('Invalid CV format');
    });
    
    it('should handle an invalid response format', async () => {
      // Arrange
      const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
      const mockResponse = { data: null }; // This will trigger the validation error
      
      mockPost.mockResolvedValueOnce(mockResponse);
      
      // Act & Assert
      await expect(cvParserService.optimizeProfileStatement(mockFile))
        .rejects
        .toThrow('Invalid response format from server');
    });
    
    it('should handle an invalid CV input', async () => {
      // Arrange
      const mockInvalidCv = null as unknown as File;
      
      // Act & Assert
      await expect(cvParserService.optimizeProfileStatement(mockInvalidCv))
        .rejects
        .toThrow('Invalid CV input: must be either a File or string ID');
    });
  });
}); 
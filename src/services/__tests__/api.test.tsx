import * as api from '../api';
import { cvParserService } from '../cvParserApi';
import { BackendResponse } from '@/types/cv';

// Mock the cvParserService
jest.mock('../cvParserApi', () => ({
  cvParserService: {
    parseCV: jest.fn(),
    optimizeProfileStatement: jest.fn(),
    optimizeSkills: jest.fn(),
    optimizeAchievements: jest.fn(),
    optimizeExperience: jest.fn(),
    scoreCV: jest.fn()
  }
}));

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('optimizeProfileStatement', () => {
    it('should call cvParserService.optimizeProfileStatement with the correct parameters', async () => {
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
      
      (cvParserService.optimizeProfileStatement as jest.Mock).mockResolvedValueOnce(mockResponse);
      
      // Act
      const result = await api.optimizeProfileStatement(mockFile, mockJobDescription);
      
      // Assert
      expect(cvParserService.optimizeProfileStatement).toHaveBeenCalledWith(
        mockFile,
        mockJobDescription
      );
      expect(result).toEqual(mockResponse);
    });
    
    it('should handle errors from cvParserService', async () => {
      // Arrange
      const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
      const mockError = new Error('Failed to optimise profile statement');
      
      (cvParserService.optimizeProfileStatement as jest.Mock).mockRejectedValueOnce(mockError);
      
      // Act & Assert
      await expect(api.optimizeProfileStatement(mockFile))
        .rejects
        .toThrow('Failed to optimise profile statement');
    });
  });
}); 
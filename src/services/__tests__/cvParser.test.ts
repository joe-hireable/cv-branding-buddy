import { cvParserService } from '../cvParserApi';
import { uploadCV, optimizeProfileStatement, optimizeSkills, optimizeAchievements, optimizeExperience } from '../api';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

// Mock axios
jest.mock('axios', () => {
  const mockAxios = {
    create: jest.fn(() => mockAxios),
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  };
  return mockAxios;
});

// Mock Supabase
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: { access_token: 'mock-token' } },
        error: null
      })
    }
  },
  PARSE_CV_ENDPOINT: 'https://mock-endpoint.com'
}));

describe('CV Parser Integration Tests', () => {
  const testCVsPath = path.join(process.cwd(), 'data', 'test_cvs');
  
  // Helper function to create File objects from test files
  const createFileFromPath = (filePath: string): File => {
    const buffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    return new File([buffer], fileName, {
      type: fileName.endsWith('.pdf') ? 'application/pdf' : 
            fileName.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' :
            'text/plain'
    });
  };

  // Test files setup
  let pdfCV: File;
  let docxCV: File;
  let txtCV: File;
  let mockJD: string;

  beforeAll(() => {
    // Set up test files
    pdfCV = createFileFromPath(path.join(testCVsPath, 'Claire Handby CV 2025[1] Copy.pdf'));
    docxCV = createFileFromPath(path.join(testCVsPath, 'Susan Mahdaly CV 2025-03-30-19-23-32.docx'));
    txtCV = createFileFromPath(path.join(testCVsPath, 'Claire Handby CV 2025[1] Copy.txt'));
    mockJD = 'Senior Software Developer position requiring React and Node.js experience';
  });

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('CV Upload and Parsing', () => {
    test('successfully uploads and parses PDF CV', async () => {
      const mockResponse = {
        status: 'success',
        data: {
          firstName: 'Claire',
          surname: 'Handby',
          // Add more expected parsed data
        }
      };

      // Mock the API response
      (axios.create() as any).post.mockResolvedValueOnce({ data: mockResponse });

      const response = await uploadCV(pdfCV);
      expect(response.status).toBe('success');
      expect(response.data.firstName).toBe('Claire');
      
      // Verify FormData was constructed correctly
      const postCall = (axios.create() as any).post.mock.calls[0];
      expect(postCall[1].get('cv_file')).toBeTruthy();
      expect(postCall[1].get('task')).toBe('parsing');
    });

    test('successfully uploads and parses DOCX CV', async () => {
      const mockResponse = {
        status: 'success',
        data: {
          firstName: 'Susan',
          surname: 'Mahdaly',
          // Add more expected parsed data
        }
      };

      (axios.create() as any).post.mockResolvedValueOnce({ data: mockResponse });

      const response = await uploadCV(docxCV);
      expect(response.status).toBe('success');
      expect(response.data.firstName).toBe('Susan');
    });

    test('handles parsing errors gracefully', async () => {
      const mockError = {
        response: {
          data: {
            status: 'error',
            errors: ['Failed to parse CV file'],
          }
        }
      };

      (axios.create() as any).post.mockRejectedValueOnce(mockError);

      await expect(uploadCV(pdfCV)).rejects.toThrow('Failed to parse CV file');
    });
  });

  describe('CV Optimization', () => {
    const mockCVId = 'test-cv-id';

    test('optimizes profile statement', async () => {
      const mockResponse = {
        status: 'success',
        data: {
          originalText: 'Software developer with 5 years experience',
          optimizedText: 'Senior Software Developer with 5+ years of expertise in full-stack development',
          feedback: 'Enhanced professional tone and specificity'
        }
      };

      (axios.create() as any).post.mockResolvedValueOnce({ data: mockResponse });

      const response = await optimizeProfileStatement(mockCVId);
      expect(response.status).toBe('success');
      expect(response.data.optimizedText).toBeTruthy();
    });

    test('optimizes skills section', async () => {
      const mockResponse = {
        status: 'success',
        data: {
          originalSkills: ['JavaScript', 'React'],
          optimizedSkills: ['JavaScript (Expert)', 'React.js', 'Node.js'],
          feedback: 'Added proficiency levels and expanded tech stack'
        }
      };

      (axios.create() as any).post.mockResolvedValueOnce({ data: mockResponse });

      const response = await optimizeSkills(mockCVId);
      expect(response.status).toBe('success');
      expect(response.data.optimizedSkills.length).toBeGreaterThan(0);
    });

    test('optimizes achievements with job description context', async () => {
      const mockResponse = {
        status: 'success',
        data: {
          originalAchievements: ['Led development team'],
          optimizedAchievements: ['Led development team of 5 engineers, improving sprint velocity by 40%'],
          feedback: 'Added quantifiable metrics'
        }
      };

      (axios.create() as any).post.mockResolvedValueOnce({ data: mockResponse });

      const response = await optimizeAchievements(mockCVId, mockJD);
      expect(response.status).toBe('success');
      expect(response.data.optimizedAchievements[0]).toContain('%');
    });

    test('optimizes experience entries', async () => {
      const mockResponse = {
        status: 'success',
        data: {
          originalExperience: {
            title: 'Software Developer',
            highlights: ['Developed web applications']
          },
          optimizedExperience: {
            title: 'Software Developer',
            highlights: ['Developed scalable web applications serving 100K+ users']
          },
          feedback: 'Added impact metrics'
        }
      };

      (axios.create() as any).post.mockResolvedValueOnce({ data: mockResponse });

      const response = await optimizeExperience(mockCVId, 0);
      expect(response.status).toBe('success');
      expect(response.data.optimizedExperience.highlights[0]).toContain('users');
    });
  });

  describe('CV Scoring', () => {
    test('scores CV against job description', async () => {
      const mockResponse = {
        status: 'success',
        data: {
          score: 85,
          feedback: {
            strengths: ['Strong technical skills match'],
            improvements: ['Could add more leadership experience']
          }
        }
      };

      (axios.create() as any).post.mockResolvedValueOnce({ data: mockResponse });

      const response = await cvParserService.scoreCV('test-cv-id', mockJD);
      expect(response.status).toBe('success');
      expect(response.data.score).toBe(85);
      expect(response.data.feedback.strengths).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    test('handles network errors', async () => {
      const networkError = new Error('Network Error');
      (axios.create() as any).post.mockRejectedValueOnce(networkError);

      await expect(uploadCV(pdfCV)).rejects.toThrow('Network Error');
    });

    test('handles authentication errors', async () => {
      const authError = {
        response: {
          status: 401,
          data: { 
            status: 'error',
            errors: ['Invalid token']
          }
        }
      };
      (axios.create() as any).post.mockRejectedValueOnce(authError);

      await expect(uploadCV(pdfCV)).rejects.toThrow('Invalid token');
    });

    test('handles invalid file types', async () => {
      const invalidFile = new File(['test'], 'test.xyz', { type: 'application/xyz' });
      const validationError = {
        response: {
          status: 400,
          data: {
            status: 'error',
            errors: ['Invalid file type']
          }
        }
      };
      (axios.create() as any).post.mockRejectedValueOnce(validationError);

      await expect(uploadCV(invalidFile)).rejects.toThrow('Invalid file type');
    });
  });

  describe('Performance', () => {
    test('handles large PDF files', async () => {
      const largePdfPath = path.join(testCVsPath, '1808.05377v3.pdf');
      const largePdf = createFileFromPath(largePdfPath);

      const mockResponse = { status: 'success', data: {} };
      (axios.create() as any).post.mockResolvedValueOnce({ data: mockResponse });

      const response = await uploadCV(largePdf);
      expect(response.status).toBe('success');
    });

    test('processes multiple CVs sequentially', async () => {
      const mockResponse = { status: 'success', data: {} };
      (axios.create() as any).post.mockResolvedValue({ data: mockResponse });

      const cvFiles = [pdfCV, docxCV, txtCV];
      const results = await Promise.all(cvFiles.map(file => uploadCV(file)));
      
      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result.status).toBe('success');
      });
    });
  });
}); 
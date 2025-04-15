import axios, { AxiosError } from 'axios';
import { supabase, PARSE_CV_ENDPOINT } from '@/integrations/supabase/supabaseClient';
import type { BackendResponse } from '@/types/cv';

interface CVParserError {
  response?: {
    data?: {
      errors?: string[];
      status?: string;
    };
    status?: number;
  };
  message?: string;
}

// Create axios instance for CV Parser API
export const cvParserApi = axios.create({
  baseURL: PARSE_CV_ENDPOINT,
  timeout: 30000, // 30 seconds timeout
});

// Add auth interceptor
cvParserApi.interceptors.request.use(async (config) => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error getting Supabase session:", error);
      return Promise.reject(error);
    }

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    // Add request ID for tracing
    config.headers['X-Request-ID'] = crypto.randomUUID();
    
    return config;
  } catch (e) {
    console.error("Error in CV Parser API request interceptor:", e);
    return Promise.reject(e);
  }
});

// Add response interceptor for error handling
cvParserApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.errors) {
      const errorMessage = error.response.data.errors[0];
      throw new Error(errorMessage);
    }
    throw error;
  }
);

// CV Parser API service functions
export const cvParserService = {
  /**
   * Parse a CV file and optionally match it against a job description
   */
  parseCV: async (cvFile: File, jobDescription?: string | File): Promise<BackendResponse> => {
    try {
      const formData = new FormData();
      formData.append('cv_file', cvFile);
      
      if (jobDescription) {
        if (jobDescription instanceof File) {
          formData.append('jd', jobDescription);
        } else {
          formData.append('jd', jobDescription);
        }
      }

      formData.append('task', 'parsing');
      
      const response = await cvParserApi.post<BackendResponse>('', formData);
      
      if (response.data.status === 'error' && response.data.errors?.length > 0) {
        throw new Error(response.data.errors[0]);
      }
      
      return response.data;
    } catch (error) {
      const cvError = error as CVParserError;
      console.error('CV parsing error:', cvError);
      if (cvError.response?.data?.errors?.length > 0) {
        throw new Error(cvError.response.data.errors[0]);
      }
      if (cvError.message) {
        throw error;
      }
      throw new Error('Failed to parse CV');
    }
  },

  /**
   * Optimise personal statement/profile
   */
  optimiseProfileStatement: async (cv: string | File, jobDescription?: string): Promise<BackendResponse> => {
    try {
      const formData = new FormData();
      formData.append('task', 'ps');
      
      // Handle CV input - either as File or ID
      if (cv instanceof File) {
        formData.append('cv_file', cv);
      } else if (typeof cv === 'string') {
        formData.append('cv_id', cv);
      } else {
        throw new Error('Invalid CV input: must be either a File or string ID');
      }
      
      if (jobDescription) {
        formData.append('jd', jobDescription);
      }

      const response = await cvParserApi.post<BackendResponse>('', formData);
      
      // Validate response structure
      if (!response.data) {
        throw new Error('Empty response received from server');
      }

      if (response.data.status === 'error') {
        if (response.data.errors?.length > 0) {
          throw new Error(response.data.errors[0]);
        }
        throw new Error('Server returned an error status without details');
      }

      // Ensure we have a data object
      if (!response.data.data) {
        response.data.data = {};
      }

      // Handle the optimised text - it could be in different fields based on API response
      if (!response.data.data.optimizedText && response.data.data.profileStatement) {
        response.data.data.optimizedText = response.data.data.profileStatement;
      }

      // Validate we have the optimised text
      if (!response.data.data.optimizedText) {
        throw new Error('Invalid response format: missing optimised text in response');
      }

      return response.data;
    } catch (error) {
      const cvError = error as CVParserError;
      console.error('Profile statement optimisation error:', {
        error: cvError,
        message: cvError.message,
        response: cvError.response?.data
      });

      // Enhance error message with more details
      if (cvError.response?.status === 500) {
        throw new Error('Server error occurred while optimising profile statement. Please try again later.');
      } else if (cvError.response?.data?.errors?.length > 0) {
        throw new Error(cvError.response.data.errors[0]);
      } else if (cvError.message) {
        throw error;
      }
      throw new Error('Failed to optimise profile statement: Unknown error occurred');
    }
  },

  /**
   * Optimise core skills section
   */
  optimiseSkills: async (cv: string | File, jobDescription?: string): Promise<BackendResponse> => {
    try {
      const formData = new FormData();
      formData.append('task', 'cs');
      
      // Handle CV input - either as File or ID
      if (cv instanceof File) {
        formData.append('cv_file', cv);
      } else if (typeof cv === 'string') {
        formData.append('cv_id', cv);
      } else {
        throw new Error('Invalid CV input: must be either a File or string ID');
      }
      
      if (jobDescription) {
        formData.append('jd', jobDescription);
      }

      // Log the request payload for debugging
      console.debug('Skills optimisation request:', {
        task: 'cs',
        cvType: cv instanceof File ? 'file' : 'id',
        hasJobDescription: !!jobDescription
      });

      const response = await cvParserApi.post<BackendResponse>('', formData);
      
      // Log the full response for debugging
      console.debug('Skills optimisation response:', response.data);
      
      // Validate response structure
      if (!response.data) {
        throw new Error('Empty response received from server');
      }

      if (typeof response.data !== 'object') {
        throw new Error('Invalid response format: expected an object');
      }

      if (response.data.status === 'error') {
        if (response.data.errors?.length > 0) {
          throw new Error(response.data.errors[0]);
        }
        throw new Error('Server returned an error status without details');
      }

      return response.data;
    } catch (error) {
      const cvError = error as CVParserError;
      console.error('Skills optimisation error:', {
        error: cvError,
        message: cvError.message,
        response: cvError.response?.data
      });

      if (cvError.response?.status === 500) {
        throw new Error('Server error occurred while optimising skills. Please try again later.');
      } else if (cvError.response?.data?.errors?.length > 0) {
        throw new Error(cvError.response.data.errors[0]);
      } else if (cvError.message) {
        throw error;
      }
      throw new Error('Failed to optimise skills: Unknown error occurred');
    }
  },

  /**
   * Optimise key achievements
   */
  optimiseAchievements: async (cv: string | File, jobDescription?: string): Promise<BackendResponse> => {
    try {
      const formData = new FormData();
      formData.append('task', 'achievements');
      
      // Handle CV input - either as File or ID
      if (cv instanceof File) {
        formData.append('cv_file', cv);
      } else if (typeof cv === 'string') {
        formData.append('cv_id', cv);
      } else {
        throw new Error('Invalid CV input: must be either a File or string ID');
      }
      
      if (jobDescription) {
        formData.append('jd', jobDescription);
      }

      const response = await cvParserApi.post<BackendResponse>('', formData);
      
      // Validate response structure
      if (!response.data) {
        throw new Error('Empty response received from server');
      }

      if (response.data.status === 'error') {
        if (response.data.errors?.length > 0) {
          throw new Error(response.data.errors[0]);
        }
        throw new Error('Server returned an error status without details');
      }

      return response.data;
    } catch (error) {
      const cvError = error as CVParserError;
      console.error('Achievements optimisation error:', {
        error: cvError,
        message: cvError.message,
        response: cvError.response?.data
      });

      if (cvError.response?.status === 500) {
        throw new Error('Server error occurred while optimising achievements. Please try again later.');
      } else if (cvError.response?.data?.errors?.length > 0) {
        throw new Error(cvError.response.data.errors[0]);
      } else if (cvError.message) {
        throw error;
      }
      throw new Error('Failed to optimise achievements: Unknown error occurred');
    }
  },

  /**
   * Optimise role descriptions
   */
  optimiseExperience: async (cv: string | File, jobDescription?: string): Promise<BackendResponse> => {
    try {
      const formData = new FormData();
      formData.append('task', 'experience');
      
      // Handle CV input - either as File or ID
      if (cv instanceof File) {
        formData.append('cv_file', cv);
      } else if (typeof cv === 'string') {
        formData.append('cv_id', cv);
      } else {
        throw new Error('Invalid CV input: must be either a File or string ID');
      }
      
      if (jobDescription) {
        formData.append('jd', jobDescription);
      }

      const response = await cvParserApi.post<BackendResponse>('', formData);
      
      // Validate response structure
      if (!response.data) {
        throw new Error('Empty response received from server');
      }

      if (response.data.status === 'error') {
        if (response.data.errors?.length > 0) {
          throw new Error(response.data.errors[0]);
        }
        throw new Error('Server returned an error status without details');
      }

      return response.data;
    } catch (error) {
      const cvError = error as CVParserError;
      console.error('Experience optimisation error:', {
        error: cvError,
        message: cvError.message,
        response: cvError.response?.data
      });

      if (cvError.response?.status === 500) {
        throw new Error('Server error occurred while optimising experience. Please try again later.');
      } else if (cvError.response?.data?.errors?.length > 0) {
        throw new Error(cvError.response.data.errors[0]);
      } else if (cvError.message) {
        throw error;
      }
      throw new Error('Failed to optimise experience: Unknown error occurred');
    }
  },

  /**
   * Score CV against job description
   */
  scoreCV: async (cvId: string, jobDescription: string | File): Promise<BackendResponse> => {
    try {
      const formData = new FormData();
      formData.append('task', 'score');
      formData.append('cv_id', cvId);
      
      if (jobDescription instanceof File) {
        formData.append('jd', jobDescription);
      } else {
        formData.append('jd', jobDescription);
      }

      const response = await cvParserApi.post<BackendResponse>('', formData);
      
      if (response.data.status === 'error' && response.data.errors?.length > 0) {
        throw new Error(response.data.errors[0]);
      }
      
      return response.data;
    } catch (error) {
      const cvError = error as CVParserError;
      console.error('CV scoring error:', cvError);
      if (cvError.response?.data?.errors?.length > 0) {
        throw new Error(cvError.response.data.errors[0]);
      }
      if (cvError.message) {
        throw error;
      }
      throw new Error('Failed to score CV');
    }
  },

  /**
   * Generate a document (PDF or DOCX) from CV data
   */
  generateDocument: async (formData: FormData): Promise<BackendResponse> => {
    try {
      const response = await cvParserApi.post<BackendResponse>('/generate', formData);
      
      if (response.data.status === 'error') {
        if (response.data.errors?.length > 0) {
          throw new Error(response.data.errors[0]);
        }
        throw new Error('Server returned an error status without details');
      }

      return response.data;
    } catch (error) {
      const cvError = error as CVParserError;
      console.error('Document generation error:', {
        error: cvError,
        message: cvError.message,
        response: cvError.response?.data
      });

      if (cvError.response?.status === 500) {
        throw new Error('Server error occurred while generating document. Please try again later.');
      } else if (cvError.response?.data?.errors?.length > 0) {
        throw new Error(cvError.response.data.errors[0]);
      } else if (cvError.message) {
        throw error;
      }
      throw new Error('Failed to generate document: Unknown error occurred');
    }
  }
}; 
import axios from 'axios';
import { supabase, PARSE_CV_ENDPOINT } from '@/integrations/supabase/supabaseClient';
import type { BackendResponse } from '@/types/cv';

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
  async parseCV(
    cvFile: File,
    jobDescription?: string | File
  ): Promise<BackendResponse> {
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
    } catch (error: any) {
      console.error('CV parsing error:', error);
      if (error.response?.data?.errors?.length > 0) {
        throw new Error(error.response.data.errors[0]);
      }
      if (error.message) {
        throw error;
      }
      throw new Error('Failed to parse CV');
    }
  },

  /**
   * Optimize personal statement/profile
   */
  async optimizeProfileStatement(
    cv: File | string,
    jobDescription?: string
  ): Promise<BackendResponse> {
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

      // Log the request payload for debugging
      console.debug('Profile statement optimization request:', {
        task: 'ps',
        cvType: cv instanceof File ? 'file' : 'id',
        hasJobDescription: !!jobDescription
      });

      const response = await cvParserApi.post<BackendResponse>('', formData);
      
      // Log the full response for debugging
      console.debug('Profile statement optimization response:', response.data);
      
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

      // Check if we have the expected data structure
      if (!response.data.data) {
        throw new Error('Invalid response format: missing data object in response');
      }
      
      // If optimizedText is missing, try to extract it from the response
      if (!response.data.data.optimizedText) {
        console.warn('Response missing optimizedText field:', response.data);
        
        // Try to find the optimized text in the response
        if (response.data.data.profileStatement) {
          // If we have a profileStatement field, use that
          response.data.data.optimizedText = response.data.data.profileStatement;
        } else if (response.data.data.text) {
          // If we have a text field, use that
          response.data.data.optimizedText = response.data.data.text;
        } else if (response.data.data.optimized) {
          // If we have an optimized field, use that
          response.data.data.optimizedText = response.data.data.optimized;
        } else {
          // If we can't find any suitable field, throw an error
          throw new Error('Invalid response format: missing optimizedText in response data');
        }
      }

      return response.data;
    } catch (error: any) {
      console.error('Profile statement optimization error:', {
        error,
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });

      // Enhance error message with more details
      if (error.response?.status === 500) {
        throw new Error('Server error occurred while optimising profile statement. Please try again later.');
      } else if (error.response?.data?.errors?.length > 0) {
        throw new Error(error.response.data.errors[0]);
      } else if (error.message) {
        throw error;
      }
      throw new Error('Failed to optimise profile statement: Unknown error occurred');
    }
  },

  /**
   * Optimize core skills section
   */
  async optimizeSkills(
    cv: File | string,
    jobDescription?: string
  ): Promise<BackendResponse> {
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
      console.debug('Skills optimization request:', {
        task: 'cs',
        cvType: cv instanceof File ? 'file' : 'id',
        hasJobDescription: !!jobDescription
      });

      const response = await cvParserApi.post<BackendResponse>('', formData);
      
      // Log the full response for debugging
      console.debug('Skills optimization response:', response.data);
      
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

      // Check if we have the expected data structure
      if (!response.data.data) {
        throw new Error('Invalid response format: missing data object in response');
      }
      
      // If optimizedSkills is missing, try to extract it from the response
      if (!response.data.data.optimizedSkills) {
        console.warn('Response missing optimizedSkills field:', response.data);
        
        // Try to find the optimized skills in the response
        if (response.data.data.skills) {
          // If we have a skills field, use that
          response.data.data.optimizedSkills = response.data.data.skills;
        } else if (response.data.data.optimized) {
          // If we have an optimized field, use that
          response.data.data.optimizedSkills = response.data.data.optimized;
        } else {
          // If we can't find any suitable field, throw an error
          throw new Error('Invalid response format: missing optimizedSkills in response data');
        }
      }

      return response.data;
    } catch (error: any) {
      console.error('Skills optimization error:', {
        error,
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });

      // Enhance error message with more details
      if (error.response?.status === 500) {
        throw new Error('Server error occurred while optimising skills. Please try again later.');
      } else if (error.response?.data?.errors?.length > 0) {
        throw new Error(error.response.data.errors[0]);
      } else if (error.message) {
        throw error;
      }
      throw new Error('Failed to optimise skills: Unknown error occurred');
    }
  },

  /**
   * Optimize key achievements
   */
  async optimizeAchievements(
    cv: File | string,
    jobDescription?: string
  ): Promise<BackendResponse> {
    try {
      const formData = new FormData();
      formData.append('task', 'ka');
      
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
      console.debug('Achievements optimization request:', {
        task: 'ka',
        cvType: cv instanceof File ? 'file' : 'id',
        hasJobDescription: !!jobDescription
      });

      const response = await cvParserApi.post<BackendResponse>('', formData);
      
      // Log the full response for debugging
      console.debug('Achievements optimization response:', response.data);
      
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

      // Check if we have the expected data structure
      if (!response.data.data) {
        throw new Error('Invalid response format: missing data object in response');
      }
      
      // If optimizedAchievements is missing, try to extract it from the response
      if (!response.data.data.optimizedAchievements) {
        console.warn('Response missing optimizedAchievements field:', response.data);
        
        // Try to find the optimized achievements in the response
        if (response.data.data.achievements) {
          // If we have an achievements field, use that
          response.data.data.optimizedAchievements = response.data.data.achievements;
        } else if (response.data.data.optimized) {
          // If we have an optimized field, use that
          response.data.data.optimizedAchievements = response.data.data.optimized;
        } else {
          // If we can't find any suitable field, throw an error
          throw new Error('Invalid response format: missing optimizedAchievements in response data');
        }
      }

      return response.data;
    } catch (error: any) {
      console.error('Achievements optimization error:', {
        error,
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });

      // Enhance error message with more details
      if (error.response?.status === 500) {
        throw new Error('Server error occurred while optimising achievements. Please try again later.');
      } else if (error.response?.data?.errors?.length > 0) {
        throw new Error(error.response.data.errors[0]);
      } else if (error.message) {
        throw error;
      }
      throw new Error('Failed to optimise achievements: Unknown error occurred');
    }
  },

  /**
   * Optimize role descriptions
   */
  async optimizeExperience(
    cv: File | string,
    experienceIndex: number,
    jobDescription?: string
  ): Promise<BackendResponse> {
    try {
      const formData = new FormData();
      formData.append('task', 'role');
      
      // Handle CV input - either as File or ID
      if (cv instanceof File) {
        formData.append('cv_file', cv);
      } else if (typeof cv === 'string') {
        formData.append('cv_id', cv);
      } else {
        throw new Error('Invalid CV input: must be either a File or string ID');
      }
      
      formData.append('experience_index', experienceIndex.toString());
      
      if (jobDescription) {
        formData.append('jd', jobDescription);
      }

      const response = await cvParserApi.post<BackendResponse>('', formData);
      
      // Log the response for debugging
      console.debug('Experience optimization response:', response.data);
      
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

      // If optimizedExperience is missing, construct it from the response data
      if (!response.data.data.optimizedExperience) {
        const data = response.data.data;
        
        // Create an optimizedExperience object from the response data
        response.data.data.optimizedExperience = {
          highlights: Array.isArray(data.highlights) ? data.highlights :
                     Array.isArray(data.bulletPoints) ? data.bulletPoints :
                     Array.isArray(data.points) ? data.points : [],
          summary: data.summary || data.description || data.text || '',
          company: data.company || data.employer || data.organisation || '',
          title: data.title || data.role || data.position || '',
          start: data.start || data.startDate || '',
          end: data.end || data.endDate || '',
          current: data.current || data.isCurrent || false
        };
      }

      return response.data;
    } catch (error: any) {
      console.error('Experience optimization error:', {
        error,
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });

      if (error.response?.status === 500) {
        throw new Error('Server error occurred while optimising experience. Please try again later.');
      } else if (error.response?.data?.errors?.length > 0) {
        throw new Error(error.response.data.errors[0]);
      } else if (error.message) {
        throw error;
      }
      throw new Error('Failed to optimise experience: Unknown error occurred');
    }
  },

  /**
   * Score CV against job description
   */
  async scoreCV(
    cvId: string,
    jobDescription: string | File
  ): Promise<BackendResponse> {
    try {
      const formData = new FormData();
      formData.append('task', 'scoring');
      formData.append('cv_id', cvId);
      
      if (jobDescription instanceof File) {
        formData.append('jd', jobDescription);
      } else {
        formData.append('jd', jobDescription);
      }

      const response = await cvParserApi.post<BackendResponse>('', formData);
      return response.data;
    } catch (error) {
      console.error('CV scoring error:', error);
      throw error;
    }
  }
}; 
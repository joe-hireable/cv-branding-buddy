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
   * Optimise personal statement/profile
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
    } catch (error: any) {
      console.error('Profile statement optimisation error:', {
        error,
        message: error.message,
        response: error.response?.data
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
   * Optimise core skills section
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

      // Check if we have the expected data structure
      if (!response.data.data) {
        throw new Error('Invalid response format: missing data object in response');
      }
      
      // If optimisedSkills is missing, try to extract it from the response
      if (!response.data.data.optimizedSkills) {
        console.warn('Response missing optimisedSkills field:', response.data);
        
        // Try to find the optimised skills in the response
        if (response.data.data.skills) {
          response.data.data.optimizedSkills = response.data.data.skills;
        } else if (response.data.data.optimized) {
          // If we have an optimised field, use that
          response.data.data.optimizedSkills = response.data.data.optimized;
        } else {
          throw new Error('Invalid response format: missing optimisedSkills in response data');
        }
      }

      return response.data;
    } catch (error: any) {
      console.error('Skills optimisation error:', {
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
   * Optimise key achievements
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

      const response = await cvParserApi.post<BackendResponse>('', formData);
      
      // Log the response for debugging
      console.debug('Achievements optimisation response:', response.data);
      
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

      // If optimisedAchievements is missing, use the achievements array from the response
      if (!response.data.data.optimizedAchievements) {
        if (response.data.data.achievements) {
          response.data.data.optimizedAchievements = response.data.data.achievements;
        } else if (response.data.data.keyAchievements) {
          response.data.data.optimizedAchievements = response.data.data.keyAchievements;
        } else if (response.data.data.accomplishments) {
          response.data.data.optimizedAchievements = response.data.data.accomplishments;
        } else if (response.data.data.highlights) {
          response.data.data.optimizedAchievements = response.data.data.highlights;
        } else {
          // If no achievements array is found, initialise an empty array
          response.data.data.optimizedAchievements = [];
        }
      }

      // Ensure each achievement is a string
      response.data.data.optimizedAchievements = response.data.data.optimizedAchievements.map(
        (achievement: any) => typeof achievement === 'string' ? achievement : achievement.text || achievement.description || achievement.toString()
      );

      return response.data;
    } catch (error: any) {
      console.error('Achievements optimisation error:', {
        error,
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });

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
   * Optimise role descriptions
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
      console.debug('Experience optimisation response:', response.data);
      
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

      // If optimisedExperience is missing, construct it from the response data
      if (!response.data.data.optimisedExperience) {
        const data = response.data.data;
        
        // Create an optimisedExperience object from the response data
        response.data.data.optimisedExperience = {
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
      console.error('Experience optimisation error:', {
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
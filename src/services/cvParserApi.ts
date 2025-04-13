import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';
import { PARSE_CV_ENDPOINT } from '@/integrations/supabase/client';
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
      } else {
        formData.append('cv_id', cv);
      }
      
      if (jobDescription) {
        formData.append('jd', jobDescription);
      }

      const response = await cvParserApi.post<BackendResponse>('', formData);
      return response.data;
    } catch (error) {
      console.error('Profile statement optimization error:', error);
      throw error;
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
      } else {
        formData.append('cv_id', cv);
      }
      
      if (jobDescription) {
        formData.append('jd', jobDescription);
      }

      const response = await cvParserApi.post<BackendResponse>('', formData);
      return response.data;
    } catch (error) {
      console.error('Skills optimization error:', error);
      throw error;
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
      } else {
        formData.append('cv_id', cv);
      }
      
      if (jobDescription) {
        formData.append('jd', jobDescription);
      }

      const response = await cvParserApi.post<BackendResponse>('', formData);
      return response.data;
    } catch (error) {
      console.error('Achievements optimization error:', error);
      throw error;
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
      } else {
        formData.append('cv_id', cv);
      }
      
      formData.append('experience_index', experienceIndex.toString());
      
      if (jobDescription) {
        formData.append('jd', jobDescription);
      }

      const response = await cvParserApi.post<BackendResponse>('', formData);
      return response.data;
    } catch (error) {
      console.error('Experience optimization error:', error);
      throw error;
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
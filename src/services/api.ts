/**
 * @file API Service
 * @description Base API service with error handling and type safety
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { CV, BackendResponse, RecruiterProfile, AppSettings, Experience, Skill } from '@/types/cv';
import { cvParserService } from './cvParserApi';
import { supabase } from '@/integrations/supabase/client';

/**
 * API error class for handling API-specific errors
 * @class APIError
 * @extends {Error}
 */
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Base API service class
 * @class APIService
 */
export class APIService {
  protected supabase;

  constructor() {
    this.supabase = createClient<Database>(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
  }

  /**
   * Handles API errors in a consistent way
   * @param {unknown} error - The error to handle
   * @returns {never} Never returns, always throws an APIError
   */
  protected handleError(error: unknown): never {
    if (error instanceof APIError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new APIError(
        error.message,
        500,
        'INTERNAL_SERVER_ERROR'
      );
    }

    throw new APIError(
      'An unexpected error occurred',
      500,
      'UNKNOWN_ERROR'
    );
  }

  /**
   * Makes a type-safe API request
   * @template T - The expected response type
   * @param {Promise<T>} request - The API request to make
   * @returns {Promise<T>} The API response
   */
  protected async makeRequest<T>(request: Promise<T>): Promise<T> {
    try {
      return await request;
    } catch (error) {
      this.handleError(error);
    }
  }
}

// This is a mock implementation since we don't have the actual backend yet
// In a real implementation, these would make API calls to the backend services

export async function uploadCV(file: File, jdFile: File | null = null): Promise<BackendResponse> {
  return cvParserService.parseCV(file, jdFile || undefined);
}

export async function uploadJobDescription(file: File): Promise<BackendResponse> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 'success',
        errors: null,
        data: {
          // Mock JD data
          title: 'Senior Software Developer',
          company: 'Tech Organization',
          description: 'We are looking for a Senior Software Developer with experience in React and Node.js...'
        }
      });
    }, 1000);
  });
}

export async function optimiseProfileStatement(
  cv: File | string,
  jobDescription?: string
): Promise<BackendResponse> {
  try {
    // If cv is a string (CV ID), fetch the CV data from Supabase
    if (typeof cv === 'string') {
      const { data, error } = await this.supabase
        .from('cvs')
        .select('parsed_data')
        .eq('id', cv)
        .single();

      if (error) throw error;
      if (!data?.parsed_data) throw new Error('CV data not found');

      // Use the profile statement from the parsed data
      cv = data.parsed_data.profileStatement;
    }

    return cvParserService.optimiseProfileStatement(cv, jobDescription);
  } catch (error) {
    console.error('Error in optimiseProfileStatement:', error);
    throw error;
  }
}

export async function optimiseSkills(
  cv: File | string,
  jobDescription?: string
): Promise<BackendResponse> {
  try {
    // If cv is a string (CV ID), fetch the CV data from Supabase
    if (typeof cv === 'string') {
      const { data, error } = await this.supabase
        .from('cvs')
        .select('parsed_data')
        .eq('id', cv)
        .single();

      if (error) throw error;
      if (!data?.parsed_data) throw new Error('CV data not found');

      // Use the skills from the parsed data
      cv = data.parsed_data.skills;
    }

    return cvParserService.optimiseSkills(cv, jobDescription);
  } catch (error) {
    console.error('Error in optimiseSkills:', error);
    throw error;
  }
}

export async function optimiseAchievements(
  cv: File | string,
  jobDescription?: string
): Promise<BackendResponse> {
  try {
    // If cv is a string (CV ID), fetch the CV data from Supabase
    if (typeof cv === 'string') {
      const { data, error } = await this.supabase
        .from('cvs')
        .select('parsed_data')
        .eq('id', cv)
        .single();

      if (error) throw error;
      if (!data?.parsed_data) throw new Error('CV data not found');

      // Use the achievements from the parsed data
      cv = data.parsed_data.achievements;
    }

    return cvParserService.optimiseAchievements(cv, jobDescription);
  } catch (error) {
    console.error('Error in optimiseAchievements:', error);
    throw error;
  }
}

export async function optimiseExperience(
  cv: File | string,
  jobDescription?: string
): Promise<BackendResponse> {
  try {
    // If cv is a string (CV ID), fetch the CV data from Supabase
    if (typeof cv === 'string') {
      const { data, error } = await this.supabase
        .from('cvs')
        .select('parsed_data')
        .eq('id', cv)
        .single();

      if (error) throw error;
      if (!data?.parsed_data) throw new Error('CV data not found');

      // Use the experience from the parsed data
      cv = data.parsed_data.experience;
    }

    return cvParserService.optimiseExperience(cv, jobDescription);
  } catch (error) {
    console.error('Error in optimiseExperience:', error);
    throw error;
  }
}

export async function generateDocument(
  cv: CV,
  format: 'PDF' | 'DOCX',
  recruiterProfile: RecruiterProfile
): Promise<string> {
  try {
    const formData = new FormData();
    
    // Add CV data
    formData.append('cv_data', JSON.stringify(cv));
    
    // Add recruiter profile
    formData.append('recruiter_profile', JSON.stringify(recruiterProfile));
    
    // Add format
    formData.append('format', format);
    
    // Make the API call
    const response = await cvParserService.generateDocument(formData);
    
    if (response.status === 'error') {
      throw new Error(response.errors?.[0] || 'Failed to generate document');
    }
    
    // Return the URL to the generated document
    return response.data.documentUrl;
  } catch (error) {
    console.error('Error generating document:', error);
    throw new APIError(
      error instanceof Error ? error.message : 'Failed to generate document',
      500,
      'DOCUMENT_GENERATION_ERROR'
    );
  }
}

export async function getRecruiterProfile(): Promise<RecruiterProfile> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@agency.com',
        phone: '+44 123 456 7890',
        profilePicture: '/placeholder.svg',
        agencyName: 'Tech Recruiters Ltd',
        website: 'https://techrecruiters.com'
      });
    }, 1000);
  });
}

export async function updateRecruiterProfile(profile: RecruiterProfile): Promise<RecruiterProfile> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(profile);
    }, 1000);
  });
}

type Settings = Database['public']['Tables']['settings']['Row']
type SettingsInsert = Database['public']['Tables']['settings']['Insert']
type SettingsUpdate = Database['public']['Tables']['settings']['Update']

export const getAppSettings = async (userId: string): Promise<Settings> => {
  console.log('[getAppSettings] Fetching settings for user:', userId);
  
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('[getAppSettings] Supabase error:', error);
      throw new Error(`Failed to fetch settings: ${error.message}`)
    }

    console.log('[getAppSettings] Received data:', data);

    if (!data) {
      console.log('[getAppSettings] No settings found, creating default settings');
      const defaultSettings: SettingsInsert = {
        user_id: userId,
        default_section_visibility: {
          profileStatement: true,
          skills: true,
          experience: true,
          education: true,
          achievements: true,
          certifications: true,
          languages: true,
          references: true
        },
        default_section_order: {
          sections: [
            'profileStatement',
            'skills',
            'experience',
            'education',
            'achievements',
            'certifications',
            'languages',
            'references'
          ]
        },
        default_anonymise: false,
        keep_original_files: true,
        default_export_format: 'PDF',
        theme: 'system'
      }

      const { data: newData, error: insertError } = await supabase
        .from('settings')
        .insert(defaultSettings)
        .select()
        .single()

      if (insertError) {
        console.error('[getAppSettings] Error creating default settings:', insertError);
        throw new Error(`Failed to create default settings: ${insertError.message}`)
      }

      console.log('[getAppSettings] Created default settings:', newData);
      return newData
    }

    // Transform the data to match the frontend's expected format
    const sectionOrder = typeof data.default_section_order === 'string' 
      ? JSON.parse(data.default_section_order)
      : data.default_section_order;

    const transformedData = {
      ...data,
      default_section_visibility: data.default_section_visibility || {},
      default_section_order: {
        sections: Array.isArray(sectionOrder) ? sectionOrder : (sectionOrder?.sections || [])
      }
    };

    console.log('[getAppSettings] Transformed data:', transformedData);
    return transformedData;
  } catch (error) {
    console.error('[getAppSettings] Unexpected error:', error);
    throw error;
  }
}

export const updateAppSettings = async (settings: SettingsUpdate, userId: string): Promise<Settings> => {
  // Transform the settings to match the database schema
  const dbSettings: SettingsUpdate = {
    ...settings,
    default_section_order: settings.default_section_order || [],
    default_section_visibility: settings.default_section_visibility,
    default_anonymise: settings.default_anonymise,
    keep_original_files: settings.keep_original_files,
    default_export_format: settings.default_export_format,
    theme: settings.theme
  };

  const { data, error } = await supabase
    .from('settings')
    .update(dbSettings)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update settings: ${error.message}`)
  }

  return data
}

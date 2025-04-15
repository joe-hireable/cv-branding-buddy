/**
 * @file API Service
 * @description Base API service with error handling and type safety
 */

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { CV, BackendResponse, RecruiterProfile, AppSettings, Experience, Skill } from '@/types/cv';
import { cvParserService } from './cvParserApi';

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
  return cvParserService.optimiseProfileStatement(cv, jobDescription);
}

export async function optimiseSkills(
  cv: File | string,
  jobDescription?: string
): Promise<BackendResponse> {
  return cvParserService.optimiseSkills(cv, jobDescription);
}

export async function optimiseAchievements(
  cv: File | string,
  jobDescription?: string
): Promise<BackendResponse> {
  return cvParserService.optimiseAchievements(cv, jobDescription);
}

export async function optimiseExperience(
  cv: File | string,
  experienceIndex: number,
  jobDescription?: string
): Promise<BackendResponse> {
  return cvParserService.optimiseExperience(cv, experienceIndex, jobDescription);
}

export async function generateDocument(cv: CV, format: 'PDF' | 'DOCX', recruiterProfile: RecruiterProfile): Promise<string> {
  // TODO: Implement document generation using the CV Parser API
  // For now, keeping the mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('https://example.com/documents/cv-12345.' + format.toLowerCase());
    }, 3000);
  });
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

export async function getAppSettings(): Promise<AppSettings> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        defaultSectionVisibility: {
          personalInfo: true,
          profileStatement: true,
          skills: true,
          experience: true,
          education: true,
          certifications: true,
          achievements: true,
          languages: true,
          professionalMemberships: true,
          earlierCareer: false,
          publications: false,
          additionalDetails: false,
        },
        defaultSectionOrder: {
          sections: [
            'personalInfo',
            'profileStatement',
            'skills',
            'experience',
            'education',
            'achievements',
            'certifications',
            'languages',
            'professionalMemberships',
            'publications',
            'earlierCareer',
            'additionalDetails',
          ]
        },
        defaultAnonymize: false,
        keepOriginalFiles: true,
        defaultExportFormat: 'PDF'
      });
    }, 1000);
  });
}

export async function updateAppSettings(settings: AppSettings): Promise<AppSettings> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(settings);
    }, 1000);
  });
}

import { CV, BackendResponse, RecruiterProfile, AppSettings } from '@/types/cv';
import { cvParserService } from './cvParserApi';

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

export async function optimizeProfileStatement(
  cv: File | string,
  jobDescription?: string
): Promise<BackendResponse> {
  return cvParserService.optimizeProfileStatement(cv, jobDescription);
}

export async function optimizeSkills(
  cv: File | string,
  jobDescription?: string
): Promise<BackendResponse> {
  return cvParserService.optimizeSkills(cv, jobDescription);
}

export async function optimizeAchievements(
  cv: File | string,
  jobDescription?: string
): Promise<BackendResponse> {
  return cvParserService.optimizeAchievements(cv, jobDescription);
}

export async function optimizeExperience(
  cv: File | string,
  experienceIndex: number,
  jobDescription?: string
): Promise<BackendResponse> {
  return cvParserService.optimizeExperience(cv, experienceIndex, jobDescription);
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

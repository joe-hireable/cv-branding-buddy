
import { CV, BackendResponse, RecruiterProfile, AppSettings } from '@/types/cv';

// This is a mock implementation since we don't have the actual backend yet
// In a real implementation, these would make API calls to the backend services

export async function uploadCV(file: File): Promise<BackendResponse> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 'success',
        errors: null,
        data: {
          // Mock CV data that would be returned from the backend parser
          firstName: 'John',
          surname: 'Doe',
          email: 'john.doe@example.com',
          phone: '+44 123 456 7890',
          links: [{ title: 'LinkedIn', url: 'https://linkedin.com/in/johndoe' }],
          location: { city: 'London', country: 'UK', postalCode: 'EC1A 1BB' },
          headline: 'Senior Software Developer',
          profileStatement: 'Senior Software Developer with 8+ years of experience in full-stack development, specializing in scalable web applications and cloud architecture.',
          skills: [
            { name: 'JavaScript', proficiency: 'Expert', skillType: 'hard' },
            { name: 'React', proficiency: 'Expert', skillType: 'hard' },
            { name: 'Node.js', proficiency: 'Advanced', skillType: 'hard' },
            { name: 'Team Leadership', proficiency: 'Advanced', skillType: 'soft' },
          ],
          achievements: [
            'Led development of cloud-native applications',
            'Managed team of 5 developers',
            'Reduced system latency by 40%'
          ],
          experience: [
            {
              company: 'Tech Company',
              title: 'Senior Developer',
              start: '2022-01',
              end: null,
              current: true,
              summary: 'Leading development of cloud applications',
              highlights: [
                'Led development of cloud-native applications',
                'Managed team of 5 developers'
              ]
            },
            {
              company: 'Digital Agency',
              title: 'Developer',
              start: '2019-03',
              end: '2021-12',
              current: false,
              summary: 'Full-stack development for client projects',
              highlights: [
                'Developed frontend for e-commerce platforms',
                'Implemented API integrations'
              ]
            }
          ],
          education: [
            {
              institution: 'University of Technology',
              location: { city: 'London', country: 'UK', postalCode: null },
              qualifications: [
                {
                  qualification: 'Bachelor\'s',
                  course: 'Computer Science',
                  start: '2015',
                  end: '2019',
                  grade: '2:1'
                }
              ]
            }
          ]
        }
      });
    }, 1500);
  });
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

export async function optimizeProfileStatement(cvId: string, jdId?: string): Promise<BackendResponse> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 'success',
        errors: null,
        data: {
          originalText: 'Senior Software Developer with 8+ years of experience.',
          optimizedText: 'Results-driven Senior Software Developer with 8+ years of expertise in designing scalable cloud applications and leading development teams. Proven track record in reducing system latency by 40% through architecture optimization.',
          feedback: 'Added more specifics about achievements and technical strengths.'
        }
      });
    }, 2000);
  });
}

export async function optimizeSkills(cvId: string, jdId?: string): Promise<BackendResponse> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 'success',
        errors: null,
        data: {
          originalSkills: [
            { name: 'JavaScript', proficiency: 'Expert', skillType: 'hard' },
            { name: 'React', proficiency: 'Expert', skillType: 'hard' },
            { name: 'Node.js', proficiency: 'Advanced', skillType: 'hard' },
          ],
          optimizedSkills: [
            { name: 'JavaScript', proficiency: 'Expert', skillType: 'hard' },
            { name: 'React', proficiency: 'Expert', skillType: 'hard' },
            { name: 'Node.js', proficiency: 'Advanced', skillType: 'hard' },
            { name: 'Cloud Architecture', proficiency: 'Advanced', skillType: 'hard' },
            { name: 'Team Leadership', proficiency: 'Advanced', skillType: 'soft' },
          ],
          feedback: 'Added Cloud Architecture based on experience description. Added Team Leadership as a soft skill.'
        }
      });
    }, 2000);
  });
}

export async function optimizeAchievements(cvId: string, jdId?: string): Promise<BackendResponse> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 'success',
        errors: null,
        data: {
          originalAchievements: ['Led development', 'Managed team'],
          optimizedAchievements: [
            'Led development of enterprise-level cloud-native applications resulting in 30% faster deployment cycles',
            'Managed team of 5 developers, improving productivity by 25% through agile methodologies',
            'Reduced system latency by 40% through architecture optimization and code refactoring'
          ],
          feedback: 'Expanded achievements with specific metrics and outcomes.'
        }
      });
    }, 2000);
  });
}

export async function optimizeExperience(cvId: string, experienceIndex: number, jdId?: string): Promise<BackendResponse> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 'success',
        errors: null,
        data: {
          originalExperience: {
            company: 'Tech Company',
            title: 'Senior Developer',
            highlights: [
              'Led development of cloud-native applications',
              'Managed team of 5 developers'
            ]
          },
          optimizedExperience: {
            company: 'Tech Company',
            title: 'Senior Developer',
            highlights: [
              'Led development of cloud-native applications, implementing microservices architecture that improved scalability by 200%',
              'Managed team of 5 developers, implementing agile methodologies that increased delivery speed by 30%',
              'Orchestrated migration to AWS cloud, reducing infrastructure costs by 25%'
            ]
          },
          feedback: 'Added specific metrics and technical details to highlight achievements.'
        }
      });
    }, 2000);
  });
}

export async function generateDocument(cv: CV, format: 'PDF' | 'DOCX', recruiterProfile: RecruiterProfile): Promise<string> {
  // Simulate API call to generate document
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real implementation, this would return a URL to the generated document
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

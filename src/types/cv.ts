/**
 * @file CV Types
 * @description Type definitions for CV/resume-related functionality
 */

/**
 * CV section types
 * @enum {string}
 */
export enum CVSectionType {
  SUMMARY = 'summary',
  EXPERIENCE = 'experience',
  EDUCATION = 'education',
  SKILLS = 'skills',
  PROJECTS = 'projects',
  CERTIFICATIONS = 'certifications',
  LANGUAGES = 'languages',
  CUSTOM = 'custom'
}

/**
 * Base interface for all CV sections
 * @interface CVSection
 */
export interface CVSection {
  /** Unique identifier for the section */
  id: string;
  /** Type of the section */
  type: CVSectionType;
  /** Title of the section */
  title: string;
  /** Order of the section in the CV */
  order: number;
  /** Whether the section is visible in the CV */
  isVisible: boolean;
}

/**
 * Experience entry in a CV
 * @interface ExperienceEntry
 */
export interface ExperienceEntry {
  /** Company name */
  company: string;
  /** Job title */
  title: string;
  /** Start date of employment */
  startDate: Date;
  /** End date of employment (null if current) */
  endDate: Date | null;
  /** Location of employment */
  location: string;
  /** Description of responsibilities and achievements */
  description: string[];
  /** Technologies used in the role */
  technologies?: string[];
}

/**
 * Education entry in a CV
 * @interface EducationEntry
 */
export interface EducationEntry {
  /** Institution name */
  institution: string;
  /** Degree or qualification */
  degree: string;
  /** Field of study */
  field: string;
  /** Start date of education */
  startDate: Date;
  /** End date of education (null if current) */
  endDate: Date | null;
  /** Location of institution */
  location: string;
  /** Grade or GPA (optional) */
  grade?: string;
}

/**
 * CV document interface
 * @interface CVDocument
 */
export interface CVDocument {
  /** Unique identifier for the CV */
  id: string;
  /** User who owns the CV */
  userId: string;
  /** Title of the CV */
  title: string;
  /** When the CV was created */
  createdAt: Date;
  /** When the CV was last updated */
  updatedAt: Date;
  /** Whether this is the user's primary CV */
  isPrimary: boolean;
  /** Sections in the CV */
  sections: {
    [key in CVSectionType]?: CVSection & {
      entries?: (ExperienceEntry | EducationEntry)[];
    };
  };
}

/**
 * CV parsing result interface
 * @interface CVParsingResult
 */
export interface CVParsingResult {
  /** Whether parsing was successful */
  success: boolean;
  /** Parsed CV document */
  document?: CVDocument;
  /** Any error that occurred during parsing */
  error?: string;
  /** Confidence score of the parsing (0-1) */
  confidence: number;
}

export interface Link {
  title: string | null;
  url: string | null;
}

export interface Location {
  city: string | null;
  country: string | null;
  postalCode: string | null;
}

export interface Skill {
  name: string;
  proficiency: "Beginner" | "Average" | "Intermediate" | "Advanced" | "Expert";
  skillType: "hard" | "soft";
}

export interface Language {
  name: string;
  level: "Native" | "Fluent" | "Advanced" | "Intermediate" | "Basic" | null;
}

export interface Experience {
  company: string;
  title?: string;
  start: string | null;
  end: string | null;
  current: boolean;
  summary: string | null;
  highlights: string[] | null;
}

export interface Qualification {
  qualification: string | null;
  course: string;
  start: string | null;
  end: string | null;
  grade: string | null;
}

export interface Education {
  institution: string;
  location: Location | null;
  qualifications: Qualification[] | null;
}

export interface Certification {
  name: string;
  issuer: string | null;
  date: string | null;
}

export interface ProfessionalMembership {
  institution: string;
  name: string;
}

export interface Role {
  title: string;
  start: string | null;
  end: string | null;
}

export interface EarlierCareer {
  company: string;
  start: string | null;
  end: string | null;
  roles: Role[];
}

export interface Publication {
  pubType: string | null;
  title: string;
  date: string | null;
}

export interface CV {
  id?: string;
  file?: File;
  jobDescription?: string;
  firstName: string | null;
  surname: string | null;
  email: string | null;
  phone: string | null;
  links: Link[] | null;
  location: Location | null;
  headline: string;
  profileStatement: string;
  skills: Skill[];
  achievements: string[];
  languages: Language[] | null;
  experience: Experience[];
  education: Education[] | null;
  certifications: Certification[] | null;
  professionalMemberships: ProfessionalMembership[] | null;
  earlierCareer: EarlierCareer[] | null;
  publications: Publication[] | null;
  addDetails: string[] | null;
}

export interface CVSectionVisibility {
  personalInfo: boolean;
  profileStatement: boolean;
  skills: boolean;
  experience: boolean;
  education: boolean;
  certifications: boolean;
  achievements: boolean;
  languages: boolean;
  professionalMemberships: boolean;
  earlierCareer: boolean;
  publications: boolean;
  additionalDetails: boolean;
}

export interface CVSectionOrder {
  sections: string[];
}

export interface RecruiterProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profilePicture?: string;
  agencyName: string;
  agencyLogo?: string;
  website?: string;
}

export interface AppSettings {
  defaultSectionVisibility: CVSectionVisibility;
  defaultSectionOrder: CVSectionOrder;
  defaultAnonymise: boolean;
  keepOriginalFiles: boolean;
  defaultExportFormat: "PDF" | "DOCX";
  theme: "light" | "dark" | "system";
}

export interface BackendResponse {
  status: "success" | "error" | "partial";
  errors: string[] | null;
  data: any;
}

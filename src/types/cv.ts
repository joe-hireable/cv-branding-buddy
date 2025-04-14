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

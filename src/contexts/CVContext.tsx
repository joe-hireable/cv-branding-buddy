
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CV, CVSectionVisibility, CVSectionOrder } from '@/types/cv';

interface CVContextType {
  cv: CV | null;
  sectionVisibility: CVSectionVisibility;
  sectionOrder: CVSectionOrder;
  isAnonymized: boolean;
  isLoading: boolean;
  setCv: (cv: CV | null) => void;
  updateCvField: (field: string, value: any) => void;
  setSectionVisibility: (section: keyof CVSectionVisibility, isVisible: boolean) => void;
  setSectionOrder: (order: string[]) => void;
  setIsAnonymized: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
}

const defaultSectionVisibility: CVSectionVisibility = {
  personalInfo: true,
  profileStatement: true,
  skills: true,
  experience: true,
  education: true,
  certifications: true,
  achievements: true,
  languages: true,
  professionalMemberships: true,
  earlierCareer: true,
  publications: true,
  additionalDetails: true,
};

const defaultSectionOrder: CVSectionOrder = {
  sections: [
    'personalInfo',
    'profileStatement',
    'skills',
    'experience',
    'education',
    'certifications',
    'achievements',
    'languages',
    'professionalMemberships',
    'earlierCareer',
    'publications',
    'additionalDetails',
  ],
};

const CVContext = createContext<CVContextType | undefined>(undefined);

export const useCVContext = () => {
  const context = useContext(CVContext);
  if (!context) {
    throw new Error('useCVContext must be used within a CVProvider');
  }
  return context;
};

export const CVProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cv, setCv] = useState<CV | null>(null);
  const [sectionVisibility, setSectionVisibility] = useState<CVSectionVisibility>(defaultSectionVisibility);
  const [sectionOrder, setSectionOrder] = useState<CVSectionOrder>(defaultSectionOrder);
  const [isAnonymized, setIsAnonymized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateCvField = (field: string, value: any) => {
    if (!cv) return;
    
    // Handle nested fields using dot notation (e.g., "location.city")
    const fields = field.split('.');
    if (fields.length === 1) {
      setCv({ ...cv, [field]: value });
    } else {
      // For nested fields
      const newCV = { ...cv };
      let current: any = newCV;
      for (let i = 0; i < fields.length - 1; i++) {
        if (!current[fields[i]]) {
          current[fields[i]] = {};
        }
        current = current[fields[i]];
      }
      current[fields[fields.length - 1]] = value;
      setCv(newCV);
    }
  };

  const handleSetSectionVisibility = (
    section: keyof CVSectionVisibility,
    isVisible: boolean
  ) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [section]: isVisible,
    }));
  };

  const handleSetSectionOrder = (order: string[]) => {
    setSectionOrder({ sections: order });
  };

  return (
    <CVContext.Provider
      value={{
        cv,
        sectionVisibility,
        sectionOrder,
        isAnonymized,
        isLoading,
        setCv,
        updateCvField,
        setSectionVisibility: handleSetSectionVisibility,
        setSectionOrder: handleSetSectionOrder,
        setIsAnonymized,
        setIsLoading,
      }}
    >
      {children}
    </CVContext.Provider>
  );
};

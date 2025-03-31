
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppSettings, CVSectionVisibility } from '@/types/cv';

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  setSectionVisibility: (section: keyof CVSectionVisibility, isVisible: boolean) => void;
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

const defaultSettings: AppSettings = {
  defaultSectionVisibility: defaultSectionVisibility,
  defaultAnonymize: false,
  keepOriginalFiles: true,
  defaultExportFormat: 'PDF',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const setSectionVisibility = (section: keyof CVSectionVisibility, isVisible: boolean) => {
    setSettings(prev => ({
      ...prev,
      defaultSectionVisibility: {
        ...prev.defaultSectionVisibility,
        [section]: isVisible,
      },
    }));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        setSectionVisibility,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};


import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AppSettings, CVSectionVisibility } from '@/types/cv';
import { getAppSettings } from '@/services/api';

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
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize settings from API when the component mounts
  useEffect(() => {
    const initializeSettings = async () => {
      try {
        console.log('Initializing settings from API...');
        const apiSettings = await getAppSettings();
        console.log('Received settings from API:', apiSettings);
        setSettings(apiSettings);
      } catch (error) {
        console.error('Failed to initialize settings from API:', error);
        // Fallback to default settings if API fails
        console.log('Using default settings');
      } finally {
        setIsInitialized(true);
      }
    };

    initializeSettings();
  }, []);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    console.log('Updating settings with:', newSettings);
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const setSectionVisibility = (section: keyof CVSectionVisibility, isVisible: boolean) => {
    console.log(`Setting visibility for ${section} to ${isVisible}`);
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

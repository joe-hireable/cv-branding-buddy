import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AppSettings, CVSectionVisibility, CVSectionOrder } from '@/types/cv';
import { getAppSettings, updateAppSettings } from '@/services/api';
import { toast } from '@/components/ui/use-toast';

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  setSectionVisibility: (section: keyof CVSectionVisibility, isVisible: boolean) => void;
  setSectionOrder: (sections: string[]) => void;
  saveSettings: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
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

const defaultSectionOrder = [
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
];

const defaultSettings: AppSettings = {
  defaultSectionVisibility: defaultSectionVisibility,
  defaultSectionOrder: { sections: defaultSectionOrder },
  defaultAnonymise: false,
  keepOriginalFiles: true,
  defaultExportFormat: 'PDF',
  theme: 'light',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Define the hook separately
function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
}

// Define the provider component
function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize settings from API when the component mounts
  useEffect(() => {
    if (isInitialized) return;
    
    const initializeSettings = async () => {
      try {
        console.log('[SettingsContext] Initializing settings from API...');
        setIsLoading(true);
        setError(null);
        
        const apiSettings = await getAppSettings();
        console.log('[SettingsContext] Received settings from API:', apiSettings);
        
        // Ensure the section order exists
        if (!apiSettings.defaultSectionOrder) {
          apiSettings.defaultSectionOrder = defaultSettings.defaultSectionOrder;
        }
        
        setSettings(apiSettings);
      } catch (error) {
        console.error('[SettingsContext] Failed to initialize settings from API:', error);
        setError('Failed to load settings. Please try again later.');
        // Fallback to default settings if API fails
        console.log('[SettingsContext] Using default settings');
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeSettings();
  }, [isInitialized]);

  // Apply theme when it changes
  useEffect(() => {
    if (!isInitialized) return;
    
    const applyTheme = () => {
      const root = window.document.documentElement;
      const isDark = settings.theme === 'dark' || 
        (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };
    
    applyTheme();
    
    // Add listener for system preference changes if using system setting
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.theme, isInitialized]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    console.log('[SettingsContext] Updating settings with:', newSettings);
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const setSectionVisibility = (section: keyof CVSectionVisibility, isVisible: boolean) => {
    console.log(`[SettingsContext] Setting visibility for ${section} to ${isVisible}`);
    setSettings(prev => ({
      ...prev,
      defaultSectionVisibility: {
        ...prev.defaultSectionVisibility,
        [section]: isVisible,
      },
    }));
  };
  
  const setSectionOrder = (sections: string[]) => {
    console.log('[SettingsContext] Setting section order to:', sections);
    setSettings(prev => ({
      ...prev,
      defaultSectionOrder: {
        sections: sections,
      },
    }));
  };
  
  const saveSettings = async () => {
    try {
      console.log('[SettingsContext] Saving settings to API:', settings);
      setIsLoading(true);
      const updatedSettings = await updateAppSettings(settings);
      setSettings(updatedSettings);
      toast({
        title: "Settings updated",
        description: "Your settings have been saved successfully.",
      });
      return Promise.resolve();
    } catch (error) {
      console.error('[SettingsContext] Error saving settings:', error);
      setError('Failed to save settings. Please try again later.');
      toast({
        title: "Update failed",
        description: "Failed to save your settings. Please try again.",
        variant: "destructive",
      });
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    console.log(`[SettingsContext] Setting theme to ${theme}`);
    setSettings(prev => ({
      ...prev,
      theme,
    }));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        setSectionVisibility,
        setSectionOrder,
        saveSettings,
        isLoading,
        error,
        setTheme
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

// Export both the provider and the hook
export { SettingsProvider, useSettingsContext };

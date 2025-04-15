import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { AppSettings, CVSectionVisibility, CVSectionOrder } from '@/types/cv';
import { getAppSettings, updateAppSettings } from '@/services/api';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  setSectionVisibility: (section: keyof CVSectionVisibility, isVisible: boolean) => void;
  setSectionOrder: (sections: string[]) => void;
  saveSettings: (newSettings: AppSettings) => Promise<void>;
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
  default_section_visibility: defaultSectionVisibility,
  default_section_order: { sections: defaultSectionOrder },
  default_anonymise: false,
  keep_original_files: true,
  default_export_format: 'PDF',
  theme: 'light',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user } = useAuth();
  const initializationRef = useRef(false);

  // Initialize settings from API when the component mounts or user changes
  useEffect(() => {
    // Prevent multiple initializations
    if (initializationRef.current) return;
    initializationRef.current = true;

    const initializeSettings = async () => {
      try {
        console.log('[SettingsContext] Starting initialization...');
        setIsLoading(true);
        setError(null);
        
        if (!user) {
          console.log('[SettingsContext] No user authenticated, using default settings');
          setSettings(defaultSettings);
          setIsLoading(false);
          setIsInitialized(true);
          return;
        }
        
        console.log('[SettingsContext] Loading settings from API for user:', user.id);
        const apiSettings = await getAppSettings(user.id);
        console.log('[SettingsContext] Received settings from API:', apiSettings);
        
        if (!apiSettings) {
          console.log('[SettingsContext] No settings found, using default settings');
          setSettings(defaultSettings);
          setIsLoading(false);
          setIsInitialized(true);
          return;
        }
        
        // Transform the settings to match the frontend's expected format
        const transformedSettings: AppSettings = {
          default_section_visibility: apiSettings.default_section_visibility || defaultSettings.default_section_visibility,
          default_section_order: {
            sections: apiSettings.default_section_order?.sections || defaultSettings.default_section_order.sections
          },
          default_anonymise: apiSettings.default_anonymise ?? defaultSettings.default_anonymise,
          keep_original_files: apiSettings.keep_original_files ?? defaultSettings.keep_original_files,
          default_export_format: apiSettings.default_export_format || defaultSettings.default_export_format,
          theme: apiSettings.theme || defaultSettings.theme
        };
        
        console.log('[SettingsContext] Setting transformed settings:', transformedSettings);
        setSettings(transformedSettings);
      } catch (error) {
        console.error('[SettingsContext] Failed to initialize settings:', error);
        setError(error instanceof Error ? error.message : 'Failed to load settings. Please try again later.');
        setSettings(defaultSettings);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
        console.log('[SettingsContext] Initialization complete');
      }
    };

    initializeSettings();

    // Cleanup function
    return () => {
      initializationRef.current = false;
    };
  }, [user?.id]); // Only depend on user.id changes

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
      default_section_visibility: {
        ...prev.default_section_visibility,
        [section]: isVisible,
      },
    }));
  };
  
  const setSectionOrder = (sections: string[]) => {
    console.log('[SettingsContext] Setting section order to:', sections);
    setSettings(prev => ({
      ...prev,
      default_section_order: {
        sections: sections,
      },
    }));
  };
  
  const saveSettings = async (newSettings: AppSettings) => {
    if (!user) {
      throw new Error('User must be authenticated to save settings');
    }

    try {
      const { error } = await updateAppSettings(newSettings, user.id);
      if (error) throw error;
      
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
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
};

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
};

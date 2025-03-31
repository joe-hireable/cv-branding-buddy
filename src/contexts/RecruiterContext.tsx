
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { RecruiterProfile } from '@/types/cv';

interface RecruiterContextType {
  profile: RecruiterProfile | null;
  isLoading: boolean;
  setProfile: (profile: RecruiterProfile | null) => void;
  updateProfileField: (field: keyof RecruiterProfile, value: any) => void;
  setIsLoading: (value: boolean) => void;
}

const defaultProfile: RecruiterProfile = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  agencyName: '',
};

const RecruiterContext = createContext<RecruiterContextType | undefined>(undefined);

export const useRecruiterContext = () => {
  const context = useContext(RecruiterContext);
  if (!context) {
    throw new Error('useRecruiterContext must be used within a RecruiterProvider');
  }
  return context;
};

export const RecruiterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<RecruiterProfile | null>(defaultProfile);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateProfileField = (field: keyof RecruiterProfile, value: any) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  return (
    <RecruiterContext.Provider
      value={{
        profile,
        isLoading,
        setProfile,
        updateProfileField,
        setIsLoading,
      }}
    >
      {children}
    </RecruiterContext.Provider>
  );
};

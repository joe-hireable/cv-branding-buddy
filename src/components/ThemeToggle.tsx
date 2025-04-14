import React from 'react';
import { useSettingsContext } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  iconOnly?: boolean;
}

export const ThemeToggle = ({ iconOnly = false }: ThemeToggleProps) => {
  const { settings, setTheme } = useSettingsContext();
  
  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      aria-label={`Switch to ${settings.theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {settings.theme === 'dark' ? (
        <>
          <Sun className="h-5 w-5" />
          {!iconOnly && <span className="ml-2">Light Mode</span>}
        </>
      ) : (
        <>
          <Moon className="h-5 w-5" />
          {!iconOnly && <span className="ml-2">Dark Mode</span>}
        </>
      )}
    </Button>
  );
};

export default ThemeToggle; 
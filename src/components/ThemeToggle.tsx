import React from 'react';
import { useSettingsContext } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Laptop } from 'lucide-react';

interface ThemeToggleProps {
  iconOnly?: boolean;
}

export const ThemeToggle = ({ iconOnly = false }: ThemeToggleProps) => {
  const { settings, setTheme } = useSettingsContext();
  
  const toggleTheme = () => {
    // Cycle through light → dark → system
    const nextTheme = 
      settings.theme === 'light' ? 'dark' :
      settings.theme === 'dark' ? 'system' : 'light';
    setTheme(nextTheme);
  };
  
  // Determine the icon and text to show based on current theme
  const getThemeContent = () => {
    switch(settings.theme) {
      case 'dark':
        return (
          <>
            <Sun className="h-5 w-5" />
            {!iconOnly && <span className="ml-2">Light Mode</span>}
          </>
        );
      case 'light':
        return (
          <>
            <Moon className="h-5 w-5" />
            {!iconOnly && <span className="ml-2">Dark Mode</span>}
          </>
        );
      case 'system':
        return (
          <>
            <Laptop className="h-5 w-5" />
            {!iconOnly && <span className="ml-2">System Theme</span>}
          </>
        );
      default:
        return (
          <>
            <Moon className="h-5 w-5" />
            {!iconOnly && <span className="ml-2">Dark Mode</span>}
          </>
        );
    }
  };
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      aria-label={`Switch to ${
        settings.theme === 'light' ? 'dark' : 
        settings.theme === 'dark' ? 'system' : 'light'
      } mode`}
    >
      {getThemeContent()}
    </Button>
  );
};

export default ThemeToggle; 
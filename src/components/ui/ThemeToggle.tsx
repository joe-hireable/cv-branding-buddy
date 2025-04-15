/**
 * @file ThemeToggle Component
 * @description A component that allows users to switch between light, dark, and system themes.
 * Provides both icon-only and text+icon variants.
 */

import React from 'react';
import { useSettingsContext } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Laptop } from 'lucide-react';

/**
 * Props for the ThemeToggle component
 * @interface ThemeToggleProps
 */
interface ThemeToggleProps {
  /** When true, only shows the icon without text */
  iconOnly?: boolean;
}

/**
 * ThemeToggle component that allows users to switch between different theme modes
 * @param {ThemeToggleProps} props - Component props
 * @returns {JSX.Element} The rendered theme toggle button
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({ iconOnly = false }) => {
  const { settings, setTheme } = useSettingsContext();
  
  /**
   * Cycles through the available themes (light → dark → system)
   */
  const toggleTheme = (): void => {
    const nextTheme = 
      settings.theme === 'light' ? 'dark' :
      settings.theme === 'dark' ? 'system' : 'light';
    setTheme(nextTheme);
  };
  
  /**
   * Determines the appropriate icon and text to display based on current theme
   * @returns {JSX.Element} The theme-specific icon and optional text
   */
  const getThemeContent = (): JSX.Element => {
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
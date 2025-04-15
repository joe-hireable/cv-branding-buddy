/**
 * @file Theme Types
 * @description Type definitions for theme-related functionality
 */

/**
 * Available theme modes in the application
 * @enum {string}
 */
export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

/**
 * Theme settings interface
 * @interface ThemeSettings
 */
export interface ThemeSettings {
  /** The current theme mode */
  theme: ThemeMode;
  /** Function to update the theme mode */
  setTheme: (theme: ThemeMode) => void;
}

/**
 * Props for theme-aware components
 * @interface ThemeAwareProps
 */
export interface ThemeAwareProps {
  /** Optional class name for theme-specific styling */
  className?: string;
  /** Whether the component should respect the current theme */
  themeAware?: boolean;
} 
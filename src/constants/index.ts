/**
 * @file Constants
 * @description Application-wide constants and configuration
 */

/**
 * Application routes
 */
export const ROUTES = {
  HOME: '/',
  UPLOAD: '/upload',
  PREVIEW: '/preview',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  HISTORY: '/history',
  AUTH: {
    LOGIN: '/auth/login',
    EMAIL: '/auth/email',
    SIGNUP: '/auth/signup',
    FORGOT_PASSWORD: '/auth/forgot-password'
  }
} as const;

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  CV: {
    BASE: '/api/cv',
    PARSE: '/api/cv/parse',
    ENHANCE: '/api/cv/enhance'
  },
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    RESET_PASSWORD: '/api/auth/reset-password'
  }
} as const;

/**
 * File upload configuration
 */
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  MAX_FILES: 1
} as const;

/**
 * Theme configuration
 */
export const THEME = {
  STORAGE_KEY: 'theme',
  DEFAULT: 'system',
  OPTIONS: ['light', 'dark', 'system'] as const
} as const;

/**
 * Application settings
 */
export const SETTINGS = {
  STORAGE_KEY: 'settings',
  DEFAULTS: {
    theme: THEME.DEFAULT,
    notificationsEnabled: true,
    emailNotifications: true
  }
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  FILE_UPLOAD: {
    SIZE: 'File size must be less than 5MB',
    TYPE: 'Only PDF and Word documents are allowed',
    REQUIRED: 'Please select a file to upload'
  },
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_IN_USE: 'Email is already in use',
    WEAK_PASSWORD: 'Password must be at least 8 characters long',
    INVALID_EMAIL: 'Please enter a valid email address'
  },
  CV: {
    PARSE_FAILED: 'Failed to parse CV. Please try again.',
    ENHANCE_FAILED: 'Failed to enhance CV. Please try again.',
    SAVE_FAILED: 'Failed to save CV. Please try again.'
  }
} as const; 
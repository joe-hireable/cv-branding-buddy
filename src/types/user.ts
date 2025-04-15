/**
 * @file User Types
 * @description Type definitions for user-related functionality
 */

/**
 * User profile information
 * @interface UserProfile
 */
export interface UserProfile {
  /** User's unique identifier */
  id: string;
  /** User's email address */
  email: string;
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** URL to user's profile picture */
  profilePicture?: string;
  /** User's role in the application */
  role: UserRole;
  /** When the user's profile was created */
  createdAt: Date;
  /** When the user's profile was last updated */
  updatedAt: Date;
}

/**
 * Available user roles in the application
 * @enum {string}
 */
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  RECRUITER = 'recruiter'
}

/**
 * Authentication state interface
 * @interface AuthState
 */
export interface AuthState {
  /** The currently authenticated user */
  user: UserProfile | null;
  /** Whether the user is currently authenticated */
  isAuthenticated: boolean;
  /** Whether the authentication state is being loaded */
  isLoading: boolean;
  /** Any error that occurred during authentication */
  error: Error | null;
}

/**
 * Authentication context interface
 * @interface AuthContextType
 */
export interface AuthContextType extends AuthState {
  /** Function to sign in a user */
  signIn: (email: string, password: string) => Promise<void>;
  /** Function to sign out the current user */
  signOut: () => Promise<void>;
  /** Function to reset a user's password */
  resetPassword: (email: string) => Promise<void>;
  /** Function to update the user's profile */
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
} 
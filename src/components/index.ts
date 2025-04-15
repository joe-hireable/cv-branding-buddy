/**
 * @file Component exports
 * @description Central export file for all components in the application
 */

// Layout Components
export { default as Header } from './layout/Header';
export { default as ProtectedRoute } from './layout/ProtectedRoute';

// CV Related Components
export { default as CVPreview } from './cv/CVPreview';
export { default as CVSection } from './cv/CVSection';
export { default as FileUpload } from './cv/FileUpload';

// Editor Components
export { default as ChatEditor } from './editor/ChatEditor';

// UI Components
export { default as ThemeToggle } from './ui/ThemeToggle';
export { default as EnvDebug } from './ui/EnvDebug';

// Re-export UI components from shadcn
export * from './ui/toaster';
export * from './ui/tooltip';
export * from './ui/sonner'; 
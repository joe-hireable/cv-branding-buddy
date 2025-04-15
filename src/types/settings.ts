export interface AppSettings {
  defaultSectionVisibility: CVSectionVisibility;
  defaultSectionOrder: { sections: string[] };
  defaultAnonymise: boolean;
  keepOriginalFiles: boolean;
  defaultExportFormat: 'PDF' | 'DOCX';
  theme: 'light' | 'dark' | 'system';
} 
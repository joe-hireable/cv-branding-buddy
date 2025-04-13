# CV Parser Integration Guide

This guide explains how to integrate the CV Parser backend (Google Cloud Function) with the CV Branding Buddy frontend application.

## Overview

The integration connects our React/Vite frontend with the Python-based CV Parser backend, which provides CV parsing, optimization, and analysis capabilities using Gemini 2.0.

### Key Features
- CV parsing and structured data extraction
- Personal statement optimization
- Core skills analysis and enhancement
- Key achievements optimization
- Role description improvements
- CV scoring against job descriptions
- Supabase JWT authentication
- File upload support (PDF, DOCX)

## Prerequisites

1. Backend deployment:
   - CV Parser deployed as a Google Cloud Function
   - Function URL available (e.g., `https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/cv_optimizer`)
   - Supabase project set up and configured with the backend

2. Frontend setup:
   - Node.js and npm installed
   - Required dependencies:
     ```bash
     npm install axios @supabase/supabase-js
     ```

## Configuration

1. Environment Variables

Create or update your environment files (`.env.development`, `.env.production`):

```env
# Development
VITE_CV_PARSER_API_URL=http://localhost:8080  # Local development
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Production
VITE_CV_PARSER_API_URL=https://YOUR_DEPLOYED_FUNCTION_URL
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. CORS Configuration

Ensure your Google Cloud Function allows requests from your frontend domains:
- Development: `http://localhost:5173` (default Vite dev server)
- Production: Your deployed frontend domain

## Integration Components

### 1. CV Parser API Client

The `cvParserApi.ts` service handles all communication with the backend:

```typescript
// src/services/cvParserApi.ts
import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';
import { PARSE_CV_ENDPOINT } from '@/integrations/supabase/client';
import type { BackendResponse } from '@/types/cv';

// See implementation in src/services/cvParserApi.ts
```

### 2. API Service Layer

The `api.ts` service provides a clean interface for components:

```typescript
// src/services/api.ts
import { cvParserService } from './cvParserApi';

// See implementation in src/services/api.ts
```

### 3. File Upload Component

The `FileUpload.tsx` component handles CV and job description file uploads:

```typescript
// src/components/FileUpload.tsx
interface FileUploadProps {
  onFileSelected: (file: File) => void;
  label?: string;
  accept?: string;
  maxSize?: number;
  isLoading?: boolean;
}

// See implementation in src/components/FileUpload.tsx
```

### 4. CV Context

The `CVContext.tsx` manages global CV state:

```typescript
// src/contexts/CVContext.tsx
interface CVContextType {
  cv: CV | null;
  sectionVisibility: CVSectionVisibility;
  sectionOrder: CVSectionOrder;
  isAnonymized: boolean;
  isLoading: boolean;
  setCv: (cv: CV | null) => void;
  updateCvField: (field: string, value: any) => void;
  setSectionVisibility: (section: keyof CVSectionVisibility, isVisible: boolean) => void;
  setSectionOrder: (order: string[]) => void;
  setIsAnonymized: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
}

// See implementation in src/contexts/CVContext.tsx
```

## Usage Examples

### 1. Uploading and Parsing a CV

```typescript
import { uploadCV } from '@/services/api';
import { useCVContext } from '@/contexts/CVContext';

const UploadPage = () => {
  const { setCv } = useCVContext();
  
  const handleUpload = async (file: File) => {
    try {
      const response = await uploadCV(file);
      if (response.status === 'success') {
        setCv(response.data);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };
  
  return <FileUpload onFileSelected={handleUpload} />;
};
```

### 2. Optimizing CV Sections

```typescript
import { optimizeProfileStatement } from '@/services/api';
import { useCVContext } from '@/contexts/CVContext';

const ProfileSection = () => {
  const { cv, updateCvField } = useCVContext();
  
  const handleOptimize = async () => {
    try {
      const response = await optimizeProfileStatement(cv.id);
      if (response.status === 'success') {
        updateCvField('profileStatement', response.data.optimizedText);
      }
    } catch (error) {
      console.error('Optimization failed:', error);
    }
  };
  
  return (
    <div>
      <h3>Profile Statement</h3>
      <p>{cv?.profileStatement}</p>
      <button onClick={handleOptimize}>Optimize</button>
    </div>
  );
};
```

### 3. Scoring Against Job Description

```typescript
import { cvParserService } from '@/services/cvParserApi';

const ScoreSection = () => {
  const [score, setScore] = useState(null);
  
  const handleScore = async (jobDescription: string) => {
    try {
      const response = await cvParserService.scoreCV(cv.id, jobDescription);
      if (response.status === 'success') {
        setScore(response.data.score);
      }
    } catch (error) {
      console.error('Scoring failed:', error);
    }
  };
  
  return (
    <div>
      <textarea onChange={(e) => handleScore(e.target.value)} />
      {score && <div>Match Score: {score}%</div>}
    </div>
  );
};
```

## Error Handling

The integration includes comprehensive error handling:

1. API-level errors:
   - Network issues
   - Authentication failures
   - Invalid requests
   - Backend processing errors

2. User-friendly error messages:
   - Toast notifications
   - Inline error states
   - Loading indicators

Example error handling:

```typescript
try {
  const response = await cvParserService.parseCV(file);
  if (response.status === 'success') {
    // Handle success
  } else {
    throw new Error(response.errors?.[0] || 'Unknown error');
  }
} catch (error) {
  toast({
    title: "Operation failed",
    description: error.message,
    variant: "destructive"
  });
}
```

## Security Considerations

1. Authentication:
   - All requests include Supabase JWT token
   - Token refresh handled automatically
   - Secure token storage

2. File Upload:
   - File type validation
   - Size limits
   - Secure file handling

3. CORS:
   - Proper configuration for production domains
   - Development environment setup

## Testing

1. Unit Tests:
   ```typescript
   import { render, fireEvent, waitFor } from '@testing-library/react';
   import { cvParserService } from '@/services/cvParserApi';
   
   jest.mock('@/services/cvParserApi');
   
   test('CV upload and parse', async () => {
     const mockParseCV = cvParserService.parseCV as jest.Mock;
     mockParseCV.mockResolvedValue({
       status: 'success',
       data: { /* mock CV data */ }
     });
     
     const { getByLabelText, findByText } = render(<UploadPage />);
     const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
     
     fireEvent.change(getByLabelText(/upload cv/i), { target: { files: [file] } });
     
     await waitFor(() => {
       expect(mockParseCV).toHaveBeenCalledWith(file, undefined);
       expect(findByText(/upload successful/i)).toBeTruthy();
     });
   });
   ```

2. Integration Tests:
   - Test full upload-parse-optimize flow
   - Verify state management
   - Check error handling

## Troubleshooting

Common issues and solutions:

1. Authentication Errors:
   - Verify Supabase configuration
   - Check token expiration
   - Validate CORS settings

2. File Upload Issues:
   - Check file size limits
   - Verify supported formats
   - Inspect network requests

3. API Errors:
   - Review backend logs
   - Check request format
   - Verify API endpoint configuration

## Support

For issues or questions:
1. Check backend logs in Google Cloud Console
2. Review Supabase authentication logs
3. Contact the development team

## Future Improvements

Planned enhancements:
1. Real-time CV optimization suggestions
2. Enhanced job description matching
3. Batch processing capabilities
4. Advanced document generation
5. AI-powered interview preparation 
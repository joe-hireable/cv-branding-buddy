# CV Branding Buddy

An internal AI-powered CV optimization tool that helps enhance resumes through analysis, optimization, and job description matching.

## Technical Overview

CV Branding Buddy integrates a React/TypeScript frontend with a Python backend deployed as a Google Cloud Function for advanced CV processing capabilities.

### Core Components

- **CV Parser**: Gemini 2.0-powered backend handles document parsing and AI-driven optimization
- **Data Store**: Supabase provides authentication, storage, and database services
- **UI Framework**: React 18 with shadcn/ui components and Tailwind CSS styling

## Architecture

The application follows a feature-based architecture with clear separation of concerns:

### Frontend Architecture

```
src/
├── components/     # Reusable UI components
│   ├── ui/         # shadcn/ui base components
│   └── ...         # Custom application components
├── contexts/       # Global state management
│   ├── AuthContext.tsx            # Authentication state
│   ├── CVContext.tsx              # CV data management
│   ├── RecruiterContext.tsx       # Recruiter profile data
│   └── SettingsContext.tsx        # Application settings
├── hooks/          # Custom React hooks
├── integrations/   # Third-party service integrations
│   └── supabase/   # Supabase client and services
├── lib/            # Utility functions and helpers
├── pages/          # Main application routes
│   ├── Auth/       # Authentication pages
│   ├── Upload.tsx  # CV upload page
│   ├── Preview.tsx # CV preview and editing
│   ├── Profile.tsx # User profile management
│   └── ...         # Other application pages
├── services/       # API and business logic
│   ├── api.ts            # High-level API interface
│   ├── cvParserApi.ts    # CV parser backend integration
│   └── cvService.ts      # CV data service
└── types/          # TypeScript type definitions
    └── cv.ts       # CV data model types
```

### Backend Architecture

The backend consists of a Python-based Google Cloud Function that provides CV parsing and optimization capabilities:

```
cv-optimizer/
├── main.py              # Entry point for the Cloud Function
├── requirements.txt     # Python dependencies
├── utils/               # Utility functions
│   ├── parser.py        # CV parsing logic
│   ├── optimizer.py     # CV optimization logic
│   └── formatter.py     # Output formatting
└── models/              # Data models
    ├── cv.py            # CV data model
    └── response.py      # API response model
```

#### API Endpoints

The backend exposes the following HTTP endpoints:

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/parse` | POST | Parse CV document | `cv_file`, `jd_file` (optional) |
| `/optimize/profile` | POST | Optimize profile statement | `cv_data`, `job_description` (optional) |
| `/optimize/skills` | POST | Optimize skills section | `cv_data`, `job_description` (optional) |
| `/optimize/achievements` | POST | Optimize achievements | `cv_data`, `job_description` (optional) |
| `/optimize/experience` | POST | Optimize experience section | `cv_data`, `experience_index`, `job_description` (optional) |
| `/score` | POST | Score CV against job description | `cv_data`, `job_description` |

### Backend Integration

- Google Cloud Function for CV parsing and optimization
- Communication via HTTP endpoints using Axios
- Authentication with Supabase JWT tokens
- File uploads handled via multipart/form-data

### Data Flow

1. User uploads CV (and optional job description)
2. Frontend saves file to Supabase storage
3. File is sent to CV Parser backend
4. Backend extracts structured data and returns JSON
5. Frontend updates CV context with parsed data
6. User can edit, optimize, and generate documents

## Data Models

### CV Model

Key interfaces in `src/types/cv.ts`:

```typescript
export interface CV {
  id?: string;
  file?: File;
  jobDescription?: string;
  firstName: string | null;
  surname: string | null;
  email: string | null;
  phone: string | null;
  links: Link[] | null;
  location: Location | null;
  headline: string;
  profileStatement: string;
  skills: Skill[];
  achievements: string[];
  languages: Language[] | null;
  experience: Experience[];
  education: Education[] | null;
  certifications: Certification[] | null;
  professionalMemberships: ProfessionalMembership[] | null;
  earlierCareer: EarlierCareer[] | null;
  publications: Publication[] | null;
  addDetails: string[] | null;
}
```

### Context APIs

- **CVContext**: Manages CV data state and operations
  - `cv`: Current CV data
  - `updateCvField`: Updates specific CV fields
  - `sectionVisibility`: Controls section display
  - `sectionOrder`: Manages section ordering
  - `isAnonymised`: Toggles PII anonymization

- **AuthContext**: Handles authentication
  - `user`: Current user data
  - `signIn`, `signUp`, `signOut`: Auth methods
  - `isLoading`: Authentication state

## State Management

The application uses React Context API for global state management with a clear hierarchy:

```
App
├── AuthProvider (authentication state)
│   ├── CVProvider (CV data and operations)
│   │   ├── RecruiterProvider (recruiter profile)
│   │   │   └── SettingsProvider (application settings)
│   │   │       └── Application Components
│   │   └── Application Components
│   └── Application Components
└── Application Components
```

### State Flow Example

```typescript
// Example of state flow in a component
import { useAuth } from '@/contexts/AuthContext';
import { useCVContext } from '@/contexts/CVContext';
import { useSettingsContext } from '@/contexts/SettingsContext';

const ProfileSection = () => {
  const { user } = useAuth();
  const { cv, updateCvField } = useCVContext();
  const { settings } = useSettingsContext();
  
  const handleUpdateProfile = (newProfile) => {
    // Update CV data
    updateCvField('profileStatement', newProfile);
    
    // Save to backend
    saveToBackend(cv.id, newProfile);
  };
  
  return (
    // Component JSX
  );
};
```

## Authentication Flow

The application uses Supabase for authentication with the following flow:

1. **User Registration/Sign In**:
   - User enters credentials on the Auth pages
   - Supabase Auth API handles authentication
   - JWT token is stored in localStorage

2. **Session Management**:
   - `AuthContext` provides the current user state
   - `ProtectedRoute` component ensures authenticated access
   - Token refresh is handled automatically by Supabase client

3. **API Authentication**:
   - All API requests include the JWT token in the Authorization header
   - Backend validates the token with Supabase

```typescript
// Example of authentication in API requests
import { supabase } from '@/integrations/supabase/client';

const makeAuthenticatedRequest = async (endpoint, data) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('Not authenticated');
  }
  
  return axios.post(endpoint, data, {
    headers: {
      Authorization: `Bearer ${session.access_token}`
    }
  });
};
```

## API Services

`src/services/api.ts` provides the following core methods:

- `uploadCV(file, jdFile)`: Upload and parse CV
- `optimizeProfileStatement(cv, jobDescription)`: Enhance profile statement
- `optimizeSkills(cv, jobDescription)`: Optimize skills section
- `optimizeAchievements(cv, jobDescription)`: Improve achievements
- `optimizeExperience(cv, experienceIndex, jobDescription)`: Enhance role descriptions
- `generateDocument(cv, format, recruiterProfile)`: Create formatted document

### Code Example: Using API Services

```typescript
import { uploadCV, optimizeProfileStatement } from '@/services/api';
import { useCVContext } from '@/contexts/CVContext';

const UploadComponent = () => {
  const { setCv, setIsLoading } = useCVContext();
  
  const handleUpload = async (file) => {
    setIsLoading(true);
    try {
      const response = await uploadCV(file);
      if (response.status === 'success') {
        setCv(response.data);
      } else {
        throw new Error(response.errors?.[0] || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    // Component JSX
  );
};
```

## Error Handling

The application implements a comprehensive error handling strategy:

### API Error Handling

```typescript
// Example of API error handling
const handleApiRequest = async () => {
  try {
    const response = await apiService.makeRequest();
    
    if (response.status === 'error') {
      // Handle API-level errors
      throw new Error(response.errors?.[0] || 'Unknown API error');
    }
    
    return response.data;
  } catch (error) {
    // Handle network errors, validation errors, etc.
    if (error.response) {
      // Server responded with error status
      handleServerError(error.response);
    } else if (error.request) {
      // Request made but no response
      handleNetworkError();
    } else {
      // Other errors
      handleGeneralError(error);
    }
    
    // Re-throw or handle as needed
    throw error;
  }
};
```

### UI Error Handling

- Toast notifications for user-facing errors
- Form validation with React Hook Form and Zod
- Loading states for async operations
- Fallback UI components for error states

## Performance Considerations

### File Upload Optimization

- Client-side file size validation (max 5MB)
- Chunked uploads for large files
- Compression for image uploads

### Rendering Optimization

- Memoization of expensive components with React.memo
- Virtualized lists for long CV sections
- Lazy loading of non-critical components

### API Optimization

- Caching of API responses with React Query
- Debouncing of frequent API calls
- Optimistic updates for better UX

## Development Setup

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account and project
- Access to GCP project for backend
- Python 3.9+ for local backend development

### Environment Variables

Required variables in `.env`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_CV_OPTIMIZER_GCF_URL=https://your-region-your-project.cloudfunctions.net/cv_optimizer
```

### Installation & Development

```sh
# Install dependencies
npm install

# Start development server
npm run dev
```

### Local Backend Setup

```sh
# Clone the backend repository
git clone https://github.com/your-org/cv-optimizer-backend.git
cd cv-optimizer-backend

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run locally
python -m functions-framework --target=cv_optimizer --debug
```

## Testing

Tests use Jest and React Testing Library. Key test files:

- `src/__tests__/`: Application tests
- `src/services/__tests__/`: API service tests

### Testing Strategy

1. **Unit Tests**: Test individual components and functions
2. **Integration Tests**: Test interactions between components
3. **API Tests**: Test API service functions with mocks
4. **E2E Tests**: Test complete user flows (coming soon)

### Example Test

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CVProvider } from '@/contexts/CVContext';
import { UploadPage } from '@/pages/Upload';

// Mock API service
jest.mock('@/services/api', () => ({
  uploadCV: jest.fn().mockResolvedValue({
    status: 'success',
    data: { /* mock CV data */ }
  })
}));

describe('UploadPage', () => {
  it('should handle file upload successfully', async () => {
    render(
      <CVProvider>
        <UploadPage />
      </CVProvider>
    );
    
    // Find file input and simulate file selection
    const fileInput = screen.getByLabelText(/upload cv/i);
    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Click upload button
    const uploadButton = screen.getByText(/upload cv/i);
    fireEvent.click(uploadButton);
    
    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/cv uploaded successfully/i)).toBeInTheDocument();
    });
  });
});
```

Run tests with:
```sh
npm run test          # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## Deployment

### Frontend Deployment

1. Build the project for production:
   ```sh
   npm run build
   ```

2. Deploy to your hosting platform:
   ```sh
   # For Netlify
   netlify deploy --prod
   
   # For Vercel
   vercel --prod
   ```

3. Configure environment variables on your hosting platform.

### Backend Deployment

1. Deploy to Google Cloud Functions:
   ```sh
   gcloud functions deploy cv_optimizer \
     --runtime python39 \
     --trigger-http \
     --allow-unauthenticated \
     --entry-point cv_optimizer
   ```

2. Update the frontend environment variable with the new function URL.

### Deployment Environments

- **Development**: Local development environment
- **Staging**: Pre-production environment for testing
- **Production**: Live environment for end users

## Key Development Workflows

### Adding New CV Features

1. Update CV type definition in `src/types/cv.ts`
2. Modify CVContext if needed for new state management
3. Update API services in `services/api.ts` and `services/cvParserApi.ts`
4. Implement UI components for the new features
5. Add tests for new functionality

### Supabase Integration

The app uses Supabase for:
- Authentication via `AuthContext`
- Storage for CV files and profile images
- Database for CV and user data

Tables defined in Supabase:
- `candidates`: Person whose CV is being processed
- `cvs`: CV records including metadata and parsed data
- `profiles`: User profile information

## Troubleshooting Guide

### Common Issues

#### Authentication Issues

- **Problem**: User can't log in
- **Solution**: Check Supabase project settings and ensure authentication is enabled for the email provider

#### CV Upload Failures

- **Problem**: CV upload fails with "File too large"
- **Solution**: Check file size limit in Supabase storage settings (default is 5MB)

#### API Connection Issues

- **Problem**: Backend API calls fail
- **Solution**: Verify the `VITE_CV_OPTIMIZER_GCF_URL` environment variable is correct

#### Performance Issues

- **Problem**: Slow rendering with large CVs
- **Solution**: Implement virtualization for long lists and optimize component rendering

### Debugging Tools

- React Developer Tools for component inspection
- Network tab in browser DevTools for API requests
- Supabase Dashboard for database inspection
- Google Cloud Logging for backend logs

## Known Issues & Limitations

- File size upload limit: 5MB
- Processing time varies by CV complexity
- Only PDF and DOCX files supported
- Limited job description matching for certain industries

## Internal Resources

- [GCP Function Source](https://console.cloud.google.com/functions/details/europe-west9/cv_optimizer)
- [Supabase Dashboard](https://app.supabase.io/projects/bvnglrtwcrysosinnnem)
- [Design System Documentation](internal-link-to-design-system)
- [API Specification](internal-link-to-api-docs)

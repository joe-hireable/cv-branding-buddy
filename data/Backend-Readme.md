# CV Optimizer Cloud Function

A Google Cloud Function that uses Gemini 2.0 to analyze, optimize, and provide insights for CVs (resumes) based on job descriptions.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [API Usage](#api-usage)
- [Frontend Integration Guide](#frontend-integration-guide)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Testing](#testing)

## 🔍 Overview

This cloud function serves as an API for CV (resume) optimization and analysis using Google's Gemini 2.0 models. It can parse CVs, analyze them against job descriptions, and provide actionable feedback and optimization suggestions.

## ✨ Features

- **CV Parsing**: Extract structured data from uploaded CV documents (PDF or DOCX)
- **Personal Statement Analysis**: Review and improve personal statements/profiles
- **Key Achievements Analysis**: Analyze and enhance key achievements
- **Core Skills Analysis**: Identify and optimize core skills sections
- **Role Analysis**: Evaluate role descriptions and experience
- **CV Scoring**: Score CVs against job descriptions for compatibility
- **OpenTelemetry Integration**: Built-in tracing and monitoring
- **Supabase Authentication**: JWT-based authentication for secure API access
- **Google ADK Integration**: Support for complex, stateful interactions via Google Agent Development Kit
- **Secret Manager Integration**: Secure storage for prompts, schemas, and examples
- **Multipart Form Support**: File uploads directly via multipart/form-data
- **Structured Logging**: JSON-formatted logs for better debugging

## 📋 Prerequisites

- Python 3.11 or higher
- Google Cloud Platform account with billing enabled
- Gemini API access (via Google Cloud AI Platform)
- Google Cloud SDK installed (for deployment)
- Supabase project (for authentication)
- (Optional) Google ADK agent configured

## 🚀 Getting Started

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cvai2
   ```

2. **Set up a virtual environment**
   ```bash
   # On Windows
   python -m venv venv311
   .\venv311\Scripts\activate

   # On macOS/Linux
   python -m venv venv311
   source venv311/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   pip install -r requirements-dev.txt  # For development dependencies
   ```

4. **Set up environment variables**
   ```bash
   # Copy the template file
   cp .env.template .env
   
   # Edit the .env file with your values
   ```

5. **Set up Google Cloud credentials**
   ```bash
   # On Windows (PowerShell)
   $env:GOOGLE_APPLICATION_CREDENTIALS="path/to/your/credentials.json"

   # On macOS/Linux
   export GOOGLE_APPLICATION_CREDENTIALS="path/to/your/credentials.json"
   ```

6. **Start the function locally**
   ```bash
   functions-framework --target=cv_optimizer
   ```

## 📡 API Usage

### Authentication

The API supports two authentication methods:

1. **Supabase JWT Authentication** (For web clients)
   ```
   Authorization: Bearer <your-supabase-jwt-token>
   ```

2. **GCP IAM Authentication** (For service accounts and GCP services)
   Generate an access token for your service account and include it in the Authorization header:
   ```
   Authorization: Bearer <your-service-account-token>
   ```
   See [IAM_AUTHENTICATION.md](IAM_AUTHENTICATION.md) for detailed setup instructions.

### Endpoint

`POST https://YOUR_FUNCTION_URL`

### Request Format

The API accepts `multipart/form-data` with the following fields:

- `cv_file`: The CV document file (PDF or DOCX)
- `task`: The task to perform (`parsing`, `ps`, `cs`, `ka`, `role`, `scoring`)
- `jd`: (Optional) Job description text or URL
- `section`: (Optional) Specific section to analyze
- `model`: (Optional) Gemini model to use (defaults to `gemini-2.0-flash-001`)

Example cURL request:
```bash
curl -X POST https://YOUR_FUNCTION_URL \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Request-ID: unique-request-id" \
  -F "cv_file=@/path/to/your/cv.pdf" \
  -F "task=parsing" \
  -F "model=gemini-2.0-flash-001"
```

## 🎨 Frontend Integration Guide

### React + Vite Integration

#### 1. API Client Setup

Create a dedicated API client using Axios or Fetch:

```typescript
// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const cvApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Add auth interceptor
cvApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('supabase_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### 2. Type Definitions

Define TypeScript interfaces for API responses:

```typescript
// src/types/cv.ts
export interface CVData {
  contact_info: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
  };
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  skills: string[];
}

export interface CVScore {
  overall: number;
  skills_match: number;
  experience_match: number;
  education_match: number;
}

export interface CVResponse {
  cv_data: CVData;
  scores?: CVScore;
  personal_statement?: string;
}
```

#### 3. React Hooks

Create custom hooks for API interactions:

```typescript
// src/hooks/useCVOptimizer.ts
import { useState } from 'react';
import { cvApi } from '../services/api';
import { CVResponse } from '../types/cv';

export const useCVOptimizer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeCV = async (
    file: File,
    task: 'parsing' | 'ps' | 'cs' | 'ka' | 'role' | 'scoring',
    jd?: string
  ): Promise<CVResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('cv_file', file);
      formData.append('task', task);
      if (jd) formData.append('jd', jd);

      const response = await cvApi.post<CVResponse>('', formData);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { analyzeCV, loading, error };
};
```

#### 4. Component Example

Example React component using the hook:

```typescript
// src/components/CVUploader.tsx
import { useState } from 'react';
import { useCVOptimizer } from '../hooks/useCVOptimizer';
import { CVResponse } from '../types/cv';

export const CVUploader = () => {
  const [result, setResult] = useState<CVResponse | null>(null);
  const { analyzeCV, loading, error } = useCVOptimizer();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const response = await analyzeCV(file, 'parsing');
    if (response) {
      setResult(response);
    }
  };

  return (
    <div>
      <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileUpload} />
      {loading && <div>Analyzing CV...</div>}
      {error && <div className="error">{error}</div>}
      {result && (
        <div>
          <h2>Analysis Results</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
```

#### 5. Environment Configuration

Create a `.env` file in your Vite project:

```env
VITE_API_BASE_URL=http://localhost:8080  # Development
# VITE_API_BASE_URL=https://your-production-api.com  # Production
```

#### 6. Error Handling

Implement comprehensive error handling:

```typescript
// src/utils/errorHandling.ts
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const handleAPIError = (error: unknown): APIError => {
  if (error instanceof APIError) return error;
  
  if (axios.isAxiosError(error)) {
    return new APIError(
      error.response?.data?.message || 'API request failed',
      error.response?.status,
      error.response?.data?.code
    );
  }
  
  return new APIError('An unexpected error occurred');
};
```

#### 7. Testing

Example test setup using Vitest:

```typescript
// src/components/__tests__/CVUploader.test.tsx
import { render, fireEvent, waitFor } from '@testing-library/react';
import { CVUploader } from '../CVUploader';
import { vi } from 'vitest';

describe('CVUploader', () => {
  it('handles file upload and displays results', async () => {
    const { getByRole, findByText } = render(<CVUploader />);
    
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const input = getByRole('file');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(findByText('Analysis Results')).toBeTruthy();
    });
  });
});
```

### Best Practices

1. **Authentication**
   - Implement token refresh logic
   - Store tokens securely (preferably in HttpOnly cookies)
   - Handle token expiration gracefully

2. **File Upload**
   - Implement file size limits
   - Validate file types client-side
   - Show upload progress
   - Handle large files with chunked uploads if needed

3. **Error Handling**
   - Implement retry logic for failed requests
   - Show user-friendly error messages
   - Log errors for debugging
   - Handle network issues gracefully

4. **Performance**
   - Implement request caching where appropriate
   - Use request debouncing for frequent operations
   - Optimize file uploads with compression
   - Implement proper loading states

5. **Security**
   - Sanitize all user inputs
   - Implement CSRF protection
   - Use secure headers
   - Follow OWASP security guidelines

## �� Project Structure

```
root/
├── main.py                  # Main function code
├── config.py                # Configuration settings
├── requirements.txt         # Python dependencies
├── requirements-dev.txt     # Development dependencies
├── .gitignore               # Git ignore file
├── .gcloudignore            # GCloud ignore file
├── utils/                   # Utility modules
│   ├── __init__.py
│   ├── document_processor.py  # Document handling
│   ├── storage.py             # GCS operations
│   ├── gemini_client.py       # Gemini API client
│   ├── adk_client.py          # ADK integration
│   └── secret_manager.py      # Secret Manager client
├── models/                  # Data models
│   └── schemas.py           # Pydantic schemas
├── data/                    # Resource files
│   ├── prompts/             # Prompt templates
│   ├── schemas/             # JSON output schemas
│   └── few_shot_examples/   # Example data for model training
├── tests/                   # Test files
│   ├── test_api.py          # API endpoint tests
│   ├── test_iam_auth.py     # IAM authentication tests
│   └── test_basic.py        # Basic functionality tests
└── docs/                    # Documentation
```

## ⚙️ Configuration

Key configuration settings in `config.py`:

- **GCS_BUCKET_NAME**: Google Cloud Storage bucket for storing documents
- **PROJECT_ID**: Google Cloud Project ID
- **LOCATION**: Google Cloud region (default: europe-west9)
- **DEFAULT_MODEL**: Gemini model version to use
- **SUPPORTED_MODELS**: List of supported Gemini models
- **VERTEX_AI_ENABLED**: Whether to use Vertex AI (or direct Gemini API)
- **USE_ADK**: Whether to use Google Agent Development Kit
- **ADK_AGENT_LOCATION**: Location path to the ADK agent
- **USE_SECRETS_MANAGER**: Whether to use Secret Manager for resources
- **PROMPTS_SECRET_PREFIX**: Prefix for prompt secrets
- **SCHEMAS_SECRET_PREFIX**: Prefix for schema secrets
- **EXAMPLES_SECRET_PREFIX**: Prefix for few-shot examples secrets
- **SUPABASE_JWT_SECRET**: Secret for validating Supabase JWT tokens
- **SUPABASE_PROJECT_REF**: Supabase project reference

## 📦 Deployment

### Environment Variables
See `.env.template` for all required and optional environment variables. The following variables are required for deployment:

- `PROJECT_ID` - Your Google Cloud Project ID
- `GCS_BUCKET_NAME` - Your Google Cloud Storage bucket
- `SUPABASE_JWT_SECRET` - Your Supabase JWT secret
- `SUPABASE_PROJECT_REF` - Your Supabase project reference

### Deploying as a GCP Function

#### Option 1: Using trigger-build.bat (Windows)
```bash
.\trigger-build.bat
```

#### Option 2: Manual deployment
```bash
gcloud functions deploy cv_optimizer \
  --gen2 \
  --runtime=python311 \
  --region=europe-west2 \
  --source=. \
  --entry-point=cv_optimizer \
  --trigger-http \
  --memory=2048MB \
  --timeout=540s \
  --set-env-vars="USE_ADK=true,ADK_AGENT_LOCATION=projects/hireable-places/locations/europe-west2/agents/cv-optimizer-agent" \
  --allow-unauthenticated
```

### Docker Deployment
The project includes a Dockerfile for containerized deployment:

```bash
# Build the Docker image
docker build -t cv-optimizer .

# Run the container locally
docker run -p 8080:8080 \
  -e GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json \
  -v /path/to/credentials.json:/path/to/credentials.json \
  cv-optimizer
```

## 🧪 Testing

The project includes several test suites:

1. **API Tests** (`test_api.py`): Tests for API endpoints and request handling
2. **IAM Authentication Tests** (`test_iam_auth.py`): Tests for IAM authentication
3. **Basic Functionality Tests** (`test_basic.py`
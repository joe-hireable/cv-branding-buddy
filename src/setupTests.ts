import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock import.meta.env
Object.defineProperty(globalThis, 'import.meta', {
  value: {
    env: {
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || 'https://test-supabase-url.com',
      VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || 'test-anon-key',
      VITE_SUPABASE_SERVICE_ROLE_KEY: process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'test-service-role-key',
      MODE: 'test',
      DEV: false,
      PROD: false,
      SSR: false
    }
  }
});

// Mock Vite's import.meta.env
const env = {
  MODE: 'test',
  VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || 'https://test-supabase-url.com',
  VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || 'test-anon-key',
  VITE_CV_OPTIMIZER_GCF_URL: process.env.VITE_CV_OPTIMIZER_GCF_URL || 'https://test-optimizer.com'
};

// Better handling of import.meta.env
global.import = {
  meta: {
    env: {
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
      VITE_SUPABASE_SERVICE_ROLE_KEY: process.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
      MODE: 'test',
      DEV: false,
      PROD: false,
      SSR: false
    }
  }
} as any;

// Ensure process.env has the same values
process.env.MODE = 'test';
process.env.VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://test-supabase-url.com';
process.env.VITE_SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'test-anon-key';
process.env.VITE_CV_OPTIMIZER_GCF_URL = process.env.VITE_CV_OPTIMIZER_GCF_URL || 'https://test-optimizer.com';

// Mock window.crypto.randomUUID
Object.defineProperty(window, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid'
  }
});

// Mock FormData
const originalFormData = global.FormData;
class MockFormData {
  private data: Map<string, any> = new Map();

  append(key: string, value: any) {
    this.data.set(key, value);
  }

  delete(key: string) {
    this.data.delete(key);
  }

  get(key: string) {
    return this.data.get(key) || null;
  }

  getAll(key: string) {
    const value = this.data.get(key);
    return value ? [value] : [];
  }

  has(key: string) {
    return this.data.has(key);
  }

  set(key: string, value: any) {
    this.data.set(key, value);
  }

  forEach(callback: (value: any, key: string, parent: FormData) => void) {
    this.data.forEach((value, key) => callback(value, key, this as any));
  }

  entries() {
    return this.data.entries();
  }

  keys() {
    return this.data.keys();
  }

  values() {
    return this.data.values();
  }
}

// @ts-ignore - Ignore type mismatch for testing purposes
global.FormData = MockFormData;

// Mock File
const originalFile = global.File;
class MockFile {
  name: string;
  type: string;
  size: number;
  lastModified: number;
  webkitRelativePath: string;

  constructor(bits: BlobPart[], fileName: string, options: FilePropertyBag = {}) {
    this.name = fileName;
    this.type = options.type || '';
    this.size = bits.reduce((acc, bit) => acc + (bit as string).length, 0);
    this.lastModified = options.lastModified || Date.now();
    this.webkitRelativePath = '';
  }

  async arrayBuffer(): Promise<ArrayBuffer> {
    return new ArrayBuffer(this.size);
  }

  async text(): Promise<string> {
    return '';
  }

  slice(start?: number, end?: number, contentType?: string): Blob {
    return new Blob([], { type: contentType });
  }

  stream(): ReadableStream {
    return new ReadableStream();
  }
}

// @ts-ignore - Ignore type mismatch for testing purposes
global.File = MockFile;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Cleanup
afterAll(() => {
  global.FormData = originalFormData;
  global.File = originalFile;
});

// Set up test environment
process.env.NODE_ENV = 'test';
process.env.VITE_SUPABASE_URL = 'https://test-supabase-url.com';
process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.VITE_SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'; 
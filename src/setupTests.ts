import '@testing-library/jest-dom';

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

// Cleanup
afterAll(() => {
  global.FormData = originalFormData;
  global.File = originalFile;
}); 
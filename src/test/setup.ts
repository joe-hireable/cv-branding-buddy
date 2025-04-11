const dotenv = require('dotenv');
require('@testing-library/jest-dom');

// Load environment variables
dotenv.config();

// Set test timeout
jest.setTimeout(30000);

// Global setup
beforeAll(() => {
  // Add any global setup here
});

// Global cleanup
afterAll(() => {
  // Add any global cleanup here
}); 
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

try {
  console.log('Initializing React app...');
  const root = createRoot(rootElement);
  root.render(
    <App />
  );
  console.log('React app initialized successfully');
} catch (error) {
  console.error('Failed to initialize React app:', error);
}

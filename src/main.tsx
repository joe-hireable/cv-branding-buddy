import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Preload fonts
const preloadFonts = () => {
  const interLink = document.createElement('link');
  interLink.rel = 'preload';
  interLink.as = 'font';
  interLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
  document.head.appendChild(interLink);

  const funnelDisplayLink = document.createElement('link');
  funnelDisplayLink.rel = 'preload';
  funnelDisplayLink.as = 'font';
  funnelDisplayLink.href = 'https://fonts.cdnfonts.com/css/funnel-display';
  document.head.appendChild(funnelDisplayLink);
};

// Call preload function
preloadFonts();

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

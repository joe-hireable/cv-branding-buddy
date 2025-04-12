import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  console.log('Loading Vite config...');
  console.log('Mode:', mode);
  console.log('Command:', command);
  console.log('Environment variables:', {
    VITE_SUPABASE_URL: env.VITE_SUPABASE_URL ? '[EXISTS]' : '[MISSING]',
    VITE_SUPABASE_ANON_KEY: env.VITE_SUPABASE_ANON_KEY ? '[EXISTS]' : '[MISSING]'
  });

  return {
    server: {
      host: true, // Listen on all addresses
      port: 8080,
      strictPort: true,
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    }
  };
});

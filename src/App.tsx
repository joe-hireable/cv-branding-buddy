
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { CVProvider } from "@/contexts/CVContext";
import { RecruiterProvider } from "@/contexts/RecruiterContext";
import { SettingsProvider } from "@/contexts/SettingsContext";

import Upload from "./pages/Upload";
import Preview from "./pages/Preview";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import History from "./pages/History";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CVProvider>
      <RecruiterProvider>
        <SettingsProvider>
          <TooltipProvider>
            <DndProvider backend={HTML5Backend}>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Upload />} />
                  <Route path="/preview" element={<Preview />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/history" element={<History />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </DndProvider>
          </TooltipProvider>
        </SettingsProvider>
      </RecruiterProvider>
    </CVProvider>
  </QueryClientProvider>
);

export default App;


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
import { AuthProvider } from "@/contexts/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import UploadPage from "./pages/Upload";
import Preview from "./pages/Preview";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import History from "./pages/History";
import NotFound from "./pages/NotFound";

// Auth pages
import AuthLayout from "./pages/Auth";
import Login from "./pages/Auth/Login";
import EmailLogin from "./pages/Auth/EmailLogin";
import SignUp from "./pages/Auth/SignUp";
import ForgotPassword from "./pages/Auth/ForgotPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CVProvider>
        <RecruiterProvider>
          <SettingsProvider>
            <TooltipProvider>
              <DndProvider backend={HTML5Backend}>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    {/* Auth routes */}
                    <Route path="/auth" element={<AuthLayout />}>
                      <Route path="login" element={<Login />} />
                      <Route path="email" element={<EmailLogin />} />
                      <Route path="signup" element={<SignUp />} />
                      <Route path="forgot-password" element={<ForgotPassword />} />
                    </Route>
                    
                    {/* Protected routes */}
                    <Route path="/" element={
                      <ProtectedRoute>
                        <UploadPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/preview" element={
                      <ProtectedRoute>
                        <Preview />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    <Route path="/settings" element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    } />
                    <Route path="/history" element={
                      <ProtectedRoute>
                        <History />
                      </ProtectedRoute>
                    } />
                    
                    {/* Fallback route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </DndProvider>
            </TooltipProvider>
          </SettingsProvider>
        </RecruiterProvider>
      </CVProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

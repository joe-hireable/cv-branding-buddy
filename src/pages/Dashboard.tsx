import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText, UserCheck, Loader2, Upload, Settings, LogOut } from 'lucide-react';
import { GradientIcon } from '@/components/ui/gradient-icon';
import { useCVContext } from '@/contexts/CVContext';
import { useSettingsContext } from '@/contexts/SettingsContext';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { GradientText, GradientButton, SecondaryGradientButton, GradientCard } from '@/components/ui/brand-components';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-grow p-6">
        <div className="flex flex-col space-y-4">
          <div className="mt-6">
            <GradientButton 
              onClick={() => navigate('/upload')} 
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload New CV
            </GradientButton>
          </div>
          <div className="mt-6">
            <SecondaryGradientButton 
              onClick={() => navigate('/settings')} 
              className="w-full"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </SecondaryGradientButton>
          </div>
          <div className="mt-6">
            <SecondaryGradientButton 
              onClick={signOut} 
              className="w-full"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </SecondaryGradientButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
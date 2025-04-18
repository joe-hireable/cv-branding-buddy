import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRecruiterContext } from '@/contexts/RecruiterContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSettingsContext } from '@/contexts/SettingsContext';
import ThemeToggle from '@/components/ThemeToggle';
import { GradientText } from '@/components/ui/brand-components';

const Header = () => {
  const location = useLocation();
  const { profile } = useRecruiterContext();
  const { user, signOut } = useAuth();
  const { settings } = useSettingsContext();
  
  // Determine if dark mode is active
  const isDarkMode = () => {
    if (typeof window === 'undefined') return false;
    
    if (settings.theme === 'dark') return true;
    if (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) return true;
    return false;
  };

  const getInitials = () => {
    if (!profile) return 'U';
    return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigation will be handled by the auth state change listener
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img 
              src={isDarkMode() ? "/logos/logo-dark.svg" : "/logos/logo.svg"} 
              alt="CV Branding Buddy"
              className="h-8 w-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                console.error('Logo failed to load:', target.src);
                target.onerror = null; // Prevent infinite loop
                target.style.display = 'none';
                // Fallback to text
                const parent = target.parentElement;
                if (parent) {
                  const textFallback = document.createElement('span');
                  textFallback.className = 'text-xl font-heading font-semibold dark:text-white';
                  textFallback.textContent = 'CV Branding Buddy';
                  parent.appendChild(textFallback);
                }
              }}
            />
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle iconOnly />
          
          {location.pathname !== '/settings' && (
            <Link to="/settings">
              <Button variant="ghost" size="sm" className="font-sans">
                Settings
              </Button>
            </Link>
          )}
          
          {location.pathname !== '/history' && (
            <Link to="/history">
              <Button variant="ghost" size="sm" className="font-sans">
                History
              </Button>
            </Link>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.profilePicture} alt={`${profile?.firstName} ${profile?.lastName}`} />
                  <AvatarFallback className="bg-brand-gradient text-white">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none font-sans">{profile?.firstName} {profile?.lastName}</p>
                  <p className="text-xs leading-none text-muted-foreground font-sans">{profile?.email || user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/profile" className="w-full font-sans">Profile Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/settings" className="w-full font-sans">App Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="font-sans">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;

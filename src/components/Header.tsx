
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

const Header: React.FC = () => {
  const location = useLocation();
  const { profile } = useRecruiterContext();
  const { user, signOut } = useAuth();

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
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-hireable-gradient flex items-center justify-center">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <span className="font-bold text-lg text-gray-800">Hireable</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {location.pathname !== '/settings' && (
            <Link to="/settings">
              <Button variant="ghost" size="sm">
                Settings
              </Button>
            </Link>
          )}
          
          {location.pathname !== '/history' && (
            <Link to="/history">
              <Button variant="ghost" size="sm">
                History
              </Button>
            </Link>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.profilePicture} alt={`${profile?.firstName} ${profile?.lastName}`} />
                  <AvatarFallback className="bg-hireable-gradient text-white">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{profile?.firstName} {profile?.lastName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{profile?.email || user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/profile" className="w-full">Profile Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/settings" className="w-full">App Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
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

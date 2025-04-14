import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes } from 'react';

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'plain';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
  className?: string;
}

export const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ variant = 'primary', size = 'default', className, children, ...props }, ref) => {
    if (variant === 'plain') {
      return (
        <div className="group relative w-full block rounded-md" style={{ padding: '1px' }}>
          {/* Gradient background for border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F600FE] via-[#A136FF] to-[#0033D9] rounded-md"></div>
          
          <Button
            ref={ref}
            size={size}
            className={cn(
              'relative bg-white dark:bg-gray-800 hover:opacity-90 transition-all duration-200 w-full rounded-[4px]',
              className
            )}
            {...props}
          >
            <span className="bg-gradient-to-r from-[#F600FE] via-[#A136FF] to-[#0033D9] bg-clip-text text-transparent font-medium inline-flex items-center gap-2">
              {children}
            </span>
          </Button>
        </div>
      );
    }
    
    if (variant === 'primary') {
      return (
        <div className="group relative w-full block rounded-md" style={{ padding: '1px' }}>
          {/* Gradient background for border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F600FE] via-[#A136FF] to-[#0033D9] rounded-md"></div>
          
          <Button
            ref={ref}
            size={size}
            className={cn(
              'relative bg-gradient-to-r from-[#F600FE] via-[#A136FF] to-[#0033D9] hover:opacity-90 transition-all duration-200 w-full rounded-[4px] text-white',
              className
            )}
            {...props}
          >
            {children}
          </Button>
        </div>
      );
    }
    
    // Secondary button with transparent background and gradient border/text
    return (
      <div className="group relative w-full block rounded-md" style={{ padding: '1px' }}>
        {/* Gradient background for border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F600FE] via-[#A136FF] to-[#0033D9] rounded-md"></div>
        
        <Button
          ref={ref}
          size={size}
          className={cn(
            'relative bg-transparent border-none hover:opacity-90 transition-all duration-200 w-full rounded-[4px]',
            className
          )}
          {...props}
        >
          <span className="bg-gradient-to-r from-[#F600FE] via-[#A136FF] to-[#0033D9] bg-clip-text text-transparent font-medium inline-flex items-center gap-2">
            {children}
          </span>
        </Button>
      </div>
    );
  }
);

CustomButton.displayName = 'CustomButton'; 
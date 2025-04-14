import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes } from 'react';

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ variant = 'primary', size = 'default', className, children, fullWidth = false, ...props }, ref) => {
    const widthClass = fullWidth ? 'w-full' : '';
    
    if (variant === 'primary') {
      return (
        <Button
          ref={ref}
          size={size}
          variant="primary-gradient"
          className={cn(widthClass, className)}
          {...props}
        >
          {children}
        </Button>
      );
    }
    
    // Secondary button - uses the new secondary-gradient variant
    return (
      <Button
        ref={ref}
        size={size}
        variant="secondary-gradient"
        className={cn(widthClass, className)}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

CustomButton.displayName = 'CustomButton'; 
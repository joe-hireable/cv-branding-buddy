/**
 * @file Brand Components
 * @description Reusable UI components using the brand gradient styles
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge, BadgeProps } from '@/components/ui/badge';

/**
 * GradientText Component - Text with brand gradient
 */
interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  as?: React.ElementType;
  animated?: boolean;
}

export const GradientText: React.FC<GradientTextProps> = ({
  as: Component = 'span',
  className,
  animated = false,
  children,
  ...props
}) => {
  return (
    <Component
      className={cn(
        'text-brand-gradient',
        animated && 'animate-gradient',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

/**
 * GradientButton Component - Button with brand gradient background
 */
export const GradientButton: React.FC<ButtonProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <Button
      className={cn(
        'btn-brand-gradient',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

/**
 * SecondaryGradientButton Component - Button with brand gradient border and gradient text
 */
export const SecondaryGradientButton: React.FC<ButtonProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <Button
      variant="outline"
      className={cn(
        'border-brand-gradient bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700',
        className
      )}
      {...props}
    >
      <span className="text-brand-gradient">{children}</span>
    </Button>
  );
};

/**
 * GradientCard Component - Card with brand gradient border
 */
export const GradientCard: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <Card
      className={cn(
        'card-brand-gradient',
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
};

/**
 * GradientBadge Component - Badge with brand gradient background
 */
export const GradientBadge: React.FC<BadgeProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <Badge
      className={cn(
        'bg-brand-gradient text-white',
        className
      )}
      {...props}
    >
      {children}
    </Badge>
  );
};

/**
 * GradientDivider Component - Horizontal divider with brand gradient
 */
interface GradientDividerProps extends React.HTMLAttributes<HTMLHRElement> {
  thickness?: 'thin' | 'medium' | 'thick';
}

export const GradientDivider: React.FC<GradientDividerProps> = ({
  className,
  thickness = 'thin',
  ...props
}) => {
  const thicknessClass = {
    thin: 'h-px',
    medium: 'h-0.5',
    thick: 'h-1',
  }[thickness];

  return (
    <hr
      className={cn(
        'divider-brand-gradient w-full border-none',
        thicknessClass,
        className
      )}
      {...props}
    />
  );
};

/**
 * GradientBorder Component - Adds a gradient border to any element
 */
interface GradientBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  borderWidth?: 'thin' | 'medium' | 'thick';
  rounded?: boolean;
}

export const GradientBorder: React.FC<GradientBorderProps> = ({
  className,
  children,
  borderWidth = 'thin',
  rounded = true,
  ...props
}) => {
  const borderWidthClass = {
    thin: 'p-[1px]',
    medium: 'p-[2px]',
    thick: 'p-[3px]',
  }[borderWidth];

  return (
    <div
      className={cn(
        'border-brand-gradient relative',
        rounded ? 'rounded-md' : '',
        borderWidthClass,
        className
      )}
      {...props}
    >
      <div className={cn(
        'bg-background h-full w-full',
        rounded ? 'rounded-[calc(var(--radius)-1px)]' : ''
      )}>
        {children}
      </div>
    </div>
  );
}; 
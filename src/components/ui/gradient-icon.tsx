import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface GradientIconProps {
  icon: LucideIcon;
  className?: string;
  size?: number;
}

export const GradientIcon: React.FC<GradientIconProps> = ({
  icon: Icon,
  className,
  size = 24,
}) => {
  // Define a unique ID for the gradient
  const gradientId = React.useId();
  
  return (
    <div className={cn("relative h-12 w-12 flex items-center justify-center", className)}>
      {/* Define the SVG gradient once per component */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F600FE" />
            <stop offset="50%" stopColor="#A136FF" />
            <stop offset="100%" stopColor="#0033D9" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Gradient background circle */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F600FE] via-[#A136FF] to-[#0033D9]"></div>
      
      {/* White inner circle with gradient icon */}
      <div className="absolute inset-0.5 rounded-full bg-white dark:bg-slate-950 flex items-center justify-center">
        <Icon
          size={size}
          style={{ stroke: `url(#${gradientId})` }}
          strokeWidth={2}
          className="text-transparent"
        />
      </div>
    </div>
  );
}; 
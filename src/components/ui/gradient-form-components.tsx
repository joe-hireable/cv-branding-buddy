import React, { ComponentPropsWithoutRef } from 'react';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export const GradientSwitch = React.forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof Switch>
>(({ className, ...props }, ref) => (
  <Switch
    ref={ref}
    className={cn(
      'bg-brand-gradient data-[state=checked]:bg-brand-gradient',
      'data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-gray-700',
      '[&[data-state=checked]>span]:translate-x-5',
      '[&[data-state=unchecked]>span]:translate-x-0',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  >
    <span className={cn(
      'block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform',
      'data-[state=checked]:bg-white data-[state=unchecked]:bg-white'
    )} />
  </Switch>
));
GradientSwitch.displayName = 'GradientSwitch';

export const GradientCheckbox = React.forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof Checkbox>
>(({ className, ...props }, ref) => (
  <Checkbox
    ref={ref}
    className={cn(
      'h-4 w-4 bg-brand-gradient border-transparent',
      'data-[state=checked]:bg-brand-gradient data-[state=checked]:border-transparent',
      'focus:ring-offset-white dark:focus:ring-offset-gray-900',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  />
));
GradientCheckbox.displayName = 'GradientCheckbox';

// Drag and Drop styles
export const dragAndDropStyles = {
  draggable: 'cursor-move transition-colors duration-200',
  dragging: 'opacity-50 border-dashed border-2 border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-900',
  dropTarget: 'border-2 border-dashed border-gray-400 dark:border-gray-600',
  container: 'flex items-center justify-between p-3 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 mb-2',
}; 
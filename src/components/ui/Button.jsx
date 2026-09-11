import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/helpers';

export const Button = ({
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  loading,
  fullWidth,
  icon: Icon,
  children,
  ...rest
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500',
    accent: 'bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-error-500 text-white hover:bg-error-600 focus:ring-error-500',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const widthStyle = fullWidth ? 'w-full' : '';
  const disabledStyle = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], widthStyle, disabledStyle, className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!loading && Icon && <Icon className="mr-2 h-4 w-4" />}
      {children}
    </button>
  );
};

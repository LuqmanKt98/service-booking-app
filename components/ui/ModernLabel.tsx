import React from 'react';

interface ModernLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  variant?: 'default' | 'bold' | 'gradient';
}

export const ModernLabel = React.forwardRef<HTMLLabelElement, ModernLabelProps>(
  ({ children, required, variant = 'default', className, ...props }, ref) => {
    const variantStyles = {
      default: 'text-gray-700 font-medium',
      bold: 'text-gray-800 font-bold',
      gradient: 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold',
    };

    return (
      <label
        ref={ref}
        className={`block text-sm ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    );
  }
);

ModernLabel.displayName = 'ModernLabel';


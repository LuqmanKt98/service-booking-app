import React from 'react';

interface ModernInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const ModernInput = React.forwardRef<HTMLInputElement, ModernInputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-bold text-gray-800 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full px-4 py-3 ${icon ? 'pl-12' : ''} rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all duration-300 font-medium text-gray-800 placeholder-gray-400 hover:border-gray-300 ${
              error ? 'border-red-500 focus:border-red-500' : ''
            } ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-red-500 text-sm font-medium mt-1">{error}</p>
        )}
      </div>
    );
  }
);

ModernInput.displayName = 'ModernInput';


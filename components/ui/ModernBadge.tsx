'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ModernBadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
}

export const ModernBadge: React.FC<ModernBadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
}) => {
  const baseStyles = `
    inline-flex items-center gap-2 font-semibold rounded-full
    transition-all duration-300
  `;

  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700',
    success: 'bg-gradient-to-r from-green-100 to-green-200 text-green-700',
    warning: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700',
    danger: 'bg-gradient-to-r from-red-100 to-red-200 text-red-700',
    info: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3.5 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <motion.span
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </motion.span>
  );
};


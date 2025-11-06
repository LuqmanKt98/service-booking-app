'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ModernCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
  interactive?: boolean;
  gradient?: boolean;
  image?: string;
  imageOverlay?: boolean;
}

export const ModernCard: React.FC<ModernCardProps> = ({
  children,
  onClick,
  selected = false,
  className = '',
  interactive = false,
  gradient = false,
  image,
  imageOverlay = true,
}) => {
  const baseStyles = `
    rounded-2xl p-6 transition-all duration-300 
    border-2 overflow-hidden relative
    ${interactive ? 'cursor-pointer' : ''}
  `;

  const selectedStyles = selected
    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl'
    : 'border-gray-200 bg-white hover:border-blue-300 shadow-lg hover:shadow-2xl';

  const gradientStyles = gradient
    ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0'
    : '';

  return (
    <motion.div
      onClick={onClick}
      className={`${baseStyles} ${selectedStyles} ${gradientStyles} ${className}`}
      whileHover={interactive ? { y: -8, scale: 1.02 } : {}}
      whileTap={interactive ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 100 }}
    >
      {image && (
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={image}
            alt=""
            className="w-full h-full object-cover"
          />
          {imageOverlay && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          )}
        </div>
      )}
      <div className={image ? 'relative z-10' : ''}>
        {children}
      </div>
    </motion.div>
  );
};


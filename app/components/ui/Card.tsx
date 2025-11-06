import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  onClick,
  selected = false,
  className = '',
  interactive = false,
}) => {
  const baseStyles = 'rounded-lg border-2 p-4 transition-all duration-200';
  const selectedStyles = selected
    ? 'border-blue-600 bg-blue-50 shadow-lg'
    : 'border-gray-200 bg-white hover:border-gray-300';
  const interactiveStyles = interactive ? 'cursor-pointer' : '';

  return (
    <motion.div
      onClick={onClick}
      className={`${baseStyles} ${selectedStyles} ${interactiveStyles} ${className}`}
      whileHover={interactive ? { scale: 1.02 } : {}}
      whileTap={interactive ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};


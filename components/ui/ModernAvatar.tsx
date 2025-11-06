import React from 'react';
import Image from 'next/image';

interface ModernAvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeStyles = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

export const ModernAvatar: React.FC<ModernAvatarProps> = ({
  src,
  alt = 'Avatar',
  initials,
  size = 'md',
  className,
}) => {
  return (
    <div
      className={`${sizeStyles[size]} rounded-full overflow-hidden flex items-center justify-center font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg ${className}`}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={64}
          height={64}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

ModernAvatar.displayName = 'ModernAvatar';


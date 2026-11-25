// src/components/ui/Avatar.jsx
import React from 'react';
import { cn, getInitials } from '../../utils/helpers';

const sizeMap = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
  '2xl': 'h-24 w-24 text-2xl',
};

const colorMap = [
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-green-100 text-green-700',
  'bg-orange-100 text-orange-700',
  'bg-pink-100 text-pink-700',
  'bg-teal-100 text-teal-700',
  'bg-indigo-100 text-indigo-700',
  'bg-yellow-100 text-yellow-700',
];

const getColor = (name) => {
  if (!name) return colorMap[0];
  const index = name.charCodeAt(0) % colorMap.length;
  return colorMap[index];
};

const Avatar = ({ name, src, size = 'md', className }) => {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover ring-2 ring-white', sizeMap[size], className)}
      />
    );
  }

  return (
    <div className={cn(
      'rounded-full flex items-center justify-center font-semibold flex-shrink-0 ring-2 ring-white',
      sizeMap[size],
      getColor(name),
      className
    )}>
      {getInitials(name)}
    </div>
  );
};

export default Avatar;

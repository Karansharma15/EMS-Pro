// src/components/ui/Badge.jsx
import React from 'react';
import { cn, getStatusColor } from '../../utils/helpers';

const Badge = ({ children, status, variant, className }) => {
  const colorClass = status ? getStatusColor(status) : '';
  const variantMap = {
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    green: 'bg-green-100 text-green-700 border-green-200',
    red: 'bg-red-100 text-red-700 border-red-200',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    orange: 'bg-orange-100 text-orange-700 border-orange-200',
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      colorClass || variantMap[variant] || variantMap.gray,
      className
    )}>
      {children}
    </span>
  );
};

export default Badge;

// src/components/ui/Card.jsx
import React from 'react';
import { cn } from '../../utils/helpers';

export const Card = ({ children, className, ...props }) => (
  <div className={cn('bg-white rounded-xl border border-slate-200 shadow-sm', className)} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ children, className, ...props }) => (
  <div className={cn('px-6 py-4 border-b border-slate-100', className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className, ...props }) => (
  <h3 className={cn('text-base font-semibold text-slate-800', className)} {...props}>
    {children}
  </h3>
);

export const CardContent = ({ children, className, ...props }) => (
  <div className={cn('px-6 py-4', className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className, ...props }) => (
  <div className={cn('px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-xl', className)} {...props}>
    {children}
  </div>
);

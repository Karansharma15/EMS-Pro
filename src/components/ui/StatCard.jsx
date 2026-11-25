// src/components/ui/StatCard.jsx
import React from 'react';
import { cn } from '../../utils/helpers';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon, change, changeType, iconBg, subtitle, className }) => {
  return (
    <div className={cn('bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {icon && (
          <div className={cn('p-3 rounded-xl', iconBg || 'bg-blue-50')}>
            {icon}
          </div>
        )}
      </div>
      {change !== undefined && (
        <div className={cn('flex items-center gap-1 text-sm font-medium', changeType === 'up' ? 'text-green-600' : 'text-red-500')}>
          {changeType === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          <span>{change}</span>
          <span className="text-slate-400 font-normal">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;

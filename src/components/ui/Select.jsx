// src/components/ui/Select.jsx
import React from 'react';
import { cn } from '../../utils/helpers';
import { ChevronDown } from 'lucide-react';

const Select = React.forwardRef(({
  label, error, helperText, options = [], placeholder, required,
  className, containerClassName, ...props
}, ref) => {
  return (
    <div className={cn('flex flex-col gap-1', containerClassName)}>
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'w-full appearance-none rounded-lg border bg-white px-3 py-2.5 pr-10 text-sm text-slate-900',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all',
            'disabled:bg-slate-50 disabled:cursor-not-allowed',
            error ? 'border-red-400' : 'border-slate-300',
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
              {typeof opt === 'string' ? opt : opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {helperText && !error && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;

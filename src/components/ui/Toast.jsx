// src/components/ui/Toast.jsx
import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../../utils/helpers';

const icons = {
  success: <CheckCircle className="h-5 w-5 text-green-500" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
  warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
};

const bgMap = {
  success: 'border-green-200 bg-green-50',
  error: 'border-red-200 bg-red-50',
  warning: 'border-yellow-200 bg-yellow-50',
  info: 'border-blue-200 bg-blue-50',
};

const Toast = ({ id, type = 'info', message, onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <div className={cn(
      'flex items-start gap-3 p-4 rounded-xl border shadow-lg min-w-80 max-w-sm toast-enter',
      bgMap[type]
    )}>
      {icons[type]}
      <p className="flex-1 text-sm text-slate-700 font-medium">{message}</p>
      <button onClick={() => onClose(id)} className="text-slate-400 hover:text-slate-600 transition-colors">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

// Toast Container
export const ToastContainer = ({ toasts, removeToast }) => (
  <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3">
    {toasts.map((t) => <Toast key={t.id} {...t} onClose={removeToast} />)}
  </div>
);

export default Toast;

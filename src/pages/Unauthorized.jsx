import { useNavigate } from 'react-router-dom';
import { ShieldOff, ArrowLeft, Home } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md w-full">
        {/* Icon */}
        <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-red-100 flex items-center justify-center shadow-inner">
          <ShieldOff size={44} className="text-red-500" />
        </div>

        {/* Error code */}
        <p className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600 mb-2 leading-none">
          403
        </p>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Access Denied</h1>

        {/* Description */}
        <p className="text-gray-500 leading-relaxed mb-8">
          You don't have permission to view this page. This area is restricted to
          authorized personnel only. Please contact your administrator if you
          believe this is a mistake.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto gap-2"
          >
            <ArrowLeft size={16} />
            Go Back
          </Button>
          <Button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto gap-2"
          >
            <Home size={16} />
            Back to Dashboard
          </Button>
        </div>

        {/* Footer note */}
        <p className="mt-10 text-xs text-gray-400">
          Error 403 &mdash; Forbidden &bull; Employee Management System
        </p>
      </div>
    </div>
  );
}

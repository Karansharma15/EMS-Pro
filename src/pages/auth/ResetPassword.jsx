import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, ArrowLeft, Building2, AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import useAuthStore from '../../store/authStore';

const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { label: 'One number', test: (v) => /[0-9]/.test(v) },
];

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const { resetPassword } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { password: '', confirmPassword: '' } });

  const passwordValue = watch('password', '');

  const onSubmit = async (data) => {
    if (!token) {
      setServerError('Invalid or missing reset token. Please request a new one.');
      return;
    }
    setIsLoading(true);
    setServerError('');
    try {
      // Simulate API call; use store method if available
      const result = resetPassword
        ? await resetPassword(token, data.password)
        : await new Promise((r) => setTimeout(() => r({ success: true }), 1000));

      if (result?.success !== false) {
        navigate('/login', {
          state: { successMessage: 'Password reset successfully! Please sign in with your new password.' },
        });
      } else {
        setServerError(result?.message || 'Failed to reset password. The token may be expired or invalid.');
      }
    } catch (err) {
      setServerError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] bg-white/5 rounded-full" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xl font-bold tracking-wide">EMS Portal</span>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white leading-tight">
            Secure Your <br />
            <span className="text-violet-200">New Password</span>
          </h1>
          <p className="text-purple-100 text-lg leading-relaxed max-w-sm">
            Create a strong password to keep your account safe and protected from unauthorized access.
          </p>
          <div className="space-y-3 pt-2 text-white/90 text-sm">
            <p>✦ Use at least 8 characters</p>
            <p>✦ Mix uppercase and lowercase letters</p>
            <p>✦ Include at least one number</p>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-purple-200 text-sm italic">"A strong password is your first line of defense."</p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-900 text-lg font-bold">EMS Portal</span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back
            </Link>

            <div className="mb-8">
              <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-violet-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Reset password</h2>
              <p className="text-gray-500 mt-1 text-sm">Enter your new password below.</p>
            </div>

            {/* Token validation warning */}
            {!token && (
              <div className="mb-5 flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  No reset token found in the URL.{' '}
                  <Link to="/forgot-password" className="underline font-medium hover:text-amber-800">
                    Request a new one.
                  </Link>
                </span>
              </div>
            )}

            {/* Token preview */}
            {token && (
              <div className="mb-5 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3">
                <p className="text-xs text-gray-500 mb-1 font-medium">Reset token</p>
                <code className="text-xs font-mono text-gray-700 break-all">{token}</code>
              </div>
            )}

            {serverError && (
              <div className="mb-5 flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* New password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Enter new password"
                    className={`w-full px-4 py-2.5 pr-11 rounded-xl border text-sm bg-white text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                      errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    {...register('password', {
                      required: 'New password is required',
                      minLength: { value: 8, message: 'Password must be at least 8 characters' },
                      validate: {
                        hasUppercase: (v) => /[A-Z]/.test(v) || 'Must contain at least one uppercase letter',
                        hasNumber: (v) => /[0-9]/.test(v) || 'Must contain at least one number',
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}

                {/* Strength indicators */}
                {passwordValue.length > 0 && (
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {PASSWORD_RULES.map(({ label, test }) => {
                      const passed = test(passwordValue);
                      return (
                        <span
                          key={label}
                          className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium transition-colors ${
                            passed
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-gray-50 text-gray-400 border-gray-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${passed ? 'bg-green-500' : 'bg-gray-300'}`} />
                          {label}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm new password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Repeat your new password"
                    className={`w-full px-4 py-2.5 pr-11 rounded-xl border text-sm bg-white text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                      errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (v) => v === passwordValue || 'Passwords do not match',
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || !token}
                className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 shadow-sm shadow-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Resetting password…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Reset password
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Remembered your password?{' '}
              <Link to="/login" className="text-violet-600 hover:text-violet-700 font-medium transition">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

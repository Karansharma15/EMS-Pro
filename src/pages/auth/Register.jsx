import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, Building2, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import useAuthStore from '../../store/authStore';

const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { label: 'One number', test: (v) => /[0-9]/.test(v) },
];

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' } });

  const passwordValue = watch('password', '');

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');
    try {
      const result = registerUser
        ? await registerUser({ name: data.fullName, email: data.email, password: data.password })
        : { success: true };

      if (result?.success !== false) {
        navigate('/login', {
          state: { successMessage: 'Account created successfully! Please sign in.' },
        });
      } else {
        setServerError(result?.message || 'Registration failed. Please try again.');
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
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-700 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] bg-white/5 rounded-full" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xl font-bold tracking-wide">EMS Portal</span>
        </div>

        {/* Hero */}
        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-extrabold text-white leading-tight">
            Join Your <br />
            <span className="text-pink-200">Organization</span> <br />
            Today
          </h1>
          <p className="text-purple-100 text-lg leading-relaxed max-w-sm">
            Create your account and get instant access to HR tools, timesheets, leave management, and more.
          </p>

          {/* Benefits */}
          <div className="space-y-3 pt-2">
            {[
              'Track attendance & leaves in real time',
              'View payroll slips and history',
              'Collaborate on tasks with your team',
            ].map((text) => (
              <div key={text} className="flex items-start gap-2 text-white/90 text-sm">
                <CheckCircle2 className="w-4 h-4 text-pink-300 mt-0.5 shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-purple-200 text-sm italic">"Your career journey starts here."</p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-900 text-lg font-bold">EMS Portal</span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Create account</h2>
              <p className="text-gray-500 mt-1 text-sm">Fill in your details to get started</p>
            </div>

            {serverError && (
              <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Full name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
                <input
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Smith"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.fullName ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  {...register('fullName', {
                    required: 'Full name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  })}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
                  })}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Create a strong password"
                    className={`w-full px-4 py-2.5 pr-11 rounded-xl border text-sm bg-white text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    {...register('password', {
                      required: 'Password is required',
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

                {/* Password strength indicators */}
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    className={`w-full px-4 py-2.5 pr-11 rounded-xl border text-sm bg-white text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
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
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 shadow-sm shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Creating account…
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Create account
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium transition">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Building2, Users, BarChart3, Shield } from 'lucide-react';
import { useForm } from 'react-hook-form';
import useAuthStore from '../../store/authStore';
import { useToast } from '../../components/layout/AppLayout';

const DEMO_CREDENTIALS = [
  { role: 'Admin', email: 'admin@company.com', password: 'Admin@123', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { role: 'HR', email: 'michael@company.com', password: 'Pass@123', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { role: 'Employee', email: 'sarah@company.com', password: 'Pass@123', color: 'bg-green-100 text-green-700 border-green-200' },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { addToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        if (data.rememberMe) {
          localStorage.setItem('ems_remember_email', data.email);
        } else {
          localStorage.removeItem('ems_remember_email');
        }
        addToast({ type: 'success', message: `Welcome back, ${result.user?.name || 'User'}!` });
        navigate('/dashboard');
      } else {
        addToast({ type: 'error', message: result.message || 'Invalid email or password.' });
      }
    } catch (err) {
      addToast({ type: 'error', message: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (email, password) => {
    setValue('email', email);
    setValue('password', password);
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] bg-white/5 rounded-full" />
        <div className="absolute top-1/2 -translate-y-1/2 -right-16 w-64 h-64 bg-white/5 rounded-full" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xl font-bold tracking-wide">EMS Portal</span>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-extrabold text-white leading-tight">
            Manage Your <br />
            <span className="text-blue-200">Workforce</span> <br />
            Effortlessly
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed max-w-sm">
            A complete Employee Management System to streamline HR operations, attendance, payroll, and performance.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 pt-2">
            {[
              { icon: Users, label: 'Team Management' },
              { icon: BarChart3, label: 'Analytics' },
              { icon: Shield, label: 'Role-Based Access' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium border border-white/20"
              >
                <Icon className="w-4 h-4" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Footer quote */}
        <div className="relative z-10">
          <p className="text-blue-200 text-sm italic">
            "Empowering teams, one click at a time."
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-900 text-lg font-bold">EMS Portal</span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
              <p className="text-gray-500 mt-1 text-sm">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium transition"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className={`w-full px-4 py-2.5 pr-11 rounded-xl border text-sm bg-white text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    {...register('password', { required: 'Password is required' })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2.5">
                <input
                  id="rememberMe"
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600 cursor-pointer"
                  {...register('rememberMe')}
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-600 cursor-pointer select-none">
                  Remember me
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 shadow-sm shadow-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Sign in
                  </>
                )}
              </button>
            </form>

            {/* Register link */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium transition">
                Create one
              </Link>
            </p>

            {/* Demo credentials */}
            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs font-semibold text-blue-700 mb-3 uppercase tracking-wide">
                Demo Credentials
              </p>
              <div className="space-y-2">
                {DEMO_CREDENTIALS.map(({ role, email, password, color }) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => fillDemo(email, password)}
                    className={`w-full flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-medium transition hover:opacity-80 ${color}`}
                  >
                    <span className="font-semibold">{role}</span>
                    <span className="font-mono opacity-80">{email}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-blue-500 mt-2 text-center">Click a row to auto-fill credentials</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

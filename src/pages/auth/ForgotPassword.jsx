import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Building2, KeyRound, Copy, CheckCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';

function generateResetToken(email) {
  // Simulate a reset token generation
  const hash = btoa(`${email}:${Date.now()}`).replace(/[^a-zA-Z0-9]/g, '').slice(0, 32);
  return hash;
}

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [copiedToken, setCopiedToken] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: '' } });

  const onSubmit = async (data) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 1200));
    const token = generateResetToken(data.email);
    setResetToken(token);
    setSubmittedEmail(data.email);
    setSubmitted(true);
    setIsLoading(false);
  };

  const copyToken = async () => {
    try {
      await navigator.clipboard.writeText(resetToken);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    } catch {
      // fallback: select text
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-700 flex-col justify-between p-12 relative overflow-hidden">
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
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white leading-tight">
            Recover <br />
            <span className="text-cyan-200">Your Access</span> <br />
            Securely
          </h1>
          <p className="text-cyan-100 text-lg leading-relaxed max-w-sm">
            We'll generate a password reset link so you can regain access to your account quickly and safely.
          </p>
          <div className="space-y-3 pt-2 text-white/90 text-sm">
            <p>✦ Secure token-based reset</p>
            <p>✦ Token expires in 15 minutes</p>
            <p>✦ No data is ever exposed</p>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-cyan-200 text-sm italic">"Security is not a product, it's a process."</p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-900 text-lg font-bold">EMS Portal</span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to sign in
            </Link>

            {!submitted ? (
              <>
                <div className="mb-8">
                  <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center mb-4">
                    <Mail className="w-6 h-6 text-teal-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Forgot your password?</h2>
                  <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                    Enter the email associated with your account and we'll generate a secure reset token for you.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        autoComplete="email"
                        placeholder="you@company.com"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-white text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                          errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        {...register('email', {
                          required: 'Email is required',
                          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
                        })}
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 shadow-sm shadow-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Generating token…
                      </>
                    ) : (
                      'Send reset token'
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* ── Success state ── */
              <div className="space-y-5">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                  <KeyRound className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Reset token generated</h2>
                  <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                    A reset token has been generated for{' '}
                    <span className="font-medium text-gray-700">{submittedEmail}</span>. Use it on the reset password
                    page. This token expires in <strong>15 minutes</strong>.
                  </p>
                </div>

                {/* Token display */}
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-2">
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Your reset token</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs font-mono text-amber-900 bg-amber-100 rounded-lg px-3 py-2 break-all border border-amber-200">
                      {resetToken}
                    </code>
                    <button
                      onClick={copyToken}
                      className="shrink-0 p-2 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-800 transition"
                      title="Copy token"
                    >
                      {copiedToken ? <CheckCheck className="w-4 h-4 text-green-700" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-amber-600">⚠ Keep this token safe — it won't be shown again.</p>
                </div>

                <Link
                  to={`/reset-password?token=${resetToken}`}
                  className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 shadow-sm shadow-teal-200"
                >
                  Continue to reset password →
                </Link>

                <Link
                  to="/login"
                  className="block text-center text-sm text-gray-500 hover:text-gray-700 transition"
                >
                  Return to sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

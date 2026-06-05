'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Activity, Lock, CheckCircle2 } from 'lucide-react';

// Gumagamit tayo ng Suspense para sa useSearchParams para iwas build error sa Next.js
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // Kukunin niya yung token sa URL

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!token) {
      setErrorMessage('Invalid or missing reset link.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    setStatus('loading');

    try {
      // Ipapasa natin ang token at bagong password sa backend
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        // Awtomatikong dadalhin sa login page pagkatapos ng 3 segundo
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setErrorMessage(data.error || 'Failed to reset password.');
        setStatus('idle');
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again.');
      setStatus('idle');
    }
  };

  // SUCCESS UI
  if (status === 'success') {
    return (
      <div className="text-center py-6 animate-in fade-in zoom-in duration-300">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Password Reset Successful!</h3>
        <p className="text-slate-600 text-sm mb-6">
          Your password has been securely updated. Redirecting you to login...
        </p>
        <Link href="/login" className="w-full flex justify-center py-2.5 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition">
          Go to Login now
        </Link>
      </div>
    );
  }

  // DEFAULT FORM UI
  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center font-medium">
          {errorMessage}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-slate-900 placeholder:text-slate-400 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2.5 border"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="text-slate-900 placeholder:text-slate-400 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2.5 border"
            placeholder="••••••••"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-70"
      >
        {status === 'loading' ? 'Saving new password...' : 'Reset Password'}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center items-center gap-2 mb-6 hover:opacity-80 transition">
          <Activity className="h-10 w-10 text-blue-600" />
          <span className="font-bold text-3xl tracking-tight text-blue-900">
            Celestia <span className="text-teal-500">Medical</span>
          </span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Create new password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-100 sm:rounded-2xl sm:px-10 relative overflow-hidden">
          <Suspense fallback={<div className="text-center p-4 text-sm text-slate-500">Loading form...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
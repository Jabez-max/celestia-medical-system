'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Activity, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState(''); // BAGONG STATE PARA SA ERROR UI

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage(''); // i-reset ang error

    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        // Eto yung SUCCESS UI (Another screen/page sa loob ng form)
        setStatus('success');
      } else {
        // Eto na yung pamalit sa alert()
        setErrorMessage('May nangyaring mali sa server. Pakisubukan muli.');
        setStatus('idle');
      }
    } catch (error) {
      console.error('Error requesting password reset:', error);
      setErrorMessage('Network error. Please check your connection.');
      setStatus('idle');
    }
  };

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
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Enter your email and we'll send you a link to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-100 sm:rounded-2xl sm:px-10 relative overflow-hidden">
          
          {status === 'success' ? (
            <div className="text-center py-6 animate-in fade-in zoom-in duration-300">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Check your email</h3>
              <p className="text-slate-600 text-sm mb-6">
                If an account exists for <span className="font-bold text-slate-800">{email}</span>, we have sent a password reset link.
              </p>
              <Link href="/login" className="w-full flex justify-center py-2.5 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition">
                Return to login
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {/* BAGONG ERROR UI */}
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center font-medium">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email address</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-slate-900 placeholder:text-slate-400 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2.5 border" 
                    placeholder="you@example.com" 
                  />
                </div>
              </div>

              <div>
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-70"
                >
                  {status === 'loading' ? 'Sending link...' : 'Send reset link'}
                </button>
              </div>
              
              <div className="text-center mt-4">
                <Link href="/login" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition">
                  <ArrowLeft className="h-4 w-4" /> Back to login
                </Link>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
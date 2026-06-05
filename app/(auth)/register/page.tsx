'use client'; 

import Link from 'next/link';
import { Activity, Mail, Lock, User, CheckCircle } from 'lucide-react';
import { registerUser } from '../../../actions/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Mga bagong state para sa ating Custom UI
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFormSubmit = async (formData: FormData) => {
    setLoading(true);
    setErrorMessage(''); // I-reset ang error bago mag-submit

    try {
      // 1. I-save ang user sa database
      const response = await registerUser(formData);

      // Kung sinabi ng backend na may error (tulad ng existing email)
      if (response?.error) {
        setErrorMessage(response.error); // Ipapakita ang error sa ibabaw ng form
        setLoading(false);
        return; 
      }

      // 2. Kunin ang email at first name para sa email
      const email = formData.get('email');
      const firstName = formData.get('firstName');

      // 3. I-trigger ang ating Nodemailer API
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          name: firstName,
          subject: 'Welcome to Celestia Medical!',
        }),
      });

      // 4. Papalabasin ang Custom Success Modal natin!
      setLoading(false);
      setShowSuccessModal(true); 
      
    } catch (error) {
      console.error('Registration Error:', error);
      setErrorMessage('May nangyaring mali. Pakisubukan muli.');
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex justify-center items-center gap-2 mb-6 hover:opacity-80 transition">
            <Activity className="h-10 w-10 text-blue-600" />
            <span className="font-bold text-3xl tracking-tight text-blue-900">
              Celestia <span className="text-teal-500">Medical</span>
            </span>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
            Create a new account
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-sm border border-slate-100 sm:rounded-2xl sm:px-10">
            
            {/* INLINE ERROR MESSAGE UI */}
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl text-center font-medium">
                {errorMessage}
              </div>
            )}

            <form className="space-y-6" action={handleFormSubmit}>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-600" />
                    </div>
                    <input type="text" name="firstName" required disabled={loading} className="text-slate-900 placeholder:text-slate-400 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2.5 border" placeholder="Juan" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-600" />
                    </div>
                    <input type="text" name="lastName" required disabled={loading} className="text-slate-900 placeholder:text-slate-400 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2.5 border" placeholder="Dela Cruz" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email address</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-600" />
                  </div>
                  <input type="email" name="email" required disabled={loading} className="text-slate-900 placeholder:text-slate-400 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2.5 border" placeholder="you@example.com" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-600" />
                  </div>
                  <input type="password" name="password" required disabled={loading} className="text-slate-900 placeholder:text-slate-400 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2.5 border" placeholder="••••••••" />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {loading ? 'Registering...' : 'Register Account'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          CUSTOM SUCCESS MODAL (Ito ang papatong sa screen)
          ========================================== */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-center transform transition-all animate-in fade-in zoom-in duration-200">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Account Created!</h3>
            <p className="text-slate-500 mb-8 text-sm leading-relaxed">
              Welcome to Celestia Medical. Your account has been successfully registered and your welcome email is on the way.
            </p>
            
            <button 
              onClick={() => router.push('/login')}
              className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-sm transition"
            >
              Continue to Login
            </button>
          </div>
        </div>
      )}
    </>
  );
}
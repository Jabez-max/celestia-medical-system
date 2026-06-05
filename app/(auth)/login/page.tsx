import Link from 'next/link';
import { Activity, Mail, Lock } from 'lucide-react';
import { loginUser } from '../../../actions/auth'; 

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center items-center gap-2 mb-6 hover:opacity-80 transition">
          <Activity className="h-10 w-10 text-blue-600" />
          <span className="font-bold text-3xl tracking-tight text-blue-900">
            {/* UPDATED NA ANG PANGALAN TO CELESTIA MEDICAL */}
            Celestia <span className="text-teal-500">Medical</span>
          </span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-100 sm:rounded-2xl sm:px-10">
          
          <form className="space-y-6" action={loginUser}> 
            
            {/* EMAIL FIELD */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email address</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-600" />
                </div>
                <input type="email" name="email" required className="text-slate-900 placeholder:text-slate-400 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2.5 border" placeholder="you@example.com" />
              </div>
            </div>

            {/* PASSWORD FIELD WITH FORGOT PASSWORD LINK */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                
                {/* DITO NATIN NILAGAY ANG FORGOT PASSWORD LINK */}
                <div className="text-sm">
                  <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 transition">
                    Forgot your password?
                  </Link>
                </div>
                
              </div>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-600" />
                </div>
                <input type="password" name="password" required className="text-slate-900 placeholder:text-slate-400 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2.5 border" placeholder="••••••••" />
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition">
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{' '}
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
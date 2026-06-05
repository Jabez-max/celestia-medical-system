import Link from 'next/link';
import { ShieldCheck, Activity, PhoneCall } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navbar */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-2xl tracking-tight text-blue-900">
              Celestia <span className="text-teal-500">Medical</span>
            </span>
          </div>
          <div className="hidden md:flex space-x-8 font-medium text-slate-600">
            <Link href="/" className="hover:text-blue-600 transition">Home</Link>
            <Link href="/services" className="hover:text-blue-600 transition">Services</Link>
            <Link href="/departments" className="hover:text-blue-600 transition">Departments</Link>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-lg flex items-center gap-2 hover:bg-red-100 transition">
              <PhoneCall className="h-4 w-4" /> Emergency
            </button>
            {/* DITO NATIN NILINK SA LOGIN PAGE */}
            <Link 
              href="/login" 
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition flex items-center"
            >
              Patient Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-40 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mt-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-700 text-sm font-semibold mb-6 border border-teal-100">
            <ShieldCheck className="h-4 w-4" /> Capstone Project Demo System
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            Advanced Care, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
              Closer to You.
            </span>
          </h1>
          <p className="text-lg text-slate-600 mb-10 leading-relaxed">
            Experience seamless healthcare management. Book appointments, access medical records, and connect with top specialists through our secure, modern portal.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/login" 
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition duration-300"
            >
              Book Appointment
            </Link>
            <button className="px-8 py-3 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition duration-300">
              Learn More
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-24">
          {[
            { label: 'Specialist Doctors', value: '500+' },
            { label: 'Patient Beds', value: '1,500' },
            { label: 'Daily Patients', value: '3,000+' },
            { label: 'Years of Service', value: '100+' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition">
              <div className="text-3xl font-bold text-blue-600 mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
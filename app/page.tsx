'use client'; 

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Activity, PhoneCall, HeartPulse, Stethoscope, Microscope, Users, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const [showEmergency, setShowEmergency] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 scroll-smooth">
      
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
            <a href="#home" className="hover:text-blue-600 transition">Home</a>
            <a href="#services" className="hover:text-blue-600 transition">Services</a>
            <a href="#departments" className="hover:text-blue-600 transition">Departments</a>
            <a href="#doctors" className="hover:text-blue-600 transition">Find a Doctor</a>
          </div>
          <div className="flex gap-4">
            
            <button 
              onClick={() => setShowEmergency(true)}
              className="px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-lg flex items-center gap-2 hover:bg-red-100 transition hover:shadow-md"
            >
              <PhoneCall className="h-4 w-4" /> Emergency
            </button>

            <Link href="/login" className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition">
              Patient Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main id="home" className="pt-40 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mt-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-700 text-sm font-semibold mb-6 border border-teal-100">
  
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
            <Link href="/login" className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition duration-300">
              Book Appointment
            </Link>
            <a href="#services" className="px-8 py-3 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition duration-300 inline-block">
              Learn More
            </a>
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

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Our Premium Services</h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto">Comprehensive healthcare solutions designed for your well-being.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition">
              <HeartPulse className="h-12 w-12 text-teal-500 mb-6" />
              <h3 className="text-xl font-bold text-slate-800 mb-3">General Checkups</h3>
              <p className="text-slate-600 leading-relaxed">Routine examinations and preventive care to keep your health on track.</p>
            </div>
            <div className="p-8 rounded-2xl bg-blue-50 border border-blue-100 hover:shadow-lg transition">
              <Microscope className="h-12 w-12 text-blue-600 mb-6" />
              <h3 className="text-xl font-bold text-slate-800 mb-3">Laboratory Tests</h3>
              <p className="text-slate-600 leading-relaxed">State-of-the-art diagnostic testing with rapid and accurate results.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition">
              <Stethoscope className="h-12 w-12 text-teal-500 mb-6" />
              <h3 className="text-xl font-bold text-slate-800 mb-3">Specialist Consults</h3>
              <p className="text-slate-600 leading-relaxed">Direct access to board-certified specialists for targeted medical care.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section id="departments" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Medical Departments</h2>
              <p className="text-slate-500 mt-4 max-w-xl">Find specialized care across our wide range of medical departments.</p>
            </div>
            <Link href="/login" className="text-blue-600 font-semibold flex items-center gap-2 hover:text-blue-700 transition">
              View All Departments <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Cardiology', 'Ophthalmology', 'Pediatrics', 'Neurology', 'Orthopedics', 'Dermatology', 'Oncology', 'Pulmonology'].map((dept, i) => (
              <div key={i} className="bg-white px-6 py-4 rounded-xl border border-slate-200 font-bold text-slate-700 hover:border-teal-500 hover:text-teal-600 transition cursor-pointer text-center shadow-sm">
                {dept}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Find a Doctor Section */}
      <section id="doctors" className="py-24 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Users className="h-16 w-16 text-blue-200 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-6">Need to see a doctor?</h2>
          <p className="text-blue-100 text-lg mb-10 leading-relaxed">
            Skip the long lines. Find the right specialist for your needs and book an appointment directly through our secure patient portal.
          </p>
          <Link href="/login" className="px-10 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:bg-slate-50 transition text-lg inline-block">
            Find Your Doctor Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-center">
        <p>© 2026 Celestia Medical Center | Capstone Project. All rights reserved.</p>
      </footer>

      {/* ================================================== */}
      {/* EMERGENCY POP-UP MODAL */}
      {/* ================================================== */}
      {showEmergency && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 text-center">
            
            <div className="bg-red-600 p-8 flex justify-center">
              <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center text-red-600 animate-pulse shadow-lg">
                <PhoneCall className="h-10 w-10" />
              </div>
            </div>
            
            <div className="p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Emergency Hotline</h3>
              <p className="text-slate-600 mb-6 font-medium">
                You are about to call the official <br/> Celestia Medical Emergency Line.
              </p>
              
              <div className="text-4xl font-extrabold text-red-600 tracking-widest mb-8 border-y border-slate-100 py-4 bg-red-50/50">
                (02) 8555-0000
              </div>
              
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowEmergency(false)}
                  className="px-6 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition w-full"
                >
                  Cancel
                </button>
                <a
                  href="tel:0285550000"
                  onClick={() => setShowEmergency(false)}
                  className="px-6 py-3.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition w-full shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
                >
                  Dial Now
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
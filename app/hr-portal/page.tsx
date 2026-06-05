'use client';

import { useState } from 'react';
import { submitOnboardingTicket } from '../../actions/hr';
import { logout } from '../../actions/logout'; // UPDATED IMPORT
import { Send, Activity, CheckCircle2, ClipboardList, LogOut } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function HRPortalPage() {
  const [roleFor, setRoleFor] = useState('DOCTOR');
  const [specialty, setSpecialty] = useState('');
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('success');

  const specialtyMap: Record<string, string> = {
    'Ophthalmology': 'Ophthalmologist',
    'Dermatology': 'Dermatologist',
    'Neurology': 'Neurologist',
    'Psychiatry': 'Psychiatrist',
    'Pulmonology': 'Pulmonologist',
    'Gastroenterology': 'Gastroenterologist',
    'Orthopedics': 'Orthopedic Surgeon',
    'ENT': 'Otolaryngologist (ENT)',
    'Nephrology': 'Nephrologist',
    'Urology': 'Urologist',
    'OB-GYN': 'Obstetrician-Gynecologist',
    'Endocrinology': 'Endocrinologist',
    'Hematology': 'Hematologist',
    'Pediatrics': 'Pediatrician',
    'Internal Medicine': 'Internist',
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDept = e.target.value;
    setSpecialty(specialtyMap[selectedDept] || '');
  };

  return (
    <div className="min-h-screen bg-indigo-50 font-sans p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-indigo-600" />
            <span className="font-bold text-2xl text-indigo-900">
              Celestia <span className="text-teal-600">HR Portal</span>
            </span>
          </div>
          
          {/* UPDATED LOGOUT BUTTON ACTION */}
          <form action={logout}>
            <button 
              type="submit" 
              className="text-sm font-bold text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-100 hover:bg-red-100 hover:text-red-800 transition flex items-center gap-2 shadow-sm"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </form>
        </div>

        {/* Success Message Banner */}
        {isSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-pulse">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="font-bold text-green-800">Ticket Submitted Successfully!</h3>
              <p className="text-green-600 text-sm">The IT Department will review and provision the account shortly.</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 overflow-hidden">
          <div className="bg-indigo-600 p-6 text-white flex items-center gap-3">
            <ClipboardList className="h-6 w-6" />
            <div>
              <h1 className="text-xl font-bold">Employee IT Onboarding Request</h1>
              <p className="text-indigo-100 text-sm">Submit this form to request system access for new medical staff.</p>
            </div>
          </div>

          <form action={submitOnboardingTicket} className="p-6 md:p-8 space-y-6">
            
            {/* Role Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Position / Role</label>
              <select 
                name="roleFor" 
                value={roleFor}
                onChange={(e) => setRoleFor(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none font-medium"
              >
                <option value="DOCTOR">Doctor / Physician</option>
                <option value="MEDTECH">Medical Technologist</option>
              </select>
            </div>

            <hr className="border-slate-100" />

            {/* Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">First Name</label>
                <input type="text" name="firstName" placeholder="e.g. Juan" required className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 outline-none font-medium" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Last Name</label>
                <input type="text" name="lastName" placeholder="e.g. Dela Cruz" required className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 outline-none font-medium" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Work Email Address</label>
              <input type="email" name="email" required placeholder="name@celestia.com" className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 outline-none font-medium" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">PRC License Number</label>
              <input type="text" name="licenseNumber" required placeholder="PRC-1234567" className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 outline-none font-medium" />
            </div>

            {/* Conditional Fields */}
            {roleFor === 'DOCTOR' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Department</label>
                  <select name="departmentName" required defaultValue="" onChange={handleDepartmentChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-indigo-500 focus:ring-2 outline-none font-medium">
                    <option value="" disabled>Select Department...</option>
                    {Object.keys(specialtyMap).map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Specialty</label>
                  <input type="text" name="specialty" required value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="e.g. Pediatrician" className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 outline-none font-medium" />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button type="submit" className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-sm">
                <Send className="h-5 w-5" /> Submit IT Ticket Request
              </button>
            </div>
            
          </form>
        </div>

      </div>
    </div>
  );
}
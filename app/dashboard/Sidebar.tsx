'use client'; 

import { useState } from 'react'; 
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
// DAGDAG: In-import natin ang ShieldCheck at FlaskConical
import { LayoutDashboard, Calendar, FileText, Settings, LogOut, Activity, Users, ShieldCheck, FlaskConical } from 'lucide-react';
import { logout } from '../../actions/logout'; 

// Tumatanggap ito ng "role" prop galing sa layout
export default function Sidebar({ role }: { role: string }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname(); 

  // ==========================================
  // MENU PARA SA PASYENTE
  // ==========================================
  const patientLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
    { name: 'Medical Records', href: '/dashboard/records', icon: FileText },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  // ==========================================
  // MENU PARA SA DOKTOR
  // ==========================================
  const doctorLinks = [
    { name: 'Doctor Overview', href: '/dashboard/doctor', icon: LayoutDashboard },
    { name: 'Patient Queue', href: '/dashboard/doctor/queue', icon: Users },
    { name: 'Consultations', href: '/dashboard/doctor/consultations', icon: FileText },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  // ==========================================
  // MENU PARA SA ADMIN
  // ==========================================
  const adminLinks = [
    { name: 'Control Panel', href: '/dashboard/admin', icon: ShieldCheck },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  // ==========================================
  // MENU PARA SA MEDTECH
  // ==========================================
  const medTechLinks = [
    { name: 'Lab Operations', href: '/dashboard/medtech', icon: FlaskConical },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  // ==========================================
  // LOGIC PARA PUMILI NG TAMANG MENU
  // ==========================================
  let navLinks = patientLinks; // Default ay Patient

  if (role === 'DOCTOR') {
    navLinks = doctorLinks;
  } else if (role === 'ADMIN') {
    navLinks = adminLinks;
  } else if (role === 'MEDTECH') {
    navLinks = medTechLinks;
  }

  return (
    <>
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-100 shadow-sm z-10">
        {/* Logo */}
        <div className="h-20 flex items-center gap-2 px-6 border-b border-slate-100">
          <Activity className="h-8 w-8 text-blue-600" />
          <span className="font-bold text-2xl tracking-tight text-blue-900">
          Celestia <span className="text-teal-500">Medical</span>
        </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href; 

            return (
              <Link 
                key={link.name}
                href={link.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900' 
                }`}
              >
                <Icon className="h-5 w-5" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => setShowLogoutModal(true)} 
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition"
          >
            <LogOut className="h-5 w-5" />
            Log out
          </button>
        </div>
      </aside>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 transform transition-all">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                <LogOut className="h-8 w-8 ml-1" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to leave?</h3>
              <p className="text-slate-500 mb-6 text-sm">
                Are you sure you want to log out of your account? You will need to enter your credentials again to access your dashboard.
              </p>
              
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                
                <form action={logout} className="flex-1">
                  <button 
                    type="submit" 
                    className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 shadow-sm transition"
                  >
                    Yes, log out
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
'use client';

import { useState } from 'react';
import { User, Bell, Shield, ChevronDown, ChevronUp, Save, CheckCircle2 } from 'lucide-react';
import { updateProfile, updatePassword } from '../../../actions/settings'; // IMPORTANTE: In-import natin ang dalawang functions

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const toggleSection = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null); 
    } else {
      setActiveSection(section); 
    }
  };

  // Function kapag nag-save ng Profile
  const handleSaveProfile = async (formData: FormData) => {
    await updateProfile(formData);
    setShowToast(true);
    setActiveSection(null);
    setTimeout(() => setShowToast(false), 3000);
  };

  // BAGONG Function kapag nag-save ng Password
  const handleSavePassword = async (formData: FormData) => {
    const newPass = formData.get('newPassword');
    const confPass = formData.get('confirmPassword');

    // Frontend validation bago pumunta sa database
    if (newPass !== confPass) {
      alert("Passwords do not match! Please try again.");
      return;
    }

    await updatePassword(formData);
    setShowToast(true);
    setActiveSection(null);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="p-4 md:p-8 font-sans relative">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage your personal information and security preferences.</p>
        </div>

        {/* Settings Options */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          
          {/* ============================== */}
          {/* 1. PROFILE SECTION             */}
          {/* ============================== */}
          <div className="border-b border-slate-100">
            <div 
              onClick={() => toggleSection('profile')}
              className="p-6 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Profile Information</h3>
                  <p className="text-slate-500 text-sm mt-1">Update your name, contact details, and personal avatar.</p>
                </div>
              </div>
              {activeSection === 'profile' ? (
                <ChevronUp className="h-5 w-5 text-blue-600 transition" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition" />
              )}
            </div>
            
            {activeSection === 'profile' && (
              <div className="p-6 pt-0 bg-slate-50/30 border-t border-slate-50">
                <form action={handleSaveProfile} className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                      <input type="text" name="firstName" defaultValue="Jabez" className="w-full p-3 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                      <input type="text" name="lastName" defaultValue="Dulay" className="w-full p-3 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input type="email" name="email" defaultValue="jabez@gmail.com" className="w-full p-3 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition flex items-center gap-2">
                      <Save className="h-4 w-4" /> Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* ============================== */}
          {/* 2. NOTIFICATIONS SECTION       */}
          {/* ============================== */}
          <div className="border-b border-slate-100">
            <div 
              onClick={() => toggleSection('notifications')}
              className="p-6 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Bell className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Notifications</h3>
                  <p className="text-slate-500 text-sm mt-1">Choose how you want to be reminded about your appointments.</p>
                </div>
              </div>
              {activeSection === 'notifications' ? (
                <ChevronUp className="h-5 w-5 text-amber-600 transition" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-400 group-hover:text-amber-600 transition" />
              )}
            </div>

            {activeSection === 'notifications' && (
              <div className="p-6 pt-0 bg-slate-50/30 border-t border-slate-50">
                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl">
                    <div>
                      <h4 className="font-semibold text-slate-800">Email Notifications</h4>
                      <p className="text-sm text-slate-500">Receive alerts when your appointment is confirmed.</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500" />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button onClick={() => { setShowToast(true); setActiveSection(null); setTimeout(() => setShowToast(false), 3000); }} className="bg-amber-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-amber-700 transition flex items-center gap-2">
                      <Save className="h-4 w-4" /> Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ============================== */}
          {/* 3. SECURITY SECTION            */}
          {/* ============================== */}
          <div className="border-b border-slate-100">
            <div 
              onClick={() => toggleSection('security')}
              className="p-6 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Security & Password</h3>
                  <p className="text-slate-500 text-sm mt-1">Change your password and secure your patient account.</p>
                </div>
              </div>
              {activeSection === 'security' ? (
                <ChevronUp className="h-5 w-5 text-teal-600 transition" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-400 group-hover:text-teal-600 transition" />
              )}
            </div>

            {activeSection === 'security' && (
              <div className="p-6 pt-0 bg-slate-50/30 border-t border-slate-50">
                {/* NAPALITAN ANG FORM PARA MA-CONNECT SA handleSavePassword */}
                <form action={handleSavePassword} className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                    <input type="password" name="newPassword" placeholder="Enter new password" required className="w-full p-3 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-teal-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                    <input type="password" name="confirmPassword" placeholder="Confirm new password" required className="w-full p-3 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-teal-500 outline-none" />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button type="submit" className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-teal-700 transition flex items-center gap-2">
                      <Save className="h-4 w-4" /> Update Password
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-10 right-10 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-50 animate-bounce transition-all">
          <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-white text-lg">Success!</h4>
            <p className="text-slate-300 text-sm">Your settings have been saved.</p>
          </div>
        </div>
      )}

    </div>
  );
}
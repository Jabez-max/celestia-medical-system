'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';

export default function NotificationBell({ appointments }: { appointments: any[] }) {
  // Switch para buksan o isara ang dropdown
  const [isOpen, setIsOpen] = useState(false);
  
  // BAGONG SWITCH: Para tandaan kung nabuksan/nakita na ba ang notifications
  const [hasViewed, setHasViewed] = useState(false);

  // Reference para sa dropdown menu (ginagamit para ma-detect kung sa labas nag-click)
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Kukunin lang natin yung mga appointments na 'CONFIRMED' na
  const confirmedAppointments = appointments.filter(apt => apt.status === 'CONFIRMED');

  // FUNCTION: Isasara ang menu kapag nag-click sa labas ng component
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Ang function na aandar kapag pinindot ang bell
  const handleBellClick = () => {
    setIsOpen(!isOpen); // Buksan o isara ang menu
    
    // Kung binubuksan natin ang menu, sabihin sa system na "Viewed" na ito
    if (!isOpen) {
      setHasViewed(true); 
    }
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      {/* Ang Bell Button */}
      <button 
        onClick={handleBellClick}
        className="p-3 bg-slate-50 rounded-full shadow-sm border border-slate-200 hover:bg-slate-100 relative transition focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Bell className="h-5 w-5 text-slate-600" />
        
        {/* LALABAS LANG ANG RED DOT KUNG MAY CONFIRMED APPOINTMENT **AT** HINDI PA NAKIKITA (!hasViewed) */}
        {confirmedAppointments.length > 0 && !hasViewed && (
          <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      {/* Ang Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden transform transition-all">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Notifications</h3>
            
            {/* I-u-update din natin yung "New" badge. Kung viewed na, mawawala na yung "New" */}
            {!hasViewed && confirmedAppointments.length > 0 && (
              <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {confirmedAppointments.length} New
              </span>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
            {confirmedAppointments.length > 0 ? (
              confirmedAppointments.map((apt) => (
                <div key={apt.id} className="p-4 hover:bg-slate-50 transition flex gap-3 items-start">
                  <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Appointment Confirmed</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Your consultation with <span className="font-semibold">Dr. {apt.doctor.user.lastName}</span> on {new Date(apt.date).toLocaleDateString()} has been confirmed.
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-500 text-sm font-medium">
                You have no new notifications.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
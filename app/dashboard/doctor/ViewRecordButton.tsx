'use client';

import { useState } from 'react';
import { X, FileText, Pill } from 'lucide-react';

export default function ViewRecordButton({ appointment, prescription }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ANG BUTTON NA IKI-CLICK NI DOC */}
      <button 
        onClick={() => setIsOpen(true)}
        className="text-slate-500 hover:text-teal-600 font-semibold text-sm px-3 py-1 rounded-md hover:bg-teal-50 transition border border-transparent hover:border-teal-100"
      >
        View Record
      </button>

      {/* ANG POP-UP MODAL (Lalabas lang kapag isOpen = true) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <FileText className="h-5 w-5 text-teal-600" />
                Consultation Record
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-red-500 transition bg-slate-100 hover:bg-red-50 p-1.5 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              
              {/* Patient Info */}
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Patient Details</p>
                <h4 className="text-xl font-bold text-slate-900">
                  {appointment.patient.user.firstName} {appointment.patient.user.lastName}
                </h4>
                <p className="text-sm text-slate-500">Date: {new Date(appointment.date).toLocaleString()}</p>
              </div>

              {/* Symptoms / Notes */}
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                <p className="text-sm text-amber-800 font-bold mb-1">Patient's Notes / Symptoms:</p>
                <p className="text-slate-700 text-sm italic">
                  "{appointment.notes || 'No specific symptoms provided during booking.'}"
                </p>
              </div>

              {/* Issued Prescription */}
              <div>
                <p className="text-sm text-slate-500 font-medium flex items-center gap-2 mb-2">
                  <Pill className="h-4 w-4 text-teal-600" /> Issued Prescription
                </p>
                
                {prescription ? (
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 shadow-sm">
                    <p className="font-bold text-teal-700 text-lg border-b border-slate-200 pb-2">
                      {prescription.medication}
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      <p className="text-sm text-slate-700">
                        <span className="font-bold text-slate-900 mr-2">Dosage:</span> 
                        {prescription.dosage}
                      </p>
                      <p className="text-sm text-slate-700">
                        <span className="font-bold text-slate-900 mr-2">Instructions:</span> 
                        {prescription.instructions}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center border-dashed">
                    <p className="text-sm text-slate-500 font-medium">No prescription record found.</p>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setIsOpen(false)} className="px-5 py-2.5 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 transition shadow-sm">
                Close Record
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
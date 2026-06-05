'use client';

import { useState } from 'react';
import { Pill, Search } from 'lucide-react';
import { completeConsultation } from '../../../../actions/consultation';

// Gumawa tayo ng type para alam ng system ang itsura ng data mula sa database
type MedicationRecord = {
  id: string;
  name: string;
  category: string;
  defaultDosage: string;
  defaultInstructions: string;
};

export default function PrescriptionForm({ 
  appointmentId, 
  patientId,
  dbMedications 
}: { 
  appointmentId: string; // Naayos na ang spelling dito
  patientId: string;
  dbMedications: MedicationRecord[];
}) {
  const [medInput, setMedInput] = useState('');
  const [dosage, setDosage] = useState('');
  const [instructions, setInstructions] = useState('');

  // Kapag nag-type o pumili si Doc, hahanapin natin sa listahan para mag-autofill
  const handleMedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMedInput(val);
    
    // Hanapin kung may match sa database natin
    const foundMed = dbMedications.find(med => med.name === val);
    
    if (foundMed) {
      setDosage(foundMed.defaultDosage);
      setInstructions(foundMed.defaultInstructions);
    } else {
      // Kung binura ni Doc, burahin din natin yung dosage at instructions
      setDosage('');
      setInstructions('');
    }
  };

  return (
    <div className="flex-1 bg-slate-50 border border-slate-200 p-5 rounded-xl">
      <h4 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2">
        <Pill className="h-4 w-4 text-teal-600" /> Issue Prescription
      </h4>
      
      <form action={completeConsultation} className="space-y-4">
        <input type="hidden" name="appointmentId" value={appointmentId} />
        <input type="hidden" name="patientId" value={patientId} />
        
        {/* SEARCHABLE INPUT: Ginamit natin ang 'list' attribute para kumonekta sa datalist */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input 
            type="text"
            name="medication"
            value={medInput}
            onChange={handleMedChange}
            list="med-list"
            placeholder="Search and select medication..."
            required
            className="pl-10 w-full p-3 border border-slate-300 bg-white rounded-xl text-slate-900 focus:ring-2 focus:ring-teal-500 outline-none font-medium shadow-sm"
          />
          
          {/* Dito nakatago yung listahan ng mga gamot na lalabas kapag nag-type si Doc */}
          <datalist id="med-list">
            {dbMedications.map((med) => (
              <option key={med.id} value={med.name}>
                {med.category}
              </option>
            ))}
          </datalist>
        </div>

        <div>
          <input 
            type="text" 
            name="dosage" 
            value={dosage}
            onChange={(e) => setDosage(e.target.value)} 
            placeholder="Dosage (e.g., 500mg)" 
            className="w-full p-3 border border-slate-300 bg-white rounded-xl text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-teal-500 outline-none font-medium shadow-sm"
            required
          />
        </div>

        <div>
          <textarea 
            name="instructions" 
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Instructions (e.g., Take twice a day after meals)" 
            rows={3}
            className="w-full p-3 border border-slate-300 bg-white rounded-xl text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-teal-500 outline-none resize-none font-medium shadow-sm"
            required
          ></textarea>
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-bold text-sm transition shadow-sm mt-2"
        >
          Issue Prescription & Complete
        </button>
      </form>
    </div>
  );
}
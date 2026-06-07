'use client';

import { useFormStatus } from 'react-dom';
import { Clock } from 'lucide-react';

export default function SubmitButton() {
  // Ito ang magic hook ng Next.js para malaman kung naglo-load pa ang form!
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className={`w-full bg-blue-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-blue-700 transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
        pending ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <Clock className={`h-5 w-5 ${pending ? 'animate-spin' : ''}`} />
      {pending ? 'Confirming Booking...' : 'Confirm Booking'}
    </button>
  );
}
import { Calendar, Clock, User, FileText, Stethoscope, ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { bookAppointment } from '@/actions/appointment';
import Link from 'next/link';
// FORCE PUSH TO VERCEL 123
export default async function BookAppointmentPage() {
  // Kunin lahat ng Doctor sa database para ilagay sa Dropdown
  const doctors = await prisma.doctor.findMany({
    include: {
      user: true,
      department: true,
    }
  });

  // ==========================================
  // TIMEZONE FIX: Siguraduhing Philippine Time ang gamit natin
  // para hindi maging UTC ang server time na mag-a-allow ng past bookings
  // ==========================================
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" }));
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  // Format na kailangan ng HTML datetime-local: "YYYY-MM-DDTHH:MM"
  const minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/appointments" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 text-sm font-medium mb-6 w-max transition">
            <ArrowLeft className="h-4 w-4" />
            Back to Appointments History
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Book an Appointment</h1>
          <p className="text-slate-500 mt-2">Fill in the details below to schedule your consultation.</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <form action={bookAppointment} className="space-y-6">
            
            {/* Doctor Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Select Specialist</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Stethoscope className="h-5 w-5 text-slate-400" />
                </div>
                <select name="doctorId" required className="pl-10 w-full rounded-xl border border-slate-300 py-3 text-slate-700 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white">
                  <option value="">-- Choose a Doctor --</option>
                  {/* DITO NA-APPLY ANG FIX: (doc: any) */}
                  {doctors.map((doc: any) => (
                    <option key={doc.id} value={doc.id}>
                      Dr. {doc.user.firstName} {doc.user.lastName} - {doc.department.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date and Time */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Select Date & Time</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="datetime-local" 
                  name="appointmentDate" 
                  required 
                  min={minDateTime} 
                  className="pl-10 w-full rounded-xl border border-slate-300 py-3 text-slate-700 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                * You cannot select past dates and times.
              </p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Reason for Visit (Optional)</label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FileText className="h-5 w-5 text-slate-400" />
                </div>
                <textarea 
                  name="notes" 
                  rows={4}
                  placeholder="E.g., I've been experiencing chest pain..."
                  className="pl-10 w-full rounded-xl border border-slate-300 py-3 text-slate-700 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100">
              <button type="submit" className="w-full bg-blue-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-blue-700 transition shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                <Clock className="h-5 w-5" />
                Confirm Booking
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
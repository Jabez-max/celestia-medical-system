import { FileText, CheckCircle2, Clock } from 'lucide-react';
import { prisma } from '../../../../lib/prisma';
import { getSession } from '../../../../lib/session';
import { redirect } from 'next/navigation';

// IMPORT NATIN YUNG BAGONG SEARCHABLE FORM COMPONENT
import PrescriptionForm from './PrescriptionForm';

export default async function ConsultationsPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const doctor = await prisma.doctor.findUnique({
    where: { userId: session.userId }
  });

  if (!doctor) {
    return <div className="p-8 text-center text-red-600 font-bold">Error: Unauthorized access.</div>;
  }

  const confirmedAppointments = await prisma.appointment.findMany({
    where: {
      doctorId: doctor.id,
      status: 'CONFIRMED' 
    },
    include: {
      patient: {
        include: { user: true }
      }
    },
    orderBy: { date: 'asc' }
  });

  // ==========================================
  // KUNIN ANG MGA GAMOT SA DATABASE
  // ==========================================
  const dbMedications = await prisma.medication.findMany({
    orderBy: { name: 'asc' } // Naka-alphabetical order para malinis
  });

  return (
    <div className="p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <FileText className="h-8 w-8 text-teal-600" />
            Active Consultations
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Add medical records and prescriptions for your confirmed patients.</p>
        </div>

        {/* Consultations List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-teal-600" /> Patients Ready for Consultation
            </h2>
            <span className="bg-teal-100 text-teal-800 font-bold px-3 py-1 rounded-full text-sm">
              {confirmedAppointments.length} Patient(s)
            </span>
          </div>
          
          {confirmedAppointments.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-700">No active consultations</h3>
              <p className="text-slate-500 text-sm mt-1">Confirmed appointments will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {confirmedAppointments.map((appointment) => (
                <div key={appointment.id} className="p-6 flex flex-col md:flex-row justify-between gap-6 hover:bg-slate-50 transition">
                  
                  {/* Patient Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900">
                      {appointment.patient.user.firstName} {appointment.patient.user.lastName}
                    </h3>
                    <p className="text-slate-500 text-sm mt-1 flex items-center gap-2 font-medium">
                      <Clock className="h-4 w-4" />
                      {appointment.date.toLocaleString()}
                    </p>
                    {appointment.notes && (
                      <div className="mt-3 bg-white border border-slate-200 p-4 rounded-xl text-sm text-slate-700 italic shadow-sm">
                        <span className="font-bold text-slate-900 not-italic block mb-1">Patient's Note:</span>
                        "{appointment.notes}"
                      </div>
                    )}
                  </div>

                  {/* DITO NATIN TINAWAG YUNG BAGONG COMPONENT */}
                  <PrescriptionForm 
                    appointmentId={appointment.id} 
                    patientId={appointment.patientId} 
                    dbMedications={dbMedications}
                  />
                  
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
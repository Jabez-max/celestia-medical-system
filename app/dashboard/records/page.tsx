import { FileText, Lock, Pill, Calendar, Stethoscope } from 'lucide-react';
import { prisma } from '../../../lib/prisma';
import { getSession } from '../../../lib/session';
import { redirect } from 'next/navigation';

export default async function MedicalRecordsPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  // 1. Hanapin ang Patient Profile
  const patient = await prisma.patient.findUnique({
    where: { userId: session.userId }
  });

  // 2. Kunin ang lahat ng Reseta mula sa database
  const prescriptions = patient 
    ? await prisma.prescription.findMany({
        where: { patientId: patient.id },
        include: {
          doctor: {
            include: { user: true, department: true }
          }
        },
        orderBy: { issuedAt: 'desc' }
      })
    : [];

  return (
    <div className="p-4 md:p-8 font-sans min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header - Pinanatili natin yung "Secure Portal" vibe mo! */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <FileText className="h-8 w-8 text-teal-600" />
              Secure Medical Records
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Your laboratory results, prescriptions, and doctor's notes.</p>
          </div>
          
          {/* Yung maganda mong UI icon, inilagay natin sa kanan ng header */}
          <div className="hidden md:flex flex-col items-end">
            <div className="h-12 w-12 bg-teal-50 rounded-full flex items-center justify-center relative">
              <FileText className="h-6 w-6 text-teal-500" />
              <div className="absolute bottom-0 right-0 h-4 w-4 bg-slate-800 rounded-full flex items-center justify-center border-2 border-white">
                <Lock className="h-2 w-2 text-white" />
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2">PGH Care Portal</p>
          </div>
        </div>

        {/* Records Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <Pill className="h-5 w-5 text-teal-600" />
            <h2 className="font-bold text-slate-800">Prescription History</h2>
          </div>

          {prescriptions.length === 0 ? (
            /* DITO LALABAS ANG ORIGINAL DESIGN MO KUNG WALANG RECORD */
            <div className="p-16 flex items-center justify-center">
              <div className="max-w-md w-full text-center space-y-6">
                <div className="relative mx-auto w-max">
                  <div className="h-24 w-24 bg-teal-50 rounded-full flex items-center justify-center mx-auto">
                    <FileText className="h-12 w-12 text-teal-500" />
                  </div>
                  <div className="absolute bottom-0 right-0 h-8 w-8 bg-slate-800 rounded-full flex items-center justify-center border-4 border-white">
                    <Lock className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No Records Yet</h3>
                  <p className="text-slate-500 text-sm">
                    Your prescriptions and doctor's notes will securely appear here after your confirmed consultations.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* KUNG MAY RECORD NA, LALABAS ANG RESETA NI DOC */
            <div className="divide-y divide-slate-100">
              {prescriptions.map((record) => (
                <div key={record.id} className="p-6 md:p-8 hover:bg-slate-50 transition flex flex-col md:flex-row gap-6">
                  
                  {/* Doctor Info */}
                  <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6">
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Stethoscope className="h-4 w-4" /> Attending Physician
                    </p>
                    <h3 className="font-bold text-slate-900 text-lg">
                      Dr. {record.doctor.user.firstName} {record.doctor.user.lastName}
                    </h3>
                    <p className="text-sm text-teal-600 font-medium mb-4">
                      {record.doctor.department.name}
                    </p>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 bg-slate-100 w-max px-3 py-1.5 rounded-lg">
                      <Calendar className="h-3.5 w-3.5" /> 
                      {record.issuedAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Prescription Details */}
                  <div className="md:w-2/3 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Medication</p>
                        <p className="font-bold text-slate-900 text-lg text-teal-700">{record.medication}</p>
                      </div>
                      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Dosage</p>
                        <p className="font-bold text-slate-900 text-lg">{record.dosage}</p>
                      </div>
                    </div>
                    
                    <div className="bg-teal-50/50 border border-teal-100 p-4 rounded-xl">
                      <p className="text-xs text-teal-800 font-bold uppercase mb-1">Doctor's Instructions</p>
                      <p className="text-slate-700 font-medium italic">"{record.instructions}"</p>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
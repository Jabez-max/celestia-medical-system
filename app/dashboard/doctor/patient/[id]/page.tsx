import { prisma } from '../../../../../lib/prisma';
import { User, Pill, ArrowLeft, Calendar, FileText } from 'lucide-react';
import Link from 'next/link';

// Kukunin natin yung ID ng pasyente mula sa URL
export default async function PatientRecordPage({ params }: { params: { id: string } }) {
  const patientId = params.id;

  // 1. Kunin ang detalye ng Pasyente
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    include: { user: true }
  });

  // 2. Kunin ang lahat ng Reseta (Prescriptions) ng Pasyente na ito
  const prescriptions = await prisma.prescription.findMany({
    where: { patientId: patientId },
    include: { 
      doctor: { include: { user: true } } // Kunin din kung sinong doktor nagbigay
    },
    orderBy: { issuedAt: 'desc' } // Pinakabago sa itaas
  });

  if (!patient) {
    return <div className="p-8 text-center text-slate-500 font-bold">Patient record not found.</div>;
  }

  return (
    <div className="p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Back Button */}
        <Link href="/dashboard/doctor" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition text-sm font-medium">
          <ArrowLeft className="h-4 w-4" /> Back to Overview
        </Link>

        {/* Patient Header Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-6">
          <div className="h-20 w-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <User className="h-10 w-10" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {patient.user.firstName} {patient.user.lastName}
            </h1>
            <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
              <FileText className="h-4 w-4" /> Patient ID: {patient.id.slice(-6).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Prescription History */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <Pill className="h-5 w-5 text-teal-600" /> Medical & Prescription History
            </h2>
          </div>

          {prescriptions.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              No medical records or prescriptions found for this patient.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {prescriptions.map((script) => (
                <div key={script.id} className="p-6 hover:bg-slate-50 transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-teal-700 flex items-center gap-2">
                        <Pill className="h-5 w-5" /> {script.medication}
                      </h3>
                      <p className="text-slate-600 text-sm mt-1 font-medium">
                        Dosage: <span className="text-slate-900">{script.dosage}</span>
                      </p>
                    </div>
                    <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {script.issuedAt.toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                    <p className="text-sm text-slate-700 italic">
                      <span className="font-bold text-slate-900 not-italic block mb-1">Instructions:</span>
                      "{script.instructions}"
                    </p>
                  </div>
                  
                  <p className="text-xs text-slate-400 mt-4 text-right">
                    Issued by: Dr. {script.doctor.user.firstName} {script.doctor.user.lastName}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
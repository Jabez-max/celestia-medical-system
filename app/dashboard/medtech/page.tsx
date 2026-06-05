import { prisma } from '../../../lib/prisma';
import { getSession } from '../../../lib/session';
import { redirect } from 'next/navigation';
import { FlaskConical, ClipboardList, User, FilePlus } from 'lucide-react';
import Link from 'next/link';

export default async function MedTechDashboard() {
  const session = await getSession();
  if (!session) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { medTech: true }
  });

  if (user?.role !== 'MEDTECH' || !user.medTech) {
    redirect('/dashboard');
  }

  // Kunin lahat ng patients para makapag-add ng lab result
  const patients = await prisma.patient.findMany({
    include: { user: true }
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="h-16 w-16 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
            <FlaskConical className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">MedTech Dashboard</h1>
            <p className="text-slate-500 font-medium">Laboratory Operations Center</p>
          </div>
        </div>

        {/* Patient List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-teal-600" /> Patient Records
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {patients.map((patient) => (
              <div key={patient.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                    {patient.user.firstName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg">{patient.user.firstName} {patient.user.lastName}</p>
                    <p className="text-sm text-slate-500">ID: {patient.id}</p>
                  </div>
                </div>
                <Link 
                  href={`/dashboard/medtech/add-result?patientId=${patient.id}`}
                  className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
                >
                  <FilePlus className="h-4 w-4" /> Add Lab Result
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
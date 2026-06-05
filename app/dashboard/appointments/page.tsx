import { CalendarCheck, Clock } from 'lucide-react';
import { prisma } from '../../../lib/prisma';
import { getSession } from '../../../lib/session';
import { redirect } from 'next/navigation';

export default async function AppointmentsHistoryPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  // Kunin LAHAT ng appointments ng pasyente
  const appointments = await prisma.appointment.findMany({
    where: { patient: { userId: session.userId } },
    include: {
      doctor: { include: { user: true, department: true } }
    },
    orderBy: { date: 'desc' } // Pinakabago ang nasa itaas
  });

  return (
    <div className="p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Appointments History</h1>
          <p className="text-slate-500 mt-1">View and manage all your past and upcoming consultations.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {appointments.length > 0 ? (
              // DITO NA-APPLY ANG FIX: (apt: any)
              appointments.map((apt: any) => (
                <div key={apt.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50 transition gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mt-1">
                      <CalendarCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-lg">
                        Dr. {apt.doctor.user.firstName} {apt.doctor.user.lastName}
                      </p>
                      <p className="text-sm text-slate-500 font-medium flex items-center gap-1 mb-1">
                        <Clock className="h-3 w-3" /> 
                        {new Date(apt.date).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
                      </p>
                      <p className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-md inline-block">
                        {apt.doctor.department.name}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold w-max ${
                      apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 
                      apt.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center">
                <CalendarCheck className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No appointment history found.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
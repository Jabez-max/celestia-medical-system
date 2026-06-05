import { Users, CalendarCheck, Clock, CheckCircle2, Stethoscope, FilePlus } from 'lucide-react';
import { prisma } from '../../../lib/prisma';
import { getSession } from '../../../lib/session';
import { redirect } from 'next/navigation';
import { updateAppointmentStatus } from '../../../actions/appointment';
import Link from 'next/link';

import ViewRecordButton from './ViewRecordButton';

export default async function DoctorDashboard() {
  const session = await getSession();
  if (!session) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  const doctor = await prisma.doctor.findUnique({
    where: { userId: session.userId },
    include: { department: true } 
  });

  if (!doctor) {
    return <div className="p-10 text-center text-red-600 font-bold">Access Denied: You are not a doctor.</div>;
  }

  const appointments = await prisma.appointment.findMany({
    where: { doctorId: doctor.id },
    include: {
      patient: {
        include: { 
          user: true,
          prescriptions: {
            where: { doctorId: doctor.id },
            orderBy: { issuedAt: 'desc' },
          }
        }
      }
    },
    orderBy: { date: 'asc' },
  });

  const totalPatients = appointments.length;
  const waitingPatients = appointments.filter(a => a.status === 'PENDING').length;
  const donePatients = appointments.filter(a => a.status === 'COMPLETED').length; 

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-end bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
              <Stethoscope className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Dr. {user?.lastName}'s Dashboard</h1>
              <p className="text-slate-500 mt-1 font-medium">{doctor.department.name} • Today's Overview</p>
            </div>
          </div>
          
          <Link 
            href="/dashboard/doctor/consultations" 
            className="px-6 py-2.5 bg-teal-600 text-white font-medium rounded-lg shadow-md hover:bg-teal-700 transition inline-block text-center"
          >
            Start Consultations
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition">
            <div className="p-4 bg-blue-50 rounded-xl text-blue-600">
              <Users className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">{totalPatients}</h3>
              <p className="text-slate-500 font-medium text-sm">Total Appointments</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition">
            <div className="p-4 bg-amber-50 rounded-xl text-amber-600">
              <Clock className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">{waitingPatients}</h3>
              <p className="text-slate-500 font-medium text-sm">Patients Waiting</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition">
            <div className="p-4 bg-green-50 rounded-xl text-green-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">{donePatients}</h3>
              <p className="text-slate-500 font-medium text-sm">Consultations Done</p>
            </div>
          </div>
        </div>

        {/* Patient Queue Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-teal-600" /> Patient Queue
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {appointments.length > 0 ? (
              appointments.map((apt) => (
                <div key={apt.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                      {apt.patient.user.firstName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-lg">
                        {apt.patient.user.firstName} {apt.patient.user.lastName}
                      </p>
                      <p className="text-sm text-slate-500 font-medium">
                        {new Date(apt.date).toLocaleString()} • Notes: {apt.notes || 'None'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold w-max ${
                      apt.status === 'PENDING' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 
                      apt.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                      'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {apt.status}
                    </span>
                    
                    {apt.status === 'PENDING' ? (
                      <form action={updateAppointmentStatus}>
                        <input type="hidden" name="appointmentId" value={apt.id} />
                        <input type="hidden" name="status" value="CONFIRMED" />
                        <button type="submit" className="text-teal-600 hover:text-white font-semibold text-sm px-3 py-1.5 rounded-md hover:bg-teal-600 transition border border-teal-600">
                          Confirm
                        </button>
                      </form>
                    ) : (
                      <div className="flex items-center gap-2">
                        <ViewRecordButton 
                          appointment={apt} 
                          prescription={apt.patient.prescriptions?.[0]} 
                        />
                        
                        {/* BAGONG ADD LAB RESULT BUTTON */}
                        <Link 
                          href={`/dashboard/doctor/add-result?patientId=${apt.patient.id}`}
                          className="flex items-center gap-1.5 text-blue-600 hover:text-white font-semibold text-sm px-3 py-1.5 rounded-md hover:bg-blue-600 transition border border-blue-600"
                        >
                          <FilePlus className="h-4 w-4" /> Add Lab Result
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
               <p className="p-6 text-slate-500 font-medium">No patients in queue today.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
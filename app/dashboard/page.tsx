import { Calendar, FileText, Pill, User, Clock, ArrowRight } from 'lucide-react';
import { prisma } from '../../lib/prisma'; 
import { getSession } from '../../lib/session';
import { redirect } from 'next/navigation';
import Link from 'next/link'; 
import NotificationBell from './NotificationBell';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  // ==========================================
  // ANG "TRAFFIC ENFORCER" NG SYSTEM MO
  // ==========================================
  if (user?.role === 'ADMIN') redirect('/dashboard/admin');
  if (user?.role === 'DOCTOR') redirect('/dashboard/doctor');
  if (user?.role === 'MEDTECH') redirect('/dashboard/medtech');
  if (user?.role === 'HR') redirect('/hr-portal');

  // ==========================================
  // KUNG PATIENT SIYA, TULOY LANG ANG CODE SA IBABA
  // ==========================================

  // Hanapin muna natin ang Patient profile gamit ang naka-login na User ID
  const currentPatient = await prisma.patient.findUnique({
    where: { userId: session.userId }
  });

  const appointments = currentPatient 
    ? await prisma.appointment.findMany({
        where: { 
          patientId: currentPatient.id,
          status: { in: ['PENDING', 'CONFIRMED'] } 
        },
        include: {
          doctor: {
            include: {
              user: true,        
              department: true   
            }
          }
        },
        orderBy: { date: 'asc' },
        take: 5 
      })
    : []; // Kung walang patient profile, ibig sabihin wala pa siyang appointments

  // Bilangin ang reseta GAMIT ANG PATIENT ID
  const prescriptionCount = currentPatient
    ? await prisma.prescription.count({
        where: { patientId: currentPatient.id }
      })
    : 0; // Kung walang patient profile, 0 ang reseta

  // Bilangin ang Lab Results GAMIT ANG PATIENT ID
  const labResultCount = currentPatient
    ? await prisma.labResult.count({
        where: { patientId: currentPatient.id }
      })
    : 0; 

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-end bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Welcome back, {user?.firstName || 'Patient'}
              </h1>
              <p className="text-slate-500 mt-1 font-medium">Here is your healthcare summary for today.</p>
            </div>
          </div>
          
          <NotificationBell appointments={appointments} />
        </div>

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl text-white shadow-lg shadow-blue-500/30 relative overflow-hidden">
            <Calendar className="h-10 w-10 mb-4 opacity-80" />
            <h3 className="text-4xl font-bold mb-1">{appointments.length}</h3>
            <p className="text-blue-100 font-medium text-sm">Upcoming Appointments</p>
          </div>
          
          {/* LAB RESULTS WIDGET - GINAWANG CLICKABLE LINK! */}
          <Link 
            href="/dashboard/lab-results" 
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-teal-200 hover:-translate-y-1 transition-all duration-200 group cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <FileText className="h-8 w-8 text-teal-500 mb-4 group-hover:scale-110 transition-transform" />
              <div className="flex items-center gap-1 text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                View All <ArrowRight className="h-3 w-3" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-800">{labResultCount}</h3>
              <p className="text-slate-500 font-medium text-sm">Lab Results Available</p>
            </div>
          </Link>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <Pill className="h-8 w-8 text-purple-500 mb-4" />
            <div>
              <h3 className="text-3xl font-bold text-slate-800">{prescriptionCount}</h3>
              <p className="text-slate-500 font-medium text-sm">Active Prescriptions</p>
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" /> Upcoming Schedule
            </h2>
            <Link href="/dashboard/book" className="text-sm font-semibold text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-1">
              + Book Appointment
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {appointments.length > 0 ? (
              appointments.map((apt) => (
                <div key={apt.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition gap-4">
                  <div>
                    <p className="font-bold text-slate-900 text-lg">
                        Dr. {apt.doctor.user.firstName} {apt.doctor.user.lastName}
                    </p>
                    <p className="text-sm text-slate-500 font-medium">
                        {apt.doctor.department.name} • {new Date(apt.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold w-max ${
                    apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="p-6 text-slate-500 font-medium">You don't have any upcoming appointments yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
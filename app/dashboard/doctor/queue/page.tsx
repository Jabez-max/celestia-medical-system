import { Users, Clock, CheckCircle } from 'lucide-react';
import { prisma } from '../../../../lib/prisma';
import { getSession } from '../../../../lib/session';
import { updateAppointmentStatus } from '../../../../actions/appointment';
import { redirect } from 'next/navigation';

export default async function PatientQueuePage() {
  // 1. Kunin ang naka-login na user (Dapat si Doctor ang naka-login dito)
  const session = await getSession();
  if (!session) redirect('/login');

  // 2. Kunin ang Doctor profile niya sa database
  const doctor = await prisma.doctor.findUnique({
    where: { userId: session.userId }
  });

  if (!doctor) {
    return (
      <div className="p-8 text-center text-red-600 font-bold">
        Error: You are not registered as a Doctor.
      </div>
    );
  }

  // 3. Kunin lahat ng "PENDING" appointments para sa doktor na ito
  const appointments = await prisma.appointment.findMany({
    where: {
      doctorId: doctor.id,
      status: 'PENDING'
    },
    include: {
      patient: {
        include: { user: true } // Kukunin natin ang pangalan ng pasyente
      }
    },
    orderBy: { date: 'asc' } // Pagsunud-sunurin ayon sa petsa
  });

  return (
    <div className="p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            Patient Queue
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Manage your upcoming appointments and waiting patients.</p>
        </div>

        {/* Queue List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" /> Pending Approvals
            </h2>
            <span className="bg-amber-100 text-amber-700 font-bold px-3 py-1 rounded-full text-sm">
              {appointments.length} Request(s)
            </span>
          </div>
          
          {appointments.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-700">No patients in queue</h3>
              <p className="text-slate-500 text-sm mt-1">Your schedule is clear for now.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition">
                  
                  {/* Patient Details */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {appointment.patient.user.firstName} {appointment.patient.user.lastName}
                    </h3>
                    <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {appointment.date.toLocaleString()}
                    </p>
                    {appointment.notes && (
                      <div className="mt-3 bg-white border border-slate-200 p-3 rounded-lg text-sm text-slate-600 italic">
                        "{appointment.notes}"
                      </div>
                    )}
                  </div>

                  {/* Action Button na konektado sa Backend Action natin! */}
                  <form action={updateAppointmentStatus}>
                    <input type="hidden" name="appointmentId" value={appointment.id} />
                    <input type="hidden" name="status" value="CONFIRMED" />
                    <button 
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition flex items-center gap-2 w-full md:w-auto justify-center"
                    >
                      <CheckCircle className="h-5 w-5" />
                      Confirm Appointment
                    </button>
                  </form>
                  
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
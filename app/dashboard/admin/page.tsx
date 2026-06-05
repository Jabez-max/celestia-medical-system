import { getSession } from '../../../lib/session';
import { prisma } from '../../../lib/prisma';
import { redirect } from 'next/navigation';
import { ShieldCheck, Users, Stethoscope, FlaskConical, Ticket, CheckCircle, XCircle } from 'lucide-react';
import { approveTicket, rejectTicket } from '../../../actions/admin';

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  // SECURITY CHECK: I-kick out kapag hindi ADMIN ang nag-login
  if (user?.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  // Kunin ang bilang ng mga users para sa statistics
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const medTechCount = await prisma.medTech.count();

  // KUNIN ANG MGA PENDING TICKETS GALING SA HR
  const pendingTickets = await prisma.onboardingTicket.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'asc' }
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end bg-white p-6 rounded-2xl shadow-sm border border-slate-100 gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Admin Control Panel</h1>
              <p className="text-slate-500 mt-1 font-medium">Welcome back, {user?.firstName} • System Overview</p>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Patients */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition">
            <div className="p-4 bg-blue-50 rounded-xl text-blue-600">
              <Users className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">{patientCount}</h3>
              <p className="text-slate-500 font-medium text-sm">Registered Patients</p>
            </div>
          </div>

          {/* Total Doctors */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition">
            <div className="p-4 bg-teal-50 rounded-xl text-teal-600">
              <Stethoscope className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">{doctorCount}</h3>
              <p className="text-slate-500 font-medium text-sm">Active Doctors</p>
            </div>
          </div>

          {/* Total MedTechs */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition">
            <div className="p-4 bg-amber-50 rounded-xl text-amber-600">
              <FlaskConical className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">{medTechCount}</h3>
              <p className="text-slate-500 font-medium text-sm">Laboratory Staff</p>
            </div>
          </div>
        </div>

        {/* BAGONG TICKETING SYSTEM SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Ticket className="h-5 w-5 text-indigo-600" /> Pending IT Onboarding Tickets
            </h2>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
              {pendingTickets.length} Pending
            </span>
          </div>
          
          <div className="p-0 overflow-x-auto">
            {pendingTickets.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center">
                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-700">All Caught Up!</h3>
                <p className="text-slate-500 text-sm mt-1">There are no pending requests from HR at the moment.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-sm font-semibold text-slate-600">
                    <th className="p-4 whitespace-nowrap">Ticket ID</th>
                    <th className="p-4">Requested Role</th>
                    <th className="p-4">Name & Email</th>
                    <th className="p-4">Details</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* DITO NA-APPLY ANG FIX: (ticket: any) */}
                  {pendingTickets.map((ticket: any) => (
                    <tr key={ticket.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-mono text-sm font-semibold text-indigo-600">
                        {ticket.ticketNumber}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          ticket.roleFor === 'DOCTOR' ? 'bg-teal-100 text-teal-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {ticket.roleFor}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-900">{ticket.firstName} {ticket.lastName}</p>
                        <p className="text-sm text-slate-500">{ticket.email}</p>
                      </td>
                      <td className="p-4 text-sm text-slate-600">
                        {ticket.roleFor === 'DOCTOR' ? (
                          <>
                            <p><span className="font-semibold">Dept:</span> {ticket.departmentName}</p>
                            <p><span className="font-semibold">PRC:</span> {ticket.licenseNumber}</p>
                          </>
                        ) : (
                          <p><span className="font-semibold">PRC:</span> {ticket.licenseNumber}</p>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* REJECT BUTTON (Red) */}
                          <form action={rejectTicket.bind(null, ticket.id)}>
                            <button type="submit" className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Reject Request">
                              <XCircle className="h-6 w-6" />
                            </button>
                          </form>
                          
                          {/* APPROVE BUTTON (Green) */}
                          <form action={approveTicket.bind(null, ticket.id)}>
                            <button type="submit" className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition shadow-sm">
                              <CheckCircle className="h-4 w-4" /> Approve
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
import { prisma } from '../../../lib/prisma';
import { getSession } from '../../../lib/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { FileText, ArrowLeft, FlaskConical, Calendar as CalendarIcon, ClipboardList } from 'lucide-react';

export default async function LabResultsPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  // Kunin ang Patient profile gamit ang naka-login na User ID
  const currentPatient = await prisma.patient.findUnique({
    where: { userId: session.userId },
  });

  if (!currentPatient) {
    return (
      <div className="p-8 text-center text-slate-500">
        No patient profile found.
      </div>
    );
  }

  // Kunin lahat ng Lab Results ng pasyenteng ito, pinakabago muna (descending)
  const labResults = await prisma.labResult.findMany({
    where: { patientId: currentPatient.id },
    orderBy: { date: 'desc' },
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/dashboard" 
            className="p-2 bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-100 transition shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <FlaskConical className="h-8 w-8 text-teal-600" />
              Laboratory Results
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              View your medical test results and doctor's remarks.
            </p>
          </div>
        </div>

        {/* Lab Results Table / List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-800">Your Records</h2>
          </div>

          {labResults.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                    <th className="px-6 py-4 font-semibold w-1/4">Date</th>
                    <th className="px-6 py-4 font-semibold w-1/4">Test Name</th>
                    <th className="px-6 py-4 font-semibold w-1/4">Result</th>
                    <th className="px-6 py-4 font-semibold w-1/4">Doctor's Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {labResults.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50/80 transition group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                          <CalendarIcon className="h-4 w-4 text-slate-400" />
                          {new Date(record.date).toLocaleDateString('en-US', { 
                            year: 'numeric', month: 'short', day: 'numeric' 
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">
                        {record.testName}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                          record.result.toLowerCase().includes('normal') 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {record.result}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 italic">
                        {record.remarks || 'No additional remarks.'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // EMPTY STATE (Kung walang records)
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-1">No Lab Results Yet</h3>
              <p className="text-slate-500 max-w-sm">
                You don't have any laboratory records in the system right now. They will appear here once your doctor uploads them.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
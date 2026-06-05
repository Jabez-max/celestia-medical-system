import { prisma } from '../../../../lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FilePlus, User, Beaker, ClipboardList } from 'lucide-react';

export default async function AddLabResultPage({
  searchParams,
}: {
  searchParams: Promise<{ patientId?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const patientId = resolvedSearchParams.patientId;

  if (!patientId) {
    redirect('/dashboard/doctor');
  }

  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    include: { user: true },
  });

  if (!patient) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <p className="text-slate-500 font-bold">Patient not found.</p>
      </div>
    );
  }

  async function createLabResult(formData: FormData) {
    'use server';
    
    const testName = formData.get('testName') as string;
    const result = formData.get('result') as string;
    const remarks = formData.get('remarks') as string;

    await prisma.labResult.create({
      data: {
        patientId: patientId as string,
        testName,
        result,
        remarks,
      },
    });

    redirect('/dashboard/doctor');
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/dashboard/doctor" 
            className="p-2 bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-100 transition shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <FilePlus className="h-8 w-8 text-blue-600" />
              Add Laboratory Result
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Record a new medical test result for this patient.
            </p>
          </div>
        </div>

        {/* Patient Info Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="h-14 w-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
            <User className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Patient Details</p>
            <h2 className="text-xl font-bold text-slate-900">
              {patient.user.firstName} {patient.user.lastName}
            </h2>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <Beaker className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-800">Test Information</h2>
          </div>
          
          <form action={createLabResult} className="p-6 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Test Name */}
              <div className="space-y-2">
                <label htmlFor="testName" className="block text-sm font-semibold text-slate-700">
                  Test Name
                </label>
                <select 
                  id="testName" 
                  name="testName" 
                  required
                  defaultValue=""
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition font-medium"
                >
                  <option value="" disabled className="text-slate-400">Select a test...</option>
                  
                  <optgroup label="Blood Tests">
                    <option value="Complete Blood Count (CBC)">Complete Blood Count (CBC)</option>
                    <option value="Fasting Blood Sugar (FBS)">Fasting Blood Sugar (FBS)</option>
                    <option value="Lipid Profile">Lipid Profile (Cholesterol)</option>
                    <option value="Creatinine">Creatinine</option>
                  </optgroup>

                  <optgroup label="Urine & Stool Tests">
                    <option value="Urinalysis">Urinalysis</option>
                    <option value="Fecalysis">Fecalysis (Stool Exam)</option>
                  </optgroup>

                  <optgroup label="Imaging & Diagnostics">
                    <option value="Chest X-Ray">Chest X-Ray</option>
                    <option value="ECG / EKG">ECG / EKG</option>
                  </optgroup>
                </select>
              </div>

              {/* Result */}
              <div className="space-y-2">
                <label htmlFor="result" className="block text-sm font-semibold text-slate-700">
                  Result Status
                </label>
                <input 
                  type="text" 
                  id="result" 
                  name="result" 
                  required
                  placeholder="e.g. Normal, Elevated, Positive"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition font-medium"
                />
              </div>
            </div>

            {/* Remarks */}
            <div className="space-y-2">
              <label htmlFor="remarks" className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-slate-500" /> Doctor's Remarks (Optional)
              </label>
              <textarea 
                id="remarks" 
                name="remarks" 
                rows={4}
                placeholder="Add clinical notes or recommendations..."
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition resize-none font-medium"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <Link 
                href="/dashboard/doctor"
                className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </Link>
              <button 
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm"
              >
                Save Lab Result
              </button>
            </div>
            
          </form>
        </div>

      </div>
    </div>
  );
}
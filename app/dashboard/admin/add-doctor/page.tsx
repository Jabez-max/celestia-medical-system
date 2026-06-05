import { prisma } from '../../../../lib/prisma';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import Link from 'next/link';
import { ArrowLeft, UserPlus, Mail, Lock, Stethoscope, Building2, FileCheck, User } from 'lucide-react';

export default async function AddDoctorPage() {
  
  // SERVER ACTION: Ito ang mag-e-execute kapag kinlick ang "Create Account"
  async function createDoctorAccount(formData: FormData) {
    'use server';
    
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    const specialty = formData.get('specialty') as string;
    const licenseNumber = formData.get('licenseNumber') as string;
    const departmentName = formData.get('departmentName') as string;

    // 1. I-check kung existing na ang email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      console.error("Email already in use!");
      return; 
    }

    // 2. I-encrypt ang password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. I-save sa database (User + Doctor + Department)
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash: hashedPassword,
        role: 'DOCTOR', 
        doctor: {
          create: {
            specialty,
            licenseNumber,
            department: {
              connectOrCreate: {
                where: { name: departmentName },
                create: { name: departmentName, description: `${departmentName} Department` }
              }
            }
          }
        }
      }
    });

    // 4. I-redirect pabalik sa admin dashboard kapag success
    redirect('/dashboard/admin');
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/dashboard/admin" 
            className="p-2 bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-100 transition shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <UserPlus className="h-8 w-8 text-teal-600" />
              Register New Doctor
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Create an official account and profile for a physician.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <form action={createDoctorAccount} className="divide-y divide-slate-100">
            
            {/* 1. Personal Information Section */}
            <div className="p-6 md:p-8 space-y-6 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-indigo-500" /> Personal Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">First Name</label>
                  <input type="text" name="firstName" required placeholder="e.g. Juan" className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Last Name</label>
                  <input type="text" name="lastName" required placeholder="e.g. Dela Cruz" className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition font-medium" />
                </div>
              </div>
            </div>

            {/* 2. Professional Details Section */}
            <div className="p-6 md:p-8 space-y-6">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Stethoscope className="h-5 w-5 text-teal-500" /> Professional Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 flex items-center gap-1">
                    <Building2 className="h-4 w-4 text-slate-400" /> Department
                  </label>
                  <select name="departmentName" required defaultValue="" className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition font-medium">
                    <option value="" disabled className="text-slate-400">Select Department...</option>
                    {/* UPDATED DEPARTMENT LIST FROM YOUR DATABASE */}
                    <option value="Ophthalmology">Ophthalmology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Psychiatry">Psychiatry</option>
                    <option value="Pulmonology">Pulmonology</option>
                    <option value="Gastroenterology">Gastroenterology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="ENT">ENT (Ear, Nose, and Throat)</option>
                    <option value="Nephrology">Nephrology</option>
                    <option value="Urology">Urology</option>
                    <option value="OB-GYN">OB-GYN</option>
                    <option value="Endocrinology">Endocrinology</option>
                    <option value="Hematology">Hematology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Internal Medicine">Internal Medicine</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Specialty</label>
                  <input type="text" name="specialty" required placeholder="e.g. Pediatric Cardiologist" className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition font-medium" />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 flex items-center gap-1">
                    <FileCheck className="h-4 w-4 text-slate-400" /> License Number
                  </label>
                  <input type="text" name="licenseNumber" required placeholder="PRC-1234567" className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition font-medium" />
                </div>

              </div>
            </div>

            {/* 3. Account Credentials Section */}
            <div className="p-6 md:p-8 space-y-6 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Lock className="h-5 w-5 text-amber-500" /> Account Credentials
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 flex items-center gap-1">
                    <Mail className="h-4 w-4 text-slate-400" /> Email Address
                  </label>
                  <input type="email" name="email" required placeholder="doctor@celestia.com" className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 flex items-center gap-1">
                    <Lock className="h-4 w-4 text-slate-400" /> Temporary Password
                  </label>
                  <input type="password" name="password" required placeholder="••••••••" className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition font-medium" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-white">
              <Link 
                href="/dashboard/admin"
                className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </Link>
              <button 
                type="submit"
                className="px-6 py-2.5 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition shadow-sm"
              >
                Create Doctor Account
              </button>
            </div>
            
          </form>
        </div>

      </div>
    </div>
  );
}
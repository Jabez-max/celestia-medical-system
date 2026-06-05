'use server';

import { prisma } from '../lib/prisma';
import { redirect } from 'next/navigation';

export async function submitOnboardingTicket(formData: FormData) {
  const roleFor = formData.get('roleFor') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const licenseNumber = formData.get('licenseNumber') as string;
  
  // Kukunin lang ang department at specialty kung DOCTOR ang pinili
  const departmentName = roleFor === 'DOCTOR' ? formData.get('departmentName') as string : null;
  const specialty = roleFor === 'DOCTOR' ? formData.get('specialty') as string : null;

  // Mag-generate ng random Ticket Number (e.g., TKT-2026-8472)
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const ticketNumber = `TKT-2026-${randomNum}`;

  // I-save ang request sa OnboardingTicket table
  await prisma.onboardingTicket.create({
    data: {
      ticketNumber,
      roleFor,
      firstName,
      lastName,
      email,
      departmentName,
      specialty,
      licenseNumber,
      status: 'PENDING'
    }
  });

  // Kapag success, i-refresh ang page na may success message
  redirect('/hr-portal?success=true');
}
'use server';

import { prisma } from '../lib/prisma';
import { getSession } from '../lib/session';
import { redirect } from 'next/navigation';

export async function completeConsultation(formData: FormData) {
  const session = await getSession();
  if (!session) redirect('/login');

  // Hanapin si Doctor gamit ang session
  const doctor = await prisma.doctor.findUnique({
    where: { userId: session.userId }
  });

  if (!doctor) throw new Error("Not authorized");

  // Kunin ang mga tinype sa form
  const appointmentId = formData.get('appointmentId') as string;
  const patientId = formData.get('patientId') as string;
  const medication = formData.get('medication') as string;
  const dosage = formData.get('dosage') as string;
  const instructions = formData.get('instructions') as string;

  // 1. Gumawa ng Prescription record
  await prisma.prescription.create({
    data: {
      doctorId: doctor.id,
      patientId: patientId,
      medication: medication,
      dosage: dosage,
      instructions: instructions
    }
  });

  // 2. I-update ang status ng Appointment para maging COMPLETED
  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status: 'COMPLETED' as any } // Ginamit natin ulit ang 'as any' para iwas enum error
  });

  // 3. I-refresh ang page
  redirect('/dashboard/doctor/consultations');
}
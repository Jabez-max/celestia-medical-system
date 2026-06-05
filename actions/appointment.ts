'use server';

import { prisma } from '../lib/prisma';
import { getSession } from '../lib/session';
import { redirect } from 'next/navigation';

// ==========================================
// 1. FUNCTION PARA MAG-BOOK ANG PASYENTE
// ==========================================
export async function bookAppointment(formData: FormData) {
  const session = await getSession();
  if (!session) redirect('/login');

  const doctorId = formData.get('doctorId') as string;
  const dateStr = formData.get('appointmentDate') as string; 
  const notes = formData.get('notes') as string;

  // ==========================================
  // BACKEND VALIDATION (The "Double Lock")
  // ==========================================
  const selectedDate = new Date(dateStr);
  const currentDate = new Date();

  // I-check kung ang piniling petsa ay nakaraan na
  if (selectedDate < currentDate) {
    throw new Error("Invalid date: Cannot book appointments in the past.");
  }

  // 1. Kunin ang Patient record (at isama ang User info para sa email)
  let patient = await prisma.patient.findUnique({
    where: { userId: session.userId },
    include: { user: true } // Isinama para makuha ang email at pangalan
  });

  // Kung walang patient profile, gumawa ng bago
  if (!patient) {
    patient = await prisma.patient.create({
      data: { 
        userId: session.userId,
        dateOfBirth: new Date('2000-01-01') 
      },
      include: { user: true }
    });
  }

  // 2. Kunin ang Doctor record para sa pangalan niya sa email
  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId },
    include: { user: true }
  });

  if (!doctor) {
    throw new Error("Doctor not found.");
  }

  // 3. I-save ang appointment sa Database
  await prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId: doctorId,
      date: selectedDate,
      notes: notes,
      status: 'PENDING'
    }
  });

  // ==========================================
  // EMAIL NOTIFICATION TRIGGER
  // ==========================================
  try {
    const formattedDate = selectedDate.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const formattedTime = selectedDate.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit'
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    await fetch(`${baseUrl}/api/send-appointment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: patient.user.email,
        patientName: patient.user.firstName,
        doctorName: `Dr. ${doctor.user.lastName}`,
        date: formattedDate,
        time: formattedTime,
        notes: notes,
      }),
    });
  } catch (error) {
    console.error("Hindi na-send ang appointment email:", error);
    // Hindi natin nilagyan ng "throw new Error" dito para kahit mag-fail ang email,
    // tuloy pa rin ang booking sa database.
  }

  // 4. I-redirect pabalik sa dashboard pagkatapos mag-book
  redirect('/dashboard');
}


// ==========================================
// 2. FUNCTION PARA MA-UPDATE NI DOKTOR ANG STATUS
// ==========================================
export async function updateAppointmentStatus(formData: FormData) {
  const appointmentId = formData.get('appointmentId') as string;
  const newStatus = formData.get('status') as any;

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status: newStatus }
  });

  redirect('/dashboard/doctor');
}
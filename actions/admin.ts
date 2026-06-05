'use server';

import { prisma } from '../lib/prisma';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

// ==========================================
// APPROVE TICKET
// ==========================================
export async function approveTicket(ticketId: string) {
  // 1. Kunin ang ticket sa database
  const ticket = await prisma.onboardingTicket.findUnique({
    where: { id: ticketId }
  });

  if (!ticket || ticket.status !== 'PENDING') return;

  // 2. Siguraduhin na walang kaparehong email
  const existingUser = await prisma.user.findUnique({ where: { email: ticket.email } });
  if (existingUser) {
    throw new Error("Email is already registered.");
  }

  // 3. Mag-generate ng default temporary password para sa staff
  // Ibibigay ito ng Admin sa bagong empleyado para maka-login sila
  const defaultPassword = 'doctor123';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(defaultPassword, salt);

  // 4. Bubuuin ang Account base sa Role (Kukuhanin ang data galing sa HR form)
  if (ticket.roleFor === 'DOCTOR') {
    await prisma.user.create({
      data: {
        firstName: ticket.firstName,
        lastName: ticket.lastName,
        email: ticket.email,
        passwordHash: hashedPassword,
        role: 'DOCTOR',
        doctor: {
          create: {
            specialty: ticket.specialty || 'General',
            licenseNumber: ticket.licenseNumber,
            department: {
              connectOrCreate: {
                where: { name: ticket.departmentName || 'General' },
                create: { name: ticket.departmentName || 'General', description: `${ticket.departmentName} Department` }
              }
            }
          }
        }
      }
    });
  } else if (ticket.roleFor === 'MEDTECH') {
    await prisma.user.create({
      data: {
        firstName: ticket.firstName,
        lastName: ticket.lastName,
        email: ticket.email,
        passwordHash: hashedPassword,
        role: 'MEDTECH',
        medTech: {
          create: {
            licenseNumber: ticket.licenseNumber
          }
        }
      }
    });
  }

  // 5. I-update ang status ng ticket to APPROVED
  await prisma.onboardingTicket.update({
    where: { id: ticketId },
    data: { status: 'APPROVED' }
  });

  // 6. I-refresh ang UI ng admin dashboard para mawala sa "Pending" list
  revalidatePath('/dashboard/admin');
}

// ==========================================
// REJECT TICKET
// ==========================================
export async function rejectTicket(ticketId: string) {
  await prisma.onboardingTicket.update({
    where: { id: ticketId },
    data: { status: 'REJECTED' }
  });
  
  revalidatePath('/dashboard/admin');
}
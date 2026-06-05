'use server';

import { prisma } from '../lib/prisma';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { createSession } from '../lib/session';

// ==========================================
// 1. FUNCTION PARA SA REGISTER
// ==========================================
export async function registerUser(formData: FormData) {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return { error: 'Email is already registered. Please try another one.' };
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash: hashedPassword,
        role: 'PATIENT',
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error sa registration:", error);
    return { error: 'Failed to create account in the database.' };
  }
}

// ==========================================
// 2. FUNCTION PARA SA LOGIN
// ==========================================
export async function loginUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const user = await prisma.user.findUnique({
    where: { email: email }
  });

  if (!user) {
    redirect('/login?error=UserNotFound');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    redirect('/login?error=InvalidPassword');
  }

  await createSession(user.id);

  if (user.role === 'ADMIN') {
    redirect('/dashboard/admin');
  } else if (user.role === 'DOCTOR') {
    redirect('/dashboard/doctor');
  } else if (user.role === 'MEDTECH') {
    redirect('/dashboard/medtech');
  } else if (user.role === 'HR') {
    redirect('/hr-portal');
  } else {
    redirect('/dashboard');
  }
}
'use server';

import { prisma } from '../lib/prisma'; 
import { getSession } from '../lib/session';
import bcrypt from 'bcryptjs'; // IMPORTANTE: Idinagdag natin ang pang-encrypt

// ==========================================
// 1. UPDATE PROFILE FUNCTION
// ==========================================
export async function updateProfile(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Not logged in" };

  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;

  await prisma.user.update({
    where: { id: session.userId },
    data: {
      firstName: firstName,
      lastName: lastName,
      email: email,
    }
  });

  return { success: true };
}

// ==========================================
// 2. UPDATE PASSWORD FUNCTION (MAY HASHING NA)
// ==========================================
export async function updatePassword(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Not logged in" };

  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  // DITO NATIN II-ENCRYPT ANG PASSWORD BAGO I-SAVE
  // Ang '10' ay tinatawag na "salt rounds" (standard security level)
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: session.userId },
    data: { 
      passwordHash: hashedPassword // Encrypted na ang mase-save sa Prisma!
    }
  });

  return { success: true };
}
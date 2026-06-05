import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const email = 'medtech@celestia.com';
    const password = 'medtech123'; // Consistent sa doctor password
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Gagawa tayo ng User record + MedTech profile
    await prisma.user.upsert({
      where: { email },
      update: {
        passwordHash: hashedPassword,
      },
      create: {
        firstName: 'Lab',
        lastName: 'Staff',
        email: email,
        passwordHash: hashedPassword,
        role: 'MEDTECH',
        medTech: {
          create: {
            licenseNumber: 'MT-000000', // Default license number
          }
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'MedTech account successfully created!',
      email: email,
      password: password
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create MedTech account.' }, { status: 500 });
  }
}
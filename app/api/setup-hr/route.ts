import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const email = 'hr@celestia.com';
    const password = 'hr123';
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await prisma.user.upsert({
      where: { email },
      update: {
        passwordHash: hashedPassword,
      },
      create: {
        firstName: 'Human',
        lastName: 'Resources',
        email: email,
        passwordHash: hashedPassword,
        role: 'HR', // Bagong role sa system mo!
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'HR account successfully created!',
      email: email,
      password: password
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create HR account.' }, { status: 500 });
  }
}
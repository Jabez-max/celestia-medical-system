import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const email = 'admin@celestia.com';
    const password = 'admin123'; // Pinalitan natin to admin123!

    // I-encrypt ang bagong password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Gagamit tayo ng 'upsert' (Update o Insert).
    // Kapag may existing na, ia-update niya ang password. Kung wala, gagawa siya ng bago.
    await prisma.user.upsert({
      where: { email },
      update: {
        passwordHash: hashedPassword,
      },
      create: {
        firstName: 'System',
        lastName: 'Admin',
        email: email,
        passwordHash: hashedPassword,
        role: 'ADMIN',
        admin: {
          create: {} 
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Admin account password successfully updated to admin123!',
      email: email,
      password: password
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update admin account.' }, { status: 500 });
  }
}
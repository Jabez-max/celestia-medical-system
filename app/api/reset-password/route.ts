import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    // 1. Hanapin ang user na may hawak ng token na ito at i-check kung hindi pa expired
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(), // "gt" means Greater Than now (Valid pa)
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Reset link is invalid or has expired.' }, { status: 400 });
    }

    // 2. I-hash ang bagong password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. I-update sa database at burahin na ang ginamit na token para secure
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
    
  } catch (error) {
    console.error('Reset password database error:', error);
    return NextResponse.json({ error: 'Failed to reset password. Please try again.' }, { status: 500 });
  }
}
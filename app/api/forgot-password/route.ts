import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ success: true });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `"Celestia Medical Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request - Celestia Medical',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #1e3a8a; text-align: center;">Celestia Medical</h2>
          <p>Hello ${user.firstName},</p>
          <p>We received a request to reset your password. Click the button below to create a new one. This link will expire in 1 hour.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
          </div>
          <p style="font-size: 12px; color: #6b7280;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error in API:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
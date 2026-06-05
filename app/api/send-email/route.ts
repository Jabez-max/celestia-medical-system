import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Added 'name' for a personalized email
    const { to, subject, name } = body; 

    // 1. Set up the Transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 2. HTML Email Design for Celestia Medical
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background-color: #1e3a8a; padding: 25px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Celestia Medical</h1>
        </div>
        <div style="padding: 30px; background-color: #ffffff; color: #333333;">
          <h2 style="color: #1e3a8a;">Welcome to our Patient Portal, ${name || 'Patient'}!</h2>
          <p style="font-size: 16px; line-height: 1.5; color: #4b5563;">Thank you for creating an account with Celestia Medical. Your account has been successfully registered in our system.</p>
          <p style="font-size: 16px; line-height: 1.5; color: #4b5563;">With your account, you can now:</p>
          <ul style="font-size: 16px; line-height: 1.5; color: #4b5563; padding-left: 20px;">
            <li>Book and manage appointments</li>
            <li>View your medical records securely</li>
            <li>Receive health reminders</li>
          </ul>
          <div style="text-align: center; margin-top: 35px; margin-bottom: 20px;">
            <a href="http://localhost:3000/login" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Log In to Account</a>
          </div>
        </div>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
          <p style="margin: 0;">&copy; 2026 Celestia Medical. All rights reserved.</p>
          <p style="margin: 5px 0 0 0;">This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    `;

    // 3. Set up the Email Options
    const mailOptions = {
      from: `"Celestia Medical" <${process.env.EMAIL_USER}>`, // Custom name included!
      to: to,
      subject: subject || 'Welcome to Celestia Medical!',
      html: htmlContent, // Using HTML instead of plain text
    };

    // 4. Send the Email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Welcome email sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ success: false, message: 'Failed to send email' }, { status: 500 });
  }
}
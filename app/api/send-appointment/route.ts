import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, patientName, doctorName, date, time, notes } = body; 

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background-color: #1e3a8a; padding: 25px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Celestia Medical</h1>
        </div>
        <div style="padding: 30px; background-color: #ffffff; color: #333333;">
          <h2 style="color: #1e3a8a;">Appointment Confirmation</h2>
          <p style="font-size: 16px; line-height: 1.5; color: #4b5563;">Hello ${patientName},</p>
          <p style="font-size: 16px; line-height: 1.5; color: #4b5563;">Your appointment has been successfully scheduled. Here are the details:</p>
          
          <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Doctor:</strong> ${doctorName}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
            ${notes ? `<p style="margin: 5px 0;"><strong>Notes:</strong> ${notes}</p>` : ''}
          </div>

          <p style="font-size: 16px; line-height: 1.5; color: #4b5563; font-weight: bold;">Reminders:</p>
          <ul style="font-size: 16px; line-height: 1.5; color: #4b5563; padding-left: 20px;">
            <li>Please arrive 15 minutes before your scheduled time.</li>
            <li>Bring any previous medical records or test results if applicable.</li>
            <li>If you need to cancel, please do so at least 24 hours in advance.</li>
          </ul>
        </div>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
          <p style="margin: 0;">&copy; 2026 Celestia Medical. All rights reserved.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"Celestia Medical Appointments" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: 'Your Appointment Confirmation - Celestia Medical',
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Appointment email sent!' }, { status: 200 });
  } catch (error) {
    console.error('Error sending appointment email:', error);
    return NextResponse.json({ success: false, message: 'Failed to send email' }, { status: 500 });
  }
}
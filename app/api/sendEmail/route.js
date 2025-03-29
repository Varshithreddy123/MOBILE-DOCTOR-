import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { DoctorBookingWelcomeEmail } from '@/emails/index';

const resend = new Resend(process.env.RESEND_API_KEY);
resend.domains.verify('42580800-2709-4593-b016-e39c1f61b505');
const ADMIN_EMAIL = 'varshithreddyreddy873@gmail.com';

export async function POST(request) {
  try {
    const { email, bookingDetails } = await request.json();

    // Send to patient
    const patientEmail = await resend.emails.send({
      from: 'DocApp <onboarding@resend.dev>',
      to: email,
      subject: `Appointment Confirmation - ${bookingDetails.appointmentDate}`,
      react: DoctorBookingWelcomeEmail(bookingDetails),
      text: `
        Appointment Confirmation\n\n
        Dear ${bookingDetails.patientName},\n\n
        Your appointment with ${bookingDetails.doctorName} is confirmed:\n
        Date: ${bookingDetails.appointmentDate}\n
        Time: ${bookingDetails.appointmentTime}\n
        Reference: ${bookingDetails.bookingReference}\n\n
        Clinic Address: ${bookingDetails.clinicAddress}\n
        Phone: ${bookingDetails.phoneNumber}\n\n
        Please arrive 15 minutes early.\n\n
        To reschedule or cancel, please contact us.
      `
    });
    

    // Send to admin
    const adminEmail = await resend.emails.send({
      from: 'DocApp <onboarding@resend.dev>',
      to: ADMIN_EMAIL,
      subject: `New Booking: ${bookingDetails.patientName}`,
      html: `
        <div>
          <h2>New Appointment Booking</h2>
          <p><strong>Patient:</strong> ${bookingDetails.patientName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Doctor:</strong> ${bookingDetails.doctorName}</p>
          <p><strong>Date:</strong> ${bookingDetails.appointmentDate}</p>
          <p><strong>Time:</strong> ${bookingDetails.appointmentTime}</p>
          <p><strong>Phone:</strong> ${bookingDetails.phoneNumber}</p>
          <p><strong>Reference:</strong> ${bookingDetails.bookingReference}</p>
        </div>
      `,
      text: `New booking received from ${bookingDetails.patientName}`
    });

    if (patientEmail.error || adminEmail.error) {
      const errors = [patientEmail.error, adminEmail.error].filter(Boolean);
      console.error('Email errors:', errors);
      return NextResponse.json({ errors }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Failed to process booking' },
      { status: 500 }
    );
  }
}
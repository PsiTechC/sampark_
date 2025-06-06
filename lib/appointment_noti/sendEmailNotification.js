import nodemailer from "nodemailer";


const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

import { DateTime } from "luxon";


export async function sendEmailNotification(recipientEmail, appointmentDate, meetingLink, timezone = "Asia/Kolkata") {
  const dt = DateTime.fromISO(appointmentDate, { zone: 'utc' }).setZone(timezone);

  const readableDate = dt.toFormat("d LLLL yyyy 'at' h:mm a"); // Don't override time zone

  const transporter = nodemailer.createTransport({
    host: 'mail.samparkai.com',
    port: 587,
    secure: false,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });

  const mailOptions = {
    from: `"Upcoming Appointment Notification" ${user}`,
    to: recipientEmail,
    subject: "Your Appointment Details & Meeting Link",
    text: `These are your appointment details and online meeting link.\n\nAppointment Date and Time: ${readableDate} (${timezone} timezone)\nMeeting Link: ${meetingLink}`,
    html: `
      <p>These are your appointment details and online meeting link.</p>
      <p><strong>Appointment Date and Time:</strong> ${readableDate} (${timezone} timezone)</p>
      <p><strong>Meeting Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${recipientEmail}: ${info.messageId}`);
    return true;
  } catch (err) {
    console.error(`❌ Failed to send email to ${recipientEmail}:`, err.message);
    return false;
  }
}
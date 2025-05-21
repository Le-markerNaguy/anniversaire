import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import { AcceptanceEmail } from '@/emails/AcceptanceEmail'; // Assume you have these email components
import { RejectionEmail } from '@/emails/RejectionEmail';
import * as React from 'react';

// Configure your SMTP transport
// Use environment variables for sensitive information
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10), // Default SMTP port
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface SendEmailProps {
  to: string;
  subject: string;
  template: 'acceptance' | 'rejection';
  templateProps: { name: string }; // Define props needed by your email templates
}

export async function sendEmail({ to, subject, template, templateProps }: SendEmailProps) {
  try {
    let emailHtml = '';

    // Render the appropriate email component
    if (template === 'acceptance') {
      emailHtml = await render(React.createElement(AcceptanceEmail, templateProps));
    } else if (template === 'rejection') {
      emailHtml = await render(React.createElement(RejectionEmail, templateProps));
    }

    if (!emailHtml) {
        console.error(`Failed to render email template: ${template}`);
        return; // Exit if template rendering failed
    }

    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL, // Sender address from environment variables
      to,
      subject,
      html: emailHtml,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log(`Email sent: ${info.messageId}`);
    return info;

  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // Re-throw the error for handling in the calling code
  }
}

// Remember to add the following environment variables to your .env file:
// SMTP_HOST=your_smtp_server_host
// SMTP_PORT=your_smtp_server_port (e.g., 587 or 465)
// SMTP_SECURE=true_or_false (true if port is 465, false otherwise usually)
// SMTP_USER=your_smtp_username
// SMTP_PASSWORD=your_smtp_password
// SMTP_FROM_EMAIL=your_sending_email_address 
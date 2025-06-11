import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import { AcceptanceEmail } from '@/emails/AcceptanceEmail';
import * as React from 'react';

interface SendEmailProps {
  to: string;
  subject: string;
  template: 'acceptance';
  templateProps: { name: string, accessCode: string }
}

export async function sendEmail({ to, subject, template, templateProps }: SendEmailProps) {
  try {
    // Vérification que SMTP_FROM est bien configuré
    if (!process.env.SMTP_FROM) {
      throw new Error('SMTP_FROM is not configured in environment variables');
    }
    // Rendu du template email
    const emailHtml = await render(React.createElement(AcceptanceEmail, templateProps));

    if (!emailHtml) {
      throw new Error(`Failed to render ${template} email template`);
    }

    // Configure le transporteur SMTP (exemple Gmail, à adapter à ton fournisseur)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Envoi de l'email
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html: emailHtml,
    });

    console.log(`Email sent successfully to ${to} with ID: ${info.messageId}`);
    return info;

  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}
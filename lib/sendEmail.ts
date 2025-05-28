import { Resend } from 'resend';
import { render } from '@react-email/render';
import { AcceptanceEmail } from '@/emails/AcceptanceEmail';
import { RejectionEmail } from '@/emails/RejectionEmail';
import * as React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailProps {
  to: string;
  subject: string;
  template: 'acceptance' | 'rejection';
  templateProps: { name: string };
}

export async function sendEmail({ to, subject, template, templateProps }: SendEmailProps) {
  try {
    // Vérification que RESEND_FROM_EMAIL est bien configuré
    if (!process.env.RESEND_FROM_EMAIL) {
      throw new Error('RESEND_FROM_EMAIL is not configured in environment variables');
    }

    // Rendu du template email
    const emailHtml = template === 'acceptance'
      ? await render(React.createElement(AcceptanceEmail, templateProps))
      : await render(React.createElement(RejectionEmail, templateProps));

    if (!emailHtml) {
      throw new Error(`Failed to render ${template} email template`);
    }

    // Envoi de l'email avec RESEND_FROM_EMAIL comme expéditeur
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: [to],
      subject,
      html: emailHtml,
    });

    if (error) {
      throw error;
    }

    console.log(`Email sent successfully to ${to} with ID: ${data?.id}`);
    return data;

  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}
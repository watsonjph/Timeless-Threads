import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail({ to, subject, text, html }) {
  const msg = {
    to,
    from: process.env.FROM_EMAIL, // Gamita sa verified sender from .env
    subject,
    text,
    html,
  };
  await sgMail.send(msg);
}

export { sendEmail }; 
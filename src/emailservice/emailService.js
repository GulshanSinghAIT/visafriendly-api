const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail({ to, subject, text, html }) {
    console.log("sendingmail",to, subject, text, html,process.env.FROM_EMAIL);
  const msg = {
    to,
    from: process.env.FROM_EMAIL, // Must be verified sender 
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Email failed: ${error.message}`);
  }
}

module.exports = { sendEmail };

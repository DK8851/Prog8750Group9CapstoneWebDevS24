// /utils/email.js

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async ({ to, subject, text, html }) => {
  return await transporter.sendMail({
    from: 'lizapatel2711@gmail.com', // Replace with your email
    to,
    subject,
    text,
    html,
  });
};

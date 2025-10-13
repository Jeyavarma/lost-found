// Alternative: Backend email service for faster delivery
// File: backend/services/emailService.js

const nodemailer = require('nodemailer')

// Use Gmail App Password or SendGrid/Mailgun for production
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your-email@gmail.com
    pass: process.env.EMAIL_APP_PASSWORD // Gmail app password
  }
})

const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'MCC Lost & Found - Password Reset OTP',
    html: `
      <h2>Password Reset OTP</h2>
      <p>Your OTP code is: <strong>${otp}</strong></p>
      <p>This code expires in 10 minutes.</p>
    `
  }
  
  return transporter.sendMail(mailOptions)
}

module.exports = { sendOTPEmail }

// Usage in auth.js:
// const { sendOTPEmail } = require('../services/emailService')
// await sendOTPEmail(email, otp)
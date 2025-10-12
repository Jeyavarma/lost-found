const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  pool: true,
  maxConnections: 1,
  rateDelta: 20000,
  rateLimit: 5
});

const sendOTPEmail = async (email, otp) => {
  // Validate environment variables
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email credentials not configured. Please set EMAIL_USER and EMAIL_PASS environment variables.');
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'MCC Lost & Found - Password Reset OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1c1b3b; color: white; padding: 20px; text-align: center;">
          <h1>MCC Lost & Found</h1>
          <p>Madras Christian College</p>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #1c1b3b;">Password Reset Request</h2>
          <p>You requested a password reset for your MCC Lost & Found account.</p>
          <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h3 style="color: #811c1f; margin: 0;">Your OTP Code</h3>
            <div style="font-size: 32px; font-weight: bold; color: #1c1b3b; letter-spacing: 5px; margin: 15px 0;">
              ${otp}
            </div>
            <p style="color: #666; margin: 0;">This code expires in 10 minutes</p>
          </div>
          <p><strong>Important:</strong> If you didn't request this reset, please ignore this email.</p>
        </div>
        <div style="background: #1c1b3b; color: white; padding: 15px; text-align: center; font-size: 12px;">
          <p>© 2024 MCC Lost & Found System</p>
        </div>
      </div>
    `
  };

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Email sending timeout'));
    }, 15000);

    transporter.sendMail(mailOptions, (error, info) => {
      clearTimeout(timeout);
      if (error) {
        console.error('📧 Email error:', error.message);
        reject(error);
      } else {
        console.log('📧 Email sent successfully to:', email);
        resolve(info);
      }
    });
  });
};

module.exports = { sendOTPEmail };
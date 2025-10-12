const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOTPEmail = async (email, otp) => {
  console.log(`📧 Attempting to send OTP ${otp} to ${email}`);
  console.log(`📧 From: ${process.env.EMAIL_USER}`);
  
  const mailOptions = {
    from: `"MCC Lost & Found" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset OTP - MCC Lost & Found',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #8B0000; color: white; padding: 20px; text-align: center;">
          <h1>MCC Lost & Found</h1>
        </div>
        <div style="padding: 30px;">
          <h2>Password Reset Request</h2>
          <p>Your OTP for password reset is:</p>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; color: #8B0000; margin: 20px 0;">
            ${otp}
          </div>
          <p>This OTP expires in 10 minutes.</p>
        </div>
      </div>
    `
  };

  const result = await transporter.sendMail(mailOptions);
  console.log(`✅ Email sent successfully! Message ID: ${result.messageId}`);
  console.log(`📊 Email details:`, {
    from: mailOptions.from,
    to: mailOptions.to,
    subject: mailOptions.subject,
    accepted: result.accepted,
    rejected: result.rejected
  });
  
  return result;
};

module.exports = { sendOTPEmail };
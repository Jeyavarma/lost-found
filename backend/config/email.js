const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendOTPEmail = async (email, otp) => {
  console.log(`📧 Sending OTP ${otp} to ${email} via SendGrid`);
  
  const msg = {
    to: email,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL || 'noreply@mcc.edu.in',
      name: 'MCC Lost & Found'
    },
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

  const result = await sgMail.send(msg);
  console.log(`✅ Email sent successfully via SendGrid!`);
  return result;
};

module.exports = { sendOTPEmail };
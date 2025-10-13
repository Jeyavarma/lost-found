const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

const sendOTPEmail = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'MCC Lost & Found <noreply@resend.dev>',
      to: [email],
      subject: 'MCC Lost & Found - Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8B0000;">Password Reset OTP</h2>
          <p>Your OTP code is:</p>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This code expires in 10 minutes.</p>
          <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
      `
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error }
    }

    console.log('✅ Resend email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('❌ Resend service error:', error)
    return { success: false, error: error.message }
  }
}

module.exports = { sendOTPEmail }
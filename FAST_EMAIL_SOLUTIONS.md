# Fast Email Delivery Solutions

## Current Issue: EmailJS takes 2+ minutes

## Solution 1: Switch to Resend (Recommended)
```bash
npm install resend
```

```js
// backend/services/resend.js
const { Resend } = require('resend')
const resend = new Resend(process.env.RESEND_API_KEY)

const sendOTP = async (email, otp) => {
  return await resend.emails.send({
    from: 'noreply@yourdomain.com',
    to: email,
    subject: 'MCC Lost & Found - Password Reset OTP',
    html: `<h2>Your OTP: ${otp}</h2><p>Expires in 10 minutes</p>`
  })
}
```

**Delivery Time: 2-5 seconds**

## Solution 2: Use SendGrid
```bash
npm install @sendgrid/mail
```

```js
// backend/services/sendgrid.js
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendOTP = async (email, otp) => {
  return await sgMail.send({
    to: email,
    from: 'noreply@yourdomain.com',
    subject: 'Password Reset OTP',
    html: `<h2>Your OTP: ${otp}</h2>`
  })
}
```

**Delivery Time: 3-8 seconds**

## Solution 3: Backend Nodemailer with Gmail App Password
```js
// backend/services/gmail.js
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD // Not regular password!
  }
})

const sendOTP = async (email, otp) => {
  return await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Password Reset OTP',
    html: `<h2>Your OTP: ${otp}</h2>`
  })
}
```

**Delivery Time: 10-30 seconds**

## Why EmailJS is Slow:
1. Free tier rate limiting
2. Template processing overhead
3. Multiple API hops
4. Gmail spam filtering for third-party services

## Recommendation:
Switch to **Resend** for fastest delivery (2-5 seconds) with better reliability.
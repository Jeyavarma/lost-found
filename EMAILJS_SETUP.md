# EmailJS Setup Guide for MCC Lost & Found

## 1. Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## 2. Create Email Service
1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose **Gmail** (recommended)
4. Connect your Gmail account
5. Note the **Service ID** (e.g., `service_mcc_lost_found`)

## 3. Create Email Template
1. Go to **Email Templates**
2. Click **Create New Template**
3. Use this template:

```html
Subject: MCC Lost & Found - Password Reset OTP

Hello {{user_name}},

Your OTP for password reset is: **{{otp_code}}**

This OTP will expire in 10 minutes.

If you didn't request this, please ignore this email.

Best regards,
MCC Lost & Found Team
```

4. Note the **Template ID** (e.g., `template_otp_reset`)

## 4. Get Keys
1. Go to **Account** → **General**
2. Copy your **Public Key** (for frontend)
3. Copy your **Private Key** (keep secure)

## 5. Update Environment Variables
Update your `.env.local` file:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=yLostandFound_otp
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=lostAndFound_otp  
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=jCTpqvdfN6ybIwxfZ
```

**Note**: Only use the public key in frontend code. Private key should never be exposed in client-side code.

## 6. Test the Setup
1. Start your development server
2. Go to forgot password page
3. Enter a valid email address
4. Check if OTP email is received

## Template Variables Used
- `{{to_email}}` - Recipient email address
- `{{otp_code}}` - 6-digit OTP code
- `{{user_name}}` - Username (extracted from email)

## Free Tier Limits
- 200 emails/month
- Perfect for development and small-scale use

## Security Notes
- Public key is safe to expose in frontend
- Service and template IDs are also safe
- No sensitive credentials in frontend code
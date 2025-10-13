"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import emailjs from '@emailjs/browser'

// Initialize EmailJS
if (typeof window !== 'undefined') {
  emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!)
}

export default function TestEmailPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage("")

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          email: email,
          passcode: "123456",
          time: 10
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      )
      setMessage("✅ Test email sent successfully!")
    } catch (error) {
      setMessage("❌ Failed to send email. Check your EmailJS configuration.")
      console.error('EmailJS error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Test EmailJS Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTest} className="space-y-4">
              <div>
                <Label htmlFor="email">Test Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your-email@gmail.com"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Test Email'}
              </Button>
              
              {message && (
                <div className={`text-sm ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                  {message}
                </div>
              )}
            </form>
            
            <div className="mt-6 text-xs text-gray-500">
              <p>Environment Variables:</p>
              <p>Service ID: {process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '❌ Not set'}</p>
              <p>Template ID: {process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '❌ Not set'}</p>
              <p>Public Key: {process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ? '✅ Set' : '❌ Not set'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
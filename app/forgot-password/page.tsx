"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle, Eye, EyeOff } from "lucide-react"
import Navigation from "@/components/navigation"

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1) // 1: email, 2: otp + password
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    console.log('🔴 Frontend: Submitting forgot password for:', email)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      console.log('📡 Frontend: Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('📄 Frontend: Response data:', data)
        setStep(2)
      } else {
        const data = await response.json()
        console.log('❌ Frontend: Error data:', data)
        setError(data.error || 'Failed to send OTP')
      }
    } catch (error) {
      console.error('❌ Frontend: Network error:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, password })
      })

      if (response.ok) {
        setShowSuccess(true)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to reset password')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-md mx-auto px-4 py-12">
        <Card className="mcc-card border-2 border-brand-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mcc-text-primary font-serif">Forgot Password</CardTitle>
            <CardDescription>
              {step === 1 ? 'Enter your email to receive an OTP' : 'Enter OTP and new password'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showSuccess ? (
              step === 1 ? (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@college.edu"
                      required
                    />
                  </div>
                  
                  {error && (
                    <div className="text-red-600 text-sm">{error}</div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full mcc-accent hover:bg-red-800"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send OTP'}
                  </Button>
                  
                  <div className="text-center">
                    <Link href="/login" className="text-sm text-gray-600 hover:text-brand-primary">
                      <ArrowLeft className="w-4 h-4 inline mr-1" />
                      Back to Login
                    </Link>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetSubmit} className="space-y-4">
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-600">OTP sent to {email}</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="otp">Enter OTP</Label>
                    <Input
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                  
                  {error && (
                    <div className="text-red-600 text-sm">{error}</div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full mcc-accent hover:bg-red-800"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Resetting...' : 'Reset Password'}
                  </Button>
                  
                  <div className="text-center">
                    <Button 
                      type="button"
                      variant="ghost"
                      onClick={() => setStep(1)}
                      className="text-sm text-gray-600 hover:text-brand-primary"
                    >
                      <ArrowLeft className="w-4 h-4 inline mr-1" />
                      Back to Email
                    </Button>
                  </div>
                </form>
              )
            ) : (
              <div className="text-center space-y-4">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                <h3 className="text-lg font-semibold text-green-800">Password Reset!</h3>
                <p className="text-gray-600">Your password has been successfully reset.</p>
                <Link href="/login">
                  <Button className="mcc-accent hover:bg-red-800">
                    Login Now
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
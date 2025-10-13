import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://lost-found-79xn.onrender.com'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🔵 Frontend API: Forgot password request for:', body.email)
    
    const response = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    
    console.log('📡 Backend response status:', response.status)
    const data = await response.json()
    console.log('📄 Backend response data:', data)
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('❌ Frontend API error:', error)
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}
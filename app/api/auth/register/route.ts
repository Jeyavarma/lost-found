import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'https://lost-found-79xn.onrender.com'

export async function POST(request: NextRequest) {
  try {
    console.log('Backend URL:', BACKEND_URL)
    const body = await request.json()
    console.log('Request body:', body)
    
    const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    
    const data = await response.json()
    console.log('Backend response:', response.status, data)
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
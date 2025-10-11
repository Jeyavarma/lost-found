import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'https://lost-found-79xn.onrender.com'

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/items/events`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch events')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Events API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}
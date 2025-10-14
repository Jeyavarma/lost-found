import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'https://lost-found-79xn.onrender.com'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventName: string }> }
) {
  const { eventName } = await params
  try {
    const decodedEventName = decodeURIComponent(eventName)
    const response = await fetch(`${BACKEND_URL}/api/items/events/${encodeURIComponent(decodedEventName)}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch event items')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Event items API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch event items' },
      { status: 500 }
    )
  }
}
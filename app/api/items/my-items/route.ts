import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://lost-found-79xn.onrender.com'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 })
    }

    const response = await fetch(`${BACKEND_URL}/api/items/my-items`, {
      headers: {
        'Authorization': authHeader
      }
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    } else {
      const error = await response.text()
      return NextResponse.json({ error }, { status: response.status })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user items' }, { status: 500 })
  }
}
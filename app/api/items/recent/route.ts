import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://lost-found-79xn.onrender.com'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '5'
    
    const response = await fetch(`${BACKEND_URL}/api/items?limit=${limit}&sort=-createdAt`)
    const data = await response.json()
    
    // Ensure we only return the requested number of items
    const limitedData = Array.isArray(data) ? data.slice(0, parseInt(limit)) : data
    
    return NextResponse.json(limitedData)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch recent items' }, { status: 500 })
  }
}
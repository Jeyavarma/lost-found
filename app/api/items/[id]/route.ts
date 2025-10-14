import { NextRequest, NextResponse } from 'next/server'

// Fixed for Next.js 15 - params is now Promise<{ id: string }>
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://lost-found-79xn.onrender.com'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const { id } = params
    const response = await fetch(`${BACKEND_URL}/api/items/${id}`)
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const { id } = params
    const authHeader = request.headers.get('authorization')
    const response = await fetch(`${BACKEND_URL}/api/items/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader || ''
      }
    })
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
  }
}


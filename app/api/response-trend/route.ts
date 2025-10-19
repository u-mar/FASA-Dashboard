import { NextResponse } from 'next/server'
import { getResponseTrend } from '@/app/actions'

export async function GET() {
  try {
    const data = await getResponseTrend()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in response-trend API route:', error)
    return NextResponse.json({ error: 'Failed to fetch response trend data' }, { status: 500 })
  }
} 
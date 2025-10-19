import { NextResponse } from 'next/server'
import { getSentimentTrend } from '@/app/actions'

export async function GET() {
  try {
    const data = await getSentimentTrend()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in sentiment-trend API route:', error)
    return NextResponse.json({ error: 'Failed to fetch sentiment trend data' }, { status: 500 })
  }
} 
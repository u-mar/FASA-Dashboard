import { NextResponse } from 'next/server'
import { getOverallSentiment } from '@/app/actions'

export async function GET() {
  try {
    const data = await getOverallSentiment()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in overall-sentiment API route:', error)
    return NextResponse.json({ error: 'Failed to fetch overall sentiment data' }, { status: 500 })
  }
} 
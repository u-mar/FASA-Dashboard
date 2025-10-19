import { NextResponse } from 'next/server'
import { getSourcesSentiment } from '@/app/actions'

export async function GET() {
  try {
    const data = await getSourcesSentiment()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in sources-sentiment API route:', error)
    return NextResponse.json({ error: 'Failed to fetch sources sentiment data' }, { status: 500 })
  }
} 
import { NextResponse } from 'next/server'
import { getEmotionsData } from '@/app/actions'

export async function GET() {
  try {
    const data = await getEmotionsData()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in emotions API route:', error)
    return NextResponse.json({ error: 'Failed to fetch emotions data' }, { status: 500 })
  }
} 
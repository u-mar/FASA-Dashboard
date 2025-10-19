import { NextResponse } from 'next/server'
import { getEmotionAspectCooccurrence } from '@/app/actions'

export async function GET() {
  try {
    const data = await getEmotionAspectCooccurrence()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in emotion-aspect API route:', error)
    return NextResponse.json({ error: 'Failed to fetch emotion aspect data' }, { status: 500 })
  }
} 
import { NextResponse } from 'next/server'
import { getAspectTrends } from '@/app/actions'

export async function GET() {
  try {
    const data = await getAspectTrends()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in aspect-trends API route:', error)
    return NextResponse.json({ error: 'Failed to fetch aspect trends data' }, { status: 500 })
  }
} 
import { NextResponse } from 'next/server'
import { getAspectMetrics } from '@/app/actions'

export async function GET() {
  try {
    const data = await getAspectMetrics()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in aspect-metrics API route:', error)
    return NextResponse.json({ error: 'Failed to fetch aspect metrics data' }, { status: 500 })
  }
} 
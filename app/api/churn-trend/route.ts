import { NextResponse } from 'next/server'
import { getChurnTrend } from '@/app/actions'

export async function GET() {
  try {
    const data = await getChurnTrend()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in churn-trend API route:', error)
    return NextResponse.json({ error: 'Failed to fetch churn trend data' }, { status: 500 })
  }
} 
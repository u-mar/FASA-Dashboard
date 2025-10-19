import { NextResponse } from 'next/server'
import { getAspectsVolume } from '@/app/actions'

export async function GET() {
  try {
    const data = await getAspectsVolume()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in aspects-volume API route:', error)
    return NextResponse.json({ error: 'Failed to fetch aspects volume data' }, { status: 500 })
  }
} 
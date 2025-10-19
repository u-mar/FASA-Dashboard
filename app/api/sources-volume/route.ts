import { NextResponse } from 'next/server'
import { getSourcesVolume } from '@/app/actions'

export async function GET() {
  try {
    const data = await getSourcesVolume()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in sources-volume API route:', error)
    return NextResponse.json({ error: 'Failed to fetch sources volume data' }, { status: 500 })
  }
} 
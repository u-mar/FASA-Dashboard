import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const result = await sql.query(`
      SELECT DISTINCT 
        EXTRACT(YEAR FROM date)::integer as year 
      FROM reviews
      ORDER BY year DESC
    `)

    const years = Array.isArray(result) ? result.map(row => row.year) : []
    return NextResponse.json({ years })
  } catch (error) {
    console.error('Error fetching available years:', error)
    return NextResponse.json({ years: [2025, 2024, 2023] })
  }
} 
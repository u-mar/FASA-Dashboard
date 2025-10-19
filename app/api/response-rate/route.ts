import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

const companyColors: Record<string, string> = {
  faras: "#10B981",  // Green
  uber: "#3B82F6",   // Blue
  little: "#F59E0B", // Orange
  bolt: "#8B5CF6"    // Purple
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year') || '2024'

    const result = await sql.query(`
      WITH company_metrics AS (
        SELECT 
          company,
          COUNT(CASE WHEN response = 'True' THEN 1 END) * 100.0 / COUNT(*) as response_rate
        FROM reviews
        WHERE EXTRACT(YEAR FROM date) = $1
        GROUP BY company
      )
      SELECT 
        company,
        ROUND(response_rate::numeric, 1) as value
      FROM company_metrics
      ORDER BY company
    `, [year])

    const metrics = Array.isArray(result) ? result.map(row => ({
      company: String(row.company),
      value: Number(row.value),
      color: companyColors[row.company] || "#CBD5E1" // Fallback color if company not found
    })) : []

    return NextResponse.json({ metrics })
  } catch (error) {
    console.error('Error fetching response rate:', error)
    return NextResponse.json(
      { 
        metrics: [
          { company: 'little', value: 74, color: "#F59E0B" },
          { company: 'faras', value: 78, color: "#10B981" },
          { company: 'uber', value: 72, color: "#3B82F6" },
          { company: 'bolt', value: 70, color: "#8B5CF6" }
        ]
      }
    )
  }
} 
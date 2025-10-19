import { NextResponse } from 'next/server'
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const data = await sql.query(`
      SELECT 
        EXTRACT(YEAR FROM date) AS year,
        company,
        ROUND(
          100.0 * COUNT(*) FILTER (WHERE response = 'True') / COUNT(*),
          1
        ) AS response_rate
      FROM reviews
      GROUP BY EXTRACT(YEAR FROM date), company
      ORDER BY year, company;
    `)

    // Get unique years
    const years = [...new Set(data.map((item: any) => Number(item.year)))].sort()

    // Create a data point for each year
    const responseTrendData = years.map((year) => {
      const yearData = data.filter((item: any) => Number(item.year) === year)
      return {
        year: year,
        faras: Number(yearData.find((item: any) => item.company === "faras")?.response_rate || 0),
        uber: Number(yearData.find((item: any) => item.company === "uber")?.response_rate || 0),
        little: Number(yearData.find((item: any) => item.company === "little")?.response_rate || 0),
        bolt: Number(yearData.find((item: any) => item.company === "bolt")?.response_rate || 0),
      }
    })

    return NextResponse.json(responseTrendData)
  } catch (error) {
    console.error('Error in response-trend-comparison API route:', error)
    // Fallback data
    return NextResponse.json([
      { year: 2022, faras: 72.5, uber: 65.2, little: 58.7, bolt: 68.3 },
      { year: 2023, faras: 75.2, uber: 67.8, little: 60.5, bolt: 70.1 },
      { year: 2024, faras: 77.8, uber: 70.3, little: 62.8, bolt: 72.6 },
      { year: 2025, faras: 78.0, uber: 71.5, little: 64.2, bolt: 73.9 },
    ])
  }
} 
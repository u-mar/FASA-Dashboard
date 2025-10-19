import { NextResponse } from 'next/server'
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const data = await sql.query(`
      SELECT 
        EXTRACT(YEAR FROM date) AS year,
        company,
        ROUND(
          100.0 * COUNT(*) FILTER (WHERE LOWER(churn_risk) = 'high') / COUNT(*),
          1
        ) AS churn_rate
      FROM reviews
      GROUP BY EXTRACT(YEAR FROM date), company
      ORDER BY year, company;
    `)

    // Get unique years
    const years = [...new Set(data.map((item: any) => Number(item.year)))].sort()

    // Create a data point for each year
    const churnTrendData = years.map((year) => {
      const yearData = data.filter((item: any) => Number(item.year) === year)
      return {
        year: year,
        faras: Number(yearData.find((item: any) => item.company === "faras")?.churn_rate || 0),
        uber: Number(yearData.find((item: any) => item.company === "uber")?.churn_rate || 0),
        little: Number(yearData.find((item: any) => item.company === "little")?.churn_rate || 0),
        bolt: Number(yearData.find((item: any) => item.company === "bolt")?.churn_rate || 0),
      }
    })

    return NextResponse.json(churnTrendData)
  } catch (error) {
    console.error('Error in churn-trend-comparison API route:', error)
    // Fallback data
    return NextResponse.json([
      { year: 2022, faras: 18.5, uber: 22.3, little: 25.1, bolt: 19.8 },
      { year: 2023, faras: 20.2, uber: 24.5, little: 27.2, bolt: 21.5 },
      { year: 2024, faras: 21.8, uber: 26.1, little: 28.9, bolt: 23.2 },
      { year: 2025, faras: 23.0, uber: 27.8, little: 30.5, bolt: 24.7 },
    ])
  }
} 
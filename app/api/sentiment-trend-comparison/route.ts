import { NextResponse } from 'next/server'
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const data = await sql.query(`
      SELECT 
        TO_CHAR(date, 'Mon') AS month,
        company,
        ROUND(
          COUNT(*) FILTER (WHERE overall_sentiment = 'positive') * 100.0 / 
          NULLIF(COUNT(*), 0),
          1
        ) AS positive_percentage
      FROM reviews
      WHERE EXTRACT(YEAR FROM date) = 2025
      GROUP BY TO_CHAR(date, 'Mon'), company, EXTRACT(MONTH FROM date)
      ORDER BY EXTRACT(MONTH FROM date), company;
    `)

    // Get unique months
    const months = [...new Set(data.map((item: any) => item.month))]

    // Create a data point for each month
    const sentimentTrendData = months.map((month) => {
      const monthData = data.filter((item: any) => item.month === month)
      return {
        month: month,
        faras: Number(monthData.find((item: any) => item.company === "faras")?.positive_percentage || 0),
        uber: Number(monthData.find((item: any) => item.company === "uber")?.positive_percentage || 0),
        little: Number(monthData.find((item: any) => item.company === "little")?.positive_percentage || 0),
        bolt: Number(monthData.find((item: any) => item.company === "bolt")?.positive_percentage || 0),
      }
    })

    return NextResponse.json(sentimentTrendData)
  } catch (error) {
    console.error('Error in sentiment-trend-comparison API route:', error)
    // Fallback data
    return NextResponse.json([
      { month: "Jan", faras: 65, uber: 55, little: 45, bolt: 60 },
      { month: "Feb", faras: 68, uber: 56, little: 46, bolt: 62 },
      { month: "Mar", faras: 70, uber: 58, little: 48, bolt: 63 },
      { month: "Apr", faras: 72, uber: 60, little: 50, bolt: 65 },
      { month: "May", faras: 75, uber: 62, little: 52, bolt: 66 },
      { month: "Jun", faras: 78, uber: 63, little: 53, bolt: 68 },
      { month: "Jul", faras: 80, uber: 65, little: 55, bolt: 70 },
      { month: "Aug", faras: 82, uber: 67, little: 57, bolt: 72 },
      { month: "Sep", faras: 85, uber: 68, little: 58, bolt: 73 },
      { month: "Oct", faras: 87, uber: 70, little: 60, bolt: 75 },
      { month: "Nov", faras: 90, uber: 72, little: 62, bolt: 77 },
      { month: "Dec", faras: 92, uber: 74, little: 64, bolt: 79 },
    ])
  }
} 
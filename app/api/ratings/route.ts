import { NextResponse } from 'next/server'
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const data = await sql.query(`
      SELECT 
        company,
        ROUND(AVG(rating), 1) AS rating
      FROM reviews
      GROUP BY company
      ORDER BY rating DESC;
    `)

    // Calculate market share percentages
    const totalMarket = 969.16 + 3.43 + 128.52 + 1.18

    // Create market share data with real ratings
    const ratingsData = [
      {
        name: "Uber",
        share: (969.16 / totalMarket) * 100,
        color: "#3B82F6",
        rating: Number(data.find((item) => item.company === "uber")?.rating || 4.2),
      },
      {
        name: "Faras",
        share: (3.43 / totalMarket) * 100,
        color: "#10B981",
        rating: Number(data.find((item) => item.company === "faras")?.rating || 4.5),
      },
      {
        name: "Little",
        share: (128.52 / totalMarket) * 100,
        color: "#F59E0B",
        rating: Number(data.find((item) => item.company === "little")?.rating || 4.0),
      },
      {
        name: "Bolt",
        share: (1.18 / totalMarket) * 100,
        color: "#8B5CF6",
        rating: Number(data.find((item) => item.company === "bolt")?.rating || 3.8),
      },
    ]

    return NextResponse.json(ratingsData)
  } catch (error) {
    console.error('Error in ratings API route:', error)
    // Fallback to default market share data
    const totalMarket = 969.16 + 3.43 + 128.52 + 1.18
    return NextResponse.json([
      {
        name: "Uber",
        share: (969.16 / totalMarket) * 100,
        color: "#3B82F6",
        rating: 4.2,
      },
      {
        name: "Faras",
        share: (3.43 / totalMarket) * 100,
        color: "#10B981",
        rating: 4.5,
      },
      {
        name: "Little",
        share: (128.52 / totalMarket) * 100,
        color: "#F59E0B",
        rating: 4.0,
      },
      {
        name: "Bolt",
        share: (1.18 / totalMarket) * 100,
        color: "#8B5CF6",
        rating: 3.8,
      },
    ])
  }
} 
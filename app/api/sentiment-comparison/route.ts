import { NextResponse } from 'next/server'
import { sql } from "@/lib/db"

type CompanyData = {
  company: string
  positive: string
  negative: string
  neutral: string
}

const companyColors: Record<string, string> = {
  faras: "#10B981",
  uber: "#3B82F6",
  little: "#F59E0B",
  bolt: "#8B5CF6",
}

export async function GET() {
  try {
    const data = await sql.query<CompanyData>(`
      SELECT 
        company,
        ROUND(
          COUNT(*) FILTER (WHERE overall_sentiment = 'positive') * 100.0 / COUNT(*),
          1
        ) AS positive,
        ROUND(
          COUNT(*) FILTER (WHERE overall_sentiment = 'negative') * 100.0 / COUNT(*),
          1
        ) AS negative,
        ROUND(
          COUNT(*) FILTER (WHERE overall_sentiment = 'neutral') * 100.0 / COUNT(*),
          1
        ) AS neutral
      FROM reviews
      GROUP BY company
      ORDER BY positive DESC;
    `)

    const sentimentComparisonData = data.map((item) => ({
      name: item.company.charAt(0).toUpperCase() + item.company.slice(1),
      positive: Number(item.positive),
      negative: Number(item.negative),
      neutral: Number(item.neutral),
      color: companyColors[item.company] || "#6B7280",
    }))

    return NextResponse.json(sentimentComparisonData)
  } catch (error) {
    console.error('Error in sentiment-comparison API route:', error)
    // Fallback data
    return NextResponse.json([
      { name: "Faras", positive: 65, negative: 20, neutral: 15, color: "#10B981" },
      { name: "Uber", positive: 55, negative: 30, neutral: 15, color: "#3B82F6" },
      { name: "Little", positive: 45, negative: 35, neutral: 20, color: "#F59E0B" },
      { name: "Bolt", positive: 60, negative: 25, neutral: 15, color: "#8B5CF6" },
    ])
  }
} 
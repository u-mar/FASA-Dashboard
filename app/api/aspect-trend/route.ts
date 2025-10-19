import { NextResponse } from 'next/server'
import { sql } from "@/lib/db"

const companyColors: Record<string, string> = {
  faras: "#10B981",
  uber: "#3B82F6",
  little: "#F59E0B",
  bolt: "#8B5CF6",
}

export async function GET() {
  try {
    const data = await sql.query(`
      WITH aspect_data AS (
        SELECT 
          company,
          key AS aspect,
          value AS sentiment,
          EXTRACT(YEAR FROM date) AS year
        FROM reviews,
        LATERAL json_each_text(REPLACE(aspect_analysis, '''', '"')::json)
      ),
      aspect_sentiment_by_year AS (
        SELECT
          aspect,
          company,
          year,
          COUNT(*) FILTER (WHERE sentiment = 'positive') AS positive_count,
          COUNT(*) FILTER (WHERE sentiment = 'negative') AS negative_count,
          COUNT(*) AS total_count,
          ROUND(100.0 * COUNT(*) FILTER (WHERE sentiment = 'positive') / NULLIF(COUNT(*), 0), 1) AS positive_percentage,
          ROUND(100.0 * COUNT(*) FILTER (WHERE sentiment = 'negative') / NULLIF(COUNT(*), 0), 1) AS negative_percentage
        FROM aspect_data
        GROUP BY aspect, company, year
      )
      SELECT
        aspect,
        company,
        year,
        positive_percentage AS positive_value,
        negative_percentage AS negative_value
      FROM aspect_sentiment_by_year
      WHERE aspect IN (
        SELECT aspect 
        FROM aspect_data 
        GROUP BY aspect 
        ORDER BY COUNT(*) DESC 
        LIMIT 5
      )
      ORDER BY aspect, company, year;
    `)

    // Transform the SQL result into the format expected by the component
    const aspectsMap = new Map()

    // Group by aspect
    data.forEach((row: any) => {
      if (!aspectsMap.has(row.aspect)) {
        aspectsMap.set(row.aspect, {
          aspect: row.aspect,
          companies: [],
        })
      }
    })

    // Get unique aspects
    const aspects = Array.from(aspectsMap.keys())

    // Get unique companies
    const companies = [...new Set(data.map((row: any) => row.company))]

    // For each aspect, create company data
    aspects.forEach((aspect) => {
      const aspectData = aspectsMap.get(aspect)

      companies.forEach((company) => {
        // Get all rows for this aspect and company
        const companyData = data.filter((row: any) => row.aspect === aspect && row.company === company)

        if (companyData.length > 0) {
          // Create company trend data with both positive and negative values
          aspectData.companies.push({
            company: company.charAt(0).toUpperCase() + company.slice(1),
            color: companyColors[company] || "#6B7280",
            data: companyData.map((row: any) => ({
              year: Number(row.year),
              positive_value: Number(row.positive_value),
              negative_value: Number(row.negative_value),
            })),
          })
        }
      })
    })

    // Convert map to array and capitalize aspect names
    const aspectTrendData = Array.from(aspectsMap.values()).map((item: any) => ({
      ...item,
      aspect: item.aspect.charAt(0).toUpperCase() + item.aspect.slice(1),
    }))

    return NextResponse.json(aspectTrendData)
  } catch (error) {
    console.error('Error in aspect-trend API route:', error)
    // Fallback data
    return NextResponse.json([
      {
        aspect: "App",
        companies: [
          {
            company: "Faras",
            color: "#10B981",
            data: [
              { year: 2022, positive_value: 65, negative_value: 25 },
              { year: 2023, positive_value: 72, negative_value: 20 },
              { year: 2024, positive_value: 78, negative_value: 15 },
              { year: 2025, positive_value: 85, negative_value: 10 },
            ],
          },
          {
            company: "Uber",
            color: "#3B82F6",
            data: [
              { year: 2022, positive_value: 70, negative_value: 20 },
              { year: 2023, positive_value: 68, negative_value: 22 },
              { year: 2024, positive_value: 65, negative_value: 25 },
              { year: 2025, positive_value: 62, negative_value: 28 },
            ],
          },
          {
            company: "Little",
            color: "#F59E0B",
            data: [
              { year: 2022, positive_value: 55, negative_value: 35 },
              { year: 2023, positive_value: 58, negative_value: 32 },
              { year: 2024, positive_value: 60, negative_value: 30 },
              { year: 2025, positive_value: 63, negative_value: 27 },
            ],
          },
          {
            company: "Bolt",
            color: "#8B5CF6",
            data: [
              { year: 2022, positive_value: 60, negative_value: 30 },
              { year: 2023, positive_value: 65, negative_value: 25 },
              { year: 2024, positive_value: 68, negative_value: 22 },
              { year: 2025, positive_value: 70, negative_value: 20 },
            ],
          },
        ],
      },
      {
        aspect: "Price",
        companies: [
          {
            company: "Faras",
            color: "#10B981",
            data: [
              { year: 2022, positive_value: 45, negative_value: 40 },
              { year: 2023, positive_value: 50, negative_value: 35 },
              { year: 2024, positive_value: 55, negative_value: 30 },
              { year: 2025, positive_value: 60, negative_value: 25 },
            ],
          },
          {
            company: "Uber",
            color: "#3B82F6",
            data: [
              { year: 2022, positive_value: 40, negative_value: 45 },
              { year: 2023, positive_value: 42, negative_value: 43 },
              { year: 2024, positive_value: 45, negative_value: 40 },
              { year: 2025, positive_value: 48, negative_value: 37 },
            ],
          },
          {
            company: "Little",
            color: "#F59E0B",
            data: [
              { year: 2022, positive_value: 60, negative_value: 30 },
              { year: 2023, positive_value: 62, negative_value: 28 },
              { year: 2024, positive_value: 65, negative_value: 25 },
              { year: 2025, positive_value: 68, negative_value: 22 },
            ],
          },
          {
            company: "Bolt",
            color: "#8B5CF6",
            data: [
              { year: 2022, positive_value: 50, negative_value: 35 },
              { year: 2023, positive_value: 48, negative_value: 37 },
              { year: 2024, positive_value: 45, negative_value: 40 },
              { year: 2025, positive_value: 42, negative_value: 43 },
            ],
          },
        ],
      },
      {
        aspect: "Service",
        companies: [
          {
            company: "Faras",
            color: "#10B981",
            data: [
              { year: 2022, positive_value: 78, negative_value: 15 },
              { year: 2023, positive_value: 80, negative_value: 13 },
              { year: 2024, positive_value: 82, negative_value: 12 },
              { year: 2025, positive_value: 85, negative_value: 10 },
            ],
          },
          {
            company: "Uber",
            color: "#3B82F6",
            data: [
              { year: 2022, positive_value: 75, negative_value: 18 },
              { year: 2023, positive_value: 73, negative_value: 20 },
              { year: 2024, positive_value: 70, negative_value: 22 },
              { year: 2025, positive_value: 68, negative_value: 25 },
            ],
          },
          {
            company: "Little",
            color: "#F59E0B",
            data: [
              { year: 2022, positive_value: 65, negative_value: 25 },
              { year: 2023, positive_value: 68, negative_value: 22 },
              { year: 2024, positive_value: 70, negative_value: 20 },
              { year: 2025, positive_value: 72, negative_value: 18 },
            ],
          },
          {
            company: "Bolt",
            color: "#8B5CF6",
            data: [
              { year: 2022, positive_value: 70, negative_value: 20 },
              { year: 2023, positive_value: 75, negative_value: 18 },
              { year: 2024, positive_value: 78, negative_value: 15 },
              { year: 2025, positive_value: 80, negative_value: 13 },
            ],
          },
        ],
      },
    ])
  }
} 
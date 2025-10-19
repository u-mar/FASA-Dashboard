import { NextResponse } from 'next/server'
import { sql } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const fromYear = searchParams.get('from_year') || '2024'
    const toYear = searchParams.get('to_year') || '2025'

    const data = await sql.query(
      `
      WITH aspect_data AS (
        SELECT 
          key AS aspect,
          value AS sentiment,
          date
        FROM reviews,
        LATERAL json_each_text(REPLACE(aspect_analysis, '''', '"')::json)
        WHERE company = 'faras'
      ),
      sentiment_summary AS (
        SELECT
          aspect,
          EXTRACT(YEAR FROM date) AS year,
          COUNT(*) AS total_mentions,
          COUNT(CASE WHEN sentiment = 'positive' THEN 1 END) AS positive_mentions
        FROM aspect_data
        GROUP BY aspect, EXTRACT(YEAR FROM date)
        HAVING aspect IN (
          SELECT aspect 
          FROM aspect_data 
          WHERE EXTRACT(YEAR FROM date) IN ($1, $2)
          GROUP BY aspect 
          HAVING COUNT(DISTINCT EXTRACT(YEAR FROM date)) = 2
        )
      ),
      sentiment_rate AS (
        SELECT
          aspect,
          year,
          ROUND((100.0 * positive_mentions::FLOAT / total_mentions)::NUMERIC, 2) AS positive_rate
        FROM sentiment_summary
      )
      SELECT 
        curr.aspect,
        curr.positive_rate - prev.positive_rate AS rate_change,
        curr.positive_rate AS current_rate,
        prev.positive_rate AS previous_rate
      FROM sentiment_rate curr
      JOIN sentiment_rate prev
        ON curr.aspect = prev.aspect AND curr.year = $2 AND prev.year = $1
      ORDER BY rate_change DESC;
      `,
      [fromYear, toYear]
    )

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in aspect-changes API route:', error)
    return NextResponse.json({ error: 'Failed to fetch aspect changes data' }, { status: 500 })
  }
} 
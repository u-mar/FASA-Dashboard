import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { generateComprehensiveInsights } from '@/lib/ai-engine';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year') || new Date().getFullYear().toString();

    // Fetch all necessary data for AI analysis
    const [
      sentimentTrendData,
      churnRateData,
      responseRateData,
      aspectsData,
      competitorMetricsData,
      aspectChangesData
    ] = await Promise.all([
      // Sentiment trend
      sql`
        SELECT 
          EXTRACT(YEAR FROM date) AS year,
          CAST(COUNT(CASE WHEN overall_sentiment = 'positive' THEN 1 END) AS INT) AS positive,
          CAST(COUNT(CASE WHEN overall_sentiment = 'negative' THEN 1 END) AS INT) AS negative,
          CAST(COUNT(CASE WHEN overall_sentiment = 'neutral'  THEN 1 END) AS INT) AS neutral
        FROM reviews
        WHERE company = 'faras'
        GROUP BY EXTRACT(YEAR FROM date)
        ORDER BY year
      `,
      
      // Churn rate
      sql`
        SELECT 
          ROUND(
            COUNT(*) FILTER (WHERE churn_risk = 'high') * 100.0 / 
            COUNT(*), 
            2
          ) AS churn_rate 
        FROM reviews
        WHERE company = 'faras'
        AND EXTRACT(YEAR FROM date) = ${year}
      `,
      
      // Response rate
      sql`
        SELECT 
          ROUND(
            COUNT(*) FILTER (WHERE response = 'True') * 100.0 / 
            COUNT(*), 
            2
          ) AS response_rate 
        FROM reviews
        WHERE sourcee != 'app_store'
        AND EXTRACT(YEAR FROM date) = ${year}
      `,
      
      // Aspects volume
      sql`
        SELECT 
          aspect,
          CAST(COUNT(CASE WHEN sentiment = 'positive' THEN 1 END) AS INT) AS positive,
          CAST(COUNT(CASE WHEN sentiment = 'negative' THEN 1 END) AS INT) AS negative,
          CAST(COUNT(CASE WHEN sentiment = 'neutral'  THEN 1 END) AS INT) AS neutral
        FROM (
          SELECT 
            key AS aspect,
            value AS sentiment
          FROM reviews,
          LATERAL json_each_text(REPLACE(aspect_analysis, '''', '"')::json)
          WHERE company = 'faras'
          AND EXTRACT(YEAR FROM date) = ${year}
        ) AS unpacked
        GROUP BY aspect
        ORDER BY aspect
      `,
      
      // Competitor metrics (churn rate comparison)
      sql`
        SELECT 
          company,
          ROUND(
            COUNT(*) FILTER (WHERE LOWER(churn_risk) = 'high') * 100.0 / COUNT(*),
            2
          ) AS value
        FROM reviews
        WHERE EXTRACT(YEAR FROM date) = ${year}
        GROUP BY company
        ORDER BY value DESC
      `,
      
      // Aspect changes (year over year)
      sql`
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
            WHERE EXTRACT(YEAR FROM date) IN (${year}::int - 1, ${year}::int)
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
          ON curr.aspect = prev.aspect 
          AND curr.year = ${year}::int 
          AND prev.year = ${year}::int - 1
        ORDER BY rate_change DESC
      `
    ]);

    // Convert SQL results to arrays (sql returns arrays directly, not {rows: []})
    const sentimentTrendArray = Array.isArray(sentimentTrendData) ? sentimentTrendData : [];
    const churnRateArray = Array.isArray(churnRateData) ? churnRateData : [];
    const responseRateArray = Array.isArray(responseRateData) ? responseRateData : [];
    const aspectsArray = Array.isArray(aspectsData) ? aspectsData : [];
    const competitorMetricsArray = Array.isArray(competitorMetricsData) ? competitorMetricsData : [];
    const aspectChangesArray = Array.isArray(aspectChangesData) ? aspectChangesData : [];

    // Prepare data for AI engine
    const aiInputData = {
      sentimentTrend: sentimentTrendArray,
      churnRate: Number(churnRateArray[0]?.churn_rate) || 0,
      responseRate: Number(responseRateArray[0]?.response_rate) || 0,
      aspects: aspectsArray,
      competitorMetrics: competitorMetricsArray,
      aspectChanges: aspectChangesArray
    };

    // Generate AI insights
    const { insights, predictions, recommendations } = generateComprehensiveInsights(aiInputData);

    return NextResponse.json({
      insights,
      predictions,
      recommendations,
      metadata: {
        year,
        generatedAt: new Date().toISOString(),
        dataPoints: {
          sentimentTrend: sentimentTrendArray.length,
          aspects: aspectsArray.length,
          competitors: competitorMetricsArray.length
        }
      }
    });

  } catch (error) {
    console.error('Error generating AI insights:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI insights' },
      { status: 500 }
    );
  }
}

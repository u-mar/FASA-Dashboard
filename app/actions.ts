"use server"

import { sql } from "@/lib/db"

// Types for our data
export type SentimentTrendData = {
  year: string
  positive: number
  negative: number
  neutral: number
}

export type OverallSentimentData = {
  overall_sentiment: string
  total: number
}

export type AspectMetricsData = {
  aspectCount: number
  sourceCount: number
}

export type SourcesVolumeData = {
  sourcee: string
  volume: number
}

export type SourcesSentimentData = {
  sourcee: string
  positive: number
  negative: number
  neutral: number
}

export type AspectsVolumeData = {
  aspect: string
  positive: number
  negative: number
  neutral: number
}

export type EmotionAspectData = {
  anger: number
  annoyance: number
  aspect: string
  strength: number
}
export type EmotionData = {
  emotion: string
  total: number
}

// Add this type to your existing types
export type AspectChangeData = {
  aspect: string
  rate_change: number
  current_rate: number
  previous_rate: number
}

// Add this type for the aspect trend data
export type AspectTrendPoint = {
  year: number
  percentage: number
}

export type AspectTrend = {
  aspect: string
  data: AspectTrendPoint[]
}

// Add types for churn and response rate data
export type ChurnRateData = {
  churn_rate: number
}

export type ResponseRateData = {
  response_rate: number
}

export type ChurnTrendData = {
  year: number
  churn_rate_percent: number
}

// Add this type for response trend data
export type ResponseTrendData = {
  year: number
  response_rate_percent: number
}

// Add these types to your existing types in actions.ts

// Competitor data types
export type CompetitorMarketShareData = {
  name: string
  share: number
  color: string
  rating?: number
}

export type CompetitorPositioningData = {
  name: string
  price: number
  quality: number
  size: number
}

export type CompetitorSentimentData = {
  name: string
  positive: number
  negative: number
  neutral: number
  color: string
}

export type CompetitorAspectSentimentData = {
  aspect: string
  faras: number
  competitor1: number
  competitor2: number
  competitor3: number
}

export type CompetitorTrendData = {
  month: string
  faras: number
  competitor1: number
  competitor2: number
  competitor3: number
}

export type CompetitorChurnTrendData = {
  year: number
  faras: number
  competitor1: number
  competitor2: number
  competitor3: number
}

export type CompetitorResponseTrendData = {
  year: number
  faras: number
  competitor1: number
  competitor2: number
  competitor3: number
}

// Add this type for aspect sentiment trend data
export interface AspectTrendPointValue {
  year: number
  value: number
}

export interface CompanyAspectTrend {
  company: string
  color: string
  data: AspectTrendPointValue[]
}

export interface AspectData {
  aspect: string
  companies: CompanyAspectTrend[]
}

// Add this to the CompetitorData interface
export type CompetitorData = {
  marketShare: CompetitorMarketShareData[]
  positioning: CompetitorPositioningData[]
  sentiment: CompetitorSentimentData[]
  aspectSentiment: CompetitorAspectSentimentData[]
  trends: CompetitorTrendData[]
  churnTrends: CompetitorChurnTrendData[]
  responseTrends: CompetitorResponseTrendData[]
  aspectTrends: AspectData[] // Add this line
}

// Add this type for competitor feature comparison
export type CompetitorFeatureData = {
  category: string
  feature: string
  faras: boolean
  competitor1: boolean
  competitor2: boolean
  competitor3: boolean
}

// Function to execute your custom SQL queries
export async function executeQuery(query: string, params: any[] = []) {
  try {
    // Convert conventional query to tagged template literal
    // This is a workaround since we can't directly use tagged templates with dynamic strings
    const result = await sql.query(query, params)
    return result as any[]
  } catch (error) {
    console.error("Database query error:", error)
    throw new Error("Failed to execute database query")
  }
}

// Example functions for each chart - replace these with your actual queries
// Update getSentimentTrend to filter for Faras only
export async function getSentimentTrend(): Promise<SentimentTrendData[]> {
  const query = `
  SELECT 
  EXTRACT(YEAR FROM date) AS year,
  CAST(COUNT(CASE WHEN overall_sentiment = 'positive' THEN 1 END) AS INT) AS positive,
  CAST(COUNT(CASE WHEN overall_sentiment = 'negative' THEN 1 END) AS INT) AS negative,
  CAST(COUNT(CASE WHEN overall_sentiment = 'neutral'  THEN 1 END) AS INT) AS neutral
FROM reviews
WHERE company = 'faras'
GROUP BY EXTRACT(YEAR FROM date)
ORDER BY year;
  `

  const result = await sql.query(query)
  return result as SentimentTrendData[]
}

// Update getOverallSentiment to filter for Faras only
export async function getOverallSentiment(): Promise<OverallSentimentData[]> {
  const query = `
  select overall_sentiment,CAST(COUNT(*) AS INT) AS total
  from reviews
  where company = 'faras'
  group by overall_sentiment;
  `

  const result = await sql.query(query)
  return result as OverallSentimentData[]
}

// Add similar functions for other data needs
export async function getAspectMetrics(): Promise<AspectMetricsData> {
  // Replace with your actual SQL query
  const query = `
    -- Your aspect metrics SQL query here
  `

  // For now, return sample data
  return { aspectCount: 9, sourceCount: 4 }

  // Uncomment this when your query is ready
  // const result = await executeQuery(query);
  // return result[0] as AspectMetricsData;
}

// Update getSourcesVolume to filter for Faras only
export async function getSourcesVolume(): Promise<SourcesVolumeData[]> {
  const query = `
  select sourcee,count(*) as volume
  from reviews
  where company = 'faras'
  group by sourcee;
  `

  try {
    const result = await sql.query(query)
    return result as SourcesVolumeData[]
  } catch (error) {
    console.error("Database query error:", error)
    // Return sample data as fallback
    return [
      { source: "Twitter", volume: 4500 },
      { source: "Facebook", volume: 1200 },
      { source: "Instagram", volume: 800 },
      { source: "Review Sites", volume: 400 },
      { source: "News", volume: 200 },
    ]
  }
}

// Update getSourcesSentiment to filter for Faras only
export async function getSourcesSentiment(): Promise<SourcesSentimentData[]> {
  const query = `
  SELECT 
  sourcee, 
  CAST(COUNT(CASE WHEN overall_sentiment = 'positive' THEN 1 END) AS INT) AS positive,
  CAST(COUNT(CASE WHEN overall_sentiment = 'negative' THEN 1 END) AS INT) AS negative,
  CAST(COUNT(CASE WHEN overall_sentiment = 'neutral'  THEN 1 END) AS INT) AS neutral
FROM reviews
WHERE company = 'faras'
GROUP BY sourcee;
  `

  const result = await sql.query(query)
  return result as SourcesSentimentData[]
}

// Update getAspectsVolume to filter for Faras only
export async function getAspectsVolume(): Promise<AspectsVolumeData[]> {
  const query = `
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
) AS unpacked
GROUP BY aspect
ORDER BY aspect;
  `

  const result = await sql.query(query)
  return result as AspectsVolumeData[]
}

// Update getEmotionAspectCooccurrence to filter for Faras only
export async function getEmotionAspectCooccurrence(): Promise<EmotionAspectData[]> {
  const query = `
  SELECT 
  aspect,
  CAST(COUNT(CASE WHEN overall_emotion = 'anger' THEN 1 END) AS INT) AS anger,
  CAST(COUNT(CASE WHEN overall_emotion = 'annoyance' THEN 1 END) AS INT) AS annoyance,
  CAST(COUNT(CASE WHEN overall_emotion = 'confusion'  THEN 1 END) AS INT) AS confusion,
  CAST(COUNT(CASE WHEN overall_emotion = 'curiosity'  THEN 1 END) AS INT) AS curiosity,
  CAST(COUNT(CASE WHEN overall_emotion = 'disappointment'  THEN 1 END) AS INT) AS disappointment,
  CAST(COUNT(CASE WHEN overall_emotion = 'neutral'  THEN 1 END) AS INT) AS neutral,
  CAST(COUNT(CASE WHEN overall_emotion = 'gratitude'  THEN 1 END) AS INT) AS gratitude
FROM (
  SELECT 
    key AS aspect,
    overall_emotion
  FROM reviews,
  LATERAL json_each_text(REPLACE(aspect_analysis, '''', '"')::json)
  WHERE company = 'faras'
) AS unpacked
GROUP BY aspect
ORDER BY aspect;
  `

  const result = await sql.query(query)
  return result as EmotionAspectData[]
}

// Update getEmotionsData to filter for Faras only
export async function getEmotionsData(): Promise<EmotionData[]> {
  const query = `
    select overall_emotion as emotion, count(*) as total
    from reviews
    where company = 'faras'
    group by overall_emotion;
  `

  const result = await sql.query(query)
  return result as EmotionData[]
}

// Add this function to your existing functions
// Update getAspectChanges to filter for Faras only
export async function getAspectChanges(): Promise<AspectChangeData[]> {
  const query = `
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
    ON curr.aspect = prev.aspect AND curr.year = 2025 AND prev.year = 2022
  ORDER BY rate_change DESC;
  `

  try {
    const result = await sql.query(query)
    return result as AspectChangeData[]
  } catch (error) {
    console.error("Error fetching aspect changes:", error)
    return []
  }
}

// Add this function to fetch aspect trend data
// Update getAspectTrends to filter for Faras only
export async function getAspectTrends(): Promise<AspectTrend[]> {
  const query = `
  WITH sentiment_data AS (
  SELECT 
    key AS aspect,
    EXTRACT(YEAR FROM date) AS year,
    value AS sentiment
  FROM reviews,
    LATERAL json_each_text(REPLACE(aspect_analysis, '''', '"')::json)
  WHERE company = 'faras'
),
sentiment_summary AS (
  SELECT 
    year,
    aspect,
    COUNT(*) FILTER (WHERE sentiment = 'positive') AS pos,
    COUNT(*) FILTER (WHERE sentiment = 'negative') AS neg,
    COUNT(*) FILTER (WHERE sentiment = 'neutral') AS neu
  FROM sentiment_data
  GROUP BY year, aspect
),
percentages AS (
  SELECT 
    year,
    aspect,
    ROUND(100.0 * pos / NULLIF(pos + neg + neu, 0), 2) AS percentage
  FROM sentiment_summary
)
SELECT
  year,
  COALESCE(MAX(CASE WHEN aspect = 'accuracy' THEN percentage END), 0) AS accuracy,
  COALESCE(MAX(CASE WHEN aspect = 'app' THEN percentage END), 0) AS app,
  COALESCE(MAX(CASE WHEN aspect = 'customer support' THEN percentage END), 0) AS customer_support,
  COALESCE(MAX(CASE WHEN aspect = 'driver' THEN percentage END), 0) AS driver,
  COALESCE(MAX(CASE WHEN aspect = 'payment' THEN percentage END), 0) AS payment,
  COALESCE(MAX(CASE WHEN aspect = 'price' THEN percentage END), 0) AS price,
  COALESCE(MAX(CASE WHEN aspect = 'safety' THEN percentage END), 0) AS safety,
  COALESCE(MAX(CASE WHEN aspect = 'service' THEN percentage END), 0) AS service,
  COALESCE(MAX(CASE WHEN aspect = 'waiting time' THEN percentage END), 0) AS waiting_time
FROM percentages
GROUP BY year
ORDER BY year;
  `

  try {
    const result = await sql.query(query)

    // Transform the SQL result into the AspectTrend format
    // The SQL returns data in a pivoted format with columns for each aspect
    const aspectTrends: AspectTrend[] = []

    if (result && result.length > 0) {
      // Get all column names except 'year'
      const aspectNames = Object.keys(result[0]).filter((key) => key !== "year")

      // For each aspect, create an AspectTrend object
      aspectNames.forEach((aspectName) => {
        const formattedAspectName = aspectName.replace(/_/g, " ")

        const data = result.map((row) => ({
          year: Number(row.year),
          percentage: Number(row[aspectName]),
        }))

        aspectTrends.push({
          aspect: formattedAspectName,
          data: data,
        })
      })
    }

    return aspectTrends
  } catch (error) {
    console.error("Error fetching aspect trends:", error)
    return []
  }
}

// Add functions for churn rate and response rate
export async function getChurnRate(): Promise<ChurnRateData> {
  const query = `
  SELECT 
    ROUND(
        COUNT(*) FILTER (WHERE churn_risk = 'high') * 100.0 / 
        COUNT(*), 
        2
    ) AS churn_rate 
  FROM reviews
  where company = 'faras';
  `

  try {
    const result = await sql.query(query)
    console.log(result)
    return result[0] as ChurnRateData
  } catch (error) {
    console.error("Error fetching churn rate:", error)
    // Return fallback data
    return { churn_rate: 23 }
  }
}

export async function getResponseRate(): Promise<ResponseRateData> {
  const query = `
  SELECT 
    ROUND(
        COUNT(*) FILTER (WHERE response = 'True') * 100.0 / 
        COUNT(*), 
        2
    ) AS response_rate 
  FROM reviews
  where sourcee != 'app_store';
  `

  try {
    const result = await sql.query(query)
    console.log(result)
    return result[0] as ResponseRateData
  } catch (error) {
    console.error("Error fetching response rate:", error)
    // Return fallback data
    return { response_rate: 78 }
  }
}

export async function getChurnTrend(): Promise<ChurnTrendData[]> {
  const query = `
  SELECT 
    EXTRACT(YEAR FROM date) AS year,
    ROUND(
      100.0 * AVG(CASE churn_risk
                    WHEN 'high' THEN 1
                    WHEN 'low' THEN 0
                 END), 
      2
    ) AS churn_rate_percent
  FROM reviews
  where company = 'faras'
  GROUP BY EXTRACT(YEAR FROM date)
  ORDER BY year;
  `

  try {
    const result = await sql.query(query)
    return result as ChurnTrendData[]
  } catch (error) {
    console.error("Error fetching churn trend:", error)
    // Return fallback data
    return [
      { year: 2022, churn_rate_percent: 18.5 },
      { year: 2023, churn_rate_percent: 20.2 },
      { year: 2024, churn_rate_percent: 21.8 },
      { year: 2025, churn_rate_percent: 23.0 },
    ]
  }
}

// Add this function to fetch response trend data
export async function getResponseTrend(): Promise<ResponseTrendData[]> {
  const query = `
  SELECT 
    EXTRACT(YEAR FROM date) AS year,
    ROUND(
      100.0 * AVG(CASE response
                    WHEN 'True' THEN 1
                    WHEN 'False' THEN 0
                 END), 
      2
    ) AS response_rate_percent
  FROM reviews
  where sourcee != 'app_store'
  GROUP BY EXTRACT(YEAR FROM date)
  ORDER BY year;
  `

  try {
    const result = await sql.query(query)
    return result as ResponseTrendData[]
  } catch (error) {
    console.error("Error fetching response trend:", error)
    // Return fallback data
    return [
      { year: 2022, response_rate_percent: 72.5 },
      { year: 2023, response_rate_percent: 75.2 },
      { year: 2024, response_rate_percent: 77.8 },
      { year: 2025, response_rate_percent: 78.0 },
    ]
  }
}

// Add this function to fetch competitor data
// Replace the existing getCompetitorData function with this updated version
export async function getCompetitorData(): Promise<CompetitorData> {
  // Calculate market share percentages from the provided values
  // Total market: 969.16M + 3.43M + 128.52M + 1.18M = 1,102.29M
  const totalMarket = 969.16 + 3.43 + 128.52 + 1.18

  // Market share data with real values
  const marketShare: CompetitorMarketShareData[] = [
    {
      name: "Uber",
      share: (969.16 / totalMarket) * 100,
      color: "#3B82F6",
      rating: 4.2, // Sample rating
    },
    {
      name: "Faras",
      share: (3.43 / totalMarket) * 100,
      color: "#10B981",
      rating: 4.5, // Sample rating
    },
    {
      name: "Little",
      share: (128.52 / totalMarket) * 100,
      color: "#F59E0B",
      rating: 4.0, // Sample rating
    },
    {
      name: "Bolt",
      share: (1.18 / totalMarket) * 100,
      color: "#8B5CF6",
      rating: 3.8, // Sample rating
    },
  ]

  // Sample positioning data - this would typically come from a different source
  // or be calculated from other metrics
  const positioning: CompetitorPositioningData[] = [
    { name: "Faras", price: 7, quality: 8, size: 100 },
    { name: "Uber", price: 8, quality: 7, size: 80 },
    { name: "Little", price: 6, quality: 6, size: 70 },
    { name: "Bolt", price: 9, quality: 9, size: 60 },
  ]

  // Sample sentiment data
  const sentiment: CompetitorSentimentData[] = [
    { name: "Faras", positive: 65, negative: 20, neutral: 15, color: "#10B981" },
    { name: "Uber", positive: 55, negative: 30, neutral: 15, color: "#3B82F6" },
    { name: "Little", positive: 45, negative: 35, neutral: 20, color: "#F59E0B" },
    { name: "Bolt", positive: 60, negative: 25, neutral: 15, color: "#8B5CF6" },
  ]

  // Sample aspect sentiment data
  const aspectSentiment: CompetitorAspectSentimentData[] = [
    { aspect: "App", faras: 85, competitor1: 70, competitor2: 65, competitor3: 75 },
    { aspect: "Price", faras: 75, competitor1: 80, competitor2: 85, competitor3: 65 },
    { aspect: "Service", faras: 80, competitor1: 75, competitor2: 70, competitor3: 85 },
    { aspect: "Support", faras: 70, competitor1: 65, competitor2: 60, competitor3: 80 },
    { aspect: "Quality", faras: 85, competitor1: 80, competitor2: 75, competitor3: 90 },
  ]

  // Sample trend data
  const trends: CompetitorTrendData[] = [
    { month: "Jaan", faras: 65, competitor1: 55, competitor2: 45, competitor3: 60 },
    { month: "Feb", faras: 68, competitor1: 56, competitor2: 46, competitor3: 62 },
    { month: "Mar", faras: 70, competitor1: 58, competitor2: 48, competitor3: 63 },
    { month: "Apr", faras: 72, competitor1: 60, competitor2: 50, competitor3: 65 },
    { month: "May", faras: 75, competitor1: 62, competitor2: 52, competitor3: 66 },
    { month: "Jun", faras: 78, competitor1: 63, competitor2: 53, competitor3: 68 },
    { month: "Jul", faras: 80, competitor1: 65, competitor2: 55, competitor3: 70 },
    { month: "Aug", faras: 82, competitor1: 67, competitor2: 57, competitor3: 72 },
    { month: "Sep", faras: 85, competitor1: 68, competitor2: 58, competitor3: 73 },
    { month: "Oct", faras: 87, competitor1: 70, competitor2: 60, competitor3: 75 },
    { month: "Nov", faras: 90, competitor1: 72, competitor2: 62, competitor3: 77 },
    { month: "Dec", faras: 92, competitor1: 74, competitor2: 64, competitor3: 79 },
  ]

  // Fetch real churn rate data per company
  let churnRateData: { company: string; churn_rate: number }[] = []
  try {
    const query = `
      SELECT 
        company,
        ROUND(
          COUNT(*) FILTER (WHERE LOWER(churn_risk) = 'high') * 100.0 / COUNT(*),
          2
        ) AS churn_rate
      FROM reviews
      GROUP BY company
      ORDER BY churn_rate DESC;
    `
    churnRateData = await sql.query(query)
    console.log("Churn rate data:", churnRateData)
  } catch (error) {
    console.error("Error fetching churn rate data:", error)
    // Fallback to sample data if query fails
    churnRateData = [
      { company: "little", churn_rate: 30.5 },
      { company: "uber", churn_rate: 27.8 },
      { company: "bolt", churn_rate: 24.7 },
      { company: "faras", churn_rate: 23.0 },
    ]
  }

  // Fetch real response rate data per company
  let responseRateData: { company: string; response_rate: number }[] = []
  try {
    const query = `
      SELECT 
        company,
        ROUND(
          COUNT(*) FILTER (WHERE response = 'True') * 100.0 / COUNT(*),
          2
        ) AS response_rate
      FROM reviews
      GROUP BY company
      ORDER BY response_rate DESC;
    `
    responseRateData = await sql.query(query)
    console.log("Response rate data:", responseRateData)
  } catch (error) {
    console.error("Error fetching response rate data:", error)
    // Fallback to sample data if query fails
    responseRateData = [
      { company: "faras", response_rate: 78.0 },
      { company: "bolt", response_rate: 73.9 },
      { company: "uber", response_rate: 71.5 },
      { company: "little", response_rate: 64.2 },
    ]
  }

  // Fetch real churn trend data per company per year
  let churnTrendRawData: { company: string; year: number; churn_rate_percent: number }[] = []
  try {
    const query = `
      SELECT 
        company,
        EXTRACT(YEAR FROM date) AS year,
        ROUND(
          100.0 * AVG(CASE LOWER(churn_risk)
                        WHEN 'high' THEN 1
                        WHEN 'low' THEN 0
                     END),
          2
        ) AS churn_rate_percent
      FROM reviews
      GROUP BY company, EXTRACT(YEAR FROM date)
      ORDER BY company, year;
    `
    churnTrendRawData = await sql.query(query)
    console.log("Churn trend data:", churnTrendRawData)
  } catch (error) {
    console.error("Error fetching churn trend data:", error)
    // We'll use the fallback data below if this fails
  }

  // Fetch real response trend data per company per year
  let responseTrendRawData: { company: string; year: number; response_rate_percent: number }[] = []
  try {
    const query = `
    SELECT 
  company,
  EXTRACT(YEAR FROM date) AS year,
  ROUND(
    100.0 * AVG(CAST(
      CASE response
        WHEN 'True' THEN 1
        WHEN 'False' THEN 0
      END AS INT)
    ),
    2
  ) AS response_rate_percent
FROM reviews
GROUP BY company, EXTRACT(YEAR FROM date)
ORDER BY company, year;

    `
    responseTrendRawData = await sql.query(query)
    console.log("Response trend data:", responseTrendRawData)
  } catch (error) {
    console.error("Error fetching response trend data:", error)
    // We'll use the fallback data below if this fails
  }

  // Process churn trend data into the format expected by the component
  let churnTrends: CompetitorChurnTrendData[] = []
  if (churnTrendRawData.length > 0) {
    // Get unique years
    const years = [...new Set(churnTrendRawData.map((item) => item.year))].sort()

    // Create a data point for each year
    churnTrends = years.map((year) => {
      const yearData = churnTrendRawData.filter((item) => item.year === year)
      return {
        year: year,
        faras: yearData.find((item) => item.company === "faras")?.churn_rate_percent || 0,
        competitor1: yearData.find((item) => item.company === "uber")?.churn_rate_percent || 0,
        competitor2: yearData.find((item) => item.company === "little")?.churn_rate_percent || 0,
        competitor3: yearData.find((item) => item.company === "bolt")?.churn_rate_percent || 0,
      }
    })
  } else {
    // Fallback to sample data
    churnTrends = [
      { year: 2022, faras: 18.5, competitor1: 22.3, competitor2: 25.1, competitor3: 19.8 },
      { year: 2023, faras: 20.2, competitor1: 24.5, competitor2: 27.2, competitor3: 21.5 },
      { year: 2024, faras: 21.8, competitor1: 26.1, competitor2: 28.9, competitor3: 23.2 },
      { year: 2025, faras: 23.0, competitor1: 27.8, competitor2: 30.5, competitor3: 24.7 },
    ]
  }

  // Process response trend data into the format expected by the component
  let responseTrends: CompetitorResponseTrendData[] = []
  if (responseTrendRawData.length > 0) {
    // Get unique years
    const years = [...new Set(responseTrendRawData.map((item) => item.year))].sort()

    // Create a data point for each year
    responseTrends = years.map((year) => {
      const yearData = responseTrendRawData.filter((item) => item.year === year)
      return {
        year: year,
        faras: yearData.find((item) => item.company === "faras")?.response_rate_percent || 0,
        competitor1: yearData.find((item) => item.company === "uber")?.response_rate_percent || 0,
        competitor2: yearData.find((item) => item.company === "little")?.response_rate_percent || 0,
        competitor3: yearData.find((item) => item.company === "bolt")?.response_rate_percent || 0,
      }
    })
  } else {
    // Fallback to sample data
    responseTrends = [
      { year: 2022, faras: 72.5, competitor1: 65.2, competitor2: 58.7, competitor3: 68.3 },
      { year: 2023, faras: 75.2, competitor1: 67.8, competitor2: 60.5, competitor3: 70.1 },
      { year: 2024, faras: 77.8, competitor1: 70.3, competitor2: 62.8, competitor3: 72.6 },
      { year: 2025, faras: 78.0, competitor1: 71.5, competitor2: 64.2, competitor3: 73.9 },
    ]
  }

  // Sample aspect trend data
  const aspectTrends: AspectData[] = [
    {
      aspect: "app",
      companies: [
        {
          company: "Faras",
          color: "#10B981",
          data: [
            { year: 2022, value: 65 },
            { year: 2023, value: 72 },
            { year: 2024, value: 78 },
            { year: 2025, value: 85 },
          ],
        },
        {
          company: "Uber",
          color: "#3B82F6",
          data: [
            { year: 2022, value: 70 },
            { year: 2023, value: 68 },
            { year: 2024, value: 65 },
            { year: 2025, value: 62 },
          ],
        },
        {
          company: "Little",
          color: "#F59E0B",
          data: [
            { year: 2022, value: 55 },
            { year: 2023, value: 58 },
            { year: 2024, value: 60 },
            { year: 2025, value: 63 },
          ],
        },
        {
          company: "Bolt",
          color: "#8B5CF6",
          data: [
            { year: 2022, value: 60 },
            { year: 2023, value: 65 },
            { year: 2024, value: 68 },
            { year: 2025, value: 70 },
          ],
        },
      ],
    },
    {
      aspect: "price",
      companies: [
        {
          company: "Faras",
          color: "#10B981",
          data: [
            { year: 2022, value: 45 },
            { year: 2023, value: 50 },
            { year: 2024, value: 55 },
            { year: 2025, value: 60 },
          ],
        },
        {
          company: "Uber",
          color: "#3B82F6",
          data: [
            { year: 2022, value: 40 },
            { year: 2023, value: 42 },
            { year: 2024, value: 45 },
            { year: 2025, value: 48 },
          ],
        },
        {
          company: "Little",
          color: "#F59E0B",
          data: [
            { year: 2022, value: 60 },
            { year: 2023, value: 62 },
            { year: 2024, value: 65 },
            { year: 2025, value: 68 },
          ],
        },
        {
          company: "Bolt",
          color: "#8B5CF6",
          data: [
            { year: 2022, value: 50 },
            { year: 2023, value: 48 },
            { year: 2024, value: 45 },
            { year: 2025, value: 42 },
          ],
        },
      ],
    },
    {
      aspect: "service",
      companies: [
        {
          company: "Faras",
          color: "#10B981",
          data: [
            { year: 2022, value: 78 },
            { year: 2023, value: 80 },
            { year: 2024, value: 82 },
            { year: 2025, value: 85 },
          ],
        },
        {
          company: "Uber",
          color: "#3B82F6",
          data: [
            { year: 2022, value: 75 },
            { year: 2023, value: 73 },
            { year: 2024, value: 70 },
            { year: 2025, value: 68 },
          ],
        },
        {
          company: "Little",
          color: "#F59E0B",
          data: [
            { year: 2022, value: 65 },
            { year: 2023, value: 68 },
            { year: 2024, value: 70 },
            { year: 2025, value: 72 },
          ],
        },
        {
          company: "Bolt",
          color: "#8B5CF6",
          data: [
            { year: 2022, value: 70 },
            { year: 2023, value: 75 },
            { year: 2024, value: 78 },
            { year: 2025, value: 80 },
          ],
        },
      ],
    },
    {
      aspect: "support",
      companies: [
        {
          company: "Faras",
          color: "#10B981",
          data: [
            { year: 2022, value: 70 },
            { year: 2023, value: 75 },
            { year: 2024, value: 78 },
            { year: 2025, value: 80 },
          ],
        },
        {
          company: "Uber",
          color: "#3B82F6",
          data: [
            { year: 2022, value: 65 },
            { year: 2023, value: 68 },
            { year: 2024, value: 70 },
            { year: 2025, value: 72 },
          ],
        },
        {
          company: "Little",
          color: "#F59E0B",
          data: [
            { year: 2022, value: 60 },
            { year: 2023, value: 62 },
            { year: 2024, value: 65 },
            { year: 2025, value: 68 },
          ],
        },
        {
          company: "Bolt",
          color: "#8B5CF6",
          data: [
            { year: 2022, value: 75 },
            { year: 2023, value: 78 },
            { year: 2024, value: 80 },
            { year: 2025, value: 82 },
          ],
        },
      ],
    },
    {
      aspect: "quality",
      companies: [
        {
          company: "Faras",
          color: "#10B981",
          data: [
            { year: 2022, value: 82 },
            { year: 2023, value: 84 },
            { year: 2024, value: 86 },
            { year: 2025, value: 88 },
          ],
        },
        {
          company: "Uber",
          color: "#3B82F6",
          data: [
            { year: 2022, value: 80 },
            { year: 2023, value: 82 },
            { year: 2024, value: 83 },
            { year: 2025, value: 85 },
          ],
        },
        {
          company: "Little",
          color: "#F59E0B",
          data: [
            { year: 2022, value: 75 },
            { year: 2023, value: 78 },
            { year: 2024, value: 80 },
            { year: 2025, value: 82 },
          ],
        },
        {
          company: "Bolt",
          color: "#8B5CF6",
          data: [
            { year: 2022, value: 85 },
            { year: 2023, value: 87 },
            { year: 2024, value: 88 },
            { year: 2025, value: 90 },
          ],
        },
      ],
    },
  ]

  return {
    marketShare,
    positioning,
    sentiment,
    aspectSentiment,
    trends,
    churnTrends,
    responseTrends,
    aspectTrends,
  }
}

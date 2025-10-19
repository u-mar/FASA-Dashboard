"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangeFilter, type DateRange } from "./date-range-filter"

interface CompetitorSentimentData {
  aspect: string
  competitor: string
  sentiment: number
  date: string
}

interface CompetitorAspectSentimentComparisonProps {
  data?: CompetitorSentimentData[]
}

export default function CompetitorAspectSentimentComparison({ data = [] }: CompetitorAspectSentimentComparisonProps) {
  const [dateRange, setDateRange] = useState<DateRange>("all")

  // If no data, show a message
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Competitor Aspect Sentiment</CardTitle>
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    )
  }

  // Ensure data is an array and has valid items
  const validData = Array.isArray(data) ? data : []

  // Filter data based on selected date range
  const filterDataByDateRange = (data: CompetitorSentimentData[]) => {
    if (!Array.isArray(data)) return []
    
    const currentYear = new Date().getFullYear()
    const getYear = (date: string) => new Date(date).getFullYear()

    switch (dateRange) {
      case "thisYear":
        return data.filter((item) => getYear(item?.date) === currentYear)
      case "lastYear":
        return data.filter((item) => getYear(item?.date) === currentYear - 1)
      case "last2Years":
        return data.filter((item) => getYear(item?.date) >= currentYear - 2)
      case "last3Years":
        return data.filter((item) => getYear(item?.date) >= currentYear - 3)
      case "all":
      default:
        return data
    }
  }

  const filteredData = filterDataByDateRange(validData)

  // If no data after filtering, show a message
  if (filteredData.length === 0) {
    return (
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Competitor Aspect Sentiment</CardTitle>
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No data available for selected time period</p>
        </CardContent>
      </Card>
    )
  }

  // Get unique aspects and competitors
  const aspects = [...new Set(filteredData.map((item) => item?.aspect))].filter(Boolean)
  const competitors = [...new Set(filteredData.map((item) => item?.competitor))].filter(Boolean)

  // Calculate sentiment scores for each aspect and competitor
  const sentimentScores = aspects.map((aspect) => {
    const scores = competitors.map((competitor) => {
      const items = filteredData.filter(
        (item) => item?.aspect === aspect && item?.competitor === competitor
      )
      const total = items.reduce((sum, item) => sum + (item?.sentiment || 0), 0)
      return {
        competitor,
        score: items.length > 0 ? total / items.length : 0,
      }
    })
    return { aspect, scores }
  })

  // Function to get color based on sentiment score
  const getSentimentColor = (score: number) => {
    if (score >= 0.7) return "bg-green-100 text-green-700"
    if (score >= 0.4) return "bg-yellow-100 text-yellow-700"
    return "bg-red-100 text-red-700"
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Competitor Aspect Sentiment</CardTitle>
        <DateRangeFilter value={dateRange} onChange={setDateRange} />
      </CardHeader>
      <CardContent>
        <div className="overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-left text-sm font-medium">Aspect</th>
                {competitors.map((competitor) => (
                  <th key={competitor} className="p-2 text-left text-sm font-medium">
                    {competitor}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sentimentScores.map(({ aspect, scores }) => (
                <tr key={aspect} className="border-t">
                  <td className="p-2 text-sm font-medium">{aspect}</td>
                  {scores.map(({ competitor, score }) => (
                    <td key={`${aspect}-${competitor}`} className="p-2">
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getSentimentColor(
                          score
                        )}`}
                      >
                        {(score * 100).toFixed(1)}%
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
} 
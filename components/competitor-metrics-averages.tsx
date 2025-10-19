"use client"

import { Card, CardContent } from "@/components/ui/card"

interface MetricsData {
  name: string
  value: number
  color: string
}

interface CompetitorMetricsAveragesProps {
  data: MetricsData[]
  title: string
  suffix?: string
  higherIsBetter?: boolean
}

export default function CompetitorMetricsAverages({
  data = [],
  title,
  suffix = "%",
  higherIsBetter = false,
}: CompetitorMetricsAveragesProps) {
  // If no data, show a message
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  // Sort data by value (ascending or descending based on higherIsBetter)
  const sortedData = [...data].sort((a, b) => {
    return higherIsBetter ? b.value - a.value : a.value - b.value
  })

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {sortedData.map((item) => {
        // Ensure value is a number
        const numericValue = typeof item.value === "number" ? item.value : Number.parseFloat(String(item.value)) || 0

        return (
          <Card key={item.name} className="border shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col items-center">
                <div
                  className="mb-2 h-2 w-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${item.color} ${
                      higherIsBetter ? numericValue : 100 - numericValue
                    }%, #e5e7eb ${higherIsBetter ? numericValue : 100 - numericValue}%)`,
                  }}
                ></div>
                <div className="text-center">
                  <div className="text-sm font-medium text-muted-foreground">{item.name}</div>
                  <div className="text-2xl font-bold" style={{ color: item.color }}>
                    {numericValue.toFixed(1)}
                    {suffix}
                  </div>
                  <div className="text-xs text-muted-foreground">{title}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

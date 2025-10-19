"use client"

import { useState, useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangeFilter, type DateRange } from "./date-range-filter"
import type { AspectTrend } from "@/app/actions"

Chart.register(...registerables)

interface AspectTrendChartProps {
  data?: AspectTrend[]
}

// Hardcoded data for fallback
const hardcodedData: AspectTrend[] = [
  {
    aspect: "app",
    data: [
      { year: 2022, percentage: 65 },
      { year: 2023, percentage: 72 },
      { year: 2024, percentage: 78 },
      { year: 2025, percentage: 85 },
    ],
  },
  {
    aspect: "service",
    data: [
      { year: 2022, percentage: 78 },
      { year: 2023, percentage: 70 },
      { year: 2024, percentage: 62 },
      { year: 2025, percentage: 48 },
    ],
  },
  {
    aspect: "price",
    data: [
      { year: 2022, percentage: 45 },
      { year: 2023, percentage: 50 },
      { year: 2024, percentage: 55 },
      { year: 2025, percentage: 60 },
    ],
  },
  {
    aspect: "quality",
    data: [
      { year: 2022, percentage: 82 },
      { year: 2023, percentage: 84 },
      { year: 2024, percentage: 86 },
      { year: 2025, percentage: 88 },
    ],
  },
  {
    aspect: "support",
    data: [
      { year: 2022, percentage: 70 },
      { year: 2023, percentage: 75 },
      { year: 2024, percentage: 73 },
      { year: 2025, percentage: 77 },
    ],
  },
]

export default function AspectTrendChart({ data = [] }: AspectTrendChartProps) {
  // Use provided data or fallback to hardcoded data if empty
  const chartData = Array.isArray(data) && data.length > 0 ? data : hardcodedData

  const [selectedAspect, setSelectedAspect] = useState<string>(chartData[0]?.aspect || "")
  const [dateRange, setDateRange] = useState<DateRange>("all")
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  // Set initial selected aspect when data loads
  useEffect(() => {
    if (chartData.length > 0 && !selectedAspect) {
      setSelectedAspect(chartData[0]?.aspect || "")
    }
  }, [chartData, selectedAspect])

  // Handle date range change
  const handleDateRangeChange = (value: DateRange) => {
    setDateRange(value)
  }

  // Filter data based on selected date range
  const filterDataByDateRange = (data: { year: number; percentage: number }[]) => {
    if (!Array.isArray(data)) return []
    
    const currentYear = new Date().getFullYear()

    switch (dateRange) {
      case "thisYear":
        return data.filter((point) => point?.year === currentYear)
      case "lastYear":
        return data.filter((point) => point?.year === currentYear - 1)
      case "last2Years":
        return data.filter((point) => point?.year >= currentYear - 2)
      case "last3Years":
        return data.filter((point) => point?.year >= currentYear - 3)
      case "all":
      default:
        return data
    }
  }

  useEffect(() => {
    if (!chartRef.current || !Array.isArray(chartData) || chartData.length === 0 || !selectedAspect) return

    // Find the selected aspect data
    const aspectData = chartData.find((item) => item?.aspect === selectedAspect)
    if (!aspectData || !Array.isArray(aspectData.data)) return

    // Filter data based on date range
    const filteredData = filterDataByDateRange(aspectData.data)

    // If no data after filtering, don't create chart
    if (!Array.isArray(filteredData) || filteredData.length === 0) {
      if (chartInstance.current) {
        chartInstance.current.destroy()
        chartInstance.current = null
      }
      return
    }

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Extract data for the chart with null checks
    const years = filteredData.map((item) => (item?.year || 0).toString())
    const percentages = filteredData.map((item) => item?.percentage || 0)

    // Create gradient for the area
    const gradient = ctx.createLinearGradient(0, 0, 0, 400)
    gradient.addColorStop(0, "rgba(124, 58, 237, 0.5)")
    gradient.addColorStop(1, "rgba(124, 58, 237, 0)")

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: years,
        datasets: [
          {
            label: `${selectedAspect.charAt(0).toUpperCase() + selectedAspect.slice(1)} Positive %`,
            data: percentages,
            borderColor: "rgb(124, 58, 237)",
            backgroundColor: gradient,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "rgb(124, 58, 237)",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            min: Math.max(0, Math.min(...percentages) - 10),
            max: Math.min(100, Math.max(...percentages) + 10),
            ticks: {
              callback: (value) => `${value}%`,
            },
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
          },
          x: {
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number
                return `Positive: ${value}%`
              },
            },
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            padding: 10,
            cornerRadius: 4,
          },
        },
        interaction: {
          mode: "index",
          intersect: false,
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [chartData, selectedAspect, dateRange])

  // If no data, show a message
  if (!Array.isArray(chartData) || chartData.length === 0) {
    return (
      <Card className="border shadow-sm">
        <CardContent className="p-6">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Aspect Sentiment Trend</CardTitle>
        <div className="flex items-center gap-2">
          <Select value={selectedAspect} onValueChange={setSelectedAspect}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select aspect" />
            </SelectTrigger>
            <SelectContent>
              {chartData.map((item) => (
                <SelectItem key={item.aspect} value={item.aspect}>
                  {item.aspect.charAt(0).toUpperCase() + item.aspect.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DateRangeFilter value={dateRange} onChange={handleDateRangeChange} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <canvas ref={chartRef} />
        </div>
      </CardContent>
    </Card>
  )
}

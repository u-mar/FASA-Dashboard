"use client"

import { useState, useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import type { SentimentTrendData } from "@/app/actions"
import { DateRangeFilter, type DateRange } from "./date-range-filter"

Chart.register(...registerables)

interface SentimentTrendProps {
  data?: SentimentTrendData[]
}

export default function SentimentTrend({ data = [] }: SentimentTrendProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const [dateRange, setDateRange] = useState<DateRange>("all")

  // Handle date range change
  const handleDateRangeChange = (value: DateRange) => {
    setDateRange(value)
  }

  // Filter data based on selected date range
  const filterDataByDateRange = (inputData: SentimentTrendData[]) => {
    // Ensure inputData is an array
    if (!Array.isArray(inputData)) return []
    
    const currentYear = new Date().getFullYear()

    switch (dateRange) {
      case "thisYear":
        return inputData.filter((point) => Number(point.year) === currentYear)
      case "lastYear":
        return inputData.filter((point) => Number(point.year) === currentYear - 1)
      case "last2Years":
        return inputData.filter((point) => Number(point.year) >= currentYear - 2)
      case "last3Years":
        return inputData.filter((point) => Number(point.year) >= currentYear - 3)
      case "all":
      default:
        return inputData
    }
  }

  useEffect(() => {
    if (!chartRef.current || !Array.isArray(data) || data.length === 0) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Filter data based on date range
    const filteredData = filterDataByDateRange(data)

    // If no data after filtering, don't create chart
    if (!Array.isArray(filteredData) || filteredData.length === 0) {
      return
    }

    // Extract data from props
    const year = filteredData.map((item) => item.year)
    const positiveData = filteredData.map((item) => item.positive || 0)
    const negativeData = filteredData.map((item) => item.negative || 0)
    const neutralData = filteredData.map((item) => item.neutral || 0)

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: year,
        datasets: [
          {
            label: "Positive Sentiment",
            data: positiveData,
            borderColor: "#10B981",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Negative Sentiment",
            data: negativeData,
            borderColor: "#EF4444",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Neutral Sentiment",
            data: neutralData,
            borderColor: "#6B7280",
            backgroundColor: "rgba(107, 114, 128, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: "index",
            intersect: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: true,
              color: "rgba(0, 0, 0, 0.05)",
            },
            ticks: {
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 7,
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              display: true,
              color: "rgba(0, 0, 0, 0.05)",
            },
            ticks: {
              callback: (value) => {
                if (value === 0) return "0"
                if (value === 2000) return "2000"
                if (value === 4000) return "4000"
                if (value === 6000) return "6000"
                if (value === 8000) return "8000"
                return ""
              },
            },
          },
        },
        interaction: {
          mode: "nearest",
          axis: "x",
          intersect: false,
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, dateRange])

  // If no data, show a message
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex h-[280px] w-full items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <DateRangeFilter value={dateRange} onChange={handleDateRangeChange} />
      </div>
      <div className="h-[280px] w-full">
        <canvas ref={chartRef} />
      </div>
    </div>
  )
}

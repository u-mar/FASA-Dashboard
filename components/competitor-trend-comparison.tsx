"use client"

import { useState, useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import { DateRangeFilter, type DateRange } from "./date-range-filter"

Chart.register(...registerables)

interface CompetitorTrendData {
  month: string
  faras: number
  uber: number
  little: number
  bolt: number
}

interface CompetitorTrendComparisonProps {
  data: CompetitorTrendData[]
}

export default function CompetitorTrendComparison({ data = [] }: CompetitorTrendComparisonProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const [dateRange, setDateRange] = useState<DateRange>("all")

  // Handle date range change
  const handleDateRangeChange = (value: DateRange) => {
    setDateRange(value)
  }

  // Filter data based on selected date range
  // For monthly data, we'll need a different approach
  const filterDataByDateRange = (data: CompetitorTrendData[]) => {
    // Since we're dealing with monthly data, we'll use a simpler approach
    // This is a simplified version - in a real app, you'd need to know which month belongs to which year
    const totalMonths = data.length

    switch (dateRange) {
      case "thisYear":
        // Assume the last 12 months are this year
        return data.slice(-12)
      case "lastYear":
        // Assume the 12 months before this year are last year
        return data.slice(-24, -12)
      case "last2Years":
        // Last 24 months
        return data.slice(-24)
      case "last3Years":
        // Last 36 months
        return data.slice(-36)
      case "all":
      default:
        return data
    }
  }

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Filter data based on date range
    const filteredData = filterDataByDateRange(data)

    // If no data after filtering, don't create chart
    if (filteredData.length === 0) {
      return
    }

    // Extract data from props
    const months = filteredData.map((item) => item.month)

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: months,
        datasets: [
          {
            label: "Faras",
            data: filteredData.map((item) => item.faras),
            borderColor: "#10B981",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            tension: 0.4,
            fill: false,
            pointBackgroundColor: "#10B981",
          },
          {
            label: "Uber",
            data: filteredData.map((item) => item.uber),
            borderColor: "#3B82F6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            tension: 0.4,
            fill: false,
            pointBackgroundColor: "#3B82F6",
          },
          {
            label: "Little",
            data: filteredData.map((item) => item.little),
            borderColor: "#F59E0B",
            backgroundColor: "rgba(245, 158, 11, 0.1)",
            tension: 0.4,
            fill: false,
            pointBackgroundColor: "#F59E0B",
          },
          {
            label: "Bolt",
            data: filteredData.map((item) => item.bolt),
            borderColor: "#8B5CF6",
            backgroundColor: "rgba(139, 92, 246, 0.1)",
            tension: 0.4,
            fill: false,
            pointBackgroundColor: "#8B5CF6",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            min: Math.max(
              0,
              Math.min(...filteredData.map((item) => Math.min(item.faras, item.uber, item.little, item.bolt))) - 5,
            ),
            max: Math.min(
              100,
              Math.max(...filteredData.map((item) => Math.max(item.faras, item.uber, item.little, item.bolt))) + 5,
            ),
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
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number
                return `${context.dataset.label}: ${value}%`
              },
            },
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
  }, [data, dateRange])

  // If no data, show a message
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <DateRangeFilter value={dateRange} onChange={handleDateRangeChange} />
      </div>
      <div className="h-[400px] w-full">
        <canvas ref={chartRef} />
      </div>
    </div>
  )
}

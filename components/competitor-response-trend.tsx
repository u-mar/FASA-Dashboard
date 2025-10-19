"use client"

import { useState, useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import { DateRangeFilter, type DateRange } from "./date-range-filter"

Chart.register(...registerables)

interface CompetitorResponseTrendData {
  year: number
  faras: number
  uber: number
  little: number
  bolt: number
}

interface CompetitorResponseTrendProps {
  data: CompetitorResponseTrendData[]
}

export default function CompetitorResponseTrend({ data = [] }: CompetitorResponseTrendProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const [dateRange, setDateRange] = useState<DateRange>("all")

  // Handle date range change
  const handleDateRangeChange = (value: DateRange) => {
    setDateRange(value)
  }

  // Filter data based on selected date range
  const filterDataByDateRange = (data: CompetitorResponseTrendData[]) => {
    const currentYear = new Date().getFullYear()

    switch (dateRange) {
      case "thisYear":
        return data.filter((point) => point.year === currentYear)
      case "lastYear":
        return data.filter((point) => point.year === currentYear - 1)
      case "last2Years":
        return data.filter((point) => point.year >= currentYear - 2)
      case "last3Years":
        return data.filter((point) => point.year >= currentYear - 3)
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
    const years = filteredData.map((item) => item.year.toString())

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: years,
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

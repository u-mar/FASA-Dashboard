"use client"

import { useState, useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import type { ResponseTrendData } from "@/app/actions"
import { DateRangeFilter, type DateRange } from "./date-range-filter"

Chart.register(...registerables)

interface ResponseTrendChartProps {
  data: ResponseTrendData[]
}

export default function ResponseTrendChart({ data = [] }: ResponseTrendChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const [dateRange, setDateRange] = useState<DateRange>("all")

  // Handle date range change
  const handleDateRangeChange = (value: DateRange) => {
    setDateRange(value)
  }

  // Filter data based on selected date range
  const filterDataByDateRange = (data: ResponseTrendData[]) => {
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
    const rates = filteredData.map((item) => item.response_rate_percent)

    // Create gradient for the area
    const gradient = ctx.createLinearGradient(0, 0, 0, 400)
    gradient.addColorStop(0, "rgba(16, 185, 129, 0.5)")
    gradient.addColorStop(1, "rgba(16, 185, 129, 0)")

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: years,
        datasets: [
          {
            label: "Response Rate %",
            data: rates,
            borderColor: "rgb(16, 185, 129)",
            backgroundColor: gradient,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "rgb(16, 185, 129)",
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
            min: Math.max(0, Math.min(...rates) - 5),
            max: Math.min(100, Math.max(...rates) + 5),
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
                return `Response Rate: ${value}%`
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
  }, [data, dateRange])

  // If no data, show a message
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <DateRangeFilter value={dateRange} onChange={handleDateRangeChange} />
      </div>
      <div className="h-[300px] w-full">
        <canvas ref={chartRef} />
      </div>
    </div>
  )
}

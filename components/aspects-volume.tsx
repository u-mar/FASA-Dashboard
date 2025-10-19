"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import type { AspectsVolumeData } from "@/app/actions"

Chart.register(...registerables)

interface AspectsVolumeProps {
  data?: AspectsVolumeData[]
}

export default function AspectsVolume({ data = [] }: AspectsVolumeProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current || !Array.isArray(data) || data.length === 0) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Ensure data is an array and has valid items
    const validData = Array.isArray(data) ? data : []

    // Extract data from props with null checks
    const chartData = {
      labels: validData.map((item) => item?.aspect || "Unknown"),
      datasets: [
        {
          label: "Positive",
          data: validData.map((item) => item?.positive || 0),
          backgroundColor: "#10B981",
          borderRadius: 4,
        },
        {
          label: "Negative",
          data: validData.map((item) => item?.negative || 0),
          backgroundColor: "#EF4444",
          borderRadius: 4,
        },
        {
          label: "Neutral",
          data: validData.map((item) => item?.neutral || 0),
          backgroundColor: "#6B7280",
          borderRadius: 4,
        },
      ],
    }

    // Calculate total volume for each item and find max
    const maxValue = Math.max(
      ...validData.map(
        (item) => (item?.positive || 0) + (item?.negative || 0) + (item?.neutral || 0)
      ),
      1
    )

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: true,
              color: "rgba(0, 0, 0, 0.05)",
            },
            ticks: {
              callback: (value) => {
                if (value === 0) return "0"
                if (value === Math.round(maxValue * 0.25)) return Math.round(maxValue * 0.25).toString()
                if (value === Math.round(maxValue * 0.5)) return Math.round(maxValue * 0.5).toString()
                if (value === Math.round(maxValue * 0.75)) return Math.round(maxValue * 0.75).toString()
                if (value === maxValue) return maxValue.toString()
                return ""
              },
            },
          },
          y: {
            grid: {
              display: false,
            },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  // If no data, show a message
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full">
      <canvas ref={chartRef} />
    </div>
  )
}

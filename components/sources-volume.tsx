"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import type { SourcesVolumeData } from "@/app/actions"

Chart.register(...registerables)

interface SourcesVolumeProps {
  data?: SourcesVolumeData[]
}

export default function SourcesVolume({ data = [] }: SourcesVolumeProps) {
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
      labels: validData.map((item) => item?.sourcee || "Unknown"),
      datasets: [
        {
          label: "Volume",
          data: validData.map((item) => item?.volume || 0),
          backgroundColor: "#06B6D4",
          borderRadius: 4,
        },
      ],
    }

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
              display: false,
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
      <div className="flex h-[200px] w-full items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  return (
    <div className="h-[200px] w-full">
      <canvas ref={chartRef} />
    </div>
  )
}

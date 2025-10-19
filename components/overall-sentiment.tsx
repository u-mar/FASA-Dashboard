"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import type { OverallSentimentData } from "@/app/actions"

Chart.register(...registerables)

interface OverallSentimentProps {
  data?: OverallSentimentData[]
}

export default function OverallSentiment({ data = [] }: OverallSentimentProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const total = Array.isArray(data) && data.length > 0 ? data[0].total || 0 : 0

  useEffect(() => {
    if (!chartRef.current || !Array.isArray(data) || data.length === 0) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Extract data from props with null checks
    const chartData = {
      labels: data.map((item) => item.overall_sentiment || ''),
      datasets: [
        {
          data: data.map((item) => item.total || 0),
          backgroundColor: ["#10B981", "#EF4444", "#3B82F6"],
          borderWidth: 0,
          cutout: "70%",
        },
      ],
    }

    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              usePointStyle: true,
              pointStyle: "circle",
              padding: 20,
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || ""
                const value = context.raw as number
                return `${label}: ${value}%`
              },
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
      <div className="flex h-[250px] w-full items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  return (
    <div className="relative h-[250px] w-full">
      <canvas ref={chartRef} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-sm text-gray-500">Total</div>
        <div className="text-2xl font-bold">{total}</div>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import type { CompetitorSentimentData } from "@/app/actions"

Chart.register(...registerables)

interface CompetitorSentimentComparisonProps {
  data: CompetitorSentimentData[]
}

export default function CompetitorSentimentComparison({ data = [] }: CompetitorSentimentComparisonProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Extract data from props
    const labels = data.map((item) => item.name)
    const positiveData = data.map((item) => item.positive)
    const negativeData = data.map((item) => item.negative)
    const neutralData = data.map((item) => item.neutral)
    const colors = data.map((item) => item.color)

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Positive",
            data: positiveData,
            backgroundColor: "#10B981",
            borderRadius: 4,
          },
          {
            label: "Negative",
            data: negativeData,
            backgroundColor: "#EF4444",
            borderRadius: 4,
          },
          {
            label: "Neutral",
            data: neutralData,
            backgroundColor: "#6B7280",
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (value) => `${value}%`,
            },
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
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  // If no data, show a message
  if (!data || data.length === 0) {
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

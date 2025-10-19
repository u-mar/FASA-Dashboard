"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import type { CompetitorMarketShareData } from "@/app/actions"

Chart.register(...registerables)

interface MarketShareVsRatingProps {
  data: CompetitorMarketShareData[]
}

export default function MarketShareVsRating({ data = [] }: MarketShareVsRatingProps) {
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
    const marketShares = data.map((item) => item.share)
    const ratings = data.map((item) => item.rating || 0)
    const colors = data.map((item) => item.color)
    const sizes = data.map((item) => Math.max(20, Math.min(100, item.share * 2))) // Scale bubble size

    chartInstance.current = new Chart(ctx, {
      type: "bubble",
      data: {
        datasets: data.map((item, index) => ({
          label: item.name,
          data: [
            {
              x: item.rating || 0,
              y: item.share,
              r: Math.max(10, Math.min(50, Math.sqrt(item.share) * 2)), // Scale bubble size based on market share
            },
          ],
          backgroundColor: item.color,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            min: 3,
            max: 5,
            title: {
              display: true,
              text: "Average Rating",
            },
          },
          y: {
            type: "logarithmic",
            title: {
              display: true,
              text: "Market Share (%)",
            },
            ticks: {
              callback: (value) => `${Number(value).toFixed(2)}%`,
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
                const dataPoint = context.raw as { x: number; y: number; r: number }
                return [
                  `${context.dataset.label}`,
                  `Rating: ${dataPoint.x.toFixed(1)}/5`,
                  `Market Share: ${dataPoint.y.toFixed(2)}%`,
                ]
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
      <div className="flex h-[400px] w-full items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  return (
    <div className="h-[400px] w-full">
      <canvas ref={chartRef} />
    </div>
  )
}

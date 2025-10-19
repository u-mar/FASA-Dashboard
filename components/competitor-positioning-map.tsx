"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import type { CompetitorPositioningData } from "@/app/actions"

Chart.register(...registerables)

interface CompetitorPositioningMapProps {
  data: CompetitorPositioningData[]
}

export default function CompetitorPositioningMap({ data = [] }: CompetitorPositioningMapProps) {
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

    // Define colors for each competitor
    const colors = {
      Faras: "#10B981",
      "Competitor A": "#3B82F6",
      "Competitor B": "#F59E0B",
      "Competitor C": "#8B5CF6",
      default: "#6B7280",
    }

    chartInstance.current = new Chart(ctx, {
      type: "bubble",
      data: {
        datasets: data.map((item) => ({
          label: item.name,
          data: [
            {
              x: item.price,
              y: item.quality,
              r: item.size / 10, // Scale down the size for better visualization
            },
          ],
          backgroundColor: colors[item.name as keyof typeof colors] || colors.default,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            min: 0,
            max: 10,
            title: {
              display: true,
              text: "Price (lower is better)",
            },
            ticks: {
              stepSize: 1,
            },
          },
          y: {
            min: 0,
            max: 10,
            title: {
              display: true,
              text: "Quality",
            },
            ticks: {
              stepSize: 1,
            },
          },
        },
        plugins: {
          legend: {
            position: "bottom",
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const dataPoint = context.raw as { x: number; y: number; r: number }
                return [
                  `${context.dataset.label}`,
                  `Price: ${dataPoint.x}/10`,
                  `Quality: ${dataPoint.y}/10`,
                  `Market Size: ${Math.round(dataPoint.r * 10)}`,
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

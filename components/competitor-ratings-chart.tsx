"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import type { CompetitorMarketShareData } from "@/app/actions"

Chart.register(...registerables)

interface CompetitorRatingsChartProps {
  data: CompetitorMarketShareData[]
}

export default function CompetitorRatingsChart({ data = [] }: CompetitorRatingsChartProps) {
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

    // Filter out items without ratings and sort by rating (highest first)
    const filteredData = [...data]
      .filter((item) => item.rating !== undefined)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))

    // Extract data from props
    const labels = filteredData.map((item) => item.name)
    const ratings = filteredData.map((item) => item.rating || 0)
    const colors = filteredData.map((item) => item.color)

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Average Rating",
            data: ratings,
            backgroundColor: colors,
            borderWidth: 1,
            borderColor: "#ffffff",
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        scales: {
          x: {
            beginAtZero: true,
            max: 5,
            title: {
              display: true,
              text: "Rating (out of 5)",
            },
            ticks: {
              stepSize: 1,
            },
          },
          y: {
            grid: {
              display: false,
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
                return `Rating: ${value.toFixed(1)}/5`
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

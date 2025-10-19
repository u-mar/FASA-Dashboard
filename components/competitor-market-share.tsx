"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import type { CompetitorMarketShareData } from "@/app/actions"

Chart.register(...registerables)

interface CompetitorMarketShareProps {
  data: CompetitorMarketShareData[]
}

export default function CompetitorMarketShare({ data = [] }: CompetitorMarketShareProps) {
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
    const values = data.map((item) => item.share)
    const colors = data.map((item) => item.color)

    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
            borderWidth: 1,
            borderColor: "#ffffff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              boxWidth: 12,
              padding: 20,
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number
                return `${context.label}: ${value.toFixed(2)}%`
              },
            },
          },
        },
        cutout: "60%",
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

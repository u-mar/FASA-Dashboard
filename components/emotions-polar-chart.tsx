"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface EmotionData {
  emotion: string
  total: number
}

interface EmotionsPolarChartProps {
  data: EmotionData[]
}

export default function EmotionsPolarChart({ data = [] }: EmotionsPolarChartProps) {
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
    const labels = data.map((item) => item.emotion.charAt(0).toUpperCase() + item.emotion.slice(1))
    const values = data.map((item) => item.total)

    // Generate colors for each emotion
    const colors = {
      anger: "rgba(239, 68, 68, 0.7)", // red
      annoyance: "rgba(249, 115, 22, 0.7)", // orange
      confusion: "rgba(234, 179, 8, 0.7)", // yellow
      curiosity: "rgba(16, 185, 129, 0.7)", // green
      disappointment: "rgba(99, 102, 241, 0.7)", // indigo
      neutral: "rgba(107, 114, 128, 0.7)", // gray
      gratitude: "rgba(139, 92, 246, 0.7)", // purple
    }

    // Get colors for each emotion, defaulting to purple if not found
    const backgroundColor = data.map(
      (item) => colors[item.emotion.toLowerCase() as keyof typeof colors] || "rgba(124, 104, 238, 0.2)",
    )

    const borderColor = data.map((item) =>
      (colors[item.emotion.toLowerCase() as keyof typeof colors] || "rgba(124, 104, 238, 0.7)").replace("0.7", "1"),
    )

    chartInstance.current = new Chart(ctx, {
      type: "polarArea",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Emotion Count",
            data: values,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            ticks: {
              display: false,
            },
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
          },
        },
        plugins: {
          legend: {
            position: "right",
            labels: {
              boxWidth: 12,
              font: {
                size: 10,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number
                return `Count: ${value}`
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

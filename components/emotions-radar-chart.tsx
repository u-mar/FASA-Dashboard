"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface EmotionData {
  emotion: string
  total: number
}

interface EmotionsRadarChartProps {
  data?: EmotionData[]
}

export default function EmotionsRadarChart({ data = [] }: EmotionsRadarChartProps) {
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
    const labels = validData.map((item) => 
      item?.emotion ? item.emotion.charAt(0).toUpperCase() + item.emotion.slice(1) : "Unknown"
    )
    const values = validData.map((item) => item?.total || 0)

    // Find the maximum value to normalize the chart
    const maxValue = Math.max(...values, 1)

    chartInstance.current = new Chart(ctx, {
      type: "radar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Emotion Distribution",
            data: values,
            backgroundColor: "rgba(124, 58, 237, 0.2)",
            borderColor: "rgba(124, 58, 237, 1)",
            borderWidth: 2,
            pointBackgroundColor: "rgba(124, 58, 237, 1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(124, 58, 237, 1)",
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            suggestedMax: maxValue * 1.1, // Add some padding to the max value
            ticks: {
              display: false, // Hide the radial ticks for cleaner look
              stepSize: Math.ceil(maxValue / 5), // Create approximately 5 steps
            },
            pointLabels: {
              font: {
                size: 12,
                weight: "bold",
              },
              color: "rgba(0, 0, 0, 0.8)",
              padding: 10,
            },
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
            },
            angleLines: {
              color: "rgba(0, 0, 0, 0.1)",
            },
          },
        },
        plugins: {
          legend: {
            display: false, // Hide the legend for cleaner look
          },
          tooltip: {
            callbacks: {
              title: (context) => {
                return context[0].label
              },
              label: (context) => {
                const value = context.raw as number
                return `Count: ${value}`
              },
            },
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            padding: 10,
            cornerRadius: 4,
            titleFont: {
              weight: "bold",
            },
          },
        },
        elements: {
          line: {
            tension: 0.2, // Add some curve to the line
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
    <div className="h-[350px] w-full">
      <canvas ref={chartRef} />
    </div>
  )
}

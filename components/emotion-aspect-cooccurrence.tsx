"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import type { EmotionAspectData } from "@/app/actions"

Chart.register(...registerables)

interface EmotionAspectCooccurrenceProps {
  data: EmotionAspectData[]
}

export default function EmotionAspectCooccurrence({ data = [] }: EmotionAspectCooccurrenceProps) {
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

    // Extract all emotion types from the data (excluding 'aspect')
    const emotionTypes = Object.keys(data[0])
      .filter((key) => key !== "aspect" && key !== "strength")
      .sort() // Sort emotions alphabetically

    // Extract aspects
    const aspects = data.map((item) => item.aspect)

    // Find the maximum value to normalize the heatmap colors
    let maxValue = 0
    data.forEach((item) => {
      emotionTypes.forEach((emotion) => {
        const value = (item[emotion as keyof EmotionAspectData] as number) || 0
        if (value > maxValue) maxValue = value
      })
    })

    // Create a matrix of data for the heatmap
    // We'll create one dataset per emotion, with each dataset containing one data point per aspect
    const datasets = []

    // For each emotion, create a separate dataset
    for (let i = 0; i < emotionTypes.length; i++) {
      const emotion = emotionTypes[i]

      // Create an array of data points for this emotion
      const dataPoints = []

      // For each aspect, add a data point
      for (let j = 0; j < aspects.length; j++) {
        const aspectData = data[j]
        const value = (aspectData[emotion as keyof EmotionAspectData] as number) || 0

        // Add a data point with x, y coordinates and value
        dataPoints.push({
          x: j, // x-coordinate (aspect index)
          y: i, // y-coordinate (emotion index)
          v: value, // actual value
        })
      }

      datasets.push({
        label: emotion.charAt(0).toUpperCase() + emotion.slice(1), // Capitalize first letter
        data: dataPoints,
        backgroundColor: (context) => {
          const value = context.raw.v || 0
          // Calculate color intensity based on value
          const intensity = maxValue > 0 ? value / maxValue : 0
          return `rgba(124, 104, 238, ${intensity})`
        },
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.8)",
        hoverBackgroundColor: (context) => {
          const value = context.raw.v || 0
          // Calculate color intensity based on value
          const intensity = maxValue > 0 ? value / maxValue : 0
          return `rgba(94, 74, 208, ${intensity + 0.1})`
        },
        hoverBorderColor: "rgba(0, 0, 0, 0.2)",
        hoverBorderWidth: 2,
        borderRadius: 0,
      })
    }

    chartInstance.current = new Chart(ctx, {
      type: "scatter",
      data: {
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: "category",
            position: "bottom",
            labels: aspects,
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 10,
              },
            },
          },
          y: {
            type: "category",
            position: "left",
            labels: emotionTypes.map((e) => e.charAt(0).toUpperCase() + e.slice(1)),
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 10,
              },
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              title: (context) => {
                const dataIndex = context[0].dataIndex
                const datasetIndex = context[0].datasetIndex
                const aspect = aspects[context[0].raw.x]
                const emotion = emotionTypes[datasetIndex]
                return `${aspect} × ${emotion.charAt(0).toUpperCase() + emotion.slice(1)}`
              },
              label: (context) => {
                const value = context.raw.v
                return `Count: ${value}`
              },
            },
          },
        },
        elements: {
          point: {
            pointStyle: "rect",
            radius: 20,
            hoverRadius: 20,
          },
        },
        animation: {
          duration: 500,
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  return (
    <div className="h-[400px] w-full">
      <canvas ref={chartRef} />
    </div>
  )
}

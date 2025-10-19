"use client"

import type { EmotionAspectData } from "@/app/actions"

interface EmotionAspectTableProps {
  data: EmotionAspectData[]
}

export default function EmotionAspectTable({ data = [] }: EmotionAspectTableProps) {
  // If no data, show a message
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[250px] w-full items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  // Extract unique emotions and aspects
  const emotions = Array.from(new Set(data.map((item) => item.emotion || "Unknown")))
  const aspects = Array.from(new Set(data.map((item) => item.aspect || "Unknown")))

  // Create a 2D matrix for the data
  const matrix: number[][] = Array(emotions.length)
    .fill(0)
    .map(() => Array(aspects.length).fill(0))

  // Fill the matrix with data
  data.forEach((item) => {
    const emotionIndex = emotions.indexOf(item.emotion || "Unknown")
    const aspectIndex = aspects.indexOf(item.aspect || "Unknown")
    if (emotionIndex >= 0 && aspectIndex >= 0) {
      matrix[emotionIndex][aspectIndex] = item.strength || 0
    }
  })

  // Function to get background color based on value
  const getBackgroundColor = (value: number) => {
    return `rgba(124, 104, 238, ${value})`
  }

  return (
    <div className="overflow-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="p-2 text-left text-sm font-medium"></th>
            {aspects.map((aspect) => (
              <th key={aspect} className="p-2 text-left text-sm font-medium">
                {aspect}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {emotions.map((emotion, i) => (
            <tr key={emotion}>
              <td className="p-2 text-sm font-medium">{emotion}</td>
              {aspects.map((aspect, j) => (
                <td
                  key={`${emotion}-${aspect}`}
                  className="p-2 text-sm"
                  style={{
                    backgroundColor: getBackgroundColor(matrix[i][j]),
                    width: "80px",
                    height: "40px",
                  }}
                ></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

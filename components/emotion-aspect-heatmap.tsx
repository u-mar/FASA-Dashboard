"use client"
import type { EmotionAspectData } from "@/app/actions"

interface EmotionAspectHeatmapProps {
  data?: EmotionAspectData[]
}

export default function EmotionAspectHeatmap({ data = [] }: EmotionAspectHeatmapProps) {
  // If no data, show a message
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  // Ensure data is an array and has valid items
  const validData = Array.isArray(data) ? data : []

  // Extract all emotion types from the data (excluding 'aspect')
  const emotionTypes = Object.keys(validData[0] || {})
    .filter((key) => key !== "aspect" && key !== "strength")
    .sort() // Sort emotions alphabetically

  // Extract aspects with null check
  const aspects = validData.map((item) => item?.aspect || "Unknown")

  // Find the maximum value to normalize the heatmap colors
  let maxValue = 0
  validData.forEach((item) => {
    if (item) {  // Add null check for item
      emotionTypes.forEach((emotion) => {
        const value = (item[emotion as keyof EmotionAspectData] as number) || 0
        if (value > maxValue) maxValue = value
      })
    }
  })

  // Function to get background color based on value
  const getBackgroundColor = (value: number) => {
    const intensity = maxValue > 0 ? value / maxValue : 0
    return `rgba(124, 104, 238, ${intensity})`
  }

  return (
    <div className="overflow-auto">
      <table className="w-full border-collapse">
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
          {emotionTypes.map((emotion) => (
            <tr key={emotion}>
              <td className="p-2 text-sm font-medium">{emotion.charAt(0).toUpperCase() + emotion.slice(1)}</td>
              {aspects.map((aspect, aspectIndex) => {
                const item = validData[aspectIndex]
                const value = item ? (item[emotion as keyof EmotionAspectData] as number) || 0 : 0
                return (
                  <td
                    key={`${emotion}-${aspect}`}
                    className="relative border border-white p-0 text-center"
                    style={{
                      backgroundColor: getBackgroundColor(value),
                      width: "60px",
                      height: "40px",
                    }}
                    title={`${aspect} × ${emotion}: ${value}`}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-800">
                      {value > 0 ? value : ""}
                    </span>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

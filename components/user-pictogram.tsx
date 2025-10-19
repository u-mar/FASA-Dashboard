"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface UserPictogramProps {
  rate: number
  title: string
  description?: string
  color?: string
}

export default function UserPictogram({ rate, title, description, color = "red" }: UserPictogramProps) {
  // Calculate how many icons should be colored
  const totalIcons = 100
  const coloredIcons = Math.round(rate)
  const remainingIcons = totalIcons - coloredIcons

  // Determine the color based on the prop
  const iconColor = color === "red" ? "#EF4444" : "#10B981"

  // Create rows of icons (10 icons per row)
  const rows = []
  let iconCount = 0

  for (let i = 0; i < 10; i++) {
    const row = []
    for (let j = 0; j < 10; j++) {
      iconCount++
      row.push(
        <svg
          key={`icon-${i}-${j}`}
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke={iconCount <= coloredIcons ? iconColor : "#E5E7EB"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-colors duration-300"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>,
      )
    }
    rows.push(
      <div key={`row-${i}`} className="flex justify-center gap-2">
        {row}
      </div>,
    )
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold">{rate.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">
              {coloredIcons} out of {totalIcons} users
            </div>
          </div>
        </div>
        <div className="grid gap-1.5">{rows}</div>
      </CardContent>
    </Card>
  )
}

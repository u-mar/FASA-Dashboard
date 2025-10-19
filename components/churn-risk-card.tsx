"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

interface ChurnRiskCardProps {
  rate: number
}

export default function ChurnRiskCard({ rate }: ChurnRiskCardProps) {
  // Calculate how many icons should be colored (out of 10)
  const totalIcons = 10
  const coloredIcons = Math.round((Number(rate) / 100) * totalIcons)
  const remainingIcons = totalIcons - coloredIcons

  // Create the progress bar segments
  const segments = []
  for (let i = 0; i < totalIcons; i++) {
    segments.push(
      <div
        key={`segment-${i}`}
        className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
          i < coloredIcons ? "bg-red-500" : "bg-gray-200"
        }`}
      ></div>,
    )
  }

  // Determine the risk level text and color
  let riskLevel = "Low"
  let riskColor = "text-green-500"

  if (Number(rate) > 30) {
    riskLevel = "High"
    riskColor = "text-red-500"
  } else if (Number(rate) > 15) {
    riskLevel = "Medium"
    riskColor = "text-amber-500"
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Churn Risk
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="relative mb-4 flex h-36 w-36 items-center justify-center rounded-full border-8 border-gray-100">
            <div
              className="absolute inset-0 rounded-full border-8 border-red-500"
              style={{
                clipPath: `polygon(0 0, 100% 0, 100% 100%, 0% 100%)`,
                opacity: Number(rate) / 100,
              }}
            ></div>
            <div className="text-center">
              <div className="text-3xl font-bold">{Number(rate).toFixed(1)}%</div>
              <div className={`text-sm font-medium ${riskColor}`}>{riskLevel} Risk</div>
            </div>
          </div>

          <div className="mb-2 w-full">
            <div className="flex w-full gap-1">{segments}</div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              {coloredIcons} out of {totalIcons} customer segments at risk
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

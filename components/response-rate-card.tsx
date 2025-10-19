"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquareText } from "lucide-react"

interface ResponseRateCardProps {
  rate: number
}

export default function ResponseRateCard({ rate }: ResponseRateCardProps) {
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
          i < coloredIcons ? "bg-green-500" : "bg-gray-200"
        }`}
      ></div>,
    )
  }

  // Determine the response level text and color
  let responseLevel = "Low"
  let responseColor = "text-red-500"

  if (Number(rate) > 75) {
    responseLevel = "High"
    responseColor = "text-green-500"
  } else if (Number(rate) > 50) {
    responseLevel = "Medium"
    responseColor = "text-amber-500"
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <MessageSquareText className="h-5 w-5 text-green-500" />
          Response Rate
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="relative mb-4 flex h-36 w-36 items-center justify-center rounded-full border-8 border-gray-100">
            <div
              className="absolute inset-0 rounded-full border-8 border-green-500"
              style={{
                clipPath: `polygon(0 0, 100% 0, 100% 100%, 0% 100%)`,
                opacity: Number(rate) / 100,
              }}
            ></div>
            <div className="text-center">
              <div className="text-3xl font-bold">{Number(rate).toFixed(1)}%</div>
              <div className={`text-sm font-medium ${responseColor}`}>{responseLevel} Rate</div>
            </div>
          </div>

          <div className="mb-2 w-full">
            <div className="flex w-full gap-1">{segments}</div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              {coloredIcons} out of {totalIcons} reviews received responses
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

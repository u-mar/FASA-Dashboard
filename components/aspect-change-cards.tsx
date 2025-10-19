"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { AspectChangeData } from "@/app/actions"

interface AspectChangeCardsProps {
  data?: AspectChangeData[]
}

export default function AspectChangeCards({ data = [] }: AspectChangeCardsProps) {
  // If no data, show a message
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <p className="text-muted-foreground">No data available</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Ensure data is an array and has valid items
  const validData = Array.isArray(data) ? data : []

  // Get the top improved aspect (first in the sorted list)
  const topImproved = validData[0] || {
    aspect: "No data",
    previous_rate: 0,
    current_rate: 0,
    rate_change: 0
  }

  // Get the worst performing aspect (last in the sorted list)
  const worstPerforming = validData[validData.length - 1] || {
    aspect: "No data",
    previous_rate: 0,
    current_rate: 0,
    rate_change: 0
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Top Improved Aspect */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Top Improved Aspect</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold capitalize">{topImproved.aspect}</p>
              <div className="mt-1 flex items-center">
                <span className="text-sm text-muted-foreground">
                  From {topImproved.previous_rate}% to {topImproved.current_rate}%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-green-700">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">+{Number(topImproved.rate_change).toFixed(1)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Worst Performing Aspect */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Worst Performing Aspect</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold capitalize">{worstPerforming.aspect}</p>
              <div className="mt-1 flex items-center">
                <span className="text-sm text-muted-foreground">
                  From {worstPerforming.previous_rate}% to {worstPerforming.current_rate}%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-red-700">
              <TrendingDown className="h-4 w-4" />
              <span className="font-medium">{Number(worstPerforming.rate_change).toFixed(1)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

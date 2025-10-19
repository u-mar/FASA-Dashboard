"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AspectMetricsData } from "@/app/actions"

interface AspectMetricsProps {
  data: AspectMetricsData
}

export default function AspectMetrics({ data }: AspectMetricsProps) {
  // Ensure data has default values
  const aspectCount = data?.aspectCount ?? 0
  const sourceCount = data?.sourceCount ?? 0

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="border-0 shadow-none">
        <CardHeader className="p-0 pb-2">
          <CardTitle className="flex items-center text-4xl font-bold text-indigo-600"># {aspectCount}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-sm text-muted-foreground">Different Aspects</p>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-none">
        <CardHeader className="p-0 pb-2">
          <CardTitle className="flex items-center text-4xl font-bold text-indigo-600">{sourceCount}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-sm text-muted-foreground">Different Companies</p>
        </CardContent>
      </Card>
    </div>
  )
}

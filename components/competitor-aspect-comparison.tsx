"use client"

import { useState, useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ThumbsUp, ThumbsDown } from "lucide-react"

Chart.register(...registerables)

interface CompetitorAspectSentimentData {
  aspect: string
  faras_positive: number
  faras_negative: number
  uber_positive: number
  uber_negative: number
  little_positive: number
  little_negative: number
  bolt_positive: number
  bolt_negative: number
}

interface CompetitorAspectComparisonProps {
  data: CompetitorAspectSentimentData[]
}

export default function CompetitorAspectComparison({ data = [] }: CompetitorAspectComparisonProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(["Faras", "Uber", "Little", "Bolt"])
  const [sentimentType, setSentimentType] = useState<"positive" | "negative">("positive")

  // Toggle company selection
  const toggleCompany = (company: string) => {
    setSelectedCompanies((prev) => {
      if (prev.includes(company)) {
        return prev.filter((c) => c !== company)
      } else {
        return [...prev, company]
      }
    })
  }

  // Select all companies
  const selectAll = () => {
    setSelectedCompanies(["Faras", "Uber", "Little", "Bolt"])
  }

  // Handle sentiment type change
  const handleSentimentChange = (value: string) => {
    if (value === "positive" || value === "negative") {
      setSentimentType(value)
    }
  }

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Extract data from props
    const aspects = data.map((item) => item.aspect)

    // Create datasets based on selected companies and sentiment type
    const datasets = []

    if (selectedCompanies.includes("Faras")) {
      datasets.push({
        label: "Faras",
        data: data.map((item) => (sentimentType === "positive" ? item.faras_positive : item.faras_negative)),
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        borderColor: "rgb(16, 185, 129)",
        pointBackgroundColor: "rgb(16, 185, 129)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(16, 185, 129)",
      })
    }

    if (selectedCompanies.includes("Uber")) {
      datasets.push({
        label: "Uber",
        data: data.map((item) => (sentimentType === "positive" ? item.uber_positive : item.uber_negative)),
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgb(59, 130, 246)",
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(59, 130, 246)",
      })
    }

    if (selectedCompanies.includes("Little")) {
      datasets.push({
        label: "Little",
        data: data.map((item) => (sentimentType === "positive" ? item.little_positive : item.little_negative)),
        backgroundColor: "rgba(245, 158, 11, 0.2)",
        borderColor: "rgb(245, 158, 11)",
        pointBackgroundColor: "rgb(245, 158, 11)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(245, 158, 11)",
      })
    }

    if (selectedCompanies.includes("Bolt")) {
      datasets.push({
        label: "Bolt",
        data: data.map((item) => (sentimentType === "positive" ? item.bolt_positive : item.bolt_negative)),
        backgroundColor: "rgba(139, 92, 246, 0.2)",
        borderColor: "rgb(139, 92, 246)",
        pointBackgroundColor: "rgb(139, 92, 246)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(139, 92, 246)",
      })
    }

    chartInstance.current = new Chart(ctx, {
      type: "radar",
      data: {
        labels: aspects,
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: {
              display: true,
              color: "rgba(0, 0, 0, 0.1)",
            },
            suggestedMin: 0,
            suggestedMax: 100,
            ticks: {
              stepSize: 20,
              callback: (value) => `${value}%`,
            },
          },
        },
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number
                return `${context.dataset.label}: ${value}%`
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
  }, [data, selectedCompanies, sentimentType])

  // If no data, show a message
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={selectedCompanies.includes("Faras") ? "default" : "outline"}
                onClick={() => toggleCompany("Faras")}
                className="bg-green-600 hover:bg-green-700"
              >
                Faras
              </Button>
              <Button
                size="sm"
                variant={selectedCompanies.includes("Uber") ? "default" : "outline"}
                onClick={() => toggleCompany("Uber")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Uber
              </Button>
              <Button
                size="sm"
                variant={selectedCompanies.includes("Little") ? "default" : "outline"}
                onClick={() => toggleCompany("Little")}
                className="bg-amber-600 hover:bg-amber-700"
              >
                Little
              </Button>
              <Button
                size="sm"
                variant={selectedCompanies.includes("Bolt") ? "default" : "outline"}
                onClick={() => toggleCompany("Bolt")}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Bolt
              </Button>
              <Button size="sm" variant="outline" onClick={selectAll}>
                All
              </Button>
            </div>
          </CardContent>
        </Card>

        <ToggleGroup type="single" value={sentimentType} onValueChange={handleSentimentChange} className="justify-end">
          <ToggleGroupItem value="positive" aria-label="Positive Sentiment" className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" />
            <span>Positive</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="negative" aria-label="Negative Sentiment" className="flex items-center gap-1">
            <ThumbsDown className="h-4 w-4" />
            <span>Negative</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="h-[400px] w-full">
        <canvas ref={chartRef} />
      </div>
    </div>
  )
}

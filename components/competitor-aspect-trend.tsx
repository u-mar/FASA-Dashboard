"use client"

import { useState, useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { DateRangeFilter, type DateRange } from "./date-range-filter"

Chart.register(...registerables)

interface AspectTrendPoint {
  year: number
  positive_value: number
  negative_value: number
}

interface CompanyAspectTrend {
  company: string
  color: string
  data: AspectTrendPoint[]
}

interface AspectData {
  aspect: string
  companies: CompanyAspectTrend[]
}

interface CompetitorAspectTrendProps {
  data: AspectData[]
}

export default function CompetitorAspectTrend({ data = [] }: CompetitorAspectTrendProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const [selectedAspect, setSelectedAspect] = useState<string>(data[0]?.aspect || "")
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(["Faras", "Uber", "Little", "Bolt"])
  const [sentimentType, setSentimentType] = useState<"positive" | "negative">("positive")
  const [dateRange, setDateRange] = useState<DateRange>("all")

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

  // Handle aspect selection change
  const handleAspectChange = (value: string) => {
    setSelectedAspect(value)
  }

  // Handle sentiment type change
  const handleSentimentChange = (value: string) => {
    if (value === "positive" || value === "negative") {
      setSentimentType(value)
    }
  }

  // Handle date range change
  const handleDateRangeChange = (value: DateRange) => {
    setDateRange(value)
  }

  // Filter data based on selected date range
  const filterDataByDateRange = (data: AspectTrendPoint[]) => {
    const currentYear = new Date().getFullYear()

    switch (dateRange) {
      case "thisYear":
        return data.filter((point) => point.year === currentYear)
      case "lastYear":
        return data.filter((point) => point.year === currentYear - 1)
      case "last2Years":
        return data.filter((point) => point.year >= currentYear - 2)
      case "last3Years":
        return data.filter((point) => point.year >= currentYear - 3)
      case "all":
      default:
        return data
    }
  }

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0 || !selectedAspect) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Find the selected aspect data
    const aspectData = data.find((item) => item.aspect === selectedAspect)
    if (!aspectData) return

    // Filter companies based on selection
    const filteredCompanies = aspectData.companies.filter((company) => selectedCompanies.includes(company.company))

    // Apply date range filter to each company's data
    const dateFilteredCompanies = filteredCompanies.map((company) => ({
      ...company,
      data: filterDataByDateRange(company.data),
    }))

    // Check if we have data after filtering
    if (dateFilteredCompanies.length === 0 || dateFilteredCompanies.every((company) => company.data.length === 0)) {
      // No data after filtering
      if (chartInstance.current) {
        chartInstance.current.destroy()
        chartInstance.current = null
      }
      return
    }

    // Extract years (assuming all companies have the same years)
    const allYears = new Set<number>()
    dateFilteredCompanies.forEach((company) => {
      company.data.forEach((point) => {
        allYears.add(point.year)
      })
    })
    const years = Array.from(allYears)
      .sort()
      .map((year) => year.toString())

    // Create datasets for the chart
    const datasets = dateFilteredCompanies.map((company) => {
      // Create a map of year to value for easier lookup
      const yearValueMap = new Map<number, number>()
      company.data.forEach((point) => {
        yearValueMap.set(point.year, sentimentType === "positive" ? point.positive_value : point.negative_value)
      })

      // Create data array with values for all years (or null if no data)
      const data = Array.from(allYears)
        .sort()
        .map((year) => {
          return yearValueMap.has(year) ? yearValueMap.get(year) : null
        })

      return {
        label: company.company,
        data: data,
        borderColor: company.color,
        backgroundColor: `${company.color}20`,
        tension: 0.4,
        fill: false,
        pointBackgroundColor: company.color,
        spanGaps: true, // Connect lines across missing data points
      }
    })

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: years,
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            min: 0,
            max: 100,
            ticks: {
              callback: (value) => `${value}%`,
            },
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
            title: {
              display: true,
              text: sentimentType === "positive" ? "Positive Sentiment (%)" : "Negative Sentiment (%)",
            },
          },
          x: {
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
            title: {
              display: true,
              text: "Year",
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
        interaction: {
          mode: "index",
          intersect: false,
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, selectedAspect, selectedCompanies, sentimentType, dateRange])

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
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="w-full sm:w-64">
            <Select value={selectedAspect} onValueChange={handleAspectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select aspect" />
              </SelectTrigger>
              <SelectContent>
                {data.map((item) => (
                  <SelectItem key={item.aspect} value={item.aspect}>
                    {item.aspect.charAt(0).toUpperCase() + item.aspect.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DateRangeFilter value={dateRange} onChange={handleDateRangeChange} />
        </div>
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
      <div className="h-[400px] w-full">
        <canvas ref={chartRef} />
      </div>
    </div>
  )
}

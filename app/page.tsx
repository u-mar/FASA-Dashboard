"use client"

import { useState, lazy, Suspense } from "react"
import SentimentTrend from "@/components/sentiment-trend"
import OverallSentiment from "@/components/overall-sentiment"
import AspectMetrics from "@/components/aspect-metrics"
import SourcesVolume from "@/components/sources-volume"
import SourcesSentiment from "@/components/sources-sentiment"
import AspectsVolume from "@/components/aspects-volume"
import EmotionAspectHeatmap from "@/components/emotion-aspect-heatmap"
import EmotionsRadarChart from "@/components/emotions-radar-chart"
import AspectChangeCards from "@/components/aspect-change-cards"
import AspectTrendChart from "@/components/aspect-trend-chart"
import ChurnRiskCard from "@/components/churn-risk-card"
import ChurnTrendChart from "@/components/churn-trend-chart"
import ResponseRateCard from "@/components/response-rate-card"
import ResponseTrendChart from "@/components/response-trend-chart"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import useSWR from 'swr'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import dynamic from 'next/dynamic'

// Add the interface for the metrics
interface MetricItem {
  company: string
  value: number
  color: string
}

// Add the interface for the years data
interface YearsData {
  years: number[]
}

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex h-[400px] w-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
)

// Lazy load competitor components
const CompetitorSentimentComparison = lazy(() => import("@/components/competitor-sentiment-comparison"))
const CompetitorAspectComparison = lazy(() => import("@/components/competitor-aspect-comparison"))
const CompetitorMarketShare = lazy(() => import("@/components/competitor-market-share"))
const CompetitorTrendComparison = lazy(() => import("@/components/competitor-trend-comparison"))
const CompetitorChurnTrend = lazy(() => import("@/components/competitor-churn-trend"))
const CompetitorResponseTrend = lazy(() => import("@/components/competitor-response-trend"))
const CompetitorRatingsChart = lazy(() => import("@/components/competitor-ratings-chart"))
const CompetitorMetricsAverages = lazy(() => import("@/components/competitor-metrics-averages"))
const MarketShareTable = lazy(() => import("@/components/market-share-table"))
const CompetitorAspectTrend = lazy(() => import("@/components/competitor-aspect-trend"))

// Create a client-only version of the Dashboard component
const DashboardWithNoSSR = dynamic(() => import('@/components/dashboard'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  ),
})

export default function DashboardPage() {
  return <DashboardWithNoSSR />
}

// Main dashboard component with data fetching
function Dashboard() {
  const [activeTab, setActiveTab] = useState("faras")
  
  // Configure SWR with a revalidation interval of 30 seconds
  const fetcher = async (url: string) => {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('An error occurred while fetching the data.')
    }
    return response.json()
  }

  const swrConfig = {
    refreshInterval: 30000,
    revalidateOnFocus: false,
    suspense: true,
    fallbackData: { years: [2025, 2024, 2023] } as YearsData
  }

  // Get available years from the API
  const { data: yearsData } = useSWR<YearsData>('/api/available-years', fetcher, swrConfig)
  const availableYears = yearsData?.years || [2025, 2024, 2023]

  // Set initial state using the most recent years
  const [selectedYear, setSelectedYear] = useState(availableYears[0]?.toString() || "2024")
  const [aspectFromYear, setAspectFromYear] = useState(availableYears[1]?.toString() || "2024")
  const [aspectToYear, setAspectToYear] = useState(availableYears[0]?.toString() || "2025")

  // Use SWR hooks for data fetching with caching
  const { data: sentimentTrendData = [], error: sentimentError } = useSWR('/api/sentiment-trend', fetcher, swrConfig)
  const { data: overallSentimentData = [], error: overallError } = useSWR('/api/overall-sentiment', fetcher, swrConfig)
  const { data: aspectMetricsData = { aspectCount: 0, sourceCount: 0 }, error: aspectError } = useSWR('/api/aspect-metrics', fetcher, swrConfig)
  const { data: sourcesVolumeData = [], error: sourcesError } = useSWR('/api/sources-volume', fetcher, swrConfig)
  const { data: sourcesSentimentData = [], error: sourcesSentimentError } = useSWR('/api/sources-sentiment', fetcher, swrConfig)
  const { data: aspectsVolumeData = [], error: aspectsVolumeError } = useSWR('/api/aspects-volume', fetcher, swrConfig)
  const { data: emotionAspectData = [], error: emotionAspectError } = useSWR('/api/emotion-aspect', fetcher, swrConfig)
  const { data: emotionsData = [], error: emotionsError } = useSWR('/api/emotions', fetcher, swrConfig)
  const { data: aspectChangesData = [], error: aspectChangesError } = useSWR(
    `/api/aspect-changes?from_year=${aspectFromYear}&to_year=${aspectToYear}`, 
    fetcher, 
    swrConfig
  )
  const { data: aspectTrendsData = [], error: aspectTrendsError } = useSWR('/api/aspect-trends', fetcher, swrConfig)
  const { data: churnRateData = {
    metrics: [
      { company: 'faras', value: 23 },
      { company: 'uber', value: 25 },
      { company: 'bolt', value: 28 },
      { company: 'little', value: 26 }
    ]
  }, error: churnRateError } = useSWR(`/api/churn-rate?year=${selectedYear}`, fetcher, swrConfig)
  const { data: responseRateData = {
    metrics: [
      { company: 'faras', value: 78 },
      { company: 'uber', value: 72 },
      { company: 'bolt', value: 70 },
      { company: 'little', value: 74 }
    ]
  }, error: responseRateError } = useSWR(`/api/response-rate?year=${selectedYear}`, fetcher, swrConfig)
  const { data: churnTrendData = [], error: churnTrendError } = useSWR('/api/churn-trend', fetcher, swrConfig)
  const { data: responseTrendData = [], error: responseTrendError } = useSWR('/api/response-trend', fetcher, swrConfig)
  const { data: marketShareData = [], error: marketShareError } = useSWR('/api/ratings', fetcher, swrConfig)
  const { data: competitorSentimentData = [], error: competitorSentimentError } = useSWR('/api/sentiment-comparison', fetcher, swrConfig)
  const { data: competitorAspectData = [], error: competitorAspectError } = useSWR('/api/aspect-sentiment', fetcher, swrConfig)
  const { data: competitorTrendData = [], error: competitorTrendError } = useSWR('/api/aspect-trend', fetcher, swrConfig)
  const { data: sentimentTrendComparisonData = [], error: sentimentTrendComparisonError } = useSWR('/api/sentiment-trend-comparison', fetcher, swrConfig)
  const { data: churnTrendComparisonData = [], error: churnTrendComparisonError } = useSWR('/api/churn-trend-comparison', fetcher, swrConfig)
  const { data: responseTrendComparisonData = [], error: responseTrendComparisonError } = useSWR('/api/response-trend-comparison', fetcher, swrConfig)

  // Calculate totals for display with null checks
  const totalSentiments = (Array.isArray(sentimentTrendData) ? sentimentTrendData : []).reduce(
    (acc: { total: number; positive: number; negative: number }, item: { positive: number; negative: number }) => {
      acc.total += (item.positive || 0) + (item.negative || 0)
      acc.positive += item.positive || 0
      acc.negative += item.negative || 0
      return acc
    },
    { total: 0, positive: 0, negative: 0 },
  )

  // Map company names to display names and colors
  const companyColors: Record<string, string> = {
    faras: "#10B981",
    uber: "#3B82F6",
    little: "#F59E0B",
    bolt: "#8B5CF6",
  }

  // Handle loading and error states
  if (sentimentError || overallError || aspectError || sourcesError || sourcesSentimentError || 
      aspectsVolumeError || emotionAspectError || emotionsError || aspectChangesError || 
      aspectTrendsError || churnRateError || responseRateError || churnTrendError || responseTrendError ||
      marketShareError || competitorSentimentError || competitorAspectError || competitorTrendError ||
      sentimentTrendComparisonError || churnTrendComparisonError || responseTrendComparisonError) {
    return <div>Error loading dashboard data. Please try again later.</div>
  }

  const renderCompetitorContent = () => (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Competitive Analysis</h1>
            <div className="rounded-full bg-blue-500 p-1 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </div>
          </div>
        </div>

        <Tabs defaultValue="market">
          <TabsList className="mb-4">
            <TabsTrigger value="market">Market Analysis</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
            <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="market">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Market Share</CardTitle>
                </CardHeader>
                <CardContent>
                  <CompetitorMarketShare data={marketShareData} />
                </CardContent>
              </Card>

              <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Average Ratings</CardTitle>
                </CardHeader>
                <CardContent>
                  <CompetitorRatingsChart data={marketShareData} />
                </CardContent>
              </Card>
            </div>

            <Card className="mt-4 border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Market Share Details</CardTitle>
              </CardHeader>
              <CardContent>
                <MarketShareTable data={marketShareData} />
              </CardContent>
            </Card>

            <Card className="mt-4 border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Sentiment Trend Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <CompetitorTrendComparison data={sentimentTrendComparisonData} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sentiment">
            <div className="space-y-4">
              <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Sentiment Comparison by Competitor</CardTitle>
                </CardHeader>
                <CardContent>
                  <CompetitorSentimentComparison data={competitorSentimentData} />
                </CardContent>
              </Card>

              <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Aspect Sentiment Comparison</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Select companies to compare or click "All" to view all competitors
                  </p>
                </CardHeader>
                <CardContent>
                  <CompetitorAspectComparison data={competitorAspectData} />
                </CardContent>
              </Card>

              <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Aspect Sentiment Trend</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Select an aspect and companies to visualize sentiment trends over time
                  </p>
                </CardHeader>
                <CardContent>
                  <CompetitorAspectTrend data={competitorTrendData} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <div className="space-y-4">
              <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Churn Rate by Company</CardTitle>
                  <p className="text-sm text-muted-foreground">Lower values indicate better customer retention</p>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-sm font-medium">Select Year:</span>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <CompetitorMetricsAverages 
                    data={(churnRateData?.metrics ?? []).map((item: MetricItem) => ({
                      name: item.company.charAt(0).toUpperCase() + item.company.slice(1),
                      value: item.value,
                      color: companyColors[item.company] || '#888888'
                    }))} 
                    title="Churn Rate" 
                    higherIsBetter={false} 
                  />
                </CardContent>
              </Card>

              <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Churn Rate Trend</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Year-over-year comparison of churn rates across competitors
                  </p>
                </CardHeader>
                <CardContent>
                  <CompetitorChurnTrend data={churnTrendComparisonData} />
                </CardContent>
              </Card>

              <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Response Rate by Company</CardTitle>
                  <p className="text-sm text-muted-foreground">Higher values indicate better customer engagement</p>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-sm font-medium">Select Year:</span>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <CompetitorMetricsAverages 
                    data={(responseRateData?.metrics ?? []).map((item: MetricItem) => ({
                      name: item.company.charAt(0).toUpperCase() + item.company.slice(1),
                      value: item.value,
                      color: companyColors[item.company] || '#888888'
                    }))} 
                    title="Response Rate" 
                    higherIsBetter={true} 
                  />
                </CardContent>
              </Card>

              <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Response Rate Trend</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Year-over-year comparison of response rates across competitors
                  </p>
                </CardHeader>
                <CardContent>
                  <CompetitorResponseTrend data={responseTrendComparisonData} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Suspense>
  )

  const renderAspectChangeCards = () => (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">From Year:</span>
          <Select value={aspectFromYear} onValueChange={setAspectFromYear}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year: number) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">To Year:</span>
          <Select value={aspectToYear} onValueChange={setAspectToYear}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year: number) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <AspectChangeCards data={aspectChangesData} />
    </div>
  )

  const renderMetricsWithYearSelect = () => (
    <div className="mb-4 flex items-center gap-2">
      <span className="text-sm font-medium">Select Year:</span>
      <Select value={selectedYear} onValueChange={setSelectedYear}>
        <SelectTrigger className="w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {availableYears.map((year: number) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="flex h-14 items-center px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#10B981" />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="#10B981"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="#10B981"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="font-semibold">Faras</span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarFallback>MR</AvatarFallback>
            </Avatar>
            <span className="text-sm">Omar</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-32 border-r bg-gray-50">
          <div className="p-2">
            <h2 className="mb-2 text-xs font-semibold uppercase text-gray-500">Company</h2>
            <div className="space-y-1">
              <Button
                variant={activeTab === "faras" ? "secondary" : "ghost"}
                className="w-full justify-start text-xs px-1.5 py-1"
                size="sm"
                onClick={() => setActiveTab("faras")}
              >
                <div className="mr-1 h-1.5 w-1.5 rounded-full bg-green-500"></div>
                Faras
              </Button>
              <Button
                variant={activeTab === "competitors" ? "secondary" : "ghost"}
                className="w-full justify-start text-xs px-1.5 py-1"
                size="sm"
                onClick={() => setActiveTab("competitors")}
              >
                <div className="mr-1 h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                Competitors
              </Button>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <Suspense fallback={<LoadingSpinner />}>
            {activeTab === "faras" ? (
              <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold">Faras Sentiment Analysis</h1>
                    <div className="rounded-full bg-blue-500 p-1 text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                      </svg>
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="overview">
                  <TabsList className="mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="scorecard">
                      Scorecard <span className="ml-1 rounded bg-amber-500 px-1.5 py-0.5 text-xs text-white">NEW</span>
                    </TabsTrigger>
                    <TabsTrigger value="aspects">Aspects</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <h2 className="text-lg font-medium">Sentiment Trend</h2>
                            <div className="rounded-full bg-gray-200 p-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                                <path d="M12 16v-4" />
                                <path d="M12 8h.01" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center">
                              <div className="flex h-5 w-14 items-center justify-center rounded-sm bg-gray-200 text-xs text-gray-600 mr-2">
                                {totalSentiments.total}
                              </div>
                              <span className="text-sm">Total</span>
                            </div>
                            <div className="flex items-center">
                              <div className="flex h-5 w-14 items-center justify-center rounded-sm bg-green-100 text-xs text-green-600 mr-2">
                                {totalSentiments.positive}
                              </div>
                              <span className="text-sm text-green-600">Positives</span>
                            </div>
                            <div className="flex items-center">
                              <div className="flex h-5 w-14 items-center justify-center rounded-sm bg-red-100 text-xs text-red-600 mr-2">
                                {totalSentiments.negative}
                              </div>
                              <span className="text-sm text-red-600">Negatives</span>
                            </div>
                          </div>
                        </div>
                        <SentimentTrend data={sentimentTrendData} />
                      </div>
                      <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg font-medium">Overall Sentiment</h2>
                            <div className="rounded-full bg-gray-200 p-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                                <path d="M12 16v-4" />
                                <path d="M12 8h.01" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <OverallSentiment data={overallSentimentData} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div className="col-span-1 rounded-lg border bg-card p-4 shadow-sm md:col-span-2">
                        <AspectMetrics data={aspectMetricsData} />
                      </div>
                      <div className="col-span-1 rounded-lg border bg-card p-4 shadow-sm md:col-span-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg font-medium">Sources (volume)</h2>
                            <div className="rounded-full bg-gray-200 p-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                                <path d="M12 16v-4" />
                                <path d="M12 8h.01" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <SourcesVolume data={sourcesVolumeData} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg font-medium">Sources (sentiment)</h2>
                            <div className="rounded-full bg-gray-200 p-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                                <path d="M12 16v-4" />
                                <path d="M12 8h.01" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">No. of Sources</span>
                            <span className="rounded bg-gray-100 px-2 py-1 text-sm">{sourcesVolumeData?.length || 0}</span>
                          </div>
                        </div>
                        <SourcesSentiment data={sourcesSentimentData} />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Scorecard Tab Content */}
                  <TabsContent value="scorecard" className="space-y-4">
                    {/* Churn Risk and Trend side by side with different sizes */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                      {/* Churn Risk Card - takes 1/4 of the space */}
                      <div className="md:col-span-1">
                        <ChurnRiskCard rate={churnRateData?.metrics?.[0]?.value ?? 23} />
                      </div>

                      {/* Churn Trend Chart - takes 3/4 of the space */}
                      <div className="md:col-span-3">
                        <Card className="border shadow-sm">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium">Churn Rate Trend</CardTitle>
                            <p className="text-sm text-muted-foreground">Year-over-year trend of churn risk percentage</p>
                          </CardHeader>
                          <CardContent>
                            <ChurnTrendChart data={churnTrendData} />
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* Response Rate and Trend side by side with different sizes */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                      {/* Response Rate Card - takes 1/4 of the space */}
                      <div className="md:col-span-1">
                        <ResponseRateCard rate={responseRateData?.metrics?.[0]?.value ?? 78} />
                      </div>

                      {/* Response Trend Chart - takes 3/4 of the space */}
                      <div className="md:col-span-3">
                        <Card className="border shadow-sm">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium">Response Rate Trend</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              Year-over-year trend of customer response percentage
                            </p>
                          </CardHeader>
                          <CardContent>
                            <ResponseTrendChart data={responseTrendData} />
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="aspects" className="space-y-4">
                    {renderAspectChangeCards()}

                    {/* New Aspect Trend Chart with real data */}
                    <AspectTrendChart data={aspectTrendsData} />

                    <div className="rounded-lg border bg-card p-4 shadow-sm">
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <h2 className="text-lg font-medium">Aspects - Total Volume</h2>
                          <div className="rounded-full bg-gray-200 p-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                              <path d="M12 16v-4" />
                              <path d="M12 8h.01" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <AspectsVolume data={aspectsVolumeData} />
                    </div>

                    {/* Emotions Charts with Tabs */}
                    <div className="rounded-lg border bg-card p-4 shadow-sm">
                      <div className="mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg font-medium">Emotions Distribution</h2>
                            <div className="rounded-full bg-gray-200 p-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                                <path d="M12 16v-4" />
                                <path d="M12 8h.01" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Total Emotions</span>
                            <span className="rounded bg-gray-100 px-2 py-1 text-sm">{emotionsData?.length || 0}</span>
                          </div>
                        </div>
                      </div>

                      <Tabs defaultValue="radar">
                        <TabsList className="mb-4">
                          <TabsTrigger value="radar">Radar Chart</TabsTrigger>
                        </TabsList>
                        <TabsContent value="radar">
                          <EmotionsRadarChart data={emotionsData} />
                        </TabsContent>
                      </Tabs>
                    </div>

                    <div className="rounded-lg border bg-card p-4 shadow-sm">
                      <div className="mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg font-medium">Emotion Aspect Co-occurrence</h2>
                            <div className="rounded-full bg-gray-200 p-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                                <path d="M12 16v-4" />
                                <path d="M12 8h.01" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Top Emotions</span>
                          </div>
                        </div>
                      </div>
                      <EmotionAspectHeatmap data={emotionAspectData} />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              renderCompetitorContent()
            )}
          </Suspense>
        </main>
      </div>
    </div>
  )
}

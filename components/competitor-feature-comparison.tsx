"use client"

import { Check, X } from "lucide-react"
import type { CompetitorFeatureData } from "@/app/actions"

interface CompetitorFeatureComparisonProps {
  data: CompetitorFeatureData[]
}

export default function CompetitorFeatureComparison({ data = [] }: CompetitorFeatureComparisonProps) {
  // If no data, show a message
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  // Group features by category
  const groupedFeatures: Record<string, CompetitorFeatureData[]> = {}
  data.forEach((feature) => {
    if (!groupedFeatures[feature.category]) {
      groupedFeatures[feature.category] = []
    }
    groupedFeatures[feature.category].push(feature)
  })

  // Get all categories
  const categories = Object.keys(groupedFeatures).sort()

  return (
    <div className="overflow-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="border p-2 text-left">Feature</th>
            <th className="border p-2 text-center">Faras</th>
            <th className="border p-2 text-center">Competitor A</th>
            <th className="border p-2 text-center">Competitor B</th>
            <th className="border p-2 text-center">Competitor C</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <>
              <tr key={`category-${category}`} className="bg-gray-100">
                <td colSpan={5} className="border p-2 font-medium">
                  {category}
                </td>
              </tr>
              {groupedFeatures[category].map((feature, index) => (
                <tr key={`feature-${index}`}>
                  <td className="border p-2">{feature.feature}</td>
                  <td className="border p-2 text-center">
                    {feature.faras ? (
                      <Check className="mx-auto h-5 w-5 text-green-500" />
                    ) : (
                      <X className="mx-auto h-5 w-5 text-red-500" />
                    )}
                  </td>
                  <td className="border p-2 text-center">
                    {feature.competitor1 ? (
                      <Check className="mx-auto h-5 w-5 text-green-500" />
                    ) : (
                      <X className="mx-auto h-5 w-5 text-red-500" />
                    )}
                  </td>
                  <td className="border p-2 text-center">
                    {feature.competitor2 ? (
                      <Check className="mx-auto h-5 w-5 text-green-500" />
                    ) : (
                      <X className="mx-auto h-5 w-5 text-red-500" />
                    )}
                  </td>
                  <td className="border p-2 text-center">
                    {feature.competitor3 ? (
                      <Check className="mx-auto h-5 w-5 text-green-500" />
                    ) : (
                      <X className="mx-auto h-5 w-5 text-red-500" />
                    )}
                  </td>
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  )
}

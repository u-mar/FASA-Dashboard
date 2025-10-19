import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { CompetitorMarketShareData } from "@/app/actions"

interface MarketShareTableProps {
  data: CompetitorMarketShareData[]
}

export default function MarketShareTable({ data = [] }: MarketShareTableProps) {
  // If no data, show a message
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  // Sort data by market share (descending)
  const sortedData = [...data].sort((a, b) => b.share - a.share)

  // Map company names to employee size ranges
  const employeeSizeMap: Record<string, string> = {
    Uber: "30,000-31,000",
    Bolt: "1,001-5,000",
    Faras: "201-500",
    Little: "51-200",
  }

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Market Share (%)</TableHead>
            <TableHead className="text-right">Employee Size</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((item) => (
            <TableRow key={item.name}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="text-right">{item.share.toFixed(2)}%</TableCell>
              <TableCell className="text-right">{employeeSizeMap[item.name] || "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

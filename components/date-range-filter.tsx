"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CalendarIcon } from "lucide-react"

export type DateRange = "all" | "thisYear" | "lastYear" | "last2Years" | "last3Years"

interface DateRangeFilterProps {
  value: DateRange
  onChange: (value: DateRange) => void
}

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  // Get current year for labels
  const currentYear = new Date().getFullYear()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <CalendarIcon className="h-4 w-4" />
          <span>
            {value === "all" && "All Time"}
            {value === "thisYear" && `${currentYear}`}
            {value === "lastYear" && `${currentYear - 1}`}
            {value === "last2Years" && `Last 2 Years`}
            {value === "last3Years" && `Last 3 Years`}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={value} onValueChange={(value) => onChange(value as DateRange)}>
          <DropdownMenuRadioItem value="all">All Time</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="thisYear">{currentYear}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="lastYear">{currentYear - 1}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="last2Years">Last 2 Years</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="last3Years">Last 3 Years</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

import { format } from "date-fns"
import { ArrowRight } from "lucide-react"

interface SearchSummaryProps {
  origin: string
  destination: string
  date: string
}

export function SearchSummary({ origin, destination, date }: SearchSummaryProps) {
  // Format the date if it's a valid date string
  const formattedDate = date ? format(new Date(date), "EEE, MMM d, yyyy") : ""

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-center gap-2 text-white">
        <span className="font-semibold">{origin}</span>
        <ArrowRight className="h-4 w-4" />
        <span className="font-semibold">{destination}</span>
      </div>
      <div className="text-center text-white/80 text-sm mt-1">{formattedDate}</div>
    </div>
  )
}

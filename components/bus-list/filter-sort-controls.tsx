"use client"

import { useState } from "react"
import { Filter, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface FilterSortControlsProps {
  onFilterChange: (filters: any) => void
  onSortChange: (sortBy: string) => void
  sortBy: string
  filters: {
    minPrice: number
    maxPrice: number
    amenities: string[]
    operators: string[]
  }
}

export function FilterSortControls({ onFilterChange, onSortChange, sortBy, filters }: FilterSortControlsProps) {
  const [localFilters, setLocalFilters] = useState(filters)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handlePriceChange = (value: number[]) => {
    setLocalFilters((prev) => ({
      ...prev,
      minPrice: value[0],
      maxPrice: value[1],
    }))
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setLocalFilters((prev) => {
      if (checked) {
        return {
          ...prev,
          amenities: [...prev.amenities, amenity],
        }
      } else {
        return {
          ...prev,
          amenities: prev.amenities.filter((a) => a !== amenity),
        }
      }
    })
  }

  const handleOperatorChange = (operator: string, checked: boolean) => {
    setLocalFilters((prev) => {
      if (checked) {
        return {
          ...prev,
          operators: [...prev.operators, operator],
        }
      } else {
        return {
          ...prev,
          operators: prev.operators.filter((o) => o !== operator),
        }
      }
    })
  }

  const applyFilters = () => {
    onFilterChange(localFilters)
    setIsFilterOpen(false)
  }

  return (
    <div className="flex justify-between items-center">
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Filter Options</SheetTitle>
          </SheetHeader>

          <div className="py-4 space-y-6">
            <div>
              <h3 className="font-montserrat text-sm font-semibold mb-3">Price Range (GHS)</h3>
              <div className="px-2">
                <Slider
                  defaultValue={[localFilters.minPrice, localFilters.maxPrice]}
                  max={500}
                  step={10}
                  onValueChange={handlePriceChange}
                />
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>GHS {localFilters.minPrice}</span>
                  <span>GHS {localFilters.maxPrice}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-montserrat text-sm font-semibold mb-3">Amenities</h3>
              <div className="space-y-2">
                {["AC", "Wi-Fi", "Charging Port", "Refreshments"].map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`amenity-${amenity}`}
                      checked={localFilters.amenities.includes(amenity)}
                      onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                    />
                    <Label htmlFor={`amenity-${amenity}`}>{amenity}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-montserrat text-sm font-semibold mb-3">Operators</h3>
              <div className="space-y-2">
                {["VIP Jeoun", "STC", "OA Travel & Tours", "Metro Mass Transit"].map((operator) => (
                  <div key={operator} className="flex items-center space-x-2">
                    <Checkbox
                      id={`operator-${operator}`}
                      checked={localFilters.operators.includes(operator)}
                      onCheckedChange={(checked) => handleOperatorChange(operator, checked as boolean)}
                    />
                    <Label htmlFor={`operator-${operator}`}>{operator}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button className="w-full bg-orange-500 hover:bg-orange-600" onClick={applyFilters}>
              Apply Filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-2">
        <ArrowUpDown className="h-4 w-4 text-gray-500" />
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px] h-9 text-sm">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="departureTime">Departure Time</SelectItem>
            <SelectItem value="price">Price: Low to High</SelectItem>
            <SelectItem value="priceDesc">Price: High to Low</SelectItem>
            <SelectItem value="duration">Duration</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { CalendarIcon, MapPin } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

// Popular cities in Ghana for the dropdown
const ghanaianCities = [
  "Accra",
  "Kumasi",
  "Tamale",
  "Cape Coast",
  "Takoradi",
  "Sunyani",
  "Koforidua",
  "Ho",
  "Wa",
  "Bolgatanga",
]

const searchFormSchema = z.object({
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  date: z.date({
    required_error: "Please select a date",
  }),
})

type SearchFormValues = z.infer<typeof searchFormSchema>

interface SearchFormProps {
  onSearchSubmit: (origin: string, destination: string, date: Date) => void
}

export function SearchForm({ onSearchSubmit }: SearchFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get tomorrow's date for default value
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      origin: "",
      destination: "",
      date: tomorrow,
    },
  })

  const onSubmit = async (data: SearchFormValues) => {
    setIsSubmitting(true)

    try {
      onSearchSubmit(data.origin, data.destination, data.date)

      // Navigate to bus list page with query params
      router.push(
        `/bus-list?origin=${encodeURIComponent(data.origin)}&destination=${encodeURIComponent(data.destination)}&date=${data.date.toISOString().split("T")[0]}`,
      )
    } catch (error) {
      console.error("Search submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="origin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-300">
                      <SelectValue placeholder="Select origin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ghanaianCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                          {city}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>To</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-300">
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ghanaianCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                          {city}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Travel Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-300 pl-3 text-left font-normal"
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-orange-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Searching..." : "Search Buses"}
        </Button>
      </form>
    </Form>
  )
}

"use client"

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

const mobileMoneySchema = z.object({
  type: z.literal("Mobile Money"),
  network: z.string({
    required_error: "Please select a mobile network",
  }),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(12, "Phone number must not exceed 12 digits")
    .regex(/^\+?[0-9]+$/, "Phone number must contain only numbers"),
  name: z.string().min(3, "Name must be at least 3 characters"),
})

const cardSchema = z.object({
  type: z.literal("Debit Card"),
  cardNumber: z
    .string()
    .min(16, "Card number must be at least 16 digits")
    .max(19, "Card number must not exceed 19 digits")
    .regex(/^[0-9\s]+$/, "Card number must contain only numbers"),
  cardholderName: z.string().min(3, "Cardholder name must be at least 3 characters"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Expiry date must be in MM/YY format"),
  cvv: z
    .string()
    .min(3, "CVV must be at least 3 digits")
    .max(4, "CVV must not exceed 4 digits")
    .regex(/^[0-9]+$/, "CVV must contain only numbers"),
})

const paymentMethodSchema = z.discriminatedUnion("type", [mobileMoneySchema, cardSchema])

type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>

interface AddPaymentMethodFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function AddPaymentMethodForm({ onSubmit, onCancel }: AddPaymentMethodFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentType, setPaymentType] = useState<"Mobile Money" | "Debit Card">("Mobile Money")

  const form = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: "Mobile Money",
      network: "",
      phoneNumber: "",
      name: "",
    },
  })

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return v
  }

  const handlePaymentTypeChange = (value: "Mobile Money" | "Debit Card") => {
    setPaymentType(value)
    form.reset({
      type: value,
      ...(value === "Mobile Money"
        ? { network: "", phoneNumber: "", name: "" }
        : { cardNumber: "", cardholderName: "", expiryDate: "", cvv: "" }),
    })
  }

  const handleSubmit = async (data: PaymentMethodFormValues) => {
    setIsSubmitting(true)
    try {
      // Extract the last 4 digits
      let last4Digits = ""
      if (data.type === "Mobile Money") {
        last4Digits = data.phoneNumber.slice(-4)
      } else {
        last4Digits = data.cardNumber.replace(/\s+/g, "").slice(-4)
      }

      // Add last4Digits to the data
      const paymentData = {
        ...data,
        last4Digits,
      }

      await onSubmit(paymentData)
    } catch (error) {
      console.error("Payment method add error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="font-montserrat text-lg font-bold text-gray-800">Add Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="mb-4">
              <FormLabel>Payment Type</FormLabel>
              <RadioGroup
                value={paymentType}
                onValueChange={(value) => handlePaymentTypeChange(value as "Mobile Money" | "Debit Card")}
                className="flex flex-col space-y-2 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Mobile Money" id="mobile-money" />
                  <FormLabel htmlFor="mobile-money" className="cursor-pointer">
                    Mobile Money
                  </FormLabel>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Debit Card" id="debit-card" />
                  <FormLabel htmlFor="debit-card" className="cursor-pointer">
                    Debit Card
                  </FormLabel>
                </div>
              </RadioGroup>
            </div>

            {paymentType === "Mobile Money" ? (
              <>
                <FormField
                  control={form.control}
                  name="network"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Network</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-300">
                            <SelectValue placeholder="Select mobile network" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MTN">MTN Mobile Money</SelectItem>
                          <SelectItem value="Vodafone">Vodafone Cash</SelectItem>
                          <SelectItem value="AirtelTigo">AirtelTigo Money</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 0241234567"
                          {...field}
                          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Name on mobile money account"
                          {...field}
                          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1234 5678 9012 3456"
                          {...field}
                          value={formatCardNumber(field.value || "")}
                          onChange={(e) => field.onChange(formatCardNumber(e.target.value))}
                          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cardholderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cardholder Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Name as it appears on card"
                          {...field}
                          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="MM/YY"
                            {...field}
                            value={formatExpiryDate(field.value || "")}
                            onChange={(e) => field.onChange(formatExpiryDate(e.target.value))}
                            maxLength={5}
                            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123"
                            {...field}
                            type="password"
                            maxLength={4}
                            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Payment Method"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

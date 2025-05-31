"use client"

import { CreditCard, Smartphone } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface PaymentOptionsProps {
  amount: number
  onPaymentSelect: (method: string) => void
  selectedMethod: string | null
}

export function PaymentOptions({ amount, onPaymentSelect, selectedMethod }: PaymentOptionsProps) {
  return (
    <RadioGroup value={selectedMethod || ""} onValueChange={onPaymentSelect} className="space-y-3">
      <div
        onClick={() => onPaymentSelect("mobile-money")}
        className={`flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-colors ${
          selectedMethod === "mobile-money" ? "bg-orange-50 border-orange-200" : "border-gray-200"
        }`}
      >
        <RadioGroupItem value="mobile-money" id="mobile-money" className="sr-only" />
        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
          <Smartphone className="h-5 w-5 text-orange-600" />
        </div>
        <div className="flex-1">
          <Label htmlFor="mobile-money" className="text-base font-medium cursor-pointer">
            Mobile Money
          </Label>
          <p className="text-sm text-gray-600">Pay with MTN Mobile Money, Vodafone Cash, or AirtelTigo Money</p>
        </div>
      </div>

      <div
        onClick={() => onPaymentSelect("card")}
        className={`flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-colors ${
          selectedMethod === "card" ? "bg-orange-50 border-orange-200" : "border-gray-200"
        }`}
      >
        <RadioGroupItem value="card" id="card" className="sr-only" />
        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
          <CreditCard className="h-5 w-5 text-orange-600" />
        </div>
        <div className="flex-1">
          <Label htmlFor="card" className="text-base font-medium cursor-pointer">
            Credit/Debit Card
          </Label>
          <p className="text-sm text-gray-600">Pay with Visa, Mastercard, or other cards</p>
        </div>
      </div>
    </RadioGroup>
  )
}

"use client"

import { CreditCard, Trash2, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface PaymentMethod {
  id: string
  type: string
  network?: string
  brand?: string
  last4Digits: string
}

interface WalletInformationProps {
  paymentMethods: PaymentMethod[]
  walletBalance: number
  onAddPaymentMethod: () => void
  onRemovePaymentMethod: (id: string) => void
}

export function WalletInformation({
  paymentMethods,
  walletBalance,
  onAddPaymentMethod,
  onRemovePaymentMethod,
}: WalletInformationProps) {
  const getPaymentMethodIcon = (type: string) => {
    if (type === "Mobile Money") {
      return (
        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-green-600 font-bold text-xs">MM</span>
        </div>
      )
    }
    return (
      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
        <CreditCard className="h-4 w-4 text-blue-600" />
      </div>
    )
  }

  const getPaymentMethodDetails = (method: PaymentMethod) => {
    if (method.type === "Mobile Money") {
      return `${method.network} - ****${method.last4Digits}`
    }
    return `${method.brand} - ****${method.last4Digits}`
  }

  return (
    <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="font-montserrat text-lg font-bold text-gray-800">Payment Methods</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddPaymentMethod}
            className="text-orange-500 hover:text-orange-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {walletBalance > 0 && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-100">
            <p className="text-sm text-green-800">Wallet Balance</p>
            <p className="font-montserrat text-xl font-bold text-green-800">GHS {walletBalance.toFixed(2)}</p>
          </div>
        )}

        {paymentMethods.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">No payment methods added yet</p>
            <Button
              variant="outline"
              size="sm"
              onClick={onAddPaymentMethod}
              className="mt-2 text-orange-500 border-orange-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {paymentMethods.map((method, index) => (
              <div key={method.id}>
                {index > 0 && <Separator className="my-3" />}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {getPaymentMethodIcon(method.type)}
                    <div>
                      <p className="font-medium text-gray-800">{method.type}</p>
                      <p className="text-sm text-gray-600">{getPaymentMethodDetails(method)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemovePaymentMethod(method.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface NotificationPreferencesProps {
  preferences: {
    bookingUpdates: boolean
    promotions: boolean
    paymentReminders: boolean
    travelTips: boolean
  }
  onChange: (notificationType: string, value: boolean) => void
}

export function NotificationPreferences({ preferences, onChange }: NotificationPreferencesProps) {
  const notificationTypes = [
    {
      id: "bookingUpdates",
      label: "Booking Updates",
      description: "Receive notifications about changes to your bookings",
    },
    {
      id: "paymentReminders",
      label: "Payment Reminders",
      description: "Get reminders about upcoming payments",
    },
    {
      id: "promotions",
      label: "Promotions & Deals",
      description: "Stay informed about special offers and discounts",
    },
    {
      id: "travelTips",
      label: "Travel Tips",
      description: "Receive helpful travel tips and information",
    },
  ]

  return (
    <div className="space-y-4">
      {notificationTypes.map((notification, index) => (
        <div key={notification.id}>
          {index > 0 && <Separator className="my-4" />}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor={notification.id} className="text-base font-medium">
                {notification.label}
              </Label>
              <p className="text-sm text-gray-500">{notification.description}</p>
            </div>
            <Switch
              id={notification.id}
              checked={preferences[notification.id as keyof typeof preferences]}
              onCheckedChange={(checked) => onChange(notification.id, checked)}
              aria-label={notification.label}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

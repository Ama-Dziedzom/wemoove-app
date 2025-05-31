"use client"

import { useState, useEffect } from "react"
import { AppSettingsToggle } from "@/components/settings/app-settings-toggle"
import { NotificationPreferences } from "@/components/settings/notification-preferences"
import { LanguageSelector } from "@/components/settings/language-selector"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BottomNavigation } from "@/components/shared/bottom-navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// Mock data for demonstration
const mockSettings = {
  theme: "light",
  language: "en",
  notifications: {
    bookingUpdates: true,
    promotions: false,
    paymentReminders: true,
    travelTips: true,
  },
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simulate API fetch
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // In a real app, this would be an API call
        // await fetch('/api/settings')

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setSettings(mockSettings)
        setLoading(false)
      } catch (err) {
        setError("Failed to load settings. Please try again later.")
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleToggleSetting = async (settingName: string, value: boolean) => {
    try {
      // In a real app, this would be an API call
      // await fetch('/api/settings', {
      //   method: 'PUT',
      //   body: JSON.stringify({ [settingName]: value })
      // })

      // Update local state
      setSettings((prev) => ({
        ...prev,
        [settingName]: value,
      }))

      // If toggling theme, update the document class for dark mode
      if (settingName === "theme") {
        if (value === "dark") {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      }
    } catch (err) {
      setError("Failed to update setting. Please try again.")
    }
  }

  const handleNotificationChange = async (notificationType: string, value: boolean) => {
    try {
      // In a real app, this would be an API call
      // await fetch('/api/settings/notifications', {
      //   method: 'PUT',
      //   body: JSON.stringify({ [notificationType]: value })
      // })

      // Update local state
      setSettings((prev) => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationType]: value,
        },
      }))
    } catch (err) {
      setError("Failed to update notification preference. Please try again.")
    }
  }

  const handleLanguageChange = async (language: string) => {
    try {
      // In a real app, this would be an API call
      // await fetch('/api/settings', {
      //   method: 'PUT',
      //   body: JSON.stringify({ language })
      // })

      // Update local state
      setSettings((prev) => ({
        ...prev,
        language,
      }))
    } catch (err) {
      setError("Failed to update language. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="container px-4 py-6 space-y-4">
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-60 w-full rounded-lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container px-4 py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="container px-4 py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Settings Not Found</AlertTitle>
          <AlertDescription>Your settings could not be loaded.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <main className="flex flex-col min-h-screen bg-gray-50 pb-16">
      <div className="bg-orange-500 text-white p-4">
        <h1 className="font-montserrat text-xl font-bold">Settings</h1>
        <p className="text-sm">Customize your app experience</p>
      </div>

      <div className="container px-4 py-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>App Preferences</CardTitle>
            <CardDescription>Customize how the app looks and behaves</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AppSettingsToggle
              settingName="theme"
              label="Dark Mode"
              description="Switch between light and dark theme"
              value={settings.theme === "dark"}
              onToggle={(value) => handleToggleSetting("theme", value ? "dark" : "light")}
            />

            <Separator />

            <LanguageSelector currentLanguage={settings.language} onLanguageChange={handleLanguageChange} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Control which notifications you receive</CardDescription>
          </CardHeader>
          <CardContent>
            <NotificationPreferences preferences={settings.notifications} onChange={handleNotificationChange} />
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </main>
  )
}

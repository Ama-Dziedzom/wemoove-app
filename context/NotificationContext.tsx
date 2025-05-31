"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import * as Notifications from "expo-notifications"
import { useAuth } from "./AuthContext"
import {
  registerForPushNotifications,
  sendLocalNotification,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
} from "../utils/notifications"

interface NotificationContextType {
  pushToken: string | null
  hasPermission: boolean
  notificationCount: number
  requestPermissions: () => Promise<boolean>
  sendNotification: (title: string, body: string, data?: Record<string, unknown>) => Promise<void>
}

const NotificationContext = createContext<NotificationContextType>({
  pushToken: null,
  hasPermission: false,
  notificationCount: 0,
  requestPermissions: async () => false,
  sendNotification: async () => {},
})

export const useNotifications = () => useContext(NotificationContext)

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  const [pushToken, setPushToken] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)

  // Request notification permissions and register for push notifications
  const requestPermissions = async (): Promise<boolean> => {
    try {
      const { status } = await Notifications.requestPermissionsAsync()
      const granted = status === "granted"
      setHasPermission(granted)

      if (granted && user) {
        const token = await registerForPushNotifications(user.id)
        setPushToken(token)
      }

      return granted
    } catch (error) {
      console.error("Error requesting notification permissions:", error)
      return false
    }
  }

  // Send a local notification
  const sendNotification = async (title: string, body: string, data: Record<string, unknown> = {}): Promise<void> => {
    await sendLocalNotification(title, body, data)
  }

  // Initialize notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      registerForPushNotifications(user.id)
        .then((token) => {
          setPushToken(token)
          setHasPermission(!!token)
        })
        .catch((error) => {
          console.error("Error registering for push notifications:", error)
        })
    } else {
      setPushToken(null)
      setHasPermission(false)
    }
  }, [isAuthenticated, user])

  // Set up notification listeners
  useEffect(() => {
    // When a notification is received while the app is in the foreground
    const notificationReceivedSubscription = addNotificationReceivedListener((notification) => {
      setNotificationCount((prev) => prev + 1)
      console.log("Notification received:", notification)
    })

    // When the user taps on a notification
    const responseReceivedSubscription = addNotificationResponseReceivedListener((response) => {
      const { notification } = response
      const data = notification.request.content.data

      console.log("Notification tapped:", data)

      // Handle navigation based on notification data
      if (data.type === "booking_confirmation") {
        // Navigate to confirmation screen
        // navigation.navigate('Confirmation', { bookingId: data.bookingId });
      } else if (data.type === "booking_reminder") {
        // Navigate to booking details
        // navigation.navigate('BookingDetails', { busId: data.busId });
      }
    })

    // Clean up listeners on unmount
    return () => {
      notificationReceivedSubscription.remove()
      responseReceivedSubscription.remove()
    }
  }, [])

  return (
    <NotificationContext.Provider
      value={{
        pushToken,
        hasPermission,
        notificationCount,
        requestPermissions,
        sendNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

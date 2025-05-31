import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import { Platform } from "react-native"
import { supabase } from "../lib/supabase"

// Configure how notifications are presented when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

// Types for push tokens
export interface PushToken {
  id?: string
  user_id: string
  token: string
  device_type: string
  created_at?: string
}

/**
 * Register for push notifications and store the token in Supabase
 */
export async function registerForPushNotifications(userId: string): Promise<string | null> {
  if (!Device.isDevice) {
    console.log("Push Notifications are not available on emulators/simulators")
    return null
  }

  // Check if we have permission
  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  // If we don't have permission, ask for it
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  // If we still don't have permission, we can't register
  if (finalStatus !== "granted") {
    console.log("Failed to get push token for push notification!")
    return null
  }

  // Get the token - for Expo Go, we don't need to specify projectId
  const token = (await Notifications.getExpoPushTokenAsync()).data

  // Store the token in Supabase
  await savePushToken(userId, token)

  // Configure notifications for Android
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF5722",
    })
  }

  return token
}

/**
 * Save the push token to Supabase
 */
export async function savePushToken(userId: string, token: string): Promise<void> {
  try {
    // Check if token already exists
    const { data: existingTokens, error: fetchError } = await supabase
      .from("push_tokens")
      .select("*")
      .eq("user_id", userId)
      .eq("token", token)

    if (fetchError) {
      throw fetchError
    }

    // If token doesn't exist, save it
    if (!existingTokens || existingTokens.length === 0) {
      const { error } = await supabase.from("push_tokens").insert({
        user_id: userId,
        token,
        device_type: Platform.OS,
      })

      if (error) {
        throw error
      }

      console.log("Push token saved successfully")
    } else {
      console.log("Push token already exists")
    }
  } catch (error) {
    console.error("Error saving push token:", error)
  }
}

/**
 * Remove a push token from Supabase
 */
export async function removePushToken(userId: string, token: string): Promise<void> {
  try {
    const { error } = await supabase.from("push_tokens").delete().eq("user_id", userId).eq("token", token)

    if (error) {
      throw error
    }

    console.log("Push token removed successfully")
  } catch (error) {
    console.error("Error removing push token:", error)
  }
}

/**
 * Send a local notification
 */
export async function sendLocalNotification(
  title: string,
  body: string,
  data: Record<string, unknown> = {},
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: null, // null means send immediately
  })
}

/**
 * Handle notification received while app is running
 */
export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void,
): Notifications.Subscription {
  return Notifications.addNotificationReceivedListener(callback)
}

/**
 * Handle notification response (when user taps on notification)
 */
export function addNotificationResponseReceivedListener(
  callback: (response: Notifications.NotificationResponse) => void,
): Notifications.Subscription {
  return Notifications.addNotificationResponseReceivedListener(callback)
}

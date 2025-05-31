import { supabase } from "../lib/supabase"

/**
 * Send a push notification to a specific user
 */
export async function sendPushNotification(
  userId: string,
  title: string,
  body: string,
  data: Record<string, unknown> = {},
): Promise<boolean> {
  try {
    // Call the Supabase Edge Function
    const { data: response, error } = await supabase.functions.invoke("send-notification", {
      body: { userId, title, body, data },
    })

    if (error) {
      throw error
    }

    return response.success
  } catch (error) {
    console.error("Error sending push notification:", error)
    return false
  }
}

/**
 * Send a booking confirmation notification
 */
export async function sendBookingConfirmationNotification(
  userId: string,
  bookingId: string,
  route: string,
  departureTime: string,
): Promise<boolean> {
  const title = "Booking Confirmed!"
  const body = `Your trip from ${route} on ${new Date(departureTime).toLocaleDateString()} has been confirmed.`
  const data = {
    type: "booking_confirmation",
    bookingId,
    route,
    departureTime,
  }

  return sendPushNotification(userId, title, body, data)
}

/**
 * Send a booking reminder notification
 */
export async function sendBookingReminderNotification(
  userId: string,
  bookingId: string,
  route: string,
  departureTime: string,
): Promise<boolean> {
  const title = "Trip Reminder"
  const body = `Your trip from ${route} is tomorrow at ${new Date(departureTime).toLocaleTimeString()}.`
  const data = {
    type: "booking_reminder",
    bookingId,
    route,
    departureTime,
  }

  return sendPushNotification(userId, title, body, data)
}

/**
 * Send a booking cancellation notification
 */
export async function sendBookingCancellationNotification(
  userId: string,
  bookingId: string,
  route: string,
): Promise<boolean> {
  const title = "Booking Cancelled"
  const body = `Your booking for ${route} has been cancelled.`
  const data = {
    type: "booking_cancellation",
    bookingId,
    route,
  }

  return sendPushNotification(userId, title, body, data)
}

/**
 * Send a promotional notification
 */
export async function sendPromotionalNotification(userId: string, title: string, body: string): Promise<boolean> {
  const data = {
    type: "promotional",
  }

  return sendPushNotification(userId, title, body, data)
}

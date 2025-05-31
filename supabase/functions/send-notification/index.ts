import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const EXPO_PUSH_API_URL = "https://exp.host/--/api/v2/push/send"

// Create a Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || ""
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface NotificationPayload {
  userId: string
  title: string
  body: string
  data?: Record<string, unknown>
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })
  }

  try {
    // Parse the request body
    const payload: NotificationPayload = await req.json()
    const { userId, title, body, data = {} } = payload

    // Validate required fields
    if (!userId || !title || !body) {
      return new Response(JSON.stringify({ error: "userId, title, and body are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Get the user's push tokens
    const { data: tokens, error: tokensError } = await supabase
      .from("push_tokens")
      .select("token")
      .eq("user_id", userId)

    if (tokensError) {
      throw tokensError
    }

    if (!tokens || tokens.length === 0) {
      return new Response(JSON.stringify({ message: "No push tokens found for this user" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Prepare the messages for Expo push service
    const messages = tokens.map(({ token }) => ({
      to: token,
      sound: "default",
      title,
      body,
      data,
    }))

    // Send the notifications via Expo push service
    const response = await fetch(EXPO_PUSH_API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messages),
    })

    const result = await response.json()

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error sending notification:", error)

    return new Response(JSON.stringify({ error: error.message || "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})

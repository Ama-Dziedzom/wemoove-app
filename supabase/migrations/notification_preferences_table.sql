-- Create notification_preferences table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_updates BOOLEAN NOT NULL DEFAULT true,
  payment_reminders BOOLEAN NOT NULL DEFAULT true,
  promotions BOOLEAN NOT NULL DEFAULT false,
  travel_tips BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Add RLS policies
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Policy for users to manage their own preferences
CREATE POLICY "Users can manage their own notification preferences"
  ON public.notification_preferences
  USING (auth.uid() = user_id);

-- Policy for service role to read all preferences
CREATE POLICY "Service role can read all notification preferences"
  ON public.notification_preferences
  FOR SELECT
  USING (auth.role() = 'service_role');

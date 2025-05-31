-- Create push_tokens table
CREATE TABLE IF NOT EXISTS public.push_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  device_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, token)
);

-- Add RLS policies
ALTER TABLE public.push_tokens ENABLE ROW LEVEL SECURITY;

-- Policy for users to manage their own tokens
CREATE POLICY "Users can manage their own push tokens"
  ON public.push_tokens
  USING (auth.uid() = user_id);

-- Policy for service role to read all tokens
CREATE POLICY "Service role can read all push tokens"
  ON public.push_tokens
  FOR SELECT
  USING (auth.role() = 'service_role');

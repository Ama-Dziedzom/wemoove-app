# Ghana Bus Booking - Expo Go SDK 53 Setup

## Prerequisites

1. Install Expo CLI globally:
   \`\`\`bash
   npm install -g @expo/cli
   \`\`\`

2. Install Expo Go app on your device from:
   - iOS: App Store
   - Android: Google Play Store

## Setup Steps

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

\`\`\`bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 3. Start the Development Server

\`\`\`bash
npx expo start
\`\`\`

### 4. Open in Expo Go

- Scan the QR code with your device camera (iOS) or Expo Go app (Android)
- The app will load in Expo Go

## Push Notifications in Expo Go

### Testing Local Notifications

1. Open the app in Expo Go
2. Navigate to the Home screen
3. Use the "Notification Testing" component to:
   - Request notification permissions
   - Send test local notifications

### Testing Remote Notifications

1. Deploy the Supabase Edge Function:
   \`\`\`bash
   supabase functions deploy send-notification
   \`\`\`

2. Use the Supabase dashboard or a tool like Postman to call the function:
   \`\`\`json
   POST https://your-project.supabase.co/functions/v1/send-notification
   {
     "userId": "user-uuid-here",
     "title": "Test Remote Notification",
     "body": "This is a test from Supabase Edge Function",
     "data": { "type": "test" }
   }
   \`\`\`

## Important Notes for Expo Go

1. **Push Tokens**: In Expo Go, push tokens are automatically managed
2. **Permissions**: Notification permissions work the same as in standalone apps
3. **Limitations**: Some advanced notification features may not work in Expo Go
4. **Production**: For production, consider building a development build or standalone app

## Troubleshooting

### Notifications Not Working

1. Check that permissions are granted
2. Verify Supabase environment variables are correct
3. Ensure you're testing on a physical device (not simulator)
4. Check the Expo Go app version is compatible with SDK 53

### Supabase Connection Issues

1. Verify your Supabase URL and anon key
2. Check that RLS policies are correctly configured
3. Ensure the database tables are created

## Next Steps

1. Test all notification features in Expo Go
2. Set up the Supabase Edge Function for remote notifications
3. Configure notification preferences in the app
4. Test the complete booking flow with notifications

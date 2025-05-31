# Ghana Bus Booking App - React Native with Push Notifications

A comprehensive React Native mobile application for booking bus tickets across Ghana, built with Expo SDK 53 and Supabase backend.

## 🚀 Quick Start for Cursor AI

### Prerequisites
- Node.js 18+ 
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device
- Supabase account

### Environment Setup
1. Clone this repository
2. Install dependencies: `npm install`
3. Environment variables are already configured in the project
4. Start development: `npx expo start`

### Key Technologies
- **Frontend**: React Native with Expo SDK 53
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **Navigation**: React Navigation v6
- **Notifications**: Expo Notifications
- **State Management**: React Context
- **Styling**: React Native StyleSheet

## 📱 Features Implemented

### Core Features
- [x] User Authentication (Login/Signup)
- [x] Bus Search & Booking
- [x] Seat Selection
- [x] Payment Integration
- [x] Booking History
- [x] User Profile Management
- [x] Push Notifications
- [x] Dark Mode Support

### Push Notification Features
- [x] Local notifications
- [x] Remote push notifications via Supabase Edge Functions
- [x] Notification preferences management
- [x] Booking confirmations
- [x] Travel reminders
- [x] Promotional notifications

## 🏗️ Project Structure

\`\`\`
├── components/           # Reusable UI components
│   ├── home/            # Home screen components
│   ├── booking-details/ # Booking flow components
│   ├── notifications/   # Notification components
│   └── test/           # Development test components
├── screens/             # Main app screens
├── context/            # React Context providers
├── utils/              # Utility functions
├── lib/                # External service configurations
└── supabase/           # Database migrations and functions
\`\`\`

## 🔧 Development Commands

\`\`\`bash
# Start development server
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android

# Clear cache and restart
npx expo start --clear

# Install new dependencies
npx expo install <package-name>
\`\`\`

## 🗄️ Database Schema

The app uses Supabase with the following main tables:
- `users` - User profiles and authentication
- `buses` - Bus information and schedules
- `bookings` - User bookings and reservations
- `push_tokens` - Device push notification tokens
- `notification_preferences` - User notification settings

## 🔔 Push Notifications Setup

### Required Tables (Run in Supabase SQL Editor)
\`\`\`sql
-- See supabase/create_push_tables.sql for complete schema
\`\`\`

### Edge Function Deployment
\`\`\`bash
# Deploy notification function
supabase functions deploy send-notification --no-verify-jwt
\`\`\`

## 🧪 Testing Components

Development test components are included for:
- Supabase connection testing
- Push notification testing
- Environment variable verification

Remove these components before production deployment.

## 📦 Dependencies

### Core Dependencies
- `expo` - Expo SDK framework
- `react-native` - React Native framework
- `@supabase/supabase-js` - Supabase client
- `@react-navigation/native` - Navigation
- `expo-notifications` - Push notifications

### Development Dependencies
- `@babel/core` - JavaScript compiler
- TypeScript support included

## 🚀 Deployment

### Development Build
\`\`\`bash
# Create development build
eas build --profile development --platform all
\`\`\`

### Production Build
\`\`\`bash
# Create production build
eas build --profile production --platform all
\`\`\`

## 🔐 Environment Variables

Required environment variables (already configured):
- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key

## 🐛 Troubleshooting

### Common Issues
1. **Notifications not working**: Ensure you're testing on a real device, not simulator
2. **Supabase connection failed**: Check environment variables and network connection
3. **Build errors**: Clear cache with `npx expo start --clear`

### Debug Commands
\`\`\`bash
# Check environment variables
npx expo config

# View logs
npx expo logs

# Reset project
npx expo install --fix
\`\`\`

## 📚 Cursor AI Development Tips

### Recommended Cursor AI Prompts
- "Add error handling to the booking flow"
- "Implement offline support for bookings"
- "Add loading states to all API calls"
- "Create unit tests for notification utils"
- "Optimize performance for large bus lists"

### File Patterns for AI Context
- Use `// @cursor-context` comments for important functions
- Keep component files focused and single-purpose
- Use TypeScript interfaces for better AI understanding
- Include JSDoc comments for complex functions

## 🤝 Contributing

1. Create feature branch from `main`
2. Implement changes with proper TypeScript types
3. Test on both iOS and Android
4. Update documentation as needed
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details
\`\`\`

Now let's create a comprehensive development configuration file:

#!/bin/bash

echo "🚀 Setting up Ghana Bus Booking App for Cursor AI..."

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js first."
    exit 1
fi

# Check if expo CLI is installed
if ! command -v expo &> /dev/null; then
    echo "📦 Installing Expo CLI..."
    npm install -g @expo/cli
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install Expo dependencies
echo "📱 Installing Expo dependencies..."
npx expo install --fix

# Install notification dependencies
echo "🔔 Installing notification dependencies..."
npx expo install expo-notifications expo-device @react-native-async-storage/async-storage

# Check environment variables
echo "🔍 Checking environment variables..."
if [ -f ".env" ]; then
    echo "✅ .env file found"
else
    echo "⚠️  .env file not found. Creating template..."
    cat > .env << EOL
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
EOL
    echo "📝 Please update .env with your Supabase credentials"
fi

# Run expo doctor
echo "🩺 Running Expo doctor..."
npx expo doctor

echo "✅ Setup complete! You can now run:"
echo "   npm start (or expo start)"
echo "   npm run dev (with cache clear)"
echo ""
echo "📖 Check CURSOR_AI_GUIDE.md for development tips!"

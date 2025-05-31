@echo off
echo 🚀 Setting up Ghana Bus Booking App for Cursor AI...

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Install Expo dependencies
echo 📱 Installing Expo dependencies...
call npx expo install --fix

REM Install notification dependencies
echo 🔔 Installing notification dependencies...
call npx expo install expo-notifications expo-device @react-native-async-storage/async-storage

REM Check environment variables
echo 🔍 Checking environment variables...
if exist ".env" (
    echo ✅ .env file found
) else (
    echo ⚠️  .env file not found. Creating template...
    echo EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here > .env
    echo EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here >> .env
    echo 📝 Please update .env with your Supabase credentials
)

echo ✅ Setup complete! You can now run:
echo    npm start (or expo start)
echo    npm run dev (with cache clear)
echo.
echo 📖 Check CURSOR_AI_GUIDE.md for development tips!
pause

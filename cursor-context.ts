// @cursor-context: Quick context loader for Cursor AI
// Import this file to get all project context and patterns

export * from "./cursor-ai-config"
export * from "./types"
export * from "./utils/dev-helpers"
export * from "./utils/fix-helpers"

/**
 * QUICK START FOR CURSOR AI:
 *
 * 1. This is a React Native app using Expo SDK 53
 * 2. Database: Supabase (credentials in environment variables)
 * 3. Navigation: React Navigation
 * 4. State: React Context + Hooks
 * 5. Styling: StyleSheet.create
 *
 * COMMON COMMANDS:
 * - npm run dev (start development)
 * - npm run cursor:fix-check (validate changes)
 * - npm run type-check (check TypeScript)
 *
 * WHEN MAKING CHANGES:
 * - Follow existing patterns
 * - Add proper TypeScript types
 * - Include error handling
 * - Test on both iOS and Android
 * - Run validation before committing
 */

// Project file structure for reference
export const FILE_STRUCTURE = `
ghana-bus-booking/
├── App.tsx                 # Main app entry point
├── cursor-ai-config.ts     # AI development guidance (THIS FILE)
├── cursor-context.ts       # Context loader
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── screens/               # App screens
│   ├── HomeScreen.tsx
│   ├── LoginScreen.tsx
│   ├── BusListScreen.tsx
│   └── ...
├── components/            # Reusable components
│   ├── home/
│   ├── bus-list/
│   ├── booking-details/
│   └── ...
├── utils/                 # Helper functions
│   ├── dev-helpers.ts
│   ├── fix-helpers.ts
│   ├── notifications.ts
│   └── ...
├── types/                 # TypeScript definitions
│   └── index.ts
├── context/               # React Context providers
│   ├── AuthContext.tsx
│   ├── NotificationContext.tsx
│   └── ...
├── lib/                   # Third-party configurations
│   └── supabase.ts
└── assets/               # Static resources
    ├── images/
    └── icons/
`

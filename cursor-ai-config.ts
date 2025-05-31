// @cursor-context: Main configuration and guidance for Cursor AI development
// This file provides context and patterns for AI-assisted development

/**
 * CURSOR AI DEVELOPMENT CONFIGURATION
 *
 * This file contains all the guidance, patterns, and context that Cursor AI
 * needs to effectively work on this Ghana Bus Booking React Native app.
 */

// ============================================================================
// PROJECT OVERVIEW
// ============================================================================

export const PROJECT_INFO = {
  name: "Ghana Bus Booking App",
  type: "React Native with Expo SDK 53",
  database: "Supabase",
  authentication: "Supabase Auth",
  notifications: "Expo Notifications",
  navigation: "React Navigation",
  styling: "React Native StyleSheet",
  state: "React Context + Hooks",
} as const

// ============================================================================
// DEVELOPMENT PATTERNS
// ============================================================================

export const DEVELOPMENT_PATTERNS = {
  // File naming conventions
  fileNaming: {
    screens: "PascalCase + Screen suffix (e.g., HomeScreen.tsx)",
    components: "PascalCase (e.g., BusCard.tsx)",
    utils: "kebab-case (e.g., notification-helpers.ts)",
    types: "kebab-case (e.g., booking-types.ts)",
    contexts: "PascalCase + Context suffix (e.g., AuthContext.tsx)",
  },

  // Component structure
  componentStructure: `
    // 1. Imports (React, React Native, then local)
    // 2. Types/Interfaces
    // 3. Component function
    // 4. Styles (StyleSheet.create)
    // 5. Export default
  `,

  // Error handling
  errorHandling: "Always use try-catch for async operations, provide user feedback",

  // State management
  stateManagement: "Use React hooks, Context for global state, local state for UI",
} as const

// ============================================================================
// CURSOR AI PROMPTING GUIDELINES
// ============================================================================

export const CURSOR_PROMPTS = {
  // For adding new features
  newFeature: `
    "Add [feature description] to [component/screen]. 
    Follow the existing patterns in the codebase, include proper TypeScript types, 
    error handling, and test the functionality. Use the patterns from cursor-ai-config.ts"
  `,

  // For fixing bugs
  bugFix: `
    "Fix the [specific issue] in [file/component]. 
    Use the 5-phase fix process: identify, isolate, fix, validate, deploy. 
    Make minimal changes and test thoroughly."
  `,

  // For optimization
  optimization: `
    "Optimize [component/function] for better performance. 
    Focus on React Native best practices, memory management, and render optimization. 
    Maintain existing functionality."
  `,

  // For refactoring
  refactoring: `
    "Refactor [component/code] to improve maintainability. 
    Follow the project patterns, improve TypeScript types, and ensure no breaking changes."
  `,
} as const

// ============================================================================
// COMMON FIXES AND SOLUTIONS
// ============================================================================

export const COMMON_SOLUTIONS = {
  // TypeScript issues
  typescript: {
    undefinedProps: "Add optional chaining (?.) and default values",
    typeErrors: "Define proper interfaces in types/ directory",
    asyncIssues: "Use proper Promise<T> return types and error handling",
  },

  // React Native issues
  reactNative: {
    navigationErrors: "Check navigation prop types and route definitions",
    stateUpdates: "Use functional updates for state that depends on previous state",
    performanceIssues: "Use React.memo, useMemo, useCallback for optimization",
  },

  // Supabase issues
  supabase: {
    connectionErrors: "Check environment variables and network connectivity",
    queryErrors: "Add proper error handling and fallback data",
    authErrors: "Handle auth state changes and token expiration",
  },

  // Expo issues
  expo: {
    notificationErrors: "Check permissions and device capabilities",
    buildErrors: "Run expo doctor and check dependencies",
    environmentErrors: "Verify EXPO_PUBLIC_ prefixed variables",
  },
} as const

// ============================================================================
// PROJECT STRUCTURE GUIDE
// ============================================================================

export const PROJECT_STRUCTURE = {
  screens: "Main app screens (HomeScreen, LoginScreen, etc.)",
  components: "Reusable UI components organized by feature",
  utils: "Helper functions and utilities",
  types: "TypeScript type definitions",
  context: "React Context providers for global state",
  lib: "Third-party service configurations (Supabase, etc.)",
  assets: "Images, fonts, and other static resources",
} as const

// ============================================================================
// VALIDATION CHECKLIST
// ============================================================================

export const VALIDATION_CHECKLIST = [
  "TypeScript compiles without errors (npm run type-check)",
  "Expo doctor passes (npm run cursor:doctor)",
  "Environment variables are set (npm run cursor:env-check)",
  "App starts without crashes (npm run dev)",
  "Core functionality works on both iOS and Android",
  "No console errors or warnings",
  "Performance is acceptable on older devices",
] as const

// ============================================================================
// EMERGENCY PROCEDURES
// ============================================================================

export const EMERGENCY_PROCEDURES = {
  rollback: [
    "Stop development server",
    "Run: git stash (save current changes)",
    "Run: git checkout main (return to stable version)",
    "Run: npm run cursor:clean (clean install)",
    "Run: npm start (restart development)",
    "Test basic functionality",
  ],

  quickFix: [
    "Identify the exact error message",
    "Check if it's a known issue in COMMON_SOLUTIONS",
    "Apply the minimal fix",
    "Run validation checklist",
    "Test the specific functionality",
  ],
} as const

// ============================================================================
// CURSOR AI CONTEXT HELPERS
// ============================================================================

/**
 * Use this function to get context for Cursor AI prompts
 */
export function getCursorContext(area: keyof typeof COMMON_SOLUTIONS) {
  return {
    patterns: DEVELOPMENT_PATTERNS,
    solutions: COMMON_SOLUTIONS[area],
    validation: VALIDATION_CHECKLIST,
    projectInfo: PROJECT_INFO,
  }
}

/**
 * Quick reference for common tasks
 */
export const QUICK_REFERENCE = {
  addScreen: "Create in screens/, add to navigation, include types",
  addComponent: "Create in components/, add props interface, export",
  addUtility: "Create in utils/, add types, include error handling",
  fixBug: "Follow 5-phase process, validate thoroughly",
  optimize: "Use React Native performance best practices",
} as const

// ============================================================================
// EXPORT ALL FOR EASY ACCESS
// ============================================================================

export default {
  PROJECT_INFO,
  DEVELOPMENT_PATTERNS,
  CURSOR_PROMPTS,
  COMMON_SOLUTIONS,
  PROJECT_STRUCTURE,
  VALIDATION_CHECKLIST,
  EMERGENCY_PROCEDURES,
  getCursorContext,
  QUICK_REFERENCE,
}

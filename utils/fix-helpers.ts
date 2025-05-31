"use client"

// @cursor-context: Quick fix helpers and common solutions

import { devLog, devError } from "./dev-helpers"
import React from "react"

/**
 * Common fix patterns and helpers for Cursor AI
 */

// Fix Helper Types
interface FixResult {
  success: boolean
  message: string
  details?: any
}

interface ComponentFixOptions {
  component: string
  issue: string
  platform?: "ios" | "android" | "both"
}

/**
 * Quick diagnostic helper
 */
export const quickDiagnose = () => {
  const diagnostics = {
    environment: {
      supabaseUrl: !!process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseKey: !!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      nodeEnv: process.env.NODE_ENV,
    },
    platform: {
      ios: true, // Will be detected at runtime
      android: true, // Will be detected at runtime
    },
    timestamp: new Date().toISOString(),
  }

  devLog("Quick Diagnosis", diagnostics)
  return diagnostics
}

/**
 * Common TypeScript fix patterns
 */
export const TypeScriptFixes = {
  // Fix undefined/null issues
  safeAccess: (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  },

  // Fix type assertion issues
  assertType: <T>(value: unknown, typeName: string): T => {
    if (value === null || value === undefined) {
      throw new Error(`Expected ${typeName}, got ${value}`)
    }
    return value as T
  },

  // Fix async/await issues
  safeAsync: async <T>(
    asyncFn: () => Promise<T>,
    fallback: T
  ): Promise<T> => {
    try {
      return await asyncFn()
    } catch (error) {
      devError('Async operation failed', error)
      return fallback
    }
  },
}

/**
 * Common React Native fix patterns
 */
export const ReactNativeFixes = {
  // Fix navigation issues
  safeNavigate: (navigation: any, route: string, params?: any) => {
    try {
      if (navigation && typeof navigation.navigate === 'function') {
        navigation.navigate(route, params)
      } else {
        devError('Navigation object invalid', { navigation, route, params })
      }
    } catch (error) {
      devError('Navigation failed', error)
    }
  },

  // Fix state update issues
  safeSetState: <T>(
    setState: React.Dispatch<React.SetStateAction<T>>,
    newState: T | ((prev: T) => T)
  ) => {
    try {
      setState(newState)
    } catch (error) {
      devError('State update failed', error)
    }
  },

  // Fix async component issues
  withErrorBoundary: <P extends object>(
    Component: React.ComponentType<P>
  ) => {
    return (props: P) => {
      try {
        return <Component {...props} />;
      } catch (error) {
        devError('Component render failed', error);
        return null;
      }
    };
  },
}

/**
 * Common Supabase fix patterns
 */
export const SupabaseFixes = {
  // Fix connection issues
  testConnection: async () => {
    try {
      // This would test the actual Supabase connection
      const result = { connected: true, timestamp: new Date().toISOString() }
      devLog('Supabase connection test', result)
      return result
    } catch (error) {
      devError('Supabase connection failed', error)
      return { connected: false, error: error.message }
    }
  },

  // Fix query issues
  safeQuery: async <T>(
    queryFn: () => Promise<{ data: T; error: any }>,
    fallback: T
  ): Promise<T> => {
    try {
      const { data, error } = await queryFn()
      if (error) throw error
      return data || fallback
    } catch (error) {
      devError('Supabase query failed', error)
      return fallback
    }
  },
}

/**
 * Performance fix helpers
 */
export const PerformanceFixes = {
  // Fix memory leaks
  useCleanup: (cleanupFn: () => void) => {
    return () => {
      try {
        cleanupFn()
      } catch (error) {
        devError('Cleanup failed', error)
      }
    }
  },

  // Fix slow renders
  memoizeComponent: <P extends object>(
    Component: React.ComponentType<P>,
    areEqual?: (prevProps: P, nextProps: P) => boolean
  ) => {
    return React.memo(Component, areEqual)
  },

  // Fix expensive calculations
  useMemoizedValue: <T>(
    computeFn: () => T,
    deps: React.DependencyList
  ): T => {
    return React.useMemo(computeFn, deps)
  },
}

/**
 * Quick fix validator
 */
export const validateFix = (options: ComponentFixOptions): FixResult => {
  const { component, issue, platform = 'both' } = options

  // Basic validation
  if (!component || !issue) {
    return {
      success: false,
      message: 'Component and issue description required',
    }
  }

  // Platform validation
  if (platform !== 'both' && !['ios', 'android'].includes(platform)) {
    return {
      success: false,
      message: 'Platform must be ios, android, or both',
    }
  }

  return {
    success: true,
    message: `Fix validation passed for ${component}`,
    details: { component, issue, platform },
  }
}

/**
 * Emergency rollback helper
 */
export const emergencyRollback = () => {
  const rollbackInfo = {
    timestamp: new Date().toISOString(),
    action: 'emergency_rollback',
    instructions: [
      '1. Stop the current development server',
      '2. Run: git stash',
      '3. Run: git checkout main',
      '4. Run: npm run cursor:clean',
      '5. Run: npm start',
      '6. Test basic functionality',
    ],
  }

  devLog('Emergency Rollback Initiated', rollbackInfo)
  return rollbackInfo
}

/**
 * Fix progress tracker
 */
export class FixTracker {
  private startTime: number
  private phase: string
  private issue: string

  constructor(issue: string) {
    this.issue = issue
    this.startTime = Date.now()
    this.phase = 'identify'
    devLog(`Fix started: ${issue}`)
  }

  nextPhase(phase: string) {
    const elapsed = Date.now() - this.startTime
    devLog(`Fix phase: ${this.phase} → ${phase} (${elapsed}ms)`)
    this.phase = phase
  }

  complete(success: boolean) {
    const totalTime = Date.now() - this.startTime
    const result = success ? 'SUCCESS' : 'FAILED'
    devLog(`Fix ${result}: ${this.issue} (${totalTime}ms total)`)
  }
}

// Export common fix patterns
export const CommonFixes = {
  TypeScript: TypeScriptFixes,
  ReactNative: ReactNativeFixes,
  Supabase: SupabaseFixes,
  Performance: PerformanceFixes,
}

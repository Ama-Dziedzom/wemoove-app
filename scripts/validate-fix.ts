// @cursor-context: Fix validation script for ensuring fixes don't break anything

import { execSync } from "child_process"

interface ValidationResult {
  step: string
  passed: boolean
  message: string
  duration: number
}

/**
 * Comprehensive fix validation
 */
export async function validateFix(): Promise<ValidationResult[]> {
  const results: ValidationResult[] = []

  // Step 1: TypeScript Check
  const tsStart = Date.now()
  try {
    execSync("npx tsc --noEmit", { stdio: "pipe" })
    results.push({
      step: "TypeScript",
      passed: true,
      message: "No TypeScript errors found",
      duration: Date.now() - tsStart,
    })
  } catch (error) {
    results.push({
      step: "TypeScript",
      passed: false,
      message: "TypeScript errors detected",
      duration: Date.now() - tsStart,
    })
  }

  // Step 2: Expo Doctor
  const expoStart = Date.now()
  try {
    execSync("npx expo doctor", { stdio: "pipe" })
    results.push({
      step: "Expo Doctor",
      passed: true,
      message: "Expo configuration is valid",
      duration: Date.now() - expoStart,
    })
  } catch (error) {
    results.push({
      step: "Expo Doctor",
      passed: false,
      message: "Expo configuration issues detected",
      duration: Date.now() - expoStart,
    })
  }

  // Step 3: Environment Check
  const envStart = Date.now()
  const envValid = !!(process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY)
  results.push({
    step: "Environment",
    passed: envValid,
    message: envValid ? "Environment variables are set" : "Missing environment variables",
    duration: Date.now() - envStart,
  })

  // Step 4: Dependencies Check
  const depsStart = Date.now()
  try {
    execSync("npm ls --depth=0", { stdio: "pipe" })
    results.push({
      step: "Dependencies",
      passed: true,
      message: "All dependencies are installed",
      duration: Date.now() - depsStart,
    })
  } catch (error) {
    results.push({
      step: "Dependencies",
      passed: false,
      message: "Dependency issues detected",
      duration: Date.now() - depsStart,
    })
  }

  return results
}

/**
 * Run validation and display results
 */
export function runValidation() {
  console.log("🔍 Running fix validation...\n")

  validateFix().then((results) => {
    let allPassed = true

    results.forEach((result) => {
      const icon = result.passed ? "✅" : "❌"
      const duration = `(${result.duration}ms)`
      console.log(`${icon} ${result.step}: ${result.message} ${duration}`)

      if (!result.passed) {
        allPassed = false
      }
    })

    console.log("\n" + "=".repeat(50))
    if (allPassed) {
      console.log("🎉 All validations passed! Fix is ready.")
    } else {
      console.log("⚠️  Some validations failed. Please review and fix.")
    }
    console.log("=".repeat(50))
  })
}

// Run if called directly
if (require.main === module) {
  runValidation()
}

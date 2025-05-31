// @cursor-context: Centralized error handling for the app

import { Alert } from "react-native"
import { devError } from "./dev-helpers"

export interface AppError {
  code: string
  message: string
  details?: any
}

/**
 * Custom error class for app-specific errors
 */
export class AppError extends Error {
  code: string
  details?: any

  constructor(code: string, message: string, details?: any) {
    super(message)
    this.name = "AppError"
    this.code = code
    this.details = details
  }
}

/**
 * Error codes used throughout the app
 */
export const ERROR_CODES = {
  // Network errors
  NETWORK_ERROR: "NETWORK_ERROR",
  TIMEOUT_ERROR: "TIMEOUT_ERROR",

  // Authentication errors
  AUTH_INVALID_CREDENTIALS: "AUTH_INVALID_CREDENTIALS",
  AUTH_USER_NOT_FOUND: "AUTH_USER_NOT_FOUND",
  AUTH_SESSION_EXPIRED: "AUTH_SESSION_EXPIRED",

  // Booking errors
  BOOKING_SEAT_UNAVAILABLE: "BOOKING_SEAT_UNAVAILABLE",
  BOOKING_PAYMENT_FAILED: "BOOKING_PAYMENT_FAILED",
  BOOKING_NOT_FOUND: "BOOKING_NOT_FOUND",

  // Notification errors
  NOTIFICATION_PERMISSION_DENIED: "NOTIFICATION_PERMISSION_DENIED",
  NOTIFICATION_SEND_FAILED: "NOTIFICATION_SEND_FAILED",

  // General errors
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
} as const

/**
 * User-friendly error messages
 */
const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.NETWORK_ERROR]: "Please check your internet connection and try again.",
  [ERROR_CODES.TIMEOUT_ERROR]: "The request timed out. Please try again.",
  [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: "Invalid email or password. Please try again.",
  [ERROR_CODES.AUTH_USER_NOT_FOUND]: "No account found with this email address.",
  [ERROR_CODES.AUTH_SESSION_EXPIRED]: "Your session has expired. Please log in again.",
  [ERROR_CODES.BOOKING_SEAT_UNAVAILABLE]: "The selected seat is no longer available.",
  [ERROR_CODES.BOOKING_PAYMENT_FAILED]: "Payment failed. Please try again or use a different payment method.",
  [ERROR_CODES.BOOKING_NOT_FOUND]: "Booking not found. Please check your booking reference.",
  [ERROR_CODES.NOTIFICATION_PERMISSION_DENIED]: "Notification permissions are required to receive updates.",
  [ERROR_CODES.NOTIFICATION_SEND_FAILED]: "Failed to send notification. Please try again.",
  [ERROR_CODES.UNKNOWN_ERROR]: "An unexpected error occurred. Please try again.",
  [ERROR_CODES.VALIDATION_ERROR]: "Please check your input and try again.",
}

/**
 * Handle and display errors to the user
 */
export const handleError = (error: any, showAlert = true) => {
  devError("Error occurred", error)

  let errorCode = ERROR_CODES.UNKNOWN_ERROR
  let errorMessage = ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR]

  // Handle different error types
  if (error instanceof AppError) {
    errorCode = error.code
    errorMessage = ERROR_MESSAGES[error.code] || error.message
  } else if (error?.code && ERROR_MESSAGES[error.code]) {
    errorCode = error.code
    errorMessage = ERROR_MESSAGES[error.code]
  } else if (error?.message) {
    errorMessage = error.message
  }

  // Show alert to user if requested
  if (showAlert) {
    Alert.alert("Error", errorMessage)
  }

  return {
    code: errorCode,
    message: errorMessage,
    originalError: error,
  }
}

/**
 * Async error wrapper for handling promises
 */
export const asyncErrorHandler = async <T>(\
  promise: Promise<T>,
  showAlert: boolean = true
)
: Promise<[T | null, AppError | null]> =>
{
  try {
    const result = await promise
    return [result, null]
  } catch (error) {
    const handledError = handleError(error, showAlert)
    return [null, new AppError(handledError.code, handledError.message, error)]
  }
}

/**
 * Retry mechanism for failed operations
 */
export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
)
: Promise<T> =>
{
  let lastError: any

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      devError(`Operation failed (attempt ${attempt}/${maxRetries})`, error)

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay * attempt))
      }
    }
  }

  throw lastError
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { RegistrationForm } from "@/components/auth/registration-form"
import { SocialLogin } from "@/components/auth/social-login"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (userData: any) => {
    setLoading(true)
    setError(null)

    try {
      // In a real app, this would be an API call
      // await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   body: JSON.stringify(userData)
      // })

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful registration
      router.push("/")
    } catch (err) {
      setError("Registration failed. Please try again.")
      setLoading(false)
    }
  }

  const handleSocialSignup = async (provider: "google" | "facebook") => {
    setLoading(true)
    setError(null)

    try {
      // In a real app, this would redirect to the social login provider
      // window.location.href = `/api/auth/${provider}`;

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful registration
      router.push("/")
    } catch (err) {
      setError(`Failed to sign up with ${provider}. Please try again.`)
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="font-montserrat text-3xl font-bold text-gray-800">Create Account</h1>
          <p className="mt-2 text-gray-600">Sign up to start booking your bus trips</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <RegistrationForm onSubmit={handleSubmit} loading={loading} />

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or sign up with</span>
              </div>
            </div>

            <div className="mt-6">
              <SocialLogin onSocialLogin={handleSocialSignup} loading={loading} />
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-orange-500 hover:text-orange-600">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

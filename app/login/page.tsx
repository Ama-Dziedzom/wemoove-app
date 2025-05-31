"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthForm } from "@/components/auth/auth-form"
import { SocialLogin } from "@/components/auth/social-login"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (credentials: { email: string; password: string }) => {
    setLoading(true)
    setError(null)

    try {
      // In a real app, this would be an API call
      // await fetch('/api/auth/login', {
      //   method: 'POST',
      //   body: JSON.stringify(credentials)
      // })

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful login
      router.push("/")
    } catch (err) {
      setError("Invalid email or password. Please try again.")
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    setLoading(true)
    setError(null)

    try {
      // In a real app, this would redirect to the social login provider
      // window.location.href = `/api/auth/${provider}`;

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful login
      router.push("/")
    } catch (err) {
      setError(`Failed to login with ${provider}. Please try again.`)
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="font-montserrat text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="mt-2 text-gray-600">Log in to your account to continue</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <AuthForm type="login" onSubmit={handleSubmit} loading={loading} />

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <SocialLogin onSocialLogin={handleSocialLogin} loading={loading} />
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="font-semibold text-orange-500 hover:text-orange-600">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

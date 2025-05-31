"use client"

import { useState, useEffect } from "react"
import { UserProfileCard } from "@/components/profile/user-profile-card"
import { WalletInformation } from "@/components/profile/wallet-information"
import { EditProfileForm } from "@/components/profile/edit-profile-form"
import { AddPaymentMethodForm } from "@/components/profile/add-payment-method-form"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BottomNavigation } from "@/components/shared/bottom-navigation"

// Mock data for demonstration
const mockUser = {
  id: "USER789",
  firstName: "Ama",
  lastName: "Dankwa",
  email: "ama.dankwa@example.com",
  phone: "+233241234567",
  walletBalanceGHS: 50.0,
  paymentMethods: [
    { id: "MM1", type: "Mobile Money", network: "MTN", last4Digits: "6789" },
    { id: "CARD1", type: "Debit Card", brand: "Visa", last4Digits: "1234" },
  ],
}

export default function ProfilePage() {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isAddingPaymentMethod, setIsAddingPaymentMethod] = useState(false)

  // Simulate API fetch
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // In a real app, this would be an API call
        // await fetch('/api/profile')

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setUser(mockUser)
        setLoading(false)
      } catch (err) {
        setError("Failed to load profile. Please try again later.")
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const handleEditProfile = () => {
    setIsEditingProfile(true)
  }

  const handleAddPaymentMethod = () => {
    setIsAddingPaymentMethod(true)
  }

  const handleProfileUpdate = async (updatedData: any) => {
    try {
      // In a real app, this would be an API call
      // await fetch('/api/profile', { method: 'PUT', body: JSON.stringify(updatedData) })

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local state
      setUser((prev) => ({ ...prev, ...updatedData }))
      setIsEditingProfile(false)
    } catch (err) {
      setError("Failed to update profile. Please try again.")
    }
  }

  const handlePaymentMethodAdd = async (paymentMethod: any) => {
    try {
      // In a real app, this would be an API call
      // await fetch('/api/profile/payment-methods', { method: 'POST', body: JSON.stringify(paymentMethod) })

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local state
      const newPaymentMethod = {
        id: `PM${Date.now()}`,
        ...paymentMethod,
      }

      setUser((prev) => ({
        ...prev,
        paymentMethods: [...prev.paymentMethods, newPaymentMethod],
      }))

      setIsAddingPaymentMethod(false)
    } catch (err) {
      setError("Failed to add payment method. Please try again.")
    }
  }

  const handlePaymentMethodRemove = async (paymentMethodId: string) => {
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/profile/payment-methods/${paymentMethodId}`, { method: 'DELETE' })

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local state
      setUser((prev) => ({
        ...prev,
        paymentMethods: prev.paymentMethods.filter((pm: any) => pm.id !== paymentMethodId),
      }))
    } catch (err) {
      setError("Failed to remove payment method. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="container px-4 py-6 space-y-4">
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-60 w-full rounded-lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container px-4 py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container px-4 py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Profile Not Found</AlertTitle>
          <AlertDescription>Your profile could not be loaded.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <main className="flex flex-col min-h-screen bg-gray-50 pb-16">
      <div className="bg-orange-500 text-white p-4">
        <h1 className="font-montserrat text-xl font-bold">My Profile</h1>
        <p className="text-sm">Manage your personal information and payment methods</p>
      </div>

      <div className="container px-4 py-4">
        {isEditingProfile ? (
          <EditProfileForm user={user} onSubmit={handleProfileUpdate} onCancel={() => setIsEditingProfile(false)} />
        ) : (
          <UserProfileCard user={user} onEdit={handleEditProfile} />
        )}

        <div className="mt-6">
          {isAddingPaymentMethod ? (
            <AddPaymentMethodForm onSubmit={handlePaymentMethodAdd} onCancel={() => setIsAddingPaymentMethod(false)} />
          ) : (
            <WalletInformation
              paymentMethods={user.paymentMethods}
              walletBalance={user.walletBalanceGHS}
              onAddPaymentMethod={handleAddPaymentMethod}
              onRemovePaymentMethod={handlePaymentMethodRemove}
            />
          )}
        </div>
      </div>

      <BottomNavigation />
    </main>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, User, Settings } from "lucide-react"

export function BottomNavigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 z-50">
      <div className="flex justify-around items-center">
        <Link href="/" className={`flex flex-col items-center ${isActive("/") ? "text-orange-500" : "text-gray-600"}`}>
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link
          href="/history"
          className={`flex flex-col items-center ${isActive("/history") ? "text-orange-500" : "text-gray-600"}`}
        >
          <Calendar className="h-6 w-6" />
          <span className="text-xs mt-1">Bookings</span>
        </Link>

        <Link
          href="/profile"
          className={`flex flex-col items-center ${isActive("/profile") ? "text-orange-500" : "text-gray-600"}`}
        >
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>

        <Link
          href="/settings"
          className={`flex flex-col items-center ${isActive("/settings") ? "text-orange-500" : "text-gray-600"}`}
        >
          <Settings className="h-6 w-6" />
          <span className="text-xs mt-1">Settings</span>
        </Link>
      </div>
    </div>
  )
}

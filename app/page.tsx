import { SearchForm } from "@/components/home/search-form"
import { HeroBanner } from "@/components/home/hero-banner"
import { PopularRoutes } from "@/components/home/popular-routes"
import { OperatorLogos } from "@/components/home/operator-logos"
import { MobileAppBanner } from "@/components/home/mobile-app-banner"
import { BottomNavigation } from "@/components/shared/bottom-navigation"

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen bg-gray-50">
      <HeroBanner
        title="Book Your Bus Journey Across Ghana"
        subtitle="Find, compare and book bus tickets with ease"
        backgroundImage="/placeholder.svg?height=400&width=800"
      />

      <div className="container px-4 py-6 -mt-16 z-10">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h2 className="font-montserrat text-xl font-bold text-gray-800 mb-4">Find Your Bus</h2>
          <SearchForm
            onSearchSubmit={(origin, destination, date) => {
              console.log("Search submitted:", origin, destination, date)
              // In a real app, this would navigate to the bus list page with query params
            }}
          />
        </div>
      </div>

      <div className="container px-4 py-6">
        <h2 className="font-montserrat text-xl font-bold text-gray-800 mb-4">Popular Routes</h2>
        <PopularRoutes />
      </div>

      <div className="container px-4 py-6 bg-white">
        <h2 className="font-montserrat text-xl font-bold text-gray-800 mb-4">Trusted Bus Operators</h2>
        <p className="text-gray-600 mb-4">We partner with Ghana's most reliable bus companies</p>
        <OperatorLogos />
      </div>

      <div className="container px-4 py-6">
        <MobileAppBanner />
      </div>

      <BottomNavigation />
    </main>
  )
}

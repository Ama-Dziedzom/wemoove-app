import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export function MobileAppBanner() {
  return (
    <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-montserrat text-lg font-bold text-gray-800 mb-2">Download Our Mobile App</h3>
          <p className="text-gray-600 mb-4 md:mb-0">Get exclusive deals and manage your bookings on the go</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>App Store</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Google Play</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

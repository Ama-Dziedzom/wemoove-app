import { Card, CardContent } from "@/components/ui/card"

interface PaymentSummaryProps {
  bookingDetails: any
}

export function PaymentSummary({ bookingDetails }: PaymentSummaryProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      weekday: 'short',
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };
  
  return (
    <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
      <CardContent className="p-4">
        <h2 className="font-montserrat text-lg font-bold text-gray-800 mb-2">Payment Summary</h2>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Bus Operator</p>
              <p className="font-semibold">{bookingDetails.bus.operator}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Route</p>
              <p className="font-semibold">{bookingDetails.bus.route}</p>
            </div>
          </div>
          
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-semibold">{formatDate(bookingDetails.bus.departureTime)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Time</p>
              <p className="font-semibold">{formatTime(bookingDetails.bus.departureTime)}</p>
            </div>
          </div>
          \

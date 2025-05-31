"use client"

import { AlertTriangle, Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface CancellationConfirmationModalProps {
  bookingId: string
  onConfirm: (bookingId: string) => void
  onCancel: () => void
  loading: boolean
}

export function CancellationConfirmationModal({
  bookingId,
  onConfirm,
  onCancel,
  loading,
}: CancellationConfirmationModalProps) {
  return (
    <AlertDialog open={true} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>Cancel Booking</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel this booking? You will receive a refund according to our cancellation
            policy.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 text-sm text-amber-800 mb-4">
          <p className="font-semibold">Cancellation Policy:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Cancellations made 24+ hours before departure: 100% refund</li>
            <li>Cancellations made 12-24 hours before departure: 50% refund</li>
            <li>Cancellations made less than 12 hours before departure: No refund</li>
          </ul>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Keep Booking</AlertDialogCancel>
          <Button variant="destructive" onClick={() => onConfirm(bookingId)} disabled={loading} className="gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Processing..." : "Yes, Cancel Booking"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

"use client"

import { useEffect, useRef } from "react"

interface QRCodeProps {
  value: string
  size?: number
}

export default function QRCode({ value, size = 200 }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // This is a simplified QR code generator for demonstration
    // In a real app, you would use a library like qrcode.js
    const drawQRCode = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Clear canvas
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, size, size)

      // Draw a fake QR code pattern
      ctx.fillStyle = "black"

      // Draw border
      ctx.fillRect(10, 10, size - 20, 10) // top
      ctx.fillRect(10, size - 20, size - 20, 10) // bottom
      ctx.fillRect(10, 20, 10, size - 40) // left
      ctx.fillRect(size - 20, 20, 10, size - 40) // right

      // Draw position markers (corners)
      ctx.fillRect(20, 20, 30, 30) // top-left
      ctx.fillRect(size - 50, 20, 30, 30) // top-right
      ctx.fillRect(20, size - 50, 30, 30) // bottom-left

      // Draw white squares inside position markers
      ctx.fillStyle = "white"
      ctx.fillRect(30, 30, 10, 10) // top-left
      ctx.fillRect(size - 40, 30, 10, 10) // top-right
      ctx.fillRect(30, size - 40, 10, 10) // bottom-left

      // Draw random dots to simulate QR code data
      ctx.fillStyle = "black"
      const seed = value.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
      const random = (min: number, max: number) => {
        const x = Math.sin(seed + 1) * 10000
        return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min
      }

      for (let i = 0; i < 100; i++) {
        const x = random(60, size - 60)
        const y = random(60, size - 60)
        const w = random(5, 10)
        const h = random(5, 10)
        ctx.fillRect(x, y, w, h)
      }

      // Add text at the bottom
      ctx.fillStyle = "black"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.fillText(value, size / 2, size - 5)
    }

    drawQRCode()
  }, [value, size])

  return <canvas ref={canvasRef} width={size} height={size} className="mx-auto rounded-lg" />
}

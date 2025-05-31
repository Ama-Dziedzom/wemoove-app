import Image from "next/image"

interface HeroBannerProps {
  title: string
  subtitle: string
  backgroundImage: string
}

export function HeroBanner({ title, subtitle, backgroundImage }: HeroBannerProps) {
  return (
    <div className="relative w-full h-64 md:h-80 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={backgroundImage || "/placeholder.svg"}
          alt="Bus travel in Ghana"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30" />
      </div>

      <div className="relative h-full flex flex-col justify-center px-4 md:px-8">
        <h1 className="font-montserrat text-3xl md:text-4xl font-bold text-white mb-2 max-w-2xl">{title}</h1>
        <p className="font-lato text-lg md:text-xl text-white/90 max-w-xl">{subtitle}</p>
      </div>
    </div>
  )
}

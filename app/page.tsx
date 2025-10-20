'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const backgroundImages = [
  '/Bali.jpg',
  '/Paris.jpg',
  '/Tokyo.jpg',
  '/Dubai.jpg',
  '/London.jpg',
  '/santorini.jpg',
  '/NewYork.jpg'
]

export default function Home() {
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 6000) // Change image every 6 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Hero Background Slideshow with Overlay */}
      <div className="absolute inset-0 w-full h-full">
        {backgroundImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-2500 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image}
              alt={`Travel destination ${index + 1}`}
              fill
              className="object-cover brightness-50"
              priority={index === 0}
              quality={100}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Title and Subtitle */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
              Your AI Travel Companion
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 drop-shadow-md">
              Create your perfect itinerary in seconds
            </p>
          </div>

          {/* CTA Button */}
          <div>
            <button
              onClick={() => router.push('/plan-trip')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer"
            >
              Plan a Trip
            </button>
          </div>

          {/* Subtle tagline */}
          <p className="text-gray-200 text-sm">
            Personalized travel plans powered by AI
          </p>

          {/* Image Indicator Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {backgroundImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentImageIndex
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

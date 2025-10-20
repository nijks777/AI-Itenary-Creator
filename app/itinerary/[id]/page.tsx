'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { tripStorage } from '@/lib/trip-storage'
import { ItineraryDisplay } from '@/components/dashboard/itinerary-display'

export default function ItineraryPage() {
  const params = useParams()
  const router = useRouter()
  const [trip, setTrip] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const tripId = params.id as string
    const savedTrip = tripStorage.getTripById(tripId)

    if (savedTrip) {
      setTrip(savedTrip)
    } else {
      // Trip not found, redirect to home
      router.push('/')
    }
    setLoading(false)
  }, [params.id, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your itinerary...</p>
        </div>
      </div>
    )
  }

  if (!trip) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        {/* Itinerary Display */}
        <ItineraryDisplay itinerary={trip.itinerary} />
      </div>
    </div>
  )
}

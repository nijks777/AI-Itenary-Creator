'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Check, Hotel, Utensils, MapPin, Sparkles } from 'lucide-react'
import { tripStorage } from '@/lib/trip-storage'

function GenerateMultiAgentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isGenerating, setIsGenerating] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [generationSteps, setGenerationSteps] = useState([
    { label: 'Fetching real places from Google', icon: MapPin, completed: false },
    { label: 'Hotel Expert analyzing accommodations', icon: Hotel, completed: false },
    { label: 'Restaurant Expert planning dining', icon: Utensils, completed: false },
    { label: 'Attraction Expert selecting sights', icon: MapPin, completed: false },
    { label: 'Master Planner combining everything', icon: Sparkles, completed: false },
  ])
  const [currentStep, setCurrentStep] = useState(0)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const formDataString = searchParams.get('data')
    if (!formDataString) {
      router.push('/plan-trip')
      return
    }

    const formData = JSON.parse(decodeURIComponent(formDataString))
    generateTrip(formData)

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [searchParams, router])

  const generateTrip = async (formData: any) => {
    try {
      abortControllerRef.current = new AbortController()

      // Simulate step progression
      const stepInterval = setInterval(() => {
        setCurrentStep(prev => {
          const next = prev + 1
          if (next < generationSteps.length) {
            setGenerationSteps(steps =>
              steps.map((step, idx) =>
                idx === prev ? { ...step, completed: true } : step
              )
            )
            return next
          }
          return prev
        })
      }, 3000) // Each agent takes ~3 seconds

      const response = await fetch('/api/generate-trip-stream-multi-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: abortControllerRef.current.signal,
        // Note: Next.js API routes don't have a timeout by default
      })

      clearInterval(stepInterval)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate trip')
      }

      const itinerary = await response.json()

      // Mark all steps as completed
      setGenerationSteps(prev => prev.map(step => ({ ...step, completed: true })))
      setCurrentStep(generationSteps.length)

      // Save to localStorage
      const tripId = tripStorage.saveTrip(formData.destination, itinerary, formData)

      // Wait a moment to show completion
      setTimeout(() => {
        setIsGenerating(false)
        router.push(`/itinerary/${tripId}`)
      }, 1000)

    } catch (err: any) {
      console.error('Error generating trip:', err)

      if (err.name === 'AbortError') {
        return
      }

      setError(err.message || 'Failed to generate itinerary')
      setIsGenerating(false)

      setTimeout(() => {
        router.push('/plan-trip')
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Multi-Agent AI Trip Planner
          </h1>
          <p className="text-gray-600">
            Our AI agents are working together to create your perfect itinerary
          </p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-4 mb-8">
          {generationSteps.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStep
            const isCompleted = step.completed

            return (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                  isCompleted
                    ? 'border-green-500 bg-green-50'
                    : isActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? 'bg-green-500'
                      : isActive
                      ? 'bg-blue-500'
                      : 'bg-gray-300'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6 text-white" />
                  ) : isActive ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <Icon className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-semibold ${
                      isCompleted || isActive ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-700 font-semibold mb-2">Generation Failed</p>
            <p className="text-red-600 text-sm">{error}</p>
            <p className="text-red-500 text-xs mt-2">Redirecting to planning page...</p>
          </div>
        )}

        {/* Success Message */}
        {!isGenerating && !error && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <Check className="w-12 h-12 text-green-600 mx-auto mb-2" />
            <p className="text-green-700 font-semibold">Itinerary Created Successfully!</p>
            <p className="text-green-600 text-sm">Redirecting to your trip...</p>
          </div>
        )}

        {/* Fun Facts */}
        {isGenerating && !error && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-sm text-blue-700 text-center italic">
              💡 Our multi-agent system ensures you get real, verified places from Google Maps
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function GenerateMultiAgentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <GenerateMultiAgentContent />
    </Suspense>
  )
}

'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Check, Sparkles } from 'lucide-react'
import { tripStorage } from '@/lib/trip-storage'

export default function GeneratePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [streamingText, setStreamingText] = useState('')
  const [isGenerating, setIsGenerating] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [generationSteps, setGenerationSteps] = useState([
    { label: 'Analyzing your preferences', completed: false },
    { label: 'Finding best destinations and activities', completed: false },
    { label: 'Planning day-by-day itinerary', completed: false },
    { label: 'Adding restaurant recommendations', completed: false },
    { label: 'Finalizing your perfect trip', completed: false },
  ])
  const [currentStep, setCurrentStep] = useState(0)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    // Get form data from URL params
    const formDataString = searchParams.get('data')
    if (!formDataString) {
      router.push('/plan-trip')
      return
    }

    const formData = JSON.parse(decodeURIComponent(formDataString))
    generateTrip(formData)

    return () => {
      // Cleanup: abort fetch on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [searchParams, router])

  const generateTrip = async (formData: any) => {
    try {
      abortControllerRef.current = new AbortController()

      const response = await fetch('/api/generate-trip-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate trip')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No response stream')
      }

      let fullText = ''
      let stepIndex = 0
      const stepInterval = setInterval(() => {
        if (stepIndex < generationSteps.length) {
          setGenerationSteps(prev =>
            prev.map((step, idx) =>
              idx === stepIndex ? { ...step, completed: true } : step
            )
          )
          setCurrentStep(stepIndex)
          stepIndex++
        } else {
          clearInterval(stepInterval)
        }
      }, 2000) // Complete a step every 2 seconds

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          clearInterval(stepInterval)
          // Mark all steps as completed
          setGenerationSteps(prev => prev.map(step => ({ ...step, completed: true })))
          break
        }

        const chunk = decoder.decode(value, { stream: true })
        fullText += chunk
        setStreamingText(fullText)
      }

      // Parse the complete JSON
      try {
        const itinerary = JSON.parse(fullText)

        // Save to localStorage
        const tripId = tripStorage.saveTrip(formData.destination, itinerary, formData)

        setIsGenerating(false)

        // Redirect to itinerary page after a short delay
        setTimeout(() => {
          router.push(`/itinerary/${tripId}`)
        }, 1500)
      } catch (parseError) {
        console.error('Parse error:', parseError)
        throw new Error('Failed to parse itinerary')
      }

    } catch (err: any) {
      if (err.name === 'AbortError') {
        return // User navigated away
      }
      console.error('Generation error:', err)
      setError(err.message || 'Failed to generate trip')
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Sparkles className="w-16 h-16 text-blue-600 animate-pulse" />
                <div className="absolute inset-0 bg-blue-400 blur-xl opacity-50 animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Creating Your Perfect Trip
            </h1>
            <p className="text-gray-600">
              Our AI is crafting a personalized itinerary just for you...
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8 space-y-3">
            {generationSteps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                  step.completed
                    ? 'bg-green-50 border border-green-200'
                    : currentStep === index
                    ? 'bg-blue-50 border border-blue-200'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                {step.completed ? (
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : currentStep === index ? (
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                )}
                <span
                  className={`font-medium ${
                    step.completed
                      ? 'text-green-700'
                      : currentStep === index
                      ? 'text-blue-700'
                      : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          {/* Streaming Content Preview */}
          {streamingText && (
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                Generating Content...
              </h3>
              <div className="text-sm text-gray-700 font-mono whitespace-pre-wrap max-h-64 overflow-y-auto">
                {streamingText.slice(0, 500)}...
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 font-medium">❌ {error}</p>
              <button
                onClick={() => router.push('/plan-trip')}
                className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium"
              >
                ← Back to planning
              </button>
            </div>
          )}

          {/* Success Message */}
          {!isGenerating && !error && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <Check className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-green-900 mb-2">
                ✨ Your trip is ready!
              </h3>
              <p className="text-green-700">Redirecting to your itinerary...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { MapPin, DollarSign, Calendar, Users, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ItineraryDisplay } from './itinerary-display'

interface PlanTripFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PlanTripForm({ open, onOpenChange }: PlanTripFormProps) {
  const [formData, setFormData] = useState({
    destination: '',
    budget: '',
    days: '',
    numberOfPeople: '',
    averageAge: '',
    tripDescription: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [itinerary, setItinerary] = useState<any>(null)
  const [showItinerary, setShowItinerary] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate itinerary')
      }

      setItinerary(data.itinerary)
      setShowItinerary(true)
      onOpenChange(false)

      // Reset form
      setFormData({
        destination: '',
        budget: '',
        days: '',
        numberOfPeople: '',
        averageAge: '',
        tripDescription: ''
      })

    } catch (err: any) {
      console.error('Error generating trip:', err)
      setError(err.message || 'Failed to generate trip. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const closeItinerary = () => {
    setShowItinerary(false)
    setItinerary(null)
  }

  return (
    <>
      {/* Trip Planning Form Dialog */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Plan Your Dream Trip
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Tell us about your travel plans and we'll create a personalized itinerary for you
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Destination */}
            <div className="space-y-2">
              <Label htmlFor="destination" className="text-sm font-medium text-gray-900">
                <MapPin className="inline-block w-4 h-4 mr-2 text-blue-600" />
                Where do you want to go?
              </Label>
              <Input
                id="destination"
                placeholder="e.g., Paris, France"
                value={formData.destination}
                onChange={(e) => handleChange('destination', e.target.value)}
                className="w-full"
                required
                disabled={isLoading}
              />
            </div>

            {/* Budget and Days Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget" className="text-sm font-medium text-gray-900">
                  <DollarSign className="inline-block w-4 h-4 mr-2 text-green-600" />
                  Budget per person
                </Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="e.g., 1500"
                  value={formData.budget}
                  onChange={(e) => handleChange('budget', e.target.value)}
                  className="w-full"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="days" className="text-sm font-medium text-gray-900">
                  <Calendar className="inline-block w-4 h-4 mr-2 text-purple-600" />
                  Number of days
                </Label>
                <Input
                  id="days"
                  type="number"
                  placeholder="e.g., 7"
                  value={formData.days}
                  onChange={(e) => handleChange('days', e.target.value)}
                  className="w-full"
                  min="1"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Number of People and Average Age Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numberOfPeople" className="text-sm font-medium text-gray-900">
                  <Users className="inline-block w-4 h-4 mr-2 text-orange-600" />
                  Number of travelers
                </Label>
                <Input
                  id="numberOfPeople"
                  type="number"
                  placeholder="e.g., 2"
                  value={formData.numberOfPeople}
                  onChange={(e) => handleChange('numberOfPeople', e.target.value)}
                  className="w-full"
                  min="1"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="averageAge" className="text-sm font-medium text-gray-900">
                  <User className="inline-block w-4 h-4 mr-2 text-pink-600" />
                  Average age of travelers
                </Label>
                <Input
                  id="averageAge"
                  type="number"
                  placeholder="e.g., 30"
                  value={formData.averageAge}
                  onChange={(e) => handleChange('averageAge', e.target.value)}
                  className="w-full"
                  min="1"
                  max="120"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Trip Description */}
            <div className="space-y-2">
              <Label htmlFor="tripDescription" className="text-sm font-medium text-gray-900">
                What kind of trip are you looking for?
              </Label>
              <Textarea
                id="tripDescription"
                placeholder="Tell us about your ideal trip... Are you looking for adventure, relaxation, culture, food experiences? Any specific interests or activities you want to include?"
                value={formData.tripDescription}
                onChange={(e) => handleChange('tripDescription', e.target.value)}
                className="w-full min-h-[120px] resize-none"
                required
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500">
                Be as detailed as possible to get the best recommendations
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="px-6"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-6 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Trip Plan'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Itinerary Display Dialog */}
      <Dialog open={showItinerary} onOpenChange={closeItinerary}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Your Trip Itinerary</DialogTitle>
            <DialogDescription>
              Detailed itinerary for your upcoming trip
            </DialogDescription>
          </DialogHeader>
          {itinerary && <ItineraryDisplay itinerary={itinerary} />}
        </DialogContent>
      </Dialog>
    </>
  )
}

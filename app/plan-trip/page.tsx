'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, DollarSign, Calendar, Users, Loader2, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CustomDropdown } from '@/components/ui/custom-dropdown'

const tripTypes = ['Adventure', 'Relaxation', 'Culture', 'Food', 'Shopping', 'Nature', 'Nightlife']
const accommodationOptions = ['Hotel', 'Airbnb', 'Hostel', 'Resort', 'Budget', 'Luxury']
const transportationOptions = ['Public Transport', 'Rental Car', 'Walking', 'Taxis', 'Tours']
const groupTypes = ['Solo', 'Couple', 'Family', 'Friends Group', 'Corporate']

// Dropdown options
const groupTypeOptions = groupTypes.map(type => ({ value: type, label: type }))
const accommodationDropdownOptions = accommodationOptions.map(option => ({ value: option, label: option }))
const transportationDropdownOptions = transportationOptions.map(option => ({ value: option, label: option }))

export default function PlanTripPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    startingPoint: '',
    destination: '',
    budget: '',
    days: '',
    startDate: '',
    endDate: '',
    numberOfPeople: '',
    groupType: '',
    tripType: [] as string[],
    accommodation: '',
    transportation: '',
    prePlannedActivities: '',
    tripDescription: ''
  })

  const [dateInputMethod, setDateInputMethod] = useState<'days' | 'dates'>('days') // User chooses method
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleTripTypeChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      tripType: prev.tripType.includes(type)
        ? prev.tripType.filter(t => t !== type)
        : [...prev.tripType, type]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Only destination is required
    if (!formData.destination.trim()) {
      setError('Please enter a destination')
      return
    }

    // Encode form data and redirect to generation page
    const formDataString = encodeURIComponent(JSON.stringify(formData))
    router.push(`/generate?data=${formDataString}`)
  }

  const goBack = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-4 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {/* Header with Back Button */}
          <div className="mb-6">
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Plan Your Dream Trip
            </h1>
            <p className="text-gray-600 text-base">
              Tell us about your travel plans and we'll create a personalized itinerary for you
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Row 1: Starting Point & Destination */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startingPoint" className="text-sm font-medium text-gray-900">
                  <MapPin className="inline-block w-4 h-4 mr-2 text-green-600" />
                  Starting Point <span className="text-gray-500 text-xs">(Optional)</span>
                </Label>
                <Input
                  id="startingPoint"
                  placeholder="e.g., New York, USA"
                  value={formData.startingPoint}
                  onChange={(e) => handleChange('startingPoint', e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">For flight/train booking recommendations</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination" className="text-sm font-medium text-gray-900">
                  <MapPin className="inline-block w-4 h-4 mr-2 text-blue-600" />
                  Destination <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="destination"
                  placeholder="e.g., Paris, France"
                  value={formData.destination}
                  onChange={(e) => handleChange('destination', e.target.value)}
                  className="w-full"
                  required
                />
              </div>
            </div>

            {/* Choose Date Input Method */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <Label className="text-sm font-semibold text-gray-900 mb-3 block">
                How would you like to plan your trip duration?
              </Label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setDateInputMethod('days')
                    setFormData(prev => ({ ...prev, startDate: '', endDate: '' }))
                  }}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                    dateInputMethod === 'days'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Number of Days
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDateInputMethod('dates')
                    setFormData(prev => ({ ...prev, days: '' }))
                  }}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                    dateInputMethod === 'dates'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Specific Dates
                </button>
              </div>
            </div>

            {/* Conditional: Days or Dates */}
            {dateInputMethod === 'days' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="days" className="text-sm font-medium text-gray-900">
                    <Calendar className="inline-block w-4 h-4 mr-2 text-purple-600" />
                    Number of days <span className="text-gray-500 text-xs">(Optional)</span>
                  </Label>
                  <Input
                    id="days"
                    type="number"
                    placeholder="e.g., 7"
                    value={formData.days}
                    onChange={(e) => handleChange('days', e.target.value)}
                    className="w-full"
                    min="1"
                    />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-sm font-medium text-gray-900">
                    <DollarSign className="inline-block w-4 h-4 mr-2 text-green-600" />
                    Budget/person (USD) <span className="text-gray-500 text-xs">(Optional)</span>
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="e.g., 1500"
                    value={formData.budget}
                    onChange={(e) => handleChange('budget', e.target.value)}
                    className="w-full"
                    />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numberOfPeople" className="text-sm font-medium text-gray-900">
                    <Users className="inline-block w-4 h-4 mr-2 text-orange-600" />
                    Travelers <span className="text-gray-500 text-xs">(Optional)</span>
                  </Label>
                  <Input
                    id="numberOfPeople"
                    type="number"
                    placeholder="e.g., 2"
                    value={formData.numberOfPeople}
                    onChange={(e) => handleChange('numberOfPeople', e.target.value)}
                    className="w-full"
                    min="1"
                    />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-medium text-gray-900">
                    <Calendar className="inline-block w-4 h-4 mr-2 text-blue-500" />
                    Start date <span className="text-gray-500 text-xs">(Optional)</span>
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    className="w-full"
                    />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-sm font-medium text-gray-900">
                    <Calendar className="inline-block w-4 h-4 mr-2 text-blue-500" />
                    End date <span className="text-gray-500 text-xs">(Optional)</span>
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    className="w-full"
                    />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="budget" className="text-sm font-medium text-gray-900">
                      <DollarSign className="inline-block w-4 h-4 mr-2 text-green-600" />
                      Budget <span className="text-gray-500 text-xs">(Optional)</span>
                    </Label>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="1500"
                      value={formData.budget}
                      onChange={(e) => handleChange('budget', e.target.value)}
                      className="w-full"
                        />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numberOfPeople" className="text-sm font-medium text-gray-900">
                      <Users className="inline-block w-4 h-4 mr-2 text-orange-600" />
                      Travelers <span className="text-gray-500 text-xs">(Optional)</span>
                    </Label>
                    <Input
                      id="numberOfPeople"
                      type="number"
                      placeholder="2"
                      value={formData.numberOfPeople}
                      onChange={(e) => handleChange('numberOfPeople', e.target.value)}
                      className="w-full"
                      min="1"
                        />
                  </div>
                </div>
              </div>
            )}

            {/* Row 3: Group Type, Trip Type Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="groupType" className="text-sm font-medium text-gray-900">
                  <Users className="inline-block w-4 h-4 mr-2 text-indigo-600" />
                  Who is traveling?
                </Label>
                <CustomDropdown
                  options={groupTypeOptions}
                  value={formData.groupType}
                  onChange={(value) => handleChange('groupType', value)}
                  placeholder="Select group type..."
                  icon={<Users className="w-4 h-4 text-indigo-600" />}
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label className="text-sm font-medium text-gray-900">
                  What kind of trip?
                </Label>
                <div className="flex flex-wrap gap-2">
                  {tripTypes.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleTripTypeChange(type)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all cursor-pointer ${
                        formData.tripType.includes(type)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                        >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 4: Trip Description (Full Width) */}
            <div className="space-y-2">
              <Label htmlFor="tripDescription" className="text-sm font-medium text-gray-900">
                Tell us more about your ideal trip <span className="text-gray-500 text-xs">(Optional)</span>
              </Label>
              <Textarea
                id="tripDescription"
                placeholder="Describe your ideal trip experience, activities you want, dietary preferences, etc..."
                value={formData.tripDescription}
                onChange={(e) => handleChange('tripDescription', e.target.value)}
                className="w-full min-h-[80px] resize-none"
              />
            </div>

            {/* Additional Info Collapsible Section */}
            <div className="border border-gray-200 rounded-lg">
              <button
                type="button"
                onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span className="font-semibold text-gray-900">Additional Information (Optional)</span>
                {showAdditionalInfo ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {showAdditionalInfo && (
                <div className="border-t border-gray-200 p-3 space-y-3 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Accommodation Preference */}
                    <div className="space-y-2">
                      <Label htmlFor="accommodation" className="text-sm font-medium text-gray-900">
                        Accommodation Type
                      </Label>
                      <CustomDropdown
                        options={accommodationDropdownOptions}
                        value={formData.accommodation}
                        onChange={(value) => handleChange('accommodation', value)}
                        placeholder="Select preference..."
                            />
                    </div>

                    {/* Transportation Style */}
                    <div className="space-y-2">
                      <Label htmlFor="transportation" className="text-sm font-medium text-gray-900">
                        Transportation Style
                      </Label>
                      <CustomDropdown
                        options={transportationDropdownOptions}
                        value={formData.transportation}
                        onChange={(value) => handleChange('transportation', value)}
                        placeholder="Select preference..."
                            />
                    </div>
                  </div>

                  {/* Pre-planned Activities (Full Width) */}
                  <div className="space-y-2">
                    <Label htmlFor="prePlannedActivities" className="text-sm font-medium text-gray-900">
                      Pre-planned or Booked Activities
                    </Label>
                    <Textarea
                      id="prePlannedActivities"
                      placeholder="List any activities you've already booked or planned. E.g., 'Eiffel Tower tour on Day 2, Wine tasting on Day 4, Museum visit on Day 3 morning'..."
                      value={formData.prePlannedActivities}
                      onChange={(e) => handleChange('prePlannedActivities', e.target.value)}
                      className="w-full min-h-[80px] resize-none text-sm"
                        />
                    <p className="text-xs text-gray-500">
                      This helps AI avoid scheduling conflicts and create a better itinerary around your pre-booked activities
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-3 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                className="px-6 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold"
              >
                Generate Trip Plan
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

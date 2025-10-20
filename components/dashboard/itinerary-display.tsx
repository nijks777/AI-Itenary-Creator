'use client'

import { MapPin, DollarSign, Clock, Utensils, Hotel, ExternalLink, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import jsPDF from 'jspdf'

interface Activity {
  time: string
  activity: string
  description: string
  location: string
  mapsLink: string
  estimatedCost: string
  duration: string
  tips?: string
}

interface Meal {
  type: string
  restaurant: string
  cuisine: string
  location: string
  mapsLink: string
  estimatedCost: string
  mustTry: string
}

interface Accommodation {
  name: string
  type: string
  location: string
  mapsLink: string
  priceRange: string
  amenities: string[]
}

interface DayPlan {
  day: number
  title: string
  activities: Activity[]
  meals: Meal[]
  accommodation: Accommodation
  dailyBudget: string
}

interface Itinerary {
  title: string
  destination: string
  duration: string
  overview: string
  totalBudget: string
  days: DayPlan[]
  travelTips: string[]
  packingList: string[]
  transportation: {
    gettingThere: string
    gettingAround: string
    costs: string
  }
  localCuisine: string[]
  culturalTips: string[]
  emergencyInfo: {
    police: string
    ambulance: string
    embassy: string
  }
}

interface ItineraryDisplayProps {
  itinerary: Itinerary
}

export function ItineraryDisplay({ itinerary }: ItineraryDisplayProps) {

  const downloadPDF = () => {
    const doc = new jsPDF()
    let yPosition = 20

    // Helper function to add text with word wrap
    const addText = (text: string, x: number, maxWidth: number) => {
      const lines = doc.splitTextToSize(text, maxWidth)
      doc.text(lines, x, yPosition)
      yPosition += lines.length * 7
    }

    // Helper to check page break
    const checkPageBreak = () => {
      if (yPosition > 270) {
        doc.addPage()
        yPosition = 20
      }
    }

    // Title
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    addText(itinerary.title, 20, 170)
    yPosition += 5

    // Overview
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    addText(`Destination: ${itinerary.destination}`, 20, 170)
    addText(`Duration: ${itinerary.duration}`, 20, 170)
    addText(`Total Budget: ${itinerary.totalBudget}`, 20, 170)
    yPosition += 5

    doc.setFontSize(11)
    addText(itinerary.overview, 20, 170)
    yPosition += 10

    // Days
    itinerary.days.forEach((day) => {
      checkPageBreak()

      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      addText(`Day ${day.day}: ${day.title}`, 20, 170)
      yPosition += 3

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      addText(`Daily Budget: ${day.dailyBudget}`, 20, 170)
      yPosition += 5

      // Activities
      day.activities.forEach((activity) => {
        checkPageBreak()
        doc.setFont('helvetica', 'bold')
        addText(`${activity.time} - ${activity.activity}`, 25, 165)
        doc.setFont('helvetica', 'normal')
        addText(activity.description, 25, 165)
        addText(`Location: ${activity.location}`, 25, 165)
        addText(`Cost: ${activity.estimatedCost} | Duration: ${activity.duration}`, 25, 165)
        if (activity.tips) {
          addText(`Tip: ${activity.tips}`, 25, 165)
        }
        yPosition += 3
      })

      // Meals
      day.meals.forEach((meal) => {
        checkPageBreak()
        doc.setFont('helvetica', 'bold')
        addText(`${meal.type}: ${meal.restaurant}`, 25, 165)
        doc.setFont('helvetica', 'normal')
        addText(`${meal.cuisine} - ${meal.location}`, 25, 165)
        addText(`Must try: ${meal.mustTry}`, 25, 165)
        addText(`Cost: ${meal.estimatedCost}`, 25, 165)
        yPosition += 3
      })

      // Accommodation
      if (day.accommodation) {
        checkPageBreak()
        doc.setFont('helvetica', 'bold')
        addText(`Accommodation: ${day.accommodation.name}`, 25, 165)
        doc.setFont('helvetica', 'normal')
        addText(`${day.accommodation.type} - ${day.accommodation.location}`, 25, 165)
        addText(`Price: ${day.accommodation.priceRange}`, 25, 165)
        yPosition += 5
      }
    })

    // Travel Tips
    checkPageBreak()
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    addText('Travel Tips', 20, 170)
    yPosition += 3

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    itinerary.travelTips.forEach((tip, index) => {
      checkPageBreak()
      addText(`${index + 1}. ${tip}`, 25, 165)
    })
    yPosition += 5

    // Packing List
    checkPageBreak()
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    addText('Packing List', 20, 170)
    yPosition += 3

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    addText(itinerary.packingList.join(', '), 25, 165)
    yPosition += 5

    // Local Cuisine
    checkPageBreak()
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    addText('Local Cuisine to Try', 20, 170)
    yPosition += 3

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    addText(itinerary.localCuisine.join(', '), 25, 165)
    yPosition += 5

    // Cultural Tips
    checkPageBreak()
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    addText('Cultural Tips', 20, 170)
    yPosition += 3

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    itinerary.culturalTips.forEach((tip, index) => {
      checkPageBreak()
      addText(`${index + 1}. ${tip}`, 25, 165)
    })

    // Save PDF
    doc.save(`${itinerary.destination.replace(/[^a-z0-9]/gi, '_')}_itinerary.pdf`)
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl mb-2">{itinerary.title}</CardTitle>
              <CardDescription className="text-blue-100 text-lg">
                {itinerary.destination} • {itinerary.duration}
              </CardDescription>
            </div>
            <Button
              onClick={downloadPDF}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-blue-50 mb-4">{itinerary.overview}</p>
          <div className="flex items-center gap-2 text-blue-50">
            <DollarSign className="w-5 h-5" />
            <span className="font-semibold">Total Budget: {itinerary.totalBudget}</span>
          </div>
        </CardContent>
      </Card>

      {/* Day by Day Itinerary */}
      <div className="space-y-6">
        {itinerary.days.map((day) => (
          <Card key={day.day} className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl text-gray-900">
                    Day {day.day}: {day.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    Daily Budget: {day.dailyBudget}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Activities Timeline */}
              <div className="space-y-6">
                <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Daily Schedule
                </h3>
                <div className="relative border-l-2 border-blue-200 ml-4 pl-8 space-y-8">
                  {day.activities.map((activity, idx) => {
                    // Calculate time gap between activities
                    const showTimeGap = idx > 0
                    const previousActivity = idx > 0 ? day.activities[idx - 1] : null

                    return (
                      <div key={idx}>
                        {/* Show time gap/free time indicator */}
                        {showTimeGap && previousActivity && (
                          <div className="relative -mt-4 mb-4">
                            <div className="absolute -left-10 top-2 w-6 h-6 bg-gray-300 rounded-full border-4 border-white flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <div className="bg-gray-50 rounded-lg border border-dashed border-gray-300 p-3">
                              <p className="text-xs text-gray-500 italic">
                                ⏱️ Free time • Travel between locations or rest
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Activity */}
                        <div className="relative">
                          <div className="absolute -left-10 top-0 w-6 h-6 bg-blue-600 rounded-full border-4 border-white"></div>
                          <div className="bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{activity.time}</span>
                                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{activity.duration}</span>
                                </div>
                                <h4 className="font-bold text-gray-900 text-lg">{activity.activity}</h4>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-green-600">{activity.estimatedCost}</p>
                              </div>
                            </div>
                            <p className="text-gray-700 mb-3 leading-relaxed">{activity.description}</p>
                            <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                              <MapPin className="w-4 h-4 mt-0.5 text-blue-500" />
                              <span>{activity.location}</span>
                            </div>
                            {activity.tips && (
                              <p className="text-sm text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-100 mt-3">
                                💡 <span className="font-semibold">Pro Tip:</span> {activity.tips}
                              </p>
                            )}
                            {activity.mapsLink && (
                              <a
                                href={activity.mapsLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-3 font-medium"
                              >
                                <ExternalLink className="w-4 h-4" />
                                View on Google Maps
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Meals */}
                {day.meals && day.meals.length > 0 && (
                  <>
                    <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2 mt-8">
                      <Utensils className="w-5 h-5 text-orange-600" />
                      Meals
                    </h3>
                    <div className="grid gap-4">
                      {day.meals.map((meal, idx) => (
                        <div key={idx} className="bg-orange-50 rounded-lg border border-orange-200 p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="text-xs font-semibold text-orange-600 uppercase">{meal.type}</span>
                              <h4 className="font-bold text-gray-900">{meal.restaurant}</h4>
                              <p className="text-sm text-gray-600">{meal.cuisine}</p>
                            </div>
                            <span className="font-semibold text-gray-900">{meal.estimatedCost}</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">
                            <span className="font-semibold">Must try:</span> {meal.mustTry}
                          </p>
                          <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                            <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                            <span>{meal.location}</span>
                          </div>
                          {meal.mapsLink && (
                            <a
                              href={meal.mapsLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Open in Google Maps
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Accommodation */}
                {day.accommodation && (
                  <>
                    <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2 mt-8">
                      <Hotel className="w-5 h-5 text-purple-600" />
                      Accommodation
                    </h3>
                    <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-gray-900">{day.accommodation.name}</h4>
                          <p className="text-sm text-gray-600">{day.accommodation.type}</p>
                        </div>
                        <span className="font-semibold text-gray-900">{day.accommodation.priceRange}</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                        <span>{day.accommodation.location}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {day.accommodation.amenities.map((amenity, idx) => (
                          <span key={idx} className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">
                            {amenity}
                          </span>
                        ))}
                      </div>
                      {day.accommodation.mapsLink && (
                        <a
                          href={day.accommodation.mapsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Open in Google Maps
                        </a>
                      )}
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Travel Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Travel Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {itinerary.travelTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-blue-600 font-bold">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Packing List */}
        <Card>
          <CardHeader>
            <CardTitle>Packing List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {itinerary.packingList.map((item, idx) => (
                <span key={idx} className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                  {item}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transportation */}
        <Card>
          <CardHeader>
            <CardTitle>Transportation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900">Getting There</h4>
              <p className="text-gray-700">{itinerary.transportation.gettingThere}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Getting Around</h4>
              <p className="text-gray-700">{itinerary.transportation.gettingAround}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Estimated Costs</h4>
              <p className="text-gray-700">{itinerary.transportation.costs}</p>
            </div>
          </CardContent>
        </Card>

        {/* Local Cuisine */}
        <Card>
          <CardHeader>
            <CardTitle>Local Cuisine to Try</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {itinerary.localCuisine.map((dish, idx) => (
                <span key={idx} className="text-sm bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                  {dish}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cultural Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Cultural Etiquette</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {itinerary.culturalTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-purple-600 font-bold">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Emergency Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Emergency Contacts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="font-semibold">Police:</span> {itinerary.emergencyInfo.police}
            </div>
            <div>
              <span className="font-semibold">Ambulance:</span> {itinerary.emergencyInfo.ambulance}
            </div>
            <div>
              <span className="font-semibold">Embassy:</span> {itinerary.emergencyInfo.embassy}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

'use client'

import { MapPin, DollarSign, Clock, Utensils, Hotel, ExternalLink, Download, Star, Phone, Globe, ChevronDown, ChevronUp, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ImageModal } from '@/components/ui/image-modal'
import { useState } from 'react'
import jsPDF from 'jspdf'

interface Activity {
  time?: string  // Legacy support
  timeOfDay?: "Morning" | "Afternoon" | "Evening"  // New format
  activity: string
  description: string
  location: string
  mapsLink: string
  rating?: number
  reviews?: number
  estimatedCost: string
  duration: string
  tips?: string
  // Extended fields
  website?: string
  phone?: string
  photoUrls?: string[]
  openingHours?: string[]
  openNow?: boolean
  placeReviews?: Array<{
    author_name: string
    rating: number
    text: string
    time?: number | string
    relative_time_description: string
  }>
}

interface Meal {
  type: string
  restaurant: string
  cuisine: string
  location: string
  mapsLink: string
  rating?: number
  reviews?: number
  estimatedCost: string
  mustTry: string
  // Extended fields
  website?: string
  phone?: string
  photoUrls?: string[]
  openingHours?: string[]
  openNow?: boolean
  placeReviews?: Array<{
    author_name: string
    rating: number
    text: string
    time?: number | string
    relative_time_description: string
  }>
}

interface Accommodation {
  name: string
  type: string
  location: string
  mapsLink: string
  rating?: number
  reviews?: number
  priceRange: string
  amenities?: string[]
  // Extended fields
  website?: string
  phone?: string
  photoUrls?: string[]
  openingHours?: string[]
  openNow?: boolean
  placeReviews?: Array<{
    author_name: string
    rating: number
    text: string
    time?: number | string
    relative_time_description: string
  }>
}

interface DayPlan {
  day: number
  title: string
  activities: Activity[]
  meals: Meal[]
  accommodation: Accommodation
  dailyBudget: string
}

interface AccommodationOption extends Accommodation {
  whyRecommended?: string
}

interface TravelEssential {
  type: 'Tour Guide' | 'Scooter Rental' | 'Car Rental' | 'Bike Rental'
  name: string
  contact: string
  description: string
  estimatedCost?: string
  website?: string
}

interface Itinerary {
  title: string
  destination: string
  duration: string
  overview: string
  totalBudget: string
  accommodationOptions?: AccommodationOption[]
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
  travelEssentials?: TravelEssential[]
}

interface ItineraryDisplayProps {
  itinerary: Itinerary
}

// More Details Card Component
interface MoreDetailsProps {
  item: Activity | Meal | Accommodation
}

function MoreDetailsSection({ item }: MoreDetailsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const hasExtendedInfo = (item.photoUrls && item.photoUrls.length > 0) ||
                          (item.openingHours && item.openingHours.length > 0) ||
                          item.website ||
                          item.phone ||
                          (item.placeReviews && item.placeReviews.length > 0)

  if (!hasExtendedInfo) {
    return null
  }

  return (
    <div className="mt-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
      >
        {isOpen ? (
          <>
            <ChevronUp className="w-4 h-4" />
            Hide Details
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            More Details
          </>
        )}
      </button>

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          src={selectedImage}
          alt="Place photo"
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}

      {isOpen && (
        <div className="mt-4 space-y-4 border-t pt-4">
          {/* Photos */}
          {item.photoUrls && item.photoUrls.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                📸 Photos
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {item.photoUrls.slice(0, 4).map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Photo ${idx + 1}`}
                    onClick={() => setSelectedImage(url)}
                    className="w-full h-24 object-cover rounded-lg border hover:scale-105 transition-transform cursor-pointer"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Opening Hours */}
          {item.openingHours && item.openingHours.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                🕒 Opening Hours
                {item.openNow !== undefined && (
                  <span className={`text-xs px-2 py-1 rounded ${item.openNow ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {item.openNow ? '✅ Open Now' : '🔴 Closed'}
                  </span>
                )}
              </h5>
              <ul className="text-sm text-gray-700 space-y-1">
                {item.openingHours.map((hours, idx) => (
                  <li key={idx}>• {hours}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact Info */}
          {(item.website || item.phone) && (
            <div>
              <h5 className="text-sm font-semibold text-gray-900 mb-2">📞 Contact & Booking</h5>
              <div className="space-y-2">
                {item.website && (
                  <a
                    href={item.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Globe className="w-4 h-4" />
                    Visit Website
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {item.phone && (
                  <a
                    href={`tel:${item.phone}`}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Phone className="w-4 h-4" />
                    {item.phone}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Reviews */}
          {item.placeReviews && item.placeReviews.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-gray-900 mb-2">💬 Recent Reviews</h5>
              <div className="space-y-3">
                {item.placeReviews.slice(0, 2).map((review, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-lg text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-gray-900">{review.author_name}</span>
                      <span className="text-xs text-gray-500">• {review.relative_time_description}</span>
                    </div>
                    <p className="text-gray-700 line-clamp-3">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function ItineraryDisplay({ itinerary }: ItineraryDisplayProps) {

  const downloadPDF = async () => {
    const doc = new jsPDF()
    let yPosition = 20

    // Helper function to add text with word wrap
    const addText = (text: string, x: number, maxWidth: number, link?: string) => {
      const lines = doc.splitTextToSize(text, maxWidth)
      if (link) {
        // For links, add each line separately with the link
        lines.forEach((line: string, index: number) => {
          doc.textWithLink(line, x, yPosition + (index * 7), { url: link })
        })
      } else {
        doc.text(lines, x, yPosition)
      }
      yPosition += lines.length * 7
    }

    // Helper to check page break
    const checkPageBreak = (spaceNeeded: number = 0) => {
      if (yPosition + spaceNeeded > 270) {
        doc.addPage()
        yPosition = 20
      }
    }

    // Note: Images removed due to CORS issues with Google Places API
    // Instead, we include image links in the PDF

    // Helper to add a section header
    const addSectionHeader = (title: string, color: [number, number, number] = [0, 0, 0]) => {
      checkPageBreak(15)
      doc.setFillColor(...color)
      doc.rect(15, yPosition - 5, 180, 10, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text(title, 20, yPosition)
      yPosition += 10
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')
    }

    // Title Page
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(41, 98, 255)
    addText(itinerary.title, 20, 170)
    yPosition += 5

    // Overview
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')
    addText(`Destination: ${itinerary.destination}`, 20, 170)
    addText(`Duration: ${itinerary.duration}`, 20, 170)
    addText(`Total Budget: ${itinerary.totalBudget}`, 20, 170)
    yPosition += 5

    doc.setFontSize(11)
    addText(itinerary.overview, 20, 170)
    yPosition += 10

    // Accommodation Options
    if (itinerary.accommodationOptions && itinerary.accommodationOptions.length > 0) {
      addSectionHeader('ACCOMMODATION OPTIONS', [147, 51, 234])

      for (const acc of itinerary.accommodationOptions) {
        checkPageBreak(60)

        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        addText(acc.name, 25, 165)

        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        addText(`${acc.type} | ${acc.priceRange}`, 25, 165)
        if (acc.rating) {
          addText(`Rating: ${acc.rating}/5 (${acc.reviews || 0} reviews)`, 25, 165)
        }
        addText(`Location: ${acc.location}`, 25, 165)

        if (acc.website) {
          doc.setTextColor(41, 98, 255)
          addText(`Website: ${acc.website}`, 25, 165, acc.website)
          doc.setTextColor(0, 0, 0)
        }
        if (acc.phone) {
          addText(`Phone: ${acc.phone}`, 25, 165)
        }

        yPosition += 5
      }
    }

    // Days
    for (const day of itinerary.days) {
      doc.addPage()
      yPosition = 20

      addSectionHeader(`DAY ${day.day}: ${day.title}`, [41, 98, 255])
      doc.setFontSize(10)
      addText(`Daily Budget: ${day.dailyBudget}`, 25, 165)
      yPosition += 5

      // Activities
      if (day.activities && day.activities.length > 0) {
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        addText('ACTIVITIES', 25, 165)
        doc.setFont('helvetica', 'normal')
        yPosition += 3

        for (const activity of day.activities) {
          checkPageBreak(80)

          doc.setFontSize(11)
          doc.setFont('helvetica', 'bold')
          const timeLabel = activity.timeOfDay || activity.time || ''
          addText(`${timeLabel} - ${activity.activity}`, 30, 160)

          doc.setFontSize(10)
          doc.setFont('helvetica', 'normal')
          addText(activity.description, 30, 160)
          addText(`Location: ${activity.location}`, 30, 160)

          if (activity.rating) {
            addText(`Rating: ${activity.rating}/5 (${activity.reviews || 0} reviews)`, 30, 160)
          }

          addText(`Cost: ${activity.estimatedCost} | Duration: ${activity.duration}`, 30, 160)

          if (activity.website) {
            doc.setTextColor(41, 98, 255)
            addText(`Website: ${activity.website}`, 30, 160, activity.website)
            doc.setTextColor(0, 0, 0)
          }

          if (activity.phone) {
            addText(`Phone: ${activity.phone}`, 30, 160)
          }

          if (activity.openingHours && activity.openingHours.length > 0) {
            addText(`Hours: ${activity.openingHours[0]}`, 30, 160)
          }

          if (activity.tips) {
            doc.setFont('helvetica', 'italic')
            addText(`Tip: ${activity.tips}`, 30, 160)
            doc.setFont('helvetica', 'normal')
          }

          if (activity.placeReviews && activity.placeReviews.length > 0) {
            const review = activity.placeReviews[0]
            checkPageBreak(20)
            doc.setFontSize(9)
            doc.setFont('helvetica', 'italic')
            addText(`Review: "${review.text.substring(0, 150)}..." - ${review.author_name}`, 30, 160)
            doc.setFont('helvetica', 'normal')
          }

          yPosition += 5
        }
      }

      // Meals
      if (day.meals && day.meals.length > 0) {
        checkPageBreak(30)
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        addText('MEALS', 25, 165)
        doc.setFont('helvetica', 'normal')
        yPosition += 3

        for (const meal of day.meals) {
          checkPageBreak(60)

          doc.setFontSize(11)
          doc.setFont('helvetica', 'bold')
          addText(`${meal.type}: ${meal.restaurant}`, 30, 160)

          doc.setFontSize(10)
          doc.setFont('helvetica', 'normal')
          addText(`Cuisine: ${meal.cuisine}`, 30, 160)
          addText(`Location: ${meal.location}`, 30, 160)

          if (meal.rating) {
            addText(`Rating: ${meal.rating}/5 (${meal.reviews || 0} reviews)`, 30, 160)
          }

          addText(`Must try: ${meal.mustTry}`, 30, 160)
          addText(`Cost: ${meal.estimatedCost}`, 30, 160)

          if (meal.website) {
            doc.setTextColor(41, 98, 255)
            addText(`Website: ${meal.website}`, 30, 160, meal.website)
            doc.setTextColor(0, 0, 0)
          }

          if (meal.phone) {
            addText(`Phone: ${meal.phone}`, 30, 160)
          }

          if (meal.placeReviews && meal.placeReviews.length > 0) {
            const review = meal.placeReviews[0]
            checkPageBreak(20)
            doc.setFontSize(9)
            doc.setFont('helvetica', 'italic')
            addText(`Review: "${review.text.substring(0, 150)}..." - ${review.author_name}`, 30, 160)
            doc.setFont('helvetica', 'normal')
          }

          yPosition += 5
        }
      }
    }

    // Additional Information
    doc.addPage()
    yPosition = 20

    // Travel Essentials
    if (itinerary.travelEssentials && itinerary.travelEssentials.length > 0) {
      addSectionHeader('TOUR GUIDE & TRAVEL ESSENTIALS', [41, 98, 255])

      itinerary.travelEssentials.forEach((essential) => {
        checkPageBreak(30)
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        addText(`${essential.type}: ${essential.name}`, 25, 165)

        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        addText(essential.description, 25, 165)
        addText(`Contact: ${essential.contact}`, 25, 165)

        if (essential.estimatedCost) {
          addText(`Estimated Cost: ${essential.estimatedCost}`, 25, 165)
        }

        if (essential.website) {
          doc.setTextColor(41, 98, 255)
          addText(`Website: ${essential.website}`, 25, 165, essential.website)
          doc.setTextColor(0, 0, 0)
        }

        yPosition += 5
      })
    }

    // Travel Tips
    addSectionHeader('TRAVEL TIPS', [76, 175, 80])
    itinerary.travelTips.forEach((tip, index) => {
      checkPageBreak(15)
      doc.setFontSize(10)
      addText(`${index + 1}. ${tip}`, 25, 165)
    })
    yPosition += 5

    // Packing List
    checkPageBreak(30)
    addSectionHeader('PACKING LIST', [255, 152, 0])
    doc.setFontSize(10)
    addText(itinerary.packingList.join(', '), 25, 165)
    yPosition += 5

    // Transportation
    checkPageBreak(40)
    addSectionHeader('TRANSPORTATION', [33, 150, 243])
    doc.setFontSize(10)
    addText(`Getting There: ${itinerary.transportation.gettingThere}`, 25, 165)
    addText(`Getting Around: ${itinerary.transportation.gettingAround}`, 25, 165)
    addText(`Costs: ${itinerary.transportation.costs}`, 25, 165)
    yPosition += 5

    // Local Cuisine
    checkPageBreak(30)
    addSectionHeader('LOCAL CUISINE TO TRY', [255, 87, 34])
    doc.setFontSize(10)
    addText(itinerary.localCuisine.join(', '), 25, 165)
    yPosition += 5

    // Cultural Tips
    checkPageBreak(30)
    addSectionHeader('CULTURAL ETIQUETTE', [156, 39, 176])
    itinerary.culturalTips.forEach((tip, index) => {
      checkPageBreak(15)
      doc.setFontSize(10)
      addText(`${index + 1}. ${tip}`, 25, 165)
    })
    yPosition += 5

    // Emergency Info
    checkPageBreak(30)
    addSectionHeader('EMERGENCY CONTACTS', [244, 67, 54])
    doc.setFontSize(10)
    addText(`Police: ${itinerary.emergencyInfo.police}`, 25, 165)
    addText(`Ambulance: ${itinerary.emergencyInfo.ambulance}`, 25, 165)
    addText(`Embassy: ${itinerary.emergencyInfo.embassy}`, 25, 165)

    // Save PDF
    doc.save(`${itinerary.destination.replace(/[^a-z0-9]/gi, '_')}_Complete_Itinerary.pdf`)
  }

  return (
    <div className="space-y-6">
      {/* Header Section - Always Visible */}
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

      {/* Main Accordion for all sections */}
      <Accordion type="multiple" className="space-y-4">

        {/* Accommodation Options Section */}
        {itinerary.accommodationOptions && itinerary.accommodationOptions.length > 0 && (
          <AccordionItem value="accommodation-options" className="border-2 border-purple-200 bg-purple-50 rounded-lg px-6">
            <AccordionTrigger className="text-xl font-semibold hover:no-underline">
              <div className="flex items-center gap-2">
                <Hotel className="w-6 h-6 text-purple-600" />
                Accommodation Options ({itinerary.accommodationOptions.length} options)
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-gray-600 mb-4">
                Select one of these top-rated accommodations for your {itinerary.duration} trip
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {itinerary.accommodationOptions.map((accommodation, idx) => (
                  <div key={idx} className="bg-white rounded-lg border-2 border-purple-300 p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-block bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
                            Option {idx + 1}
                          </span>
                          {accommodation.rating && (
                            <div className="flex items-center gap-1 text-xs bg-yellow-50 px-2 py-1 rounded">
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              <span className="font-semibold text-gray-700">{accommodation.rating}</span>
                              {accommodation.reviews && (
                                <span className="text-gray-500">({accommodation.reviews})</span>
                              )}
                            </div>
                          )}
                        </div>
                        <h4 className="font-bold text-gray-900 text-lg mb-1">{accommodation.name}</h4>
                        <p className="text-sm text-gray-600">{accommodation.type}</p>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-purple-600 mb-3">
                      {accommodation.priceRange}
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                      <span className="line-clamp-2">{accommodation.location}</span>
                    </div>
                    {accommodation.whyRecommended && (
                      <p className="text-xs text-gray-700 bg-purple-50 p-2 rounded mb-3 italic">
                        "{accommodation.whyRecommended}"
                      </p>
                    )}
                    {accommodation.amenities && accommodation.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {accommodation.amenities.slice(0, 4).map((amenity, aIdx) => (
                          <span key={aIdx} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}
                    {accommodation.mapsLink && (
                      <a
                        href={accommodation.mapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 font-medium mb-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View on Maps
                      </a>
                    )}
                    <MoreDetailsSection item={accommodation} />
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Day by Day Itinerary */}
        {itinerary.days.map((day) => (
          <AccordionItem key={day.day} value={`day-${day.day}`} className="border rounded-lg bg-white">
            <AccordionTrigger className="px-6 text-xl font-semibold hover:no-underline">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Day {day.day}: {day.title}</span>
                <span className="text-sm font-normal text-gray-500">• Budget: {day.dailyBudget}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6">
              {/* Activities Section */}
              <Collapsible defaultOpen className="mb-6">
                <CollapsibleTrigger className="flex items-center justify-between w-full py-3 px-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Activities ({day.activities.length})
                  </h3>
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                  <div className="relative border-l-2 border-blue-200 ml-4 pl-8 space-y-8">
                    {day.activities.map((activity, idx) => {
                      const showTimeGap = idx > 0

                      return (
                        <div key={idx}>
                          {showTimeGap && (
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

                          <div className="relative">
                            <div className="absolute -left-10 top-0 w-6 h-6 bg-blue-600 rounded-full border-4 border-white"></div>
                            <div className="bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                      {activity.timeOfDay || activity.time}
                                    </span>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{activity.duration}</span>
                                    {activity.rating && (
                                      <div className="flex items-center gap-1 text-xs bg-yellow-50 px-2 py-1 rounded">
                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                        <span className="font-semibold text-gray-700">{activity.rating}</span>
                                        {activity.reviews && (
                                          <span className="text-gray-500">({activity.reviews})</span>
                                        )}
                                      </div>
                                    )}
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
                              <MoreDetailsSection item={activity} />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Meals Section */}
              {day.meals && day.meals.length > 0 && (
                <Collapsible defaultOpen className="mb-6">
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-3 px-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                    <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                      <Utensils className="w-5 h-5 text-orange-600" />
                      Meals ({day.meals.length})
                    </h3>
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4">
                    <div className="grid gap-4">
                      {day.meals.map((meal, idx) => (
                        <div key={idx} className="bg-orange-50 rounded-lg border border-orange-200 p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold text-orange-600 uppercase">{meal.type}</span>
                                {meal.rating && (
                                  <div className="flex items-center gap-1 text-xs bg-yellow-50 px-2 py-1 rounded">
                                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                    <span className="font-semibold text-gray-700">{meal.rating}</span>
                                    {meal.reviews && (
                                      <span className="text-gray-500">({meal.reviews})</span>
                                    )}
                                  </div>
                                )}
                              </div>
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
                          <MoreDetailsSection item={meal} />
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}

              {/* Accommodation Section */}
              {day.accommodation && (
                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-3 px-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                      <Hotel className="w-5 h-5 text-purple-600" />
                      Accommodation
                    </h3>
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4">
                    <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-gray-900">{day.accommodation.name}</h4>
                            {day.accommodation.rating && (
                              <div className="flex items-center gap-1 text-xs bg-yellow-50 px-2 py-1 rounded">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                <span className="font-semibold text-gray-700">{day.accommodation.rating}</span>
                                {day.accommodation.reviews && (
                                  <span className="text-gray-500">({day.accommodation.reviews})</span>
                                )}
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{day.accommodation.type}</p>
                        </div>
                        <span className="font-semibold text-gray-900">{day.accommodation.priceRange}</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                        <span>{day.accommodation.location}</span>
                      </div>
                      {day.accommodation.amenities && day.accommodation.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {day.accommodation.amenities.map((amenity, idx) => (
                            <span key={idx} className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      )}
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
                      <MoreDetailsSection item={day.accommodation} />
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}

        {/* Additional Information Section */}
        <AccordionItem value="additional-info" className="border rounded-lg bg-gray-50">
          <AccordionTrigger className="px-6 text-xl font-semibold hover:no-underline">
            <div className="flex items-center gap-2">
              💡 Additional Information
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6">
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

              {/* Travel Essentials - Tour Guides & Rentals */}
              {itinerary.travelEssentials && itinerary.travelEssentials.length > 0 && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      🚗 Tour Guide & Travel Essentials
                    </CardTitle>
                    <CardDescription>
                      Local contacts for guides, scooter/bike rentals, and transportation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {itinerary.travelEssentials.map((essential, idx) => (
                        <div key={idx} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">
                              {essential.type === 'Tour Guide' ? '👨‍🏫' :
                               essential.type === 'Scooter Rental' ? '🛵' :
                               essential.type === 'Bike Rental' ? '🚲' : '🚗'}
                            </span>
                            <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                              {essential.type}
                            </span>
                          </div>
                          <h4 className="font-bold text-gray-900 mb-1">{essential.name}</h4>
                          <p className="text-sm text-gray-600 mb-3">{essential.description}</p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-4 h-4 text-blue-600" />
                              <a
                                href={`tel:${essential.contact}`}
                                className="text-blue-600 hover:text-blue-700 font-medium"
                              >
                                {essential.contact}
                              </a>
                            </div>
                            {essential.website && (
                              <div className="flex items-center gap-2 text-sm">
                                <Globe className="w-4 h-4 text-blue-600" />
                                <a
                                  href={essential.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                  Visit Website
                                </a>
                              </div>
                            )}
                            {essential.estimatedCost && (
                              <div className="flex items-center gap-2 text-sm">
                                <DollarSign className="w-4 h-4 text-green-600" />
                                <span className="text-green-600 font-semibold">{essential.estimatedCost}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

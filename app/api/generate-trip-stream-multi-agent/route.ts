import { NextRequest } from 'next/server'
import { searchRestaurants, searchAttractions, searchAccommodations, PlaceResult } from '@/lib/google-places'
import {
  hotelRecommendationAgent,
  restaurantRecommendationAgent,
  attractionRecommendationAgent,
  masterPlannerAgent
} from '@/lib/ai-agents'

// Helper function to find place data by name
function findPlaceByName(name: string, places: PlaceResult[]): PlaceResult | undefined {
  // First try exact match
  const exactMatch = places.find(p => p.name.toLowerCase() === name.toLowerCase())
  if (exactMatch) return exactMatch

  // Then try partial match
  return places.find(p =>
    p.name.toLowerCase().includes(name.toLowerCase()) ||
    name.toLowerCase().includes(p.name.toLowerCase())
  )
}

// Enrich itinerary with extended place data
function enrichItineraryWithPlaceData(
  itinerary: any,
  restaurants: PlaceResult[],
  attractions: PlaceResult[],
  accommodations: PlaceResult[]
) {
  // Enrich accommodation options
  if (itinerary.accommodationOptions) {
    itinerary.accommodationOptions = itinerary.accommodationOptions.map((acc: any) => {
      const placeData = findPlaceByName(acc.name, accommodations)
      if (placeData) {
        return {
          ...acc,
          website: placeData.website,
          phone: placeData.formatted_phone_number,
          photoUrls: placeData.photoUrls,
          openingHours: placeData.opening_hours?.weekday_text,
          openNow: placeData.opening_hours?.open_now,
          placeReviews: placeData.reviews
        }
      }
      return acc
    })
  }

  // Enrich each day's data
  if (itinerary.days) {
    itinerary.days = itinerary.days.map((day: any) => {
      // Enrich activities
      if (day.activities) {
        day.activities = day.activities.map((activity: any) => {
          const placeData = findPlaceByName(activity.activity, attractions)
          if (placeData) {
            return {
              ...activity,
              website: placeData.website,
              phone: placeData.formatted_phone_number,
              photoUrls: placeData.photoUrls,
              openingHours: placeData.opening_hours?.weekday_text,
              openNow: placeData.opening_hours?.open_now,
              placeReviews: placeData.reviews
            }
          }
          return activity
        })
      }

      // Enrich meals
      if (day.meals) {
        day.meals = day.meals.map((meal: any) => {
          const placeData = findPlaceByName(meal.restaurant, restaurants)
          if (placeData) {
            return {
              ...meal,
              website: placeData.website,
              phone: placeData.formatted_phone_number,
              photoUrls: placeData.photoUrls,
              openingHours: placeData.opening_hours?.weekday_text,
              openNow: placeData.opening_hours?.open_now,
              placeReviews: placeData.reviews
            }
          }
          return meal
        })
      }

      // Enrich accommodation
      if (day.accommodation) {
        const placeData = findPlaceByName(day.accommodation.name, accommodations)
        if (placeData) {
          day.accommodation = {
            ...day.accommodation,
            website: placeData.website,
            phone: placeData.formatted_phone_number,
            photoUrls: placeData.photoUrls,
            openingHours: placeData.opening_hours?.weekday_text,
            openNow: placeData.opening_hours?.open_now,
            placeReviews: placeData.reviews
          }
        }
      }

      return day
    })
  }

  return itinerary
}

// Increase route timeout for multi-agent processing
export const maxDuration = 300 // 5 minutes
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      startingPoint,
      destination,
      budget,
      days,
      startDate,
      endDate,
      numberOfPeople,
      groupType,
      tripType,
      accommodation,
      transportation,
      prePlannedActivities,
      tripDescription
    } = body

    // Only destination is required
    if (!destination || !destination.trim()) {
      return new Response(
        JSON.stringify({ error: 'Destination is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Set defaults
    const budgetValue = budget || '1000'
    const daysValue = days || '3'
    const peopleValue = numberOfPeople || '2'
    const descriptionValue = tripDescription || 'A relaxing and enjoyable trip'
    const groupTypeValue = groupType || 'Solo'
    const tripTypeValue = tripType || []

    // Convert budget number to price category
    const budgetNum = parseInt(budgetValue)
    const budgetPerDay = budgetNum / parseInt(daysValue)

    let priceCategory: string
    if (budgetPerDay < 100) {
      priceCategory = "Budget" // $1-2 price level
    } else if (budgetPerDay < 300) {
      priceCategory = "Moderate" // $2-3 price level
    } else {
      priceCategory = "Luxury" // $3-4 price level
    }

    console.log('🚀 Starting Multi-Agent Trip Generation System')
    console.log(`📍 Destination: ${destination} | 📅 ${daysValue} days | 💰 $${budgetValue} (${priceCategory} - $${budgetPerDay.toFixed(0)}/day)`)

    // STEP 1: Fetch real places from Google Places API with BUDGET FILTERING
    console.log('\n🔍 Step 1: Fetching real places from Google Places API...')

    const [restaurants, attractions, accommodations] = await Promise.all([
      searchRestaurants({
        destination,
        tripType: tripTypeValue,
        priceLevel: priceCategory, // Use converted price category
        limit: 25
      }),
      searchAttractions({
        destination,
        tripType: tripTypeValue,
        limit: 35
      }),
      searchAccommodations(destination, accommodation || 'Hotel', 20, priceCategory) // Pass budget
    ])

    console.log(`✅ Found ${restaurants.length} restaurants, ${attractions.length} attractions, ${accommodations.length} hotels`)

    if (restaurants.length === 0 && attractions.length === 0 && accommodations.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No places found for this destination. Please try a different location.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // STEP 2: Hotel Recommendation Agent
    console.log('\n🏨 Step 2: Running Hotel Recommendation Agent...')
    const hotelRecommendations = await hotelRecommendationAgent(
      destination,
      accommodations,
      budgetValue,
      daysValue,
      groupTypeValue
    )
    console.log(`✅ Selected ${hotelRecommendations.accommodationOptions?.length || 0} accommodation options`)

    // STEP 3: Restaurant Recommendation Agent
    console.log('\n🍽️ Step 3: Running Restaurant Recommendation Agent...')
    const restaurantRecommendations = await restaurantRecommendationAgent(
      destination,
      restaurants,
      tripTypeValue,
      daysValue,
      budgetValue
    )
    console.log(`✅ Planned restaurants for ${restaurantRecommendations.restaurantsByDay?.length || 0} days`)

    // STEP 4: Attraction Recommendation Agent
    console.log('\n🗺️ Step 4: Running Attraction Recommendation Agent...')
    const attractionRecommendations = await attractionRecommendationAgent(
      destination,
      attractions,
      tripTypeValue,
      daysValue
    )
    console.log(`✅ Planned attractions for ${attractionRecommendations.attractionsByDay?.length || 0} days`)

    // STEP 5: Master Planner Agent
    console.log('\n📋 Step 5: Running Master Planner Agent to combine everything...')
    const tripDetails = {
      destination,
      startingPoint,
      budget: budgetValue,
      days: daysValue,
      numberOfPeople: peopleValue,
      groupType: groupTypeValue,
      tripType: tripTypeValue,
      accommodation,
      transportation,
      prePlannedActivities,
      description: descriptionValue,
      startDate,
      endDate
    }

    let finalItinerary
    try {
      finalItinerary = await masterPlannerAgent(
        destination,
        daysValue,
        budgetValue,
        hotelRecommendations,
        restaurantRecommendations,
        attractionRecommendations,
        tripDetails
      )
      console.log('✅ Complete itinerary generated successfully!')
    } catch (masterError: any) {
      console.error('❌ Master Planner Agent failed:', masterError.message)
      throw new Error(`Master Planner failed: ${masterError.message}`)
    }

    // STEP 6: Enrich itinerary with extended Google Places data
    console.log('\n🔧 Step 6: Enriching itinerary with photos, reviews, and contact info...')
    const enrichedItinerary = enrichItineraryWithPlaceData(
      finalItinerary,
      restaurants,
      attractions,
      accommodations
    )
    console.log('✅ Itinerary enriched with extended place data!')

    // Return the complete itinerary as JSON
    return new Response(
      JSON.stringify(enrichedItinerary),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

  } catch (error: any) {
    console.error('❌ Error generating trip:', error)

    return new Response(
      JSON.stringify({
        error: 'Failed to generate trip itinerary',
        details: error.message
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

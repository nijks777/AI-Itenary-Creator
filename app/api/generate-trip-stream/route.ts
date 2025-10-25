import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { searchRestaurants, searchAttractions, searchAccommodations, formatPlaceForAI } from '@/lib/google-places'

export async function POST(req: NextRequest) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

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

    // Set defaults for optional fields
    const budgetValue = budget || '1000'
    const daysValue = days || '3'
    const peopleValue = numberOfPeople || '2'
    const descriptionValue = tripDescription || 'A relaxing and enjoyable trip'

    // Fetch real places from Google Places API
    console.log('Fetching real places from Google Places API...')

    const [restaurants, attractions, accommodations] = await Promise.all([
      searchRestaurants({
        destination,
        tripType: tripType || [],
        priceLevel: budget,
        limit: 20
      }),
      searchAttractions({
        destination,
        tripType: tripType || [],
        limit: 25
      }),
      searchAccommodations(destination, accommodation || 'Hotel', 15)
    ])

    console.log(`Found ${restaurants.length} restaurants, ${attractions.length} attractions, ${accommodations.length} accommodations`)

    // Format places for AI prompt
    const restaurantsData = restaurants.length > 0
      ? restaurants.map(formatPlaceForAI).join(',\n')
      : 'No restaurant data available - you may suggest general restaurant types'

    const attractionsData = attractions.length > 0
      ? attractions.map(formatPlaceForAI).join(',\n')
      : 'No attraction data available - you may suggest general attractions'

    const accommodationsData = accommodations.length > 0
      ? accommodations.map(formatPlaceForAI).join(',\n')
      : 'No accommodation data available - you may suggest general accommodation types'

    // Build additional context
    let additionalContext = ''
    if (startingPoint) additionalContext += `\nStarting Point: ${startingPoint}`
    if (startDate && endDate) additionalContext += `\nTravel Dates: ${startDate} to ${endDate}`
    if (groupType) additionalContext += `\nGroup Type: ${groupType}`
    if (tripType && tripType.length > 0) additionalContext += `\nTrip Interests: ${tripType.join(', ')}`
    if (accommodation) additionalContext += `\nPreferred Accommodation: ${accommodation}`
    if (transportation) additionalContext += `\nPreferred Transportation: ${transportation}`
    if (prePlannedActivities) additionalContext += `\nPre-planned Activities: ${prePlannedActivities}`

    // Create a detailed prompt for OpenAI
    const prompt = `You are an expert travel planner. Create a detailed, day-by-day itinerary for a trip with the following specifications:

Destination: ${destination}
${startingPoint ? `Starting Point: ${startingPoint}` : ''}
Budget per person: $${budgetValue}
Duration: ${daysValue} days
Number of travelers: ${peopleValue}
${groupType ? `Group Type: ${groupType}` : ''}
${tripType && tripType.length > 0 ? `Trip Interests: ${tripType.join(', ')}` : ''}
Trip preferences: ${descriptionValue}${additionalContext}

VERIFIED PLACES DATA FROM GOOGLE PLACES API:

RESTAURANTS (use ONLY these verified restaurants):
[${restaurantsData}]

ATTRACTIONS (use ONLY these verified attractions):
[${attractionsData}]

ACCOMMODATIONS (use ONLY these verified accommodations):
[${accommodationsData}]

IMPORTANT INSTRUCTIONS:
1. You MUST use ONLY the places provided above from Google Places API. These are real, verified places with accurate addresses and ratings.
2. DO NOT make up or hallucinate any place names, addresses, or details.
3. Use the exact "name", "address", "rating", and "mapsLink" from the data provided.
4. DO NOT provide specific times like "9:00 AM" or "2:00 PM" for activities. Instead, suggest a logical order and sequence.
5. Group activities into logical sections like "Morning", "Afternoon", "Evening" but don't assign specific clock times.
6. You can suggest "best time to visit" or "recommended duration" but NOT "arrive at 10:30 AM".
7. Focus on the flow and sequence of activities, not rigid time schedules.

Please provide a comprehensive itinerary that includes:

${startingPoint ? `IMPORTANT: Since the traveler is coming from ${startingPoint}, include:
- Flight/train/bus options from ${startingPoint} to ${destination} with estimated costs
- Best booking platforms and tips
- Arrival transportation from airport/station to accommodation
` : ''}

1. A brief overview of the trip
2. Day-by-day detailed schedule with:
   - Activities organized by time of day (Morning/Afternoon/Evening) without specific clock times
   - Suggested sequence and flow between activities
   - Restaurant recommendations from the provided list with ratings and costs
   - Accommodation suggestions from the provided list with ratings and price ranges
3. Estimated daily budget breakdown
4. Important travel tips for ${destination}
5. Suggested packing list
6. Best times to visit attractions to avoid crowds (general guidance, not specific times)
7. Local transportation options
8. Must-try local foods and dishes
9. Cultural etiquette and customs to know
10. Emergency contacts and important information

Format the response as a JSON object with this structure:
{
  "title": "Trip title",
  "destination": "${destination}",
  "duration": "${daysValue} days",
  "overview": "Brief trip overview",
  "totalBudget": "Estimated total budget",
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "activities": [
        {
          "timeOfDay": "Morning/Afternoon/Evening",
          "activity": "Activity name (from verified attractions list)",
          "description": "Detailed description",
          "location": "Full address (from Google data)",
          "mapsLink": "Google Maps link (from Google data)",
          "rating": 4.5,
          "reviews": 1234,
          "estimatedCost": "$XX",
          "duration": "X hours",
          "tips": "Any helpful tips"
        }
      ],
      "meals": [
        {
          "type": "Breakfast/Lunch/Dinner",
          "restaurant": "Restaurant name (from verified restaurants list)",
          "cuisine": "Type of cuisine",
          "location": "Full address (from Google data)",
          "mapsLink": "Google Maps link (from Google data)",
          "rating": 4.5,
          "reviews": 1234,
          "estimatedCost": "$XX",
          "mustTry": "Recommended dishes"
        }
      ],
      "accommodation": {
        "name": "Hotel name (from verified accommodations list)",
        "type": "Hotel/Hostel/Airbnb",
        "location": "Address (from Google data)",
        "mapsLink": "Google Maps link (from Google data)",
        "rating": 4.5,
        "reviews": 1234,
        "priceRange": "$XX - $XXX per night",
        "amenities": ["Amenity 1", "Amenity 2"]
      },
      "dailyBudget": "$XXX"
    }
  ],
  "travelTips": ["Tip 1", "Tip 2"],
  "packingList": ["Item 1", "Item 2"],
  "transportation": {
    "gettingThere": "How to reach destination",
    "gettingAround": "Local transportation options",
    "costs": "Transportation costs"
  },
  "localCuisine": ["Dish 1", "Dish 2"],
  "culturalTips": ["Tip 1", "Tip 2"],
  "emergencyInfo": {
    "police": "Phone number",
    "ambulance": "Phone number",
    "embassy": "Contact info"
  }
}

REMEMBER: Use ONLY verified places from the provided lists. Include ratings and review counts. DO NOT use specific clock times, use timeOfDay instead.`

    // Call OpenAI API with streaming
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert travel planner with extensive knowledge of destinations worldwide. You provide detailed, accurate, and personalized travel itineraries. Always include specific addresses and create proper Google Maps links for all locations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 10000,
      response_format: { type: "json_object" },
      stream: true,
    })

    // Create a readable stream for the response
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              controller.enqueue(encoder.encode(content))
            }
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })

  } catch (error: any) {
    console.error('Error generating trip:', error)

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

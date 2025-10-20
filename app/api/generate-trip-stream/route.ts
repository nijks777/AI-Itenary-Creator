import { NextRequest } from 'next/server'
import OpenAI from 'openai'

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

Please provide a comprehensive itinerary that includes:

${startingPoint ? `IMPORTANT: Since the traveler is coming from ${startingPoint}, include:
- Flight/train/bus options from ${startingPoint} to ${destination} with estimated costs
- Best booking platforms and tips
- Arrival transportation from airport/station to accommodation
` : ''}

1. A brief overview of the trip
2. Day-by-day detailed schedule with:
   - Morning activities (with specific times like 9:00 AM, 10:30 AM)
   - Afternoon activities (with specific times like 1:00 PM, 3:30 PM)
   - Evening activities (with specific times like 6:00 PM, 8:00 PM)
   - Restaurant recommendations with estimated costs
   - Accommodation suggestions with price ranges
3. Estimated daily budget breakdown
4. Important travel tips for ${destination}
5. Suggested packing list
6. Best times to visit attractions to avoid crowds
7. Local transportation options
8. Must-try local foods and dishes
9. Cultural etiquette and customs to know
10. Emergency contacts and important information

For each attraction or restaurant mentioned:
- Include the full address if available
- Provide a Google Maps search link in this format: https://www.google.com/maps/search/?api=1&query=[location name and address]

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
          "time": "9:00 AM",
          "activity": "Activity name",
          "description": "Detailed description",
          "location": "Full address",
          "mapsLink": "Google Maps link",
          "estimatedCost": "$XX",
          "duration": "X hours",
          "tips": "Any helpful tips"
        }
      ],
      "meals": [
        {
          "type": "Breakfast/Lunch/Dinner",
          "restaurant": "Restaurant name",
          "cuisine": "Type of cuisine",
          "location": "Full address",
          "mapsLink": "Google Maps link",
          "estimatedCost": "$XX",
          "mustTry": "Recommended dishes"
        }
      ],
      "accommodation": {
        "name": "Hotel name",
        "type": "Hotel/Hostel/Airbnb",
        "location": "Address",
        "mapsLink": "Google Maps link",
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

Make sure all Google Maps links are properly formatted and use real locations in ${destination}.`

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

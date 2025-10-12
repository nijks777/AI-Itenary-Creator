import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(req: NextRequest) {
  try {
    // Initialize OpenAI client inside the function to avoid build-time errors
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const body = await req.json()
    const { destination, budget, days, numberOfPeople, averageAge, tripDescription } = body

    // Validate required fields
    if (!destination || !budget || !days || !numberOfPeople || !averageAge || !tripDescription) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Create a detailed prompt for OpenAI
    const prompt = `You are an expert travel planner. Create a detailed, day-by-day itinerary for a trip with the following specifications:

Destination: ${destination}
Budget per person: $${budget}
Duration: ${days} days
Number of travelers: ${numberOfPeople}
Average age of travelers: ${averageAge}
Trip preferences: ${tripDescription}

Please provide a comprehensive itinerary that includes:

1. A brief overview of the trip
2. Day-by-day detailed schedule with:
   - Morning activities (with specific times)
   - Afternoon activities (with specific times)
   - Evening activities (with specific times)
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
  "duration": "${days} days",
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

    // Call OpenAI API with GPT-4
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
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
      max_tokens: 4000,
      response_format: { type: "json_object" }
    })

    const itineraryText = completion.choices[0].message.content

    if (!itineraryText) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response
    const itinerary = JSON.parse(itineraryText)

    return NextResponse.json({
      success: true,
      itinerary,
      creditsUsed: 25 // You can adjust this based on your credit system
    })

  } catch (error: any) {
    console.error('Error generating trip:', error)

    return NextResponse.json(
      {
        error: 'Failed to generate trip itinerary',
        details: error.message
      },
      { status: 500 }
    )
  }
}

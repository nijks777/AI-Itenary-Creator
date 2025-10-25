import OpenAI from 'openai'
import { PlaceResult } from './google-places'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Agent 1: Hotel Recommendation Expert
export async function hotelRecommendationAgent(
  destination: string,
  accommodations: PlaceResult[],
  budget: string,
  days: string,
  groupType: string
): Promise<any> {
  const budgetNum = parseInt(budget)
  const budgetPerDay = budgetNum / parseInt(days)
  const hotelBudgetPerNight = budgetPerDay * 0.4 // 40% of daily budget for hotel

  const prompt = `You are a hotel recommendation expert specializing in ${destination}.

AVAILABLE HOTELS FROM GOOGLE PLACES (verified real places):
${accommodations.map((h, i) => `
${i + 1}. ${h.name}
   - Address: ${h.vicinity}
   - Rating: ${h.rating || 'N/A'}★ (${h.user_ratings_total || 0} reviews)
   - Price Level: ${h.price_level ? '$'.repeat(h.price_level) : 'Not specified'}
   - Place ID: ${h.place_id}
`).join('\n')}

TRIP DETAILS:
- Duration: ${days} days
- Total Budget: $${budget}
- Budget Per Day: $${budgetPerDay.toFixed(0)}
- Hotel Budget Per Night: ~$${hotelBudgetPerNight.toFixed(0)} (40% of daily budget)
- Group Type: ${groupType}

YOUR TASK:
Select the TOP 3 accommodations that FIT WITHIN THE BUDGET. Consider:
1. CRITICAL: Price must be ≤ $${hotelBudgetPerNight.toFixed(0)} per night
2. Prioritize price levels $ or $$ for budget trips (ignore $$$ and $$$$ if budget is low)
3. Rating and review count (prioritize highly rated with many reviews)
4. Location convenience for tourists
5. Suitable for ${groupType}

BUDGET ENFORCEMENT:
- If budget is $${budget} for ${days} days, hotel should cost max $${hotelBudgetPerNight.toFixed(0)}/night
- Estimate realistic prices based on price level:
  - $ (Budget): $30-60/night
  - $$ (Moderate): $60-120/night
  - $$$ (Upscale): $120-250/night
  - $$$$ (Luxury): $250+/night

Return ONLY valid JSON (no markdown, no explanations) in this exact format:
{
  "accommodationOptions": [
    {
      "name": "Hotel name from the list above",
      "type": "Hotel/Hostel/Airbnb",
      "location": "Address from above",
      "rating": 4.5,
      "reviews": 1234,
      "mapsLink": "https://www.google.com/maps/search/?api=1&query=HOTEL_NAME&query_place_id=PLACE_ID",
      "priceRange": "$XX - $XXX per night",
      "amenities": ["WiFi", "Breakfast", "Pool"],
      "whyRecommended": "Brief explanation why this is good for the trip"
    }
  ]
}

IMPORTANT: Use ONLY hotels from the list above. Include all fields. Return pure JSON only.`

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a hotel recommendation expert. You analyze hotel data and select the best options. Always return valid JSON only, no markdown formatting."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.3,
    response_format: { type: "json_object" }
  })

  const content = response.choices[0].message.content || '{}'
  return JSON.parse(content)
}

// Agent 2: Restaurant Recommendation Expert
export async function restaurantRecommendationAgent(
  destination: string,
  restaurants: PlaceResult[],
  tripType: string[],
  days: string,
  budget: string
): Promise<any> {
  const budgetNum = parseInt(budget)
  const budgetPerDay = budgetNum / parseInt(days)
  const foodBudgetPerDay = budgetPerDay * 0.4 // 40% of daily budget for food
  const mealBudget = foodBudgetPerDay / 3 // Split across 3 meals

  const prompt = `You are a restaurant recommendation expert specializing in ${destination}.

AVAILABLE RESTAURANTS FROM GOOGLE PLACES (verified real places):
${restaurants.map((r, i) => `
${i + 1}. ${r.name}
   - Address: ${r.vicinity}
   - Rating: ${r.rating || 'N/A'}★ (${r.user_ratings_total || 0} reviews)
   - Price Level: ${r.price_level ? '$'.repeat(r.price_level) : 'Not specified'}
   - Place ID: ${r.place_id}
`).join('\n')}

TRIP DETAILS:
- Duration: ${days} days (need ${parseInt(days) * 3} restaurant recommendations)
- Total Budget: $${budget}
- Budget Per Day: $${budgetPerDay.toFixed(0)}
- Food Budget Per Day: ~$${foodBudgetPerDay.toFixed(0)} (40% of daily budget)
- Budget Per Meal: ~$${mealBudget.toFixed(0)}
- Trip Interests: ${tripType.join(', ')}

BUDGET ENFORCEMENT:
- Each meal should cost approximately $${mealBudget.toFixed(0)} or less
- Prioritize $ and $$ restaurants for budget trips
- Price level guide:
  - $ : $5-15 per meal
  - $$ : $15-35 per meal
  - $$$ : $35-60 per meal
  - $$$$ : $60+ per meal

YOUR TASK:
Select the BEST restaurants for each day. For ${days} days, recommend:
- ${days} breakfast places (variety of options)
- ${days} lunch places (mix of casual and nice)
- ${days} dinner places (highlight best dining experiences)

IMPORTANT: Prioritize ICONIC and FAMOUS restaurants/places that tourists MUST visit.

Return ONLY valid JSON (no markdown, no explanations) in this exact format:
{
  "restaurantsByDay": [
    {
      "day": 1,
      "restaurants": [
        {
          "type": "Breakfast",
          "restaurant": "Name from list above",
          "cuisine": "Type of cuisine",
          "location": "Address from above",
          "rating": 4.5,
          "reviews": 1234,
          "mapsLink": "https://www.google.com/maps/search/?api=1&query=RESTAURANT_NAME&query_place_id=PLACE_ID",
          "estimatedCost": "$XX",
          "mustTry": "Signature dishes",
          "whyVisit": "What makes this special"
        },
        {
          "type": "Lunch",
          "restaurant": "Name from list above",
          ...
        },
        {
          "type": "Dinner",
          "restaurant": "Name from list above",
          ...
        }
      ]
    }
  ]
}

IMPORTANT:
- Use ONLY restaurants from the list above
- Give 3 restaurants per day (breakfast, lunch, dinner)
- Prioritize high ratings and many reviews
- Return pure JSON only`

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a restaurant recommendation expert. You analyze restaurant data and create dining plans. Always return valid JSON only, no markdown formatting."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.4,
    response_format: { type: "json_object" }
  })

  const content = response.choices[0].message.content || '{}'
  return JSON.parse(content)
}

// Agent 3: Attraction Recommendation Expert
export async function attractionRecommendationAgent(
  destination: string,
  attractions: PlaceResult[],
  tripType: string[],
  days: string
): Promise<any> {
  const prompt = `You are an attraction expert specializing in ${destination}.

AVAILABLE ATTRACTIONS FROM GOOGLE PLACES (verified real places):
${attractions.map((a, i) => `
${i + 1}. ${a.name}
   - Address: ${a.vicinity}
   - Rating: ${a.rating || 'N/A'}★ (${a.user_ratings_total || 0} reviews)
   - Place ID: ${a.place_id}
`).join('\n')}

TRIP DETAILS:
- Duration: ${days} days
- Trip Interests: ${tripType.join(', ')}

YOUR TASK:
Select the BEST attractions for each day. Requirements:
- MINIMUM 3 attractions per day
- Prioritize MUST-SEE iconic landmarks and famous spots
- Consider trip interests: ${tripType.join(', ')}
- Organize by time of day: Morning, Afternoon, Evening
- NO specific clock times (like 9:00 AM), just "Morning", "Afternoon", "Evening"

IMPORTANT: Focus on FAMOUS, ICONIC places that define ${destination}. Don't miss major landmarks!

Return ONLY valid JSON (no markdown, no explanations) in this exact format:
{
  "attractionsByDay": [
    {
      "day": 1,
      "dayTitle": "Exploring [Theme]",
      "attractions": [
        {
          "timeOfDay": "Morning",
          "activity": "Name from list above",
          "description": "What you'll experience here",
          "location": "Address from above",
          "rating": 4.7,
          "reviews": 12345,
          "mapsLink": "https://www.google.com/maps/search/?api=1&query=ATTRACTION_NAME&query_place_id=PLACE_ID",
          "estimatedCost": "$XX or Free",
          "duration": "X hours",
          "tips": "Best time to visit, what to bring, insider tips"
        }
      ]
    }
  ]
}

IMPORTANT:
- Use ONLY attractions from the list above
- Minimum 3 attractions per day
- Prioritize highest rated and most reviewed (these are usually the iconic ones)
- Use timeOfDay: "Morning", "Afternoon", or "Evening" (NOT clock times)
- Return pure JSON only`

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an attraction recommendation expert. You analyze tourist attraction data and create sightseeing plans. Always return valid JSON only, no markdown formatting."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.4,
    response_format: { type: "json_object" }
  })

  const content = response.choices[0].message.content || '{}'
  return JSON.parse(content)
}

// Agent 4: Master Itinerary Planner
export async function masterPlannerAgent(
  destination: string,
  days: string,
  budget: string,
  hotelData: any,
  restaurantData: any,
  attractionData: any,
  tripDetails: any
): Promise<any> {
  const prompt = `You are the master trip planner. Combine all expert recommendations into a complete itinerary.

HOTEL RECOMMENDATIONS (show these first as OPTIONS):
${JSON.stringify(hotelData, null, 2)}

RESTAURANT RECOMMENDATIONS BY DAY:
${JSON.stringify(restaurantData, null, 2)}

ATTRACTION RECOMMENDATIONS BY DAY:
${JSON.stringify(attractionData, null, 2)}

TRIP DETAILS:
${JSON.stringify(tripDetails, null, 2)}

YOUR TASK:
Create a complete ${days}-day itinerary that:
1. Shows 3 accommodation OPTIONS at the top (user will choose)
2. For each day, includes:
   - Day title/theme
   - 3+ attractions organized by time of day (Morning/Afternoon/Evening)
   - 3 restaurant options (breakfast, lunch, dinner)
   - Daily budget estimate
3. Includes travel tips, packing list, cultural tips, emergency info

Return ONLY valid JSON (no markdown) in this exact format:
{
  "title": "${destination} ${days}-Day Adventure",
  "destination": "${destination}",
  "duration": "${days} days",
  "overview": "Brief compelling overview of the trip",
  "totalBudget": "Estimated total for ${days} days",
  "accommodationOptions": [USE THE 3 OPTIONS FROM hotelData],
  "days": [
    {
      "day": 1,
      "title": "Day title from attractionData",
      "activities": [USE attractions from attractionData for day 1 - minimum 3],
      "meals": [USE restaurants from restaurantData for day 1 - exactly 3],
      "dailyBudget": "$XXX"
    }
  ],
  "travelTips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4", "Tip 5"],
  "packingList": ["Item 1", "Item 2", ...],
  "transportation": {
    "gettingThere": "How to reach ${destination}",
    "gettingAround": "Local transport options",
    "costs": "Estimated transport costs"
  },
  "localCuisine": ["Must-try dish 1", "Must-try dish 2", ...],
  "culturalTips": ["Tip 1", "Tip 2", ...],
  "emergencyInfo": {
    "police": "Local emergency number",
    "ambulance": "Local emergency number",
    "embassy": "Contact if applicable"
  }
}

IMPORTANT:
- Use ALL data provided by the expert agents
- Don't add new places - use only what was recommended
- Keep the structure exactly as shown
- Return pure JSON only, no markdown`

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a master trip planner who synthesizes expert recommendations into comprehensive itineraries. Always return valid JSON only, no markdown formatting."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.5,
    max_tokens: 12000,
    response_format: { type: "json_object" }
  }, {
    timeout: 120000 // 2 minutes timeout for complex itineraries
  })

  const content = response.choices[0].message.content || '{}'
  return JSON.parse(content)
}

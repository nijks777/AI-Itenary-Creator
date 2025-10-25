import { NextRequest, NextResponse } from 'next/server'
import { searchRestaurants, searchAttractions, searchAccommodations } from '@/lib/google-places'

export async function GET(req: NextRequest) {
  try {
    // Check if API key exists
    const apiKey = process.env.GOOGLE_PLACES_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'GOOGLE_PLACES_API_KEY not found in environment variables',
          message: 'Please add GOOGLE_PLACES_API_KEY to your .env.local file'
        },
        { status: 500 }
      )
    }

    console.log('Testing Google Places API...')
    console.log('API Key found:', apiKey.substring(0, 10) + '...')

    // Test with a simple destination
    const testDestination = 'Paris, France'

    console.log(`Searching for restaurants in ${testDestination}...`)
    const restaurants = await searchRestaurants({
      destination: testDestination,
      limit: 5
    })

    console.log(`Searching for attractions in ${testDestination}...`)
    const attractions = await searchAttractions({
      destination: testDestination,
      limit: 5
    })

    console.log(`Searching for accommodations in ${testDestination}...`)
    const accommodations = await searchAccommodations(testDestination, 'Hotel', 5)

    // Check if we got results
    const success = restaurants.length > 0 || attractions.length > 0 || accommodations.length > 0

    return NextResponse.json({
      success,
      apiKeyConfigured: true,
      testDestination,
      results: {
        restaurants: {
          count: restaurants.length,
          sample: restaurants.slice(0, 2).map(r => ({
            name: r.name,
            address: r.vicinity,
            rating: r.rating,
            reviews: r.user_ratings_total,
            priceLevel: r.price_level
          }))
        },
        attractions: {
          count: attractions.length,
          sample: attractions.slice(0, 2).map(a => ({
            name: a.name,
            address: a.vicinity,
            rating: a.rating,
            reviews: a.user_ratings_total
          }))
        },
        accommodations: {
          count: accommodations.length,
          sample: accommodations.slice(0, 2).map(h => ({
            name: h.name,
            address: h.vicinity,
            rating: h.rating,
            reviews: h.user_ratings_total
          }))
        }
      },
      message: success
        ? '✅ Google Places API is working correctly!'
        : '⚠️ API is configured but returned no results. This might be a quota or billing issue.'
    })

  } catch (error: any) {
    console.error('Error testing Google Places API:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.toString(),
        message: '❌ Google Places API test failed. Check the error details above.',
        troubleshooting: [
          'Make sure your API key is valid',
          'Check if Places API is enabled in Google Cloud Console',
          'Verify billing is set up for your Google Cloud project',
          'Check if there are any quota limits reached'
        ]
      },
      { status: 500 }
    )
  }
}

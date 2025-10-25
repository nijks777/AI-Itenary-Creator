import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});

export interface PlaceResult {
  name: string;
  vicinity: string;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  place_id: string;
  types?: string[];
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  opening_hours?: {
    open_now?: boolean;
  };
}

export interface RestaurantSearchParams {
  destination: string;
  cuisineType?: string;
  tripType?: string[];
  priceLevel?: string;
  limit?: number;
}

export interface AttractionSearchParams {
  destination: string;
  tripType?: string[];
  limit?: number;
}

export async function searchRestaurants(
  params: RestaurantSearchParams
): Promise<PlaceResult[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    console.warn("Google Places API key not found");
    return [];
  }

  try {
    // Build search query based on preferences
    let query = `restaurants in ${params.destination}`;

    if (params.cuisineType) {
      query = `${params.cuisineType} ${query}`;
    }

    // Add trip type preferences
    if (params.tripType && params.tripType.length > 0) {
      if (params.tripType.includes("Food")) {
        query = `best ${query}`;
      }
      if (params.tripType.includes("Luxury") || params.priceLevel === "Luxury") {
        query = `fine dining ${query}`;
      }
    }

    const response = await client.textSearch({
      params: {
        query,
        key: apiKey,
      },
    });

    const results = response.data.results as PlaceResult[];

    // Filter by price level if specified
    let filteredResults = results;
    if (params.priceLevel) {
      const priceMap: Record<string, number[]> = {
        "Budget": [1, 2],
        "Moderate": [2, 3],
        "Luxury": [3, 4],
      };

      const acceptedPrices = priceMap[params.priceLevel] || [1, 2, 3, 4];
      filteredResults = results.filter(r =>
        r.price_level === undefined || acceptedPrices.includes(r.price_level)
      );
    }

    // Sort by rating and review count
    filteredResults.sort((a, b) => {
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
      const reviewsA = a.user_ratings_total || 0;
      const reviewsB = b.user_ratings_total || 0;

      // Prioritize places with good ratings and many reviews
      const scoreA = ratingA * Math.log(reviewsA + 1);
      const scoreB = ratingB * Math.log(reviewsB + 1);

      return scoreB - scoreA;
    });

    return filteredResults.slice(0, params.limit || 15);
  } catch (error) {
    console.error("Error searching restaurants:", error);
    return [];
  }
}

export async function searchAttractions(
  params: AttractionSearchParams
): Promise<PlaceResult[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    console.warn("Google Places API key not found");
    return [];
  }

  try {
    // ALWAYS search for top/famous attractions first
    let query = `top famous tourist attractions landmarks ${params.destination}`;

    const response = await client.textSearch({
      params: {
        query,
        key: apiKey,
      },
    });

    let results = response.data.results as PlaceResult[];

    // Sort by popularity (reviews) and rating - this gets the ICONIC places
    results.sort((a, b) => {
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
      const reviewsA = a.user_ratings_total || 0;
      const reviewsB = b.user_ratings_total || 0;

      // Weight reviews heavily - iconic places have MANY reviews
      const scoreA = (ratingA * 0.3) + (Math.log(reviewsA + 1) * 0.7);
      const scoreB = (ratingB * 0.3) + (Math.log(reviewsB + 1) * 0.7);

      return scoreB - scoreA;
    });

    // Return more results to give AI more options
    return results.slice(0, params.limit || 30);
  } catch (error) {
    console.error("Error searching attractions:", error);
    return [];
  }
}

export async function searchAccommodations(
  destination: string,
  accommodationType: string,
  limit: number = 10,
  priceLevel?: string
): Promise<PlaceResult[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    console.warn("Google Places API key not found");
    return [];
  }

  try {
    let query = `${accommodationType} in ${destination}`;

    // Add budget indicator to search query
    if (priceLevel === "Budget") {
      query = `budget affordable ${query}`;
    } else if (priceLevel === "Luxury") {
      query = `luxury premium ${query}`;
    }

    const response = await client.textSearch({
      params: {
        query,
        key: apiKey,
      },
    });

    let results = response.data.results as PlaceResult[];

    // Filter by price level if specified
    if (priceLevel) {
      const priceMap: Record<string, number[]> = {
        "Budget": [1, 2],
        "Moderate": [2, 3],
        "Luxury": [3, 4],
      };

      const acceptedPrices = priceMap[priceLevel] || [1, 2, 3, 4];
      results = results.filter(r =>
        r.price_level === undefined || acceptedPrices.includes(r.price_level)
      );
    }

    results.sort((a, b) => {
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
      const reviewsA = a.user_ratings_total || 0;
      const reviewsB = b.user_ratings_total || 0;

      const scoreA = ratingA * Math.log(reviewsA + 1);
      const scoreB = ratingB * Math.log(reviewsB + 1);

      return scoreB - scoreA;
    });

    return results.slice(0, limit);
  } catch (error) {
    console.error("Error searching accommodations:", error);
    return [];
  }
}

export function formatPlaceForAI(place: PlaceResult): string {
  const priceLevel = place.price_level
    ? "$".repeat(place.price_level)
    : "Price not available";

  return `{
    "name": "${place.name}",
    "address": "${place.vicinity}",
    "rating": ${place.rating || "N/A"},
    "reviews": ${place.user_ratings_total || 0},
    "priceLevel": "${priceLevel}",
    "placeId": "${place.place_id}",
    "mapsLink": "https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.place_id}"
  }`;
}

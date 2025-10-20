// Utility for managing trip data in localStorage

export interface SavedTrip {
  id: string
  destination: string
  itinerary: any
  formData: any
  createdAt: string
}

const STORAGE_KEY = 'ai_trip_planner_trips'
const MAX_TRIPS = 10

export const tripStorage = {
  // Save a new trip
  saveTrip: (destination: string, itinerary: any, formData: any): string => {
    const trips = tripStorage.getAllTrips()

    const newTrip: SavedTrip = {
      id: Date.now().toString(),
      destination,
      itinerary,
      formData,
      createdAt: new Date().toISOString()
    }

    // Add new trip to the beginning
    trips.unshift(newTrip)

    // Keep only last 10 trips
    const limitedTrips = trips.slice(0, MAX_TRIPS)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedTrips))
    return newTrip.id
  },

  // Get all trips
  getAllTrips: (): SavedTrip[] => {
    if (typeof window === 'undefined') return []

    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error reading trips from localStorage:', error)
      return []
    }
  },

  // Get a specific trip by ID
  getTripById: (id: string): SavedTrip | null => {
    const trips = tripStorage.getAllTrips()
    return trips.find(trip => trip.id === id) || null
  },

  // Delete a trip
  deleteTrip: (id: string): void => {
    const trips = tripStorage.getAllTrips()
    const filtered = trips.filter(trip => trip.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  },

  // Clear all trips
  clearAllTrips: (): void => {
    localStorage.removeItem(STORAGE_KEY)
  }
}

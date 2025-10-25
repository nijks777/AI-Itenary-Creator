export interface Activity {
  timeOfDay: "Morning" | "Afternoon" | "Evening";
  activity: string;
  description: string;
  location: string;
  mapsLink: string;
  rating?: number;
  reviews?: number;
  estimatedCost: string;
  duration: string;
  tips?: string;
}

export interface Meal {
  type: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  restaurant: string;
  cuisine: string;
  location: string;
  mapsLink: string;
  rating?: number;
  reviews?: number;
  estimatedCost: string;
  mustTry: string;
}

export interface Accommodation {
  name: string;
  type: string;
  location: string;
  mapsLink: string;
  rating?: number;
  reviews?: number;
  priceRange: string;
  amenities: string[];
}

export interface DayPlan {
  day: number;
  title: string;
  activities: Activity[];
  meals: Meal[];
  accommodation?: Accommodation; // Legacy support - single accommodation per day
  dailyBudget: string;
}

export interface Transportation {
  gettingThere: string;
  gettingAround: string;
  costs: string;
}

export interface EmergencyInfo {
  police: string;
  ambulance: string;
  embassy: string;
}

export interface AccommodationOption extends Accommodation {
  whyRecommended?: string;
}

export interface Itinerary {
  title: string;
  destination: string;
  duration: string;
  overview: string;
  totalBudget: string;
  accommodationOptions?: AccommodationOption[]; // NEW: 3 hotel options for user to choose
  days: DayPlan[];
  travelTips: string[];
  packingList: string[];
  transportation: Transportation;
  localCuisine: string[];
  culturalTips: string[];
  emergencyInfo: EmergencyInfo;
}

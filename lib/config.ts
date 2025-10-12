// Configuration constants
export const APP_CONFIG = {
  // Credit costs for different features
  CREDITS: {
    BASIC_TRIP_PLANNING: 10,
    DETAILED_ITINERARY: 25,
    PREMIUM_RECOMMENDATIONS: 50,
    CUSTOM_TRIP_EXPORT: 15,
  },

  // Plan limits
  PLANS: {
    FREE: {
      monthly_credits: 100,
      features: ['basic_planning', 'limited_destinations']
    },
    BASIC: {
      monthly_credits: 500,
      features: ['basic_planning', 'detailed_itinerary', 'all_destinations']
    },
    PREMIUM: {
      monthly_credits: 2000,
      features: ['all_features', 'priority_support', 'unlimited_exports']
    }
  },

  // App settings
  APP_NAME: 'AI Trip Planner',
  DEFAULT_CREDITS: 100,
  MAX_TRIP_DESTINATIONS: 10,
}

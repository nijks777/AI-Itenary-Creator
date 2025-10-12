'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Star } from 'lucide-react'

// Dynamic import to avoid SSR issues with Leaflet - import everything dynamically
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })

interface Destination {
  id: string
  name: string
  country: string
  lat: number
  lng: number
  popularity: number
  image: string
  description: string
  bestTime: string
  averageCost: string
  highlights: string[]
  rating: number
}

const popularDestinations: Destination[] = [
  {
    id: '1',
    name: 'Paris',
    country: 'France',
    lat: 48.8566,
    lng: 2.3522,
    popularity: 95,
    image: '🗼',
    description: 'The City of Light offers world-class museums, iconic landmarks, and romantic ambiance.',
    bestTime: 'Apr-Oct',
    averageCost: '$150-300/day',
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral', 'Seine River Cruise'],
    rating: 4.8
  },
  {
    id: '2',
    name: 'Tokyo',
    country: 'Japan',
    lat: 35.6762,
    lng: 139.6503,
    popularity: 92,
    image: '🏯',
    description: 'A fascinating blend of ultra-modern and traditional, with incredible food and culture.',
    bestTime: 'Mar-May, Sep-Nov',
    averageCost: '$120-250/day',
    highlights: ['Shibuya Crossing', 'Tokyo Skytree', 'Tsukiji Fish Market', 'Senso-ji Temple'],
    rating: 4.7
  },
  {
    id: '3',
    name: 'London',
    country: 'United Kingdom',
    lat: 51.5074,
    lng: -0.1278,
    popularity: 89,
    image: '🏰',
    description: 'Rich history, royal palaces, and vibrant cultural scene.',
    bestTime: 'May-Sep',
    averageCost: '$180-350/day',
    highlights: ['Big Ben', 'Tower of London', 'British Museum', 'Thames River'],
    rating: 4.6
  },
  {
    id: '4',
    name: 'Sydney',
    country: 'Australia',
    lat: -33.8688,
    lng: 151.2093,
    popularity: 86,
    image: '🏛️',
    description: 'Iconic harbor city with stunning beaches and modern architecture.',
    bestTime: 'Sep-Nov, Mar-May',
    averageCost: '$130-280/day',
    highlights: ['Sydney Opera House', 'Harbour Bridge', 'Bondi Beach', 'Royal Botanic Garden'],
    rating: 4.5
  },
  {
    id: '5',
    name: 'New York',
    country: 'USA',
    lat: 40.7128,
    lng: -74.0060,
    popularity: 94,
    image: '🗽',
    description: 'The city that never sleeps, with world-class attractions and Broadway shows.',
    bestTime: 'Apr-Jun, Sep-Nov',
    averageCost: '$200-400/day',
    highlights: ['Statue of Liberty', 'Central Park', 'Times Square', 'Brooklyn Bridge'],
    rating: 4.6
  },
  {
    id: '6',
    name: 'Dubai',
    country: 'UAE',
    lat: 25.2048,
    lng: 55.2708,
    popularity: 87,
    image: '🏙️',
    description: 'Ultra-modern city with luxury shopping and futuristic architecture.',
    bestTime: 'Nov-Mar',
    averageCost: '$150-300/day',
    highlights: ['Burj Khalifa', 'Desert Safari', 'Gold Souk', 'Dubai Mall'],
    rating: 4.4
  },
  {
    id: '7',
    name: 'Rome',
    country: 'Italy',
    lat: 41.9028,
    lng: 12.4964,
    popularity: 91,
    image: '🏛️',
    description: 'Ancient history meets modern Italian culture in the Eternal City.',
    bestTime: 'Apr-Jun, Sep-Oct',
    averageCost: '$120-250/day',
    highlights: ['Colosseum', 'Vatican City', 'Trevi Fountain', 'Roman Forum'],
    rating: 4.7
  },
  {
    id: '8',
    name: 'Bangkok',
    country: 'Thailand',
    lat: 13.7563,
    lng: 100.5018,
    popularity: 85,
    image: '🛕',
    description: 'Vibrant street life, ornate temples, and incredible street food.',
    bestTime: 'Nov-Mar',
    averageCost: '$40-80/day',
    highlights: ['Grand Palace', 'Wat Pho Temple', 'Floating Markets', 'Khao San Road'],
    rating: 4.4
  },
  {
    id: '9',
    name: 'Cape Town',
    country: 'South Africa',
    lat: -33.9249,
    lng: 18.4241,
    popularity: 82,
    image: '🏔️',
    description: 'Stunning landscapes, wine regions, and rich cultural heritage.',
    bestTime: 'Nov-Mar',
    averageCost: '$60-120/day',
    highlights: ['Table Mountain', 'Robben Island', 'Cape of Good Hope', 'Wine Country'],
    rating: 4.3
  },
  {
    id: '10',
    name: 'Reykjavik',
    country: 'Iceland',
    lat: 64.1466,
    lng: -21.9426,
    popularity: 78,
    image: '🏔️',
    description: 'Gateway to natural wonders, Northern Lights, and geothermal springs.',
    bestTime: 'Jun-Aug',
    averageCost: '$180-300/day',
    highlights: ['Blue Lagoon', 'Northern Lights', 'Golden Circle', 'Geysir'],
    rating: 4.5
  },
  {
    id: '11',
    name: 'Marrakech',
    country: 'Morocco',
    lat: 31.6295,
    lng: -7.9811,
    popularity: 80,
    image: '🕌',
    description: 'Exotic markets, stunning architecture, and Sahara desert adventures.',
    bestTime: 'Oct-Apr',
    averageCost: '$50-100/day',
    highlights: ['Jemaa el-Fnaa', 'Atlas Mountains', 'Majorelle Garden', 'Sahara Desert'],
    rating: 4.2
  },
  {
    id: '12',
    name: 'Rio de Janeiro',
    country: 'Brazil',
    lat: -22.9068,
    lng: -43.1729,
    popularity: 84,
    image: '🏖️',
    description: 'Beautiful beaches, vibrant culture, and iconic landmarks.',
    bestTime: 'Dec-Mar',
    averageCost: '$70-150/day',
    highlights: ['Christ the Redeemer', 'Copacabana Beach', 'Sugarloaf Mountain', 'Carnival'],
    rating: 4.4
  },
  {
    id: '13',
    name: 'Singapore',
    country: 'Singapore',
    lat: 1.3521,
    lng: 103.8198,
    popularity: 88,
    image: '🏙️',
    description: 'Modern city-state with incredible food and architecture.',
    bestTime: 'Feb-Apr',
    averageCost: '$120-250/day',
    highlights: ['Marina Bay Sands', 'Gardens by the Bay', 'Hawker Centers', 'Sentosa Island'],
    rating: 4.6
  },
  {
    id: '14',
    name: 'Istanbul',
    country: 'Turkey',
    lat: 41.0082,
    lng: 28.9784,
    popularity: 85,
    image: '🕌',
    description: 'Where Europe meets Asia with rich history and culture.',
    bestTime: 'Apr-May, Sep-Nov',
    averageCost: '$60-120/day',
    highlights: ['Hagia Sophia', 'Blue Mosque', 'Grand Bazaar', 'Bosphorus Cruise'],
    rating: 4.5
  },
  {
    id: '15',
    name: 'Barcelona',
    country: 'Spain',
    lat: 41.3851,
    lng: 2.1734,
    popularity: 90,
    image: '🏰',
    description: 'Stunning architecture, vibrant culture, and Mediterranean charm.',
    bestTime: 'May-Jun, Sep-Oct',
    averageCost: '$100-200/day',
    highlights: ['Sagrada Familia', 'Park Güell', 'Las Ramblas', 'Gothic Quarter'],
    rating: 4.7
  },
  {
    id: '16',
    name: 'Mumbai',
    country: 'India',
    lat: 19.0760,
    lng: 72.8777,
    popularity: 82,
    image: '🏙️',
    description: 'Bollywood capital with incredible street food and energy.',
    bestTime: 'Oct-Mar',
    averageCost: '$30-70/day',
    highlights: ['Gateway of India', 'Marine Drive', 'Bollywood Studios', 'Street Markets'],
    rating: 4.3
  },
  {
    id: '17',
    name: 'Cairo',
    country: 'Egypt',
    lat: 30.0444,
    lng: 31.2357,
    popularity: 86,
    image: '🏛️',
    description: 'Ancient wonders and Islamic architecture.',
    bestTime: 'Oct-Apr',
    averageCost: '$40-80/day',
    highlights: ['Pyramids of Giza', 'Egyptian Museum', 'Khan el-Khalili', 'Nile River'],
    rating: 4.4
  },
  {
    id: '18',
    name: 'Buenos Aires',
    country: 'Argentina',
    lat: -34.6037,
    lng: -58.3816,
    popularity: 83,
    image: '🏛️',
    description: 'European elegance meets Latin passion.',
    bestTime: 'Mar-May, Sep-Nov',
    averageCost: '$60-120/day',
    highlights: ['Tango Shows', 'La Boca', 'Recoleta Cemetery', 'Puerto Madero'],
    rating: 4.5
  },
  {
    id: '19',
    name: 'Kyoto',
    country: 'Japan',
    lat: 35.0116,
    lng: 135.7681,
    popularity: 89,
    image: '⛩️',
    description: 'Ancient temples, traditional culture, and stunning gardens.',
    bestTime: 'Mar-May, Oct-Nov',
    averageCost: '$100-200/day',
    highlights: ['Fushimi Inari Shrine', 'Bamboo Grove', 'Kiyomizu Temple', 'Geisha District'],
    rating: 4.8
  },
  {
    id: '20',
    name: 'Vancouver',
    country: 'Canada',
    lat: 49.2827,
    lng: -123.1207,
    popularity: 81,
    image: '🏔️',
    description: 'Beautiful nature meets modern city life.',
    bestTime: 'Jun-Aug',
    averageCost: '$120-250/day',
    highlights: ['Stanley Park', 'Granville Island', 'Capilano Bridge', 'Whistler'],
    rating: 4.6
  }
]

function InteractiveMap() {
  const [isClient, setIsClient] = useState(false)
  const [blinkingRedDotIcon, setBlinkingRedDotIcon] = useState<import('leaflet').DivIcon | null>(null)
  
  useEffect(() => {
    setIsClient(true)
    
    // Create icon only on client side
    const createIcon = async () => {
      const L = (await import('leaflet')).default
      
      const icon = L.divIcon({
        className: 'custom-red-dot',
        html: `
          <div style="
            background-color: #ef4444; 
            width: 12px; 
            height: 12px; 
            border-radius: 50%; 
            border: 2px solid white; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            animation: blink 2s ease-in-out infinite;
          "></div>
          <style>
            @keyframes blink {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.3; transform: scale(1.2); }
            }
          </style>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      })
      
      setBlinkingRedDotIcon(icon)
    }
    
    createIcon()
  }, [])

  const handleAIInsights = (destination: Destination) => {
    // Simple alert for now - you can integrate with your AI system later
    alert(`Getting AI insights for ${destination.name}, ${destination.country}...`)
  }

  if (!isClient || !blinkingRedDotIcon) {
    return <div className="mt-8 h-[300px] bg-gray-100 rounded-xl flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  }

  return (
    <div className="mt-8">
      {/* Clean Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
          🗺️ Click any destination to explore
        </div>
      </div>
      
      {/* Clean Map Container */}
      <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="absolute top-4 right-4 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-gray-600 dark:text-gray-300 shadow-sm">
          20 destinations
        </div>
        
        <div style={{ height: '300px', width: '100%' }}>
          <MapContainer
            center={[25, 0]}
            zoom={2}
            style={{ height: '100%', width: '100%' }}
            className="rounded-xl"
          >
            {/* Clean, professional map style */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              subdomains="abcd"
            />
            
            {popularDestinations.map((dest) => (
              <Marker
                key={dest.id}
                position={[dest.lat, dest.lng]}
                icon={blinkingRedDotIcon}
              >
                <Popup>
                  <div className="p-4 min-w-[200px] bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border-l-4 border-blue-500">
                    <div className="text-center">
                      <div className="text-3xl mb-2">{dest.image}</div>
                      <h3 className="font-bold text-xl text-blue-800 dark:text-blue-200 mb-1">{dest.name}</h3>
                      <p className="text-purple-600 dark:text-purple-300 text-sm font-medium mb-2">{dest.country}</p>
                      
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <Star className="text-yellow-500 fill-current" size={16} />
                        <span className="text-yellow-600 font-bold">{dest.rating}</span>
                      </div>
                      
                      <div className="text-xs text-gray-600 dark:text-gray-300 mb-3 bg-white/50 dark:bg-black/20 rounded px-2 py-1">
                        Best time: {dest.bestTime}
                      </div>
                      
                      <button
                        onClick={() => handleAIInsights(dest)}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 px-4 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                      >
                        🤖 Get AI Insights
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  )
}

export default InteractiveMap
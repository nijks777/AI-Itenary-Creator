import { Textarea } from '@/components/ui/textarea'
import React from 'react'
import { MapPin, Camera, Utensils, Compass, Send } from 'lucide-react'
import TravelVideo from './TravelVideo'
import PopularDestinations from './PopularDestinations'

function Hero() {
  return (
    <>
      {/* Hero Content Section */}
      <div className='mt-16 w-full flex justify-center'>
        <div className='md:w-3xl w-full text-center px-4'>   
          <h1 className='text-xl md:text-5xl font-bold'>
            Hey! Ready to explore? I'll craft your <span className='text-primary'>perfect itinerary.</span>
          </h1>
          <p className='mt-2 text-md md:text-lg text-gray-600 dark:text-gray-400'>Just share your travel details, and I'll handle the rest.</p>

          {/* Input box with integrated button */}
          <div className='mt-4 md:mt-8'>
            <div className='relative'>
              <Textarea 
                placeholder='E.g., "3 days in Paris for art and history, budget $1500"' 
                className='h-24 md:h-32 w-full pr-16 resize-none'
              />
              <button className='absolute bottom-3 right-3 bg-primary text-white p-2.5 rounded-lg hover:bg-primary/90 transition-all hover:scale-105 shadow-lg'>
                <Send size={20} />
              </button>
            </div>
          </div>

          {/* Suggestion boxes */}
          <div className='mt-8 grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 cursor-pointer border border-gray-200 dark:border-gray-700'>
              <div className='flex flex-col items-center text-center space-y-2'>
                <div className='bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full'>
                  <Compass className='text-blue-600 dark:text-blue-400' size={24} />
                </div>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Discover Hidden Gems</span>
              </div>
            </div>

            <div className='bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 cursor-pointer border border-gray-200 dark:border-gray-700'>
              <div className='flex flex-col items-center text-center space-y-2'>
                <div className='bg-green-100 dark:bg-green-900/30 p-3 rounded-full'>
                  <MapPin className='text-green-600 dark:text-green-400' size={24} />
                </div>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Popular Destinations</span>
              </div>
            </div>

            <div className='bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 cursor-pointer border border-gray-200 dark:border-gray-700'>
              <div className='flex flex-col items-center text-center space-y-2'>
                <div className='bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full'>
                  <Utensils className='text-orange-600 dark:text-orange-400' size={24} />
                </div>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Food & Culture</span>
              </div>
            </div>

            <div className='bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 cursor-pointer border border-gray-200 dark:border-gray-700'>
              <div className='flex flex-col items-center text-center space-y-2'>
                <div className='bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full'>
                  <Camera className='text-purple-600 dark:text-purple-400' size={24} />
                </div>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Photo Spots</span>
              </div>
            </div>
          </div>

          {/* Travel Video Section */}
          <TravelVideo />
        </div>
      </div>

      {/* Popular Destinations Section - Full Width Below Everything */}
      <PopularDestinations />
    </>
  )
}

export default Hero
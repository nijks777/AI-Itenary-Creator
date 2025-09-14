'use client'
import React, { useState } from 'react'

function PopularDestinations() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const totalCards = 7
  const maxIndex = totalCards - 3 // Show 3 cards at a time

  const handleNext = () => {
    setCurrentIndex(prev => prev < maxIndex ? prev + 1 : prev)
  }

  const handlePrevious = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : prev)
  }

  return (
    <div className="w-full py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Popular Destinations to Visit
        </h2>
        
        {/* Cards Container with Hover Navigation */}
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex gap-6 transition-transform duration-500 ease-in-out justify-center"
              style={{ transform: `translateX(${currentIndex * -270}px)` }}
            >
              
              {/* Card 1 - Paris */}
              <div className="flex-shrink-0 w-60 h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gray-200 dark:bg-gray-700 relative">
                <div className="absolute bottom-6 left-6 text-gray-800 dark:text-white">
                  <h3 className="text-xl font-bold">Paris</h3>
                  <p className="text-sm opacity-90">City of Light</p>
                </div>
              </div>

              {/* Card 2 - Tokyo */}
              <div className="flex-shrink-0 w-60 h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gray-200 dark:bg-gray-700 relative">
                <div className="absolute bottom-6 left-6 text-gray-800 dark:text-white">
                  <h3 className="text-xl font-bold">Tokyo</h3>
                  <p className="text-sm opacity-90">Modern Metropolis</p>
                </div>
              </div>

              {/* Card 3 - Santorini */}
              <div className="flex-shrink-0 w-60 h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gray-200 dark:bg-gray-700 relative">
                <div className="absolute bottom-6 left-6 text-gray-800 dark:text-white">
                  <h3 className="text-xl font-bold">Santorini</h3>
                  <p className="text-sm opacity-90">Greek Paradise</p>
                </div>
              </div>

              {/* Card 4 - Dubai */}
              <div className="flex-shrink-0 w-60 h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gray-200 dark:bg-gray-700 relative">
                <div className="absolute bottom-6 left-6 text-gray-800 dark:text-white">
                  <h3 className="text-xl font-bold">Dubai</h3>
                  <p className="text-sm opacity-90">Future City</p>
                </div>
              </div>

              {/* Card 5 - New York */}
              <div className="flex-shrink-0 w-60 h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gray-200 dark:bg-gray-700 relative">
                <div className="absolute bottom-6 left-6 text-gray-800 dark:text-white">
                  <h3 className="text-xl font-bold">New York</h3>
                  <p className="text-sm opacity-90">Big Apple</p>
                </div>
              </div>

              {/* Card 6 - Bali */}
              <div className="flex-shrink-0 w-60 h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gray-200 dark:bg-gray-700 relative">
                <div className="absolute bottom-6 left-6 text-gray-800 dark:text-white">
                  <h3 className="text-xl font-bold">Bali</h3>
                  <p className="text-sm opacity-90">Tropical Paradise</p>
                </div>
              </div>

              {/* Card 7 - London */}
              <div className="flex-shrink-0 w-60 h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gray-200 dark:bg-gray-700 relative">
                <div className="absolute bottom-6 left-6 text-gray-800 dark:text-white">
                  <h3 className="text-xl font-bold">London</h3>
                  <p className="text-sm opacity-90">Royal Heritage</p>
                </div>
              </div>

            </div>
          </div>

          {/* Invisible Hover Navigation Areas */}
          <div 
            className="absolute left-0 top-0 w-20 h-full bg-transparent cursor-pointer z-10"
            onMouseEnter={handlePrevious}
          >
          </div>

          <div 
            className="absolute right-0 top-0 w-20 h-full bg-transparent cursor-pointer z-10"
            onMouseEnter={handleNext}
          >
          </div>
        </div>

        {/* Navigation Hint */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">Hover on sides to navigate through destinations</p>
        </div>
      </div>
    </div>
  )
}

export default PopularDestinations
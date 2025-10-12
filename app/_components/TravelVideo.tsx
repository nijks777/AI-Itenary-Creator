'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

function TravelVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)

    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
      setIsPlaying(false)
    } else {
      video.play()
      setIsPlaying(true)
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  const handleVideoClick = () => {
    togglePlay()
  }

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className="mt-8">
      {/* Video Container */}
      <div 
        className="relative rounded-xl overflow-hidden shadow-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-1 group"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Video Player */}
        <div className="relative rounded-lg overflow-hidden shadow-inner bg-black">
          <video
            ref={videoRef}
            className="w-full h-[300px] object-cover cursor-pointer"
            muted
            loop
            playsInline
            onClick={handleVideoClick}
            poster="/video-placeholder.jpg" // Add a placeholder image
          >
            <source src="/123.mp4" type="video/mp4" />
            {/* Fallback for browsers that don't support video */}
            <div className="flex items-center justify-center h-[300px] bg-gray-200 dark:bg-gray-700">
              <p className="text-gray-500 dark:text-gray-400">Your browser does not support video playback.</p>
            </div>
          </video>

          {/* Video Overlay - appears on hover or when paused */}
          <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
            
            {/* Center Play/Pause Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={togglePlay}
                className="bg-white/90 hover:bg-white text-gray-800 rounded-full p-4 transition-all duration-200 hover:scale-110 shadow-lg"
              >
                {isPlaying ? (
                  <Pause size={24} />
                ) : (
                  <Play size={24} className="ml-1" />
                )}
              </button>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-4 left-4 right-4">
              {/* Progress Bar */}
              <div className="mb-3 bg-white/30 rounded-full h-1 overflow-hidden">
                <div 
                  className="bg-white h-full transition-all duration-100 ease-linear"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 transition-all duration-200 hover:scale-110"
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 transition-all duration-200 hover:scale-110"
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                </div>

                <div className="bg-white/90 px-3 py-1 rounded-full text-xs font-medium text-gray-800">
                  {Math.floor(currentTime)}s / {Math.floor(duration)}s
                </div>
              </div>
            </div>

          </div>

          {/* Loading State */}
          {duration === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Loading travel video...</p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Video Description */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Experience breathtaking destinations around the world. Let our AI help you plan your perfect journey to these amazing places.
        </p>
      </div>
    </div>
  )
}

export default TravelVideo
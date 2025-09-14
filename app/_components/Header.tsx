'use client'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const menuOptions = [
  { name: "Home", link: "/" },
  { name: "About", link: "/about" },
  { name: "Contact", link: "/contact" }
]

function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-[100] transition-all duration-300 border-b ${
      scrolled 
        ? 'bg-white/80 backdrop-blur-md border-gray-200/50 dark:bg-gray-900/80 dark:border-gray-800/50' 
        : 'bg-white/95 backdrop-blur-sm border-gray-200 dark:bg-gray-900/95 dark:border-gray-800'
    }`}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16 md:h-20'>
          {/* Logo Section */}
          <div className='flex items-center'>
            <Link href="/" className='flex items-center'>
              <Image 
                src="/logo.png" 
                alt="Logo" 
                width={180} 
                height={50} 
                className='h-auto w-auto'
                priority
              />
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className='hidden md:flex items-center space-x-8'>
            {menuOptions.map((menu) => (
              <Link 
                href={menu.link} 
                key={menu.name}
                className='text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary font-medium transition-all hover:scale-105'
              >
                {menu.name}
              </Link>
            ))}
          </nav>

          {/* Get Started Button */}
          <div className='flex items-center'>
            <Button className='bg-primary hover:bg-primary/90 text-white px-6 py-2 font-medium transition-all hover:scale-105 shadow-sm'>
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button (for future mobile menu) */}
          <div className='md:hidden flex items-center'>
            <button className='p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'>
              <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
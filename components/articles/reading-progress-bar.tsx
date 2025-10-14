/**
 * Reading Progress Bar Component (Story 7.8)
 *
 * Visual indicator showing article scroll progress
 * - Displays at top of page
 * - Updates based on scroll percentage
 * - Smooth animation
 * - Hidden when at top
 *
 * @module components/articles/reading-progress-bar
 */

'use client'

import { useEffect, useState } from 'react'

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll percentage
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY

      // Total scrollable height
      const scrollableHeight = documentHeight - windowHeight

      // Calculate percentage (0-100)
      const scrollPercentage = scrollableHeight > 0
        ? (scrollTop / scrollableHeight) * 100
        : 0

      setProgress(Math.min(100, Math.max(0, scrollPercentage)))
    }

    // Initial calculation
    handleScroll()

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Don't show if at very top (less than 1% progress)
  if (progress < 1) {
    return null
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-gold to-yellow-500 transition-all duration-150 ease-out"
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    />
  )
}

"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

const carouselImages = [
  { src: "/images/uni.jpg", alt: "University Campus" },
  { src: "/images/g.jpg", alt: "Students Group" },
  { src: "/images/v.jpg", alt: "Sports" },
  { src: "/images/i.jpg", alt: "Image" },
  { src: "/images/li.jpg", alt: "Library" },
]

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const nextSlide = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1))
    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating])

  const prevSlide = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1))
    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating])

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [nextSlide])

  return (
    <section id="home" className="pt-20 md:pt-16">
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden rounded-lg shadow-xl">
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {carouselImages.map((image, index) => (
            <div key={index} className="min-w-full h-full relative group">
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="absolute top-1/2 left-0 right-0 flex justify-between px-4 -translate-y-1/2">
          <button
            onClick={prevSlide}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/70 dark:bg-gray-800/70 flex items-center justify-center text-gray-800 dark:text-gray-200 shadow-md transition-all duration-300 hover:bg-white dark:hover:bg-gray-800 hover:scale-110 focus:outline-none"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/70 dark:bg-gray-800/70 flex items-center justify-center text-gray-800 dark:text-gray-200 shadow-md transition-all duration-300 hover:bg-white dark:hover:bg-gray-800 hover:scale-110 focus:outline-none"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (isAnimating) return
                setIsAnimating(true)
                setCurrentSlide(index)
                setTimeout(() => setIsAnimating(false), 500)
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "w-8 bg-white dark:bg-gray-200"
                  : "w-2 bg-white/50 dark:bg-gray-400/50 hover:bg-white/80 dark:hover:bg-gray-400/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

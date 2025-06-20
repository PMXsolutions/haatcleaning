import type React from "react"
import { useState } from "react"
import { FaArrowRight, FaArrowLeft, FaStar } from "react-icons/fa";
import { ImQuotesRight } from "react-icons/im";
import { Button } from "@/components/shared/button"

interface TestimonialData {
  quote: string
  name: string
  title: string
  location: string
  rating: number
  image: string
}

interface TestimonialCarouselProps {
  title?: string
  subtitle?: string
}

export const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
  title = "Feedback About Their Experience With Us",
  subtitle = "Read testimonials from our satisfied clients. See how our cleaning services have made a difference in their lives and homes.",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const testimonials: TestimonialData[] = [
    {
      quote:
        "Excellent service! The team was punctual, thorough, and left my home sparkling clean. Highly recommend for anyone needing a reliable and detailed cleaning service.",
      name: "Roberta Fox",
      title: "Business Woman",
      location: "Los Angeles",
      rating: 5,
      image: "/images/Testimonial-1.png",
    },
    {
      quote:
        "Fresh delivers exceptional cleanliness and service! Their team was professional, on-time, and thoroughly cleaned areas previous services missed.",
      name: "Matt Spencer",
      title: "Marketing Director",
      location: "New York",
      rating: 4,
      image: "/images/Testimonial-1.png",
    },
    {
      quote:
        "Our space feels refreshed and immaculate thanks to Fresh. Their eco-friendly products leave no harsh chemical smells, just a clean, healthy environment.",
      name: "Milly Brown",
      title: "Home Owner",
      location: "Los Angeles",
      rating: 5,
      image: "/images/Testimonial-1.png",
    },
  ]

  const nextTestimonial = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
      setIsAnimating(false)
    }, 250)
  }

  const prevTestimonial = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
      setIsAnimating(false)
    }, 250)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="py-6 md:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-5 gap-2 items-center md:w-[70%] lg:w-full mx-auto">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8 lg:text-left text-center">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary mb-4">{title}</h2>
              <p className="text-gray-600 font-text mb-6">{subtitle}</p>
            </div>

            {/* Navigation Arrows */}
            <div className="flex gap-4 justify-center lg:justify-start">
              <Button
                variant="icon"
                icon={<FaArrowLeft size={24} />}
                onClick={prevTestimonial}
                disabled={isAnimating}
              />
              <Button
                variant="icon"
                icon={<FaArrowRight size={24} />}
                onClick={nextTestimonial}
                disabled={isAnimating}
              />
            </div>
          </div>

          {/* Right Testimonial Card */}
          <div className="lg:col-span-3 mt-6 lg:mt-0">
            <div
              className={`bg-white rounded-3xl px-8 transition-all duration-500 ease-in-out transform ${
                isAnimating ? "opacity-50 scale-95" : "opacity-100 scale-100 hover:shadow-2xl"
              }`}
            >
              
              {/* Profile Section */}
              <div className="flex items-center gap-6">
                {/* Testimonial Image */}
                <div className="w-full h-full flex justify-end">
                  <img
                    src={currentTestimonial.image || "/placeholder.svg"}
                    alt={currentTestimonial.name}
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-1 justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-2xl text-gray-900 font-heading">{currentTestimonial.name}</h4>
                      <p className="text-lg text-gray-600">{currentTestimonial.title}</p>
                      {/* Star Rating */}
                      <div className="flex gap-1">
                        {[...Array(currentTestimonial.rating)].map((_, i) => (
                          <FaStar
                            key={i}
                            size={28}
                            className="fill-yellow-400 text-yellow-400 transition-all duration-200 hover:scale-110"
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      {/* Quote Icon */}
                      <div className="bg-gold text-white text-6xl font-serif w-20 h-20 rounded-xl flex items-center justify-center shadow-lg">
                        <ImQuotesRight />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-700 leading-relaxed font-text">{currentTestimonial.quote}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

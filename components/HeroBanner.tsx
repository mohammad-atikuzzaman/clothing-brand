"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HERO_SLIDES } from "@/data/products";

export const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <div className="relative w-full overflow-hidden bg-neutral-950 group">
      {/* Aspect Ratio Container: 16:9 on mobile, ~21:9 or ~3:1 on wide desktop */}
      <div className="relative w-full aspect-[16/8] sm:aspect-[21/9] max-h-[580px]">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              className="object-cover object-center"
              sizes="100vw"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex items-end justify-start p-6 sm:p-12 lg:p-16">
              <div className="max-w-xl text-white">
                <span className="inline-block bg-[#c19b65] text-black font-semibold text-xs tracking-widest uppercase px-3 py-1 mb-3 rounded-xs">
                  {slide.discount}
                </span>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold uppercase tracking-wider mb-2">
                  {slide.title}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-300 tracking-wider uppercase mb-5 font-light">
                  {slide.subtitle}
                </p>
                <a
                  href="#products-section"
                  className="inline-block bg-white text-black font-semibold text-xs tracking-widest uppercase px-6 py-3 hover:bg-[#c19b65] hover:text-white transition-colors duration-200"
                >
                  {slide.buttonText}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === currentSlide ? "w-8 bg-[#c19b65]" : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

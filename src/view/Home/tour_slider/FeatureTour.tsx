'use client';

import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { MapPin, Clock, Star, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils'; // Assuming standard Shadcn utils, if not will fix

const FEATURED_TOURS = [
  {
    id: 1,
    title: "Magical Maldives Retreat",
    location: "Maldives",
    price: "£1,299",
    duration: "7 Days",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=800&q=80",
    category: "Honeymoon"
  },
  {
    id: 2,
    title: "Sacred Umrah Journey",
    location: "Makkah & Madinah",
    price: "£850",
    duration: "10 Days",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1693590614566-1d3ea9ef32f7?auto=format&fit=crop&w=800&q=80",
    category: "Religious"
  },
  {
    id: 3,
    title: "Istanbul & Cappadocia",
    location: "Turkey",
    price: "£950",
    duration: "8 Days",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1691446930608-98466a4bdd0f?auto=format&fit=crop&w=800&q=80",
    category: "Adventure"
  },
  {
    id: 4,
    title: "Dubai Luxury Escape",
    location: "Dubai, UAE",
    price: "£1,100",
    duration: "5 Days",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=800&q=80",
    category: "Luxury"
  },
  {
    id: 5,
    title: "Swiss Alps Adventure",
    location: "Switzerland",
    price: "£1,450",
    duration: "6 Days",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80",
    category: "Nature"
  }
];

const FeatureTour = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [
    Autoplay({ delay: 4000, stopOnInteraction: false })
  ]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="py-20 bg-base-100 overflow-hidden">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-secondary font-bold uppercase tracking-wider text-sm flex items-center gap-2">
              <span className="w-8 h-[2px] bg-secondary"></span>
              Featured Destinations
            </span>
            <h2 className="text-4xl md:text-5xl font-gilliequest uppercase leading-tight">
              Popular <span className="text-primary italic">Tour </span>Packages
            </h2>
            <p className="text-gray-500 text-lg">
              Discover our most loved destinations, curated for unforgettable experiences.
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <button 
              onClick={scrollPrev}
              className="btn btn-circle btn-outline border-base-300 hover:bg-primary hover:border-primary hover:text-white transition-all duration-300"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={scrollNext}
              className="btn btn-circle btn-primary text-white shadow-lg shadow-primary/30 hover:scale-110 transition-transform duration-300"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative" ref={emblaRef}>
          <div className="flex -ml-6 py-4"> {/* Negative margin for gap compensation */}
            {FEATURED_TOURS.map((tour) => (
              <div key={tour.id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-6 min-w-0">
                <div className="group relative h-[450px] rounded-3xl overflow-hidden bg-base-100 border border-base-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  
                  {/* Image Background */}
                  <div className="absolute inset-0">
                    <Image
                      src={tour.image}
                      alt={tour.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  </div>

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="badge badge-primary text-white font-bold py-3 px-4 shadow-lg">
                      {tour.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white z-10 space-y-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm font-medium text-gray-300">
                      <div className="flex items-center gap-1.5">
                        <Clock size={16} className="text-secondary" />
                        {tour.duration}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Star size={16} className="text-yellow-400 fill-yellow-400" />
                        {tour.rating}
                      </div>
                    </div>

                    {/* Title & Location */}
                    <div className="space-y-1">
                        <h3 className="text-2xl font-bold font-gilliequest leading-tight group-hover:text-primary transition-colors">
                        {tour.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-gray-300">
                            <MapPin size={16} />
                            {tour.location}
                        </div>
                    </div>

                    <div className="w-full h-[1px] bg-white/20" />

                    {/* Footer: Price & Action */}
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wider block">Start From</span>
                        <span className="text-2xl font-bold text-white group-hover:text-secondary transition-colors">{tour.price}</span>
                      </div>
                      
                      <Link 
                        href={`/tours/${tour.id}`} 
                        className="btn btn-circle bg-white/20 border-0 text-white hover:bg-primary hover:text-white backdrop-blur-sm"
                      >
                        <ArrowRight size={20} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default FeatureTour;

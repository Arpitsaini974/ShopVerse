import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Sparkles,
  Zap
} from 'lucide-react';

// 7 Diverse Category-Themed Commercial Hero Slides
const HERO_SLIDES = [
  {
    id: 'mobiles',
    category: 'Mobiles',
    badge: 'FLAGSHIP LAUNCHES',
    headline: 'Upgrade Your Mobile Experience',
    description: 'Explore the latest 5G smartphones from Apple, Samsung, OnePlus & top global leaders with exchange bonuses.',
    ctaText: 'SHOP MOBILES',
    link: '/products?category=Mobiles',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=85',
    productName: 'Apple iPhone 16 Pro & Flagship 5G',
    productTag: 'Official Brand Warranties Included',
    accentColor: 'from-blue-600/30 via-indigo-600/20 to-transparent',
    pillColor: 'from-blue-500/20 to-indigo-500/20 text-blue-300 border-blue-400/30'
  },
  {
    id: 'electronics',
    category: 'Electronics',
    badge: 'PRO PERFORMANCE',
    headline: 'Power Up Your Everyday Gear',
    description: 'Discover high-performance laptops, studio-grade audio, 4K monitors & smart wearables built for creators.',
    ctaText: 'SHOP ELECTRONICS',
    link: '/products?category=Electronics',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=85',
    productName: 'MacBook Pro, Dell XPS & Audio',
    productTag: 'Up to 40% Off Laptops & Accessories',
    accentColor: 'from-cyan-600/30 via-blue-600/20 to-transparent',
    pillColor: 'from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-400/30'
  },
  {
    id: 'fashion',
    category: 'Fashion',
    badge: 'NEW SEASON TRENDS',
    headline: 'Style That Fits Your Life',
    description: 'Fresh apparel, trending sneakers, and everyday statement wear from Nike, Adidas, Puma, and Levi\'s.',
    ctaText: 'SHOP FASHION',
    link: '/products?category=Fashion',
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=85',
    productName: 'Ultraboost & Premium Footwear',
    productTag: '100% Genuine Apparel & Sneakers',
    accentColor: 'from-rose-600/30 via-pink-600/20 to-transparent',
    pillColor: 'from-rose-500/20 to-pink-500/20 text-rose-300 border-rose-400/30'
  },
  {
    id: 'home-appliances',
    category: 'Appliances',
    badge: 'SMART LIVING',
    headline: 'Elevate Your Home & Living Space',
    description: 'Smart kitchen essentials, cordless vacuums, ergonomic furniture, and energy-efficient double-door refrigerators.',
    ctaText: 'SHOP APPLIANCES',
    link: '/products?category=Appliances',
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=1000&q=85',
    productName: 'Smart Refrigerators & Dyson Cleaners',
    productTag: 'Zero Cost EMI Available',
    accentColor: 'from-emerald-600/30 via-teal-600/20 to-transparent',
    pillColor: 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-400/30'
  },
  {
    id: 'beauty',
    category: 'Beauty',
    badge: 'DERMA & LUXURY CARE',
    headline: 'Glow With Pure Confidence',
    description: 'Dermatologist-tested skincare, revitalizing hyaluronic serums, and luxury fragrances from trusted beauty icons.',
    ctaText: 'SHOP BEAUTY',
    link: '/products?category=Beauty',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1000&q=85',
    productName: 'L\'Oreal, Forest Essentials & Minimalist',
    productTag: 'Dermatologically Approved Care',
    accentColor: 'from-purple-600/30 via-fuchsia-600/20 to-transparent',
    pillColor: 'from-purple-500/20 to-fuchsia-500/20 text-purple-300 border-purple-400/30'
  },
  {
    id: 'sports',
    category: 'Sports',
    badge: 'ACTIVE & ATHLETIC',
    headline: 'Gear Up For Every Game',
    description: 'Premium English willow bats, pro gym equipment, badminton racquets, and all-weather athletic accessories.',
    ctaText: 'SHOP SPORTS',
    link: '/products?category=Sports',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=85',
    productName: 'SG, Yonex, Decathlon & Nivia Gear',
    productTag: 'Tested for Peak Athletic Endurance',
    accentColor: 'from-amber-600/30 via-orange-600/20 to-transparent',
    pillColor: 'from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-400/30'
  },
  {
    id: 'books-toys',
    category: 'Books',
    badge: 'BESTSELLERS & LEARNING',
    headline: 'Ignite Curiosity & Mindset',
    description: 'Chart-topping business & personal growth reads, LEGO building sets, and daily home essentials delivered in minutes.',
    ctaText: 'SHOP BOOKS & TOYS',
    link: '/products?category=Books',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=85',
    productName: 'Atomic Habits, LEGO Kits & More',
    productTag: 'Bestselling Titles & Creative Fun',
    accentColor: 'from-indigo-600/30 via-violet-600/20 to-transparent',
    pillColor: 'from-indigo-500/20 to-violet-500/20 text-indigo-300 border-indigo-400/30'
  }
];

export const HeroBanner = () => {
  // Initialize starting slide randomly on page load/refresh so it doesn't always start on slide 0
  const [currentIndex, setCurrentIndex] = useState(() => {
    return Math.floor(Math.random() * HERO_SLIDES.length);
  });
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // Automatic rotation: 5-second interval, paused when mouse enters on desktop
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  const currentSlide = HERO_SLIDES[currentIndex];

  return (
    <div 
      className="w-full relative bg-[#0b1329] overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Dynamic ambient radial lighting matching current slide theme */}
      <div 
        className={`absolute inset-0 pointer-events-none opacity-40 mix-blend-screen transition-all duration-700 bg-gradient-to-tr ${currentSlide.accentColor}`}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Main Hero Carousel Slide Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7 pb-6 md:pt-10 md:pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center min-h-[380px] sm:min-h-[420px]">
          
          {/* Left Column: Slide Content (Headline, Description, CTA) */}
          <div className="md:col-span-7 flex flex-col justify-center text-left space-y-3.5 sm:space-y-4">
            
            {/* Category Theme Badge */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black tracking-wider uppercase w-fit bg-gradient-to-r ${currentSlide.pillColor} backdrop-blur-md shadow-sm transition-all duration-500`}>
              <Sparkles size={13} className="text-amber-400" />
              <span>{currentSlide.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[46px] font-black text-white tracking-tight leading-[1.14] transition-all duration-500">
              {currentSlide.headline}
            </h1>

            {/* Slide Description */}
            <p className="text-sm sm:text-base text-slate-300 max-w-xl font-normal leading-relaxed line-clamp-2 sm:line-clamp-3">
              {currentSlide.description}
            </p>

            {/* Slide Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to={currentSlide.link}
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-black text-xs sm:text-sm text-white bg-[#fb641b] hover:bg-[#e25712] active:scale-[0.98] shadow-lg shadow-orange-500/25 transition-all duration-200 uppercase tracking-wider"
              >
                <span>{currentSlide.ctaText}</span>
                <ArrowRight size={15} />
              </Link>

              <Link
                to="/products?sort=discount"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm text-slate-200 bg-white/10 hover:bg-white/15 border border-white/15 active:scale-[0.98] transition-all duration-200 backdrop-blur-sm"
              >
                <Zap size={14} className="text-amber-400 fill-amber-400" />
                <span>Today's Deals</span>
              </Link>
            </div>

            {/* Marketplace Trust Propositions */}
            <div className="pt-3 flex items-center gap-4 sm:gap-6 text-[11px] sm:text-xs text-slate-300 border-t border-white/10 mt-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
                <span className="font-medium">100% Genuine Brands</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck size={15} className="text-blue-400 shrink-0" />
                <span className="font-medium">Free Delivery Across India</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw size={15} className="text-amber-400 shrink-0" />
                <span className="font-medium">7-Day Easy Returns</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Container */}
          <div className="md:col-span-5 flex justify-center items-center relative">
            <div className="relative z-10 w-full max-w-[420px] rounded-2xl bg-gradient-to-b from-white/10 to-white/5 p-3.5 sm:p-4 border border-white/15 shadow-2xl backdrop-blur-md group hover:border-white/25 transition-all duration-300">
              <div className="relative h-56 sm:h-64 md:h-72 w-full rounded-xl overflow-hidden bg-slate-900/60 flex items-center justify-center p-3">
                <img
                  key={currentSlide.id}
                  src={currentSlide.image}
                  alt={currentSlide.productName}
                  className="max-h-full max-w-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)] transition-all duration-500 animate-in fade-in zoom-in-95 select-none"
                  loading="eager"
                />
                
                {/* Genuine Product Overlay Tag */}
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-emerald-500/90 text-white text-[10px] font-bold tracking-wide uppercase backdrop-blur-sm shadow-md flex items-center gap-1">
                  <ShieldCheck size={12} />
                  <span>{currentSlide.category}</span>
                </div>
              </div>

              {/* Product Visual Details */}
              <div className="mt-2.5 px-2 flex items-center justify-between">
                <div className="truncate">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                    {currentSlide.productName}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">
                    {currentSlide.productTag}
                  </p>
                </div>
                <Link
                  to={currentSlide.link}
                  className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0 ml-2"
                  aria-label={`Explore ${currentSlide.category}`}
                >
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Carousel Navigation Controls & Indicators */}
        <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between">
          {/* Previous / Next Arrow Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-150 backdrop-blur-md active:scale-95 border border-white/15"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Slide"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-150 backdrop-blur-md active:scale-95 border border-white/15"
            >
              <ChevronRight size={16} />
            </button>
            <span className="text-xs font-semibold text-slate-400 ml-1 hidden sm:inline">
              {currentIndex + 1} / {HERO_SLIDES.length}
            </span>
          </div>

          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}: ${slide.category}`}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === idx 
                    ? 'w-6 sm:w-8 h-2 bg-[#fb641b] shadow-sm shadow-orange-500/50' 
                    : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>

          {/* Quick Slide Category Pills (Desktop) */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs">
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(idx)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  currentIndex === idx
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {slide.category}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};


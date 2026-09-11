import React from 'react';
import { HeroBanner } from '../components/home/HeroBanner';
import { CategoryCards } from '../components/home/CategoryCards';
import { TrendingProducts } from '../components/home/TrendingProducts';
import { DealOfTheDay } from '../components/home/DealOfTheDay';
import { TopBrands } from '../components/home/TopBrands';
import { RecommendedForYou } from '../components/home/RecommendedForYou';
import { RecentlyViewed } from '../components/home/RecentlyViewed';
import { TrustBadges } from '../components/home/TrustBadges';

const HomePage = () => {
  return (
    <div className="bg-[#f1f3f6] min-h-screen pb-12">
      {/* 1. HERO SECTION WITH EMBEDDED DYNAMIC CATEGORY SHORTCUTS */}
      <HeroBanner />

      <main className="w-full max-w-[2400px] mx-auto px-2 sm:px-4 md:px-6 lg:px-8 space-y-6 sm:space-y-8 mt-4 sm:mt-6">
        {/* 2. SHOP BY CATEGORY (10 Major Categories with Authentic Imagery) */}
        <CategoryCards />

        {/* 3. TRENDING NOW (Dual action, ratings, real prices & discounts) */}
        <TrendingProducts />

        {/* 4. DEALS YOU MAY LIKE (Live DB discounts, countdown timer, dual actions) */}
        <DealOfTheDay />

        {/* 5. POPULAR BRANDS (Dynamic DB brands with category filters & authentic logos) */}
        <TopBrands />

        {/* 6. RECOMMENDED FOR YOU / POPULAR ON SHOPVERSE (Personalized or platform-wide) */}
        <RecommendedForYou />

        {/* 7. RECENTLY VIEWED (If user has viewed products) */}
        <RecentlyViewed />

        {/* 8. TRUST & VALUE PROPOSITIONS */}
        <TrustBadges />
      </main>
    </div>
  );
};

export default HomePage;


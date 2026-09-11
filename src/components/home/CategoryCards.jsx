import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ChevronRight } from 'lucide-react';
import { api } from '../../api/client';
import { categories as fallbackCategories } from '../../data/categories';

// Category card metadata with authentic product-focused visuals and concise labels
const categoryVisualMap = {
  'Mobiles': {
    label: 'Latest smartphones',
    tag: '5G Flagships & Accessories',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80',
    popularBadge: 'Top Seller'
  },
  'Electronics': {
    label: 'Gadgets & accessories',
    tag: 'Laptops, Audio & Watches',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    popularBadge: 'Popular'
  },
  'Fashion': {
    label: 'Style for everyone',
    tag: 'Men, Women & Footwear',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80'
  },
  'Home': {
    label: 'Make your space better',
    tag: 'Furniture & Smart Living',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80'
  },
  'Appliances': {
    label: 'Smart home essentials',
    tag: 'Refrigerators, ACs & Kitchen',
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80'
  },
  'Beauty': {
    label: 'Beauty & personal care',
    tag: 'Skincare, Makeup & Scents',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80'
  },
  'Sports': {
    label: 'Gear for every game',
    tag: 'Fitness, Cricket & Cycling',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80'
  },
  'Books': {
    label: 'Bestsellers & reads',
    tag: 'Fiction, Business & Growth',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
  },
  'Toys': {
    label: 'Fun & learning',
    tag: 'LEGO, Games & Vehicles',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=600&q=80'
  },
  'Grocery': {
    label: 'Daily essentials',
    tag: 'Beverages, Snacks & Food',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'
  }
};

export const CategoryCards = () => {
  const [categories, setCategories] = useState(fallbackCategories);

  useEffect(() => {
    let isMounted = true;
    api.getCategories()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      })
      .catch((err) => {
        console.warn('CategoryCards: Using fallback categories due to API notice:', err);
      });
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="bg-white p-5 sm:p-7 rounded-2xl shadow-sm border border-gray-100">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-6 bg-primary-600 rounded-full inline-block" />
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              SHOP BY CATEGORY
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 pl-4">
            Explore authentic products curated across all 10 store departments
          </p>
        </div>

        <Link
          to="/products"
          className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-3.5 py-1.5 rounded-lg transition-colors"
        >
          <span>View All Products</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* 10 Major Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
        {categories.map((category) => {
          const visual = categoryVisualMap[category.name] || {};
          const cardImage = category.image || visual.image || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80';
          const cardLabel = visual.label || (category.description?.slice(0, 30) + '...') || 'Explore items';
          const cardTag = visual.tag || (category.product_count ? `${category.product_count} Products` : 'Shop now');
          const categoryLink = `/products?category=${encodeURIComponent(category.name)}`;

          return (
            <Link
              key={category.id || category.slug || category.name}
              to={categoryLink}
              className="group relative flex flex-col justify-between bg-white rounded-xl border border-gray-100 p-3 sm:p-4 hover:border-primary-400 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              {visual.popularBadge && (
                <span className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 text-[9px] font-extrabold rounded-md bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wide">
                  {visual.popularBadge}
                </span>
              )}

              {/* Realistic Product Visual Showcase */}
              <div className="w-full h-28 sm:h-32 rounded-xl bg-gradient-to-b from-slate-50 to-gray-100/70 p-2.5 flex items-center justify-center overflow-hidden mb-3 group-hover:from-blue-50/50 group-hover:to-indigo-50/40 transition-colors">
                <img
                  src={cardImage}
                  alt={category.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-sm"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>

              {/* Category Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-black text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-600 font-medium line-clamp-1 mt-0.5">
                    {cardLabel}
                  </p>
                  <span className="text-[11px] text-gray-400 block line-clamp-1 mt-0.5">
                    {cardTag}
                  </span>
                </div>

                {/* Footer action */}
                <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-primary-600 font-bold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Shop</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, ChevronRight } from 'lucide-react';
import { api } from '../../api/client';

export const TopBrands = () => {
  const [brandsList, setBrandsList] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  // Curated prominent brand logos/icons with clean styling
  const brandLogos = {
    'Apple': { icon: '', color: 'bg-black text-white' },
    'Samsung': { icon: 'SAMSUNG', color: 'bg-[#1428a0] text-white font-black tracking-wider text-xs' },
    'OnePlus': { icon: '1+', color: 'bg-red-600 text-white font-black' },
    'Sony': { icon: 'SONY', color: 'bg-neutral-900 text-white font-black tracking-widest text-xs' },
    'Dell': { icon: 'DELL', color: 'bg-[#007db8] text-white font-bold' },
    'HP': { icon: 'hp', color: 'bg-[#0096d6] text-white font-bold italic text-lg' },
    'Lenovo': { icon: 'Lenovo', color: 'bg-[#e2231a] text-white font-bold text-xs' },
    'ASUS': { icon: 'ASUS', color: 'bg-neutral-800 text-white font-black tracking-wider text-xs' },
    'boAt': { icon: 'boAt', color: 'bg-red-500 text-white font-black text-xs' },
    'Nike': { icon: '✓', color: 'bg-black text-white font-black text-xl' },
    'Adidas': { icon: '///', color: 'bg-black text-white font-black text-base' },
    'Puma': { icon: 'PUMA', color: 'bg-neutral-900 text-white font-black text-xs' },
    'LG': { icon: 'LG', color: 'bg-[#a50034] text-white font-bold' },
    'Xiaomi': { icon: 'mi', color: 'bg-[#ff6900] text-white font-black text-sm' },
    'Realme': { icon: 'realme', color: 'bg-[#ffc915] text-black font-bold text-xs' },
    'Logitech': { icon: 'logi', color: 'bg-[#00b8fc] text-black font-bold text-xs' },
    'Canon': { icon: 'Canon', color: 'bg-[#cc0000] text-white font-bold text-xs' },
    'IKEA': { icon: 'IKEA', color: 'bg-[#0051ba] text-[#ffda1a] font-black tracking-wider text-xs' },
    'LEGO': { icon: 'LEGO', color: 'bg-[#e3000b] text-[#ffed00] font-black text-xs' },
    'Penguin': { icon: '🐧', color: 'bg-orange-500 text-white text-base' }
  };

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const params = activeCategory === 'All' ? {} : { category: activeCategory };

    api.getBrands(params)
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          // Sort by product count descending, take top 12 with products
          const filtered = data
            .filter((b) => (b.count || 0) > 0)
            .sort((a, b) => (b.count || 0) - (a.count || 0))
            .slice(0, 12);
          
          if (filtered.length > 0) {
            setBrandsList(filtered);
          } else {
            // Fallback to top brands regardless of count if filtered is empty
            setBrandsList(data.slice(0, 12));
          }
        }
      })
      .catch((err) => {
        console.warn('Brands API error:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, [activeCategory]);

  const categories = ['All', 'Mobiles', 'Electronics', 'Fashion', 'Appliances', 'Sports'];

  return (
    <section className="bg-white p-5 sm:p-7 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-gray-100 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              POPULAR BRANDS
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              100% genuine products with official manufacturer warranties
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {brandsList.map((brand) => {
          const visual = brandLogos[brand.name] || {
            icon: brand.name.slice(0, 3).toUpperCase(),
            color: 'bg-gray-800 text-white font-bold text-xs'
          };

          return (
            <Link
              key={brand.name}
              to={`/products?brand=${encodeURIComponent(brand.name)}`}
              className="group flex flex-col items-center justify-center p-4 border border-gray-100 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all duration-200 bg-gradient-to-b from-gray-50/50 to-white text-center"
            >
              <div
                className={`w-14 h-12 rounded-xl flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform duration-200 ${visual.color}`}
              >
                <span>{visual.icon}</span>
              </div>
              <span className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {brand.name}
              </span>
              <span className="text-[11px] text-gray-500 mt-0.5 font-medium">
                {brand.count ? `${brand.count} products` : 'Explore'}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

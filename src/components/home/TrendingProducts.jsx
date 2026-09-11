import React, { useState, useEffect } from 'react';
import { TrendingUp, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { products as fallbackProducts } from '../../data/products';
import { ProductCard } from '../product/ProductCard';

export const TrendingProducts = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    api.getProducts({ sort: 'popular', limit: 8 })
      .then((data) => {
        if (isMounted && data && Array.isArray(data.products) && data.products.length > 0) {
          setTrendingProducts(data.products);
        } else if (isMounted) {
          const fallback = [...fallbackProducts]
            .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
            .slice(0, 8);
          setTrendingProducts(fallback);
        }
      })
      .catch((err) => {
        console.warn('TrendingProducts: Using catalog fallback due to notice:', err);
        if (isMounted) {
          const fallback = [...fallbackProducts]
            .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
            .slice(0, 8);
          setTrendingProducts(fallback);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  if (!isLoading && trendingProducts.length === 0) return null;

  return (
    <section className="bg-white p-5 sm:p-7 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              TRENDING NOW
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Most purchased & highly rated products across India this week
            </p>
          </div>
        </div>
        <Link
          to="/products?sort=popular"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-3.5 py-1.5 rounded-lg transition-colors"
        >
          <span>View More</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      <div className="flex overflow-x-auto gap-4 sm:gap-5 pb-4 snap-x snap-mandatory scrollbar-hide -mx-2 px-2 sm:mx-0 sm:px-0">
        {trendingProducts.map((product) => (
          <div key={product.id} className="min-w-[250px] sm:min-w-[280px] max-w-[290px] snap-start shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

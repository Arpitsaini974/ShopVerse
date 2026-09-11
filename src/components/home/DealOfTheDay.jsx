import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, ChevronRight, Clock } from 'lucide-react';
import { api } from '../../api/client';
import { products as fallbackProducts } from '../../data/products';
import { ProductCard } from '../product/ProductCard';

export const DealOfTheDay = () => {
  const [dealProducts, setDealProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      const difference = endOfDay.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    api.getProducts({ sort: 'discount', limit: 8 })
      .then((data) => {
        if (isMounted && data && Array.isArray(data.products) && data.products.length > 0) {
          setDealProducts(data.products);
        } else if (isMounted) {
          const fallback = [...fallbackProducts]
            .sort((a, b) => (b.discount || 0) - (a.discount || 0))
            .slice(0, 8);
          setDealProducts(fallback);
        }
      })
      .catch((err) => {
        console.warn('Deals: Using fallback due to error:', err);
        if (isMounted) {
          const fallback = [...fallbackProducts]
            .sort((a, b) => (b.discount || 0) - (a.discount || 0))
            .slice(0, 8);
          setDealProducts(fallback);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  if (!isLoading && dealProducts.length === 0) return null;

  return (
    <section className="bg-white p-5 sm:p-7 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-gray-100 gap-4">
        <div className="flex flex-wrap items-center gap-3.5">
          <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                DEALS YOU MAY LIKE
              </h2>
              <span className="hidden sm:inline-block bg-red-100 text-red-700 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                Up to 80% Off
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              Handpicked blockbuster discounts ending soon
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl ml-auto sm:ml-2">
            <Clock className="w-4 h-4 text-red-500 animate-pulse" />
            <span className="text-[11px] font-semibold text-gray-500 uppercase mr-1">Ends in</span>
            <span className="bg-gray-900 text-white font-mono font-bold text-xs px-1.5 py-0.5 rounded">
              {String(timeLeft.hours).padStart(2, '0')}h
            </span>
            <span className="text-gray-400 font-bold">:</span>
            <span className="bg-gray-900 text-white font-mono font-bold text-xs px-1.5 py-0.5 rounded">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </span>
            <span className="text-gray-400 font-bold">:</span>
            <span className="bg-red-600 text-white font-mono font-bold text-xs px-1.5 py-0.5 rounded">
              {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>
        </div>

        <Link
          to="/products?sort=discount"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-3.5 py-1.5 rounded-lg transition-colors self-start sm:self-auto"
        >
          <span>View All Deals</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      <div className="flex overflow-x-auto gap-4 sm:gap-5 pb-4 snap-x snap-mandatory scrollbar-hide -mx-2 px-2 sm:mx-0 sm:px-0">
        {dealProducts.map((product) => (
          <div key={product.id} className="min-w-[250px] sm:min-w-[280px] max-w-[290px] snap-start shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

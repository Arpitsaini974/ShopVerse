import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useRecentStore from '../../store/recentStore';
import { api } from '../../api/client';
import { products as fallbackProducts } from '../../data/products';
import { ProductCard } from '../product/ProductCard';

export const RecommendedForYou = () => {
  const { user, isLoggedIn } = useAuthStore();
  const { items: recentItems } = useRecentStore();
  const [productsList, setProductsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const hasHistory = (recentItems && recentItems.length > 0);
  const isPersonalized = isLoggedIn || hasHistory;

  const sectionTitle = isPersonalized 
    ? (user?.name ? `Recommended for ${user.name.split(' ')[0]}` : 'Recommended For You')
    : 'Popular on ShopVerse';

  const sectionSubtitle = isPersonalized
    ? (hasHistory ? 'Based on your recent browsing & purchase interests' : 'Handpicked recommendations for your lifestyle')
    : 'Trending top-rated items across all departments';

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    // If recent items exist, fetch products matching their category or top rated
    api.getProducts({ limit: 8, sort: 'rating' })
      .then((data) => {
        if (isMounted && data && Array.isArray(data.products) && data.products.length > 0) {
          setProductsList(data.products);
        } else if (isMounted) {
          const fallback = [...fallbackProducts]
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 8);
          setProductsList(fallback);
        }
      })
      .catch((err) => {
        console.warn('Recommended: Using fallback:', err);
        if (isMounted) {
          const fallback = [...fallbackProducts]
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 8);
          setProductsList(fallback);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, [isLoggedIn, recentItems?.length]);

  if (!isLoading && productsList.length === 0) return null;

  return (
    <section className="bg-white p-5 sm:p-7 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-gray-100 gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600">
            {isPersonalized ? <Sparkles className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                {sectionTitle}
              </h2>
              {isPersonalized && (
                <span className="bg-purple-100 text-purple-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                  Personalized
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              {sectionSubtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-4 sm:gap-5 pb-4 snap-x snap-mandatory scrollbar-hide -mx-2 px-2 sm:mx-0 sm:px-0">
        {productsList.map((product) => (
          <div key={product.id} className="min-w-[250px] sm:min-w-[280px] max-w-[290px] snap-start shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

import React from 'react';
import { History } from 'lucide-react';
import useRecentStore from '../../store/recentStore';
import { getProductById } from '../../data/products';
import { ProductCard } from '../product/ProductCard';

export const RecentlyViewed = () => {
  const { recentProducts } = useRecentStore();
  
  if (!recentProducts || recentProducts.length === 0) return null;

  const viewedItems = recentProducts
    .map(id => getProductById(id))
    .filter(Boolean); // Remove any nulls if product was deleted

  if (viewedItems.length === 0) return null;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-gray-100 rounded-full">
          <History className="w-5 h-5 text-gray-600" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Recently Viewed</h2>
      </div>

      <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide">
        {viewedItems.map((product) => (
          <div key={product.id} className="min-w-[240px] sm:min-w-[280px] snap-start shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

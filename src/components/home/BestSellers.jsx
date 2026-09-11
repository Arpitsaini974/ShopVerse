import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Award } from 'lucide-react';
import { products } from '../../data/products';
import { ProductCard } from '../product/ProductCard';

export const BestSellers = () => {
  const bestSellers = products.filter((p) => p.badge === 'Best Seller').slice(0, 8);

  if (bestSellers.length === 0) return null;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-50 rounded-full">
            <Award className="w-5 h-5 text-accent-500" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Best Sellers</h2>
        </div>
        <Link
          to="/products?badge=Best Seller"
          className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          View All
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="responsive-product-grid">
        {bestSellers.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

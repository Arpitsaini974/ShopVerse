import React from 'react';

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse border border-gray-100">
    <div className="w-full h-48 bg-gray-200"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-6 bg-gray-200 rounded w-1/3 mt-4"></div>
    </div>
  </div>
);

export const ProductDetailSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="aspect-square bg-gray-200 rounded-lg"></div>
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
        <div className="space-y-2 mt-6">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="flex gap-4 mt-8">
          <div className="h-12 bg-gray-200 rounded w-1/2"></div>
          <div className="h-12 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  </div>
);

export const ListSkeleton = ({ rows = 3 }) => (
  <div className="space-y-4 animate-pulse">
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="flex gap-4 p-4 bg-white rounded-lg shadow-sm">
        <div className="w-24 h-24 bg-gray-200 rounded shrink-0"></div>
        <div className="flex-1 space-y-3 py-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mt-4"></div>
        </div>
      </div>
    ))}
  </div>
);

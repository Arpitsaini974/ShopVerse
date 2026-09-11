import React from 'react';
import { X } from 'lucide-react';

export const FilterChips = ({ filters, onRemove }) => {
  const chips = [];

  if (filters.category?.length) {
    filters.category.forEach(cat => {
      chips.push({ id: `cat-${cat}`, label: cat, group: 'category', value: cat });
    });
  }
  
  if (filters.brand?.length) {
    filters.brand.forEach(b => {
      chips.push({ id: `brand-${b}`, label: b, group: 'brand', value: b });
    });
  }

  if (filters.price) {
    const labels = {
      '0-1000': 'Under ₹1,000',
      '1000-5000': '₹1,000 - ₹5,000',
      '5000-10000': '₹5,000 - ₹10,000',
      '10000-max': 'Over ₹10,000'
    };
    chips.push({ id: 'price', label: labels[filters.price] || filters.price, group: 'price' });
  }

  if (filters.rating) {
    chips.push({ id: 'rating', label: `${filters.rating}★ & above`, group: 'rating' });
  }

  if (filters.discount) {
    chips.push({ id: 'discount', label: `${filters.discount}% or more`, group: 'discount' });
  }

  if (filters.inStock) {
    chips.push({ id: 'instock', label: 'In Stock Only', group: 'inStock' });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm text-gray-500">Active Filters:</span>
      {chips.map(chip => (
        <span 
          key={chip.id}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
        >
          {chip.label}
          <button 
            onClick={() => onRemove(chip.group, chip.value)}
            className="p-0.5 hover:bg-indigo-200 rounded-full transition-colors"
            aria-label={`Remove filter ${chip.label}`}
          >
            <X size={12} />
          </button>
        </span>
      ))}
      {chips.length > 1 && (
        <button 
          onClick={() => onRemove('clearAll')}
          className="text-xs font-medium text-gray-500 hover:text-indigo-600 underline ml-2"
        >
          Clear All
        </button>
      )}
    </div>
  );
};

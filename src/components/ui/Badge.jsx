import React from 'react';
import { cn } from '../../utils/helpers';

export const Badge = ({ type, className }) => {
  if (!type) return null;

  const typeConfig = {
    'Best Seller': 'bg-emerald-100 text-emerald-800',
    'Top Rated': 'bg-blue-100 text-blue-800',
    'New': 'bg-purple-100 text-purple-800',
    'Limited Offer': 'bg-rose-100 text-rose-800',
    'Great Value': 'bg-amber-100 text-amber-800',
  };

  const defaultStyle = 'bg-gray-100 text-gray-800';
  const badgeStyle = typeConfig[type] || defaultStyle;

  return (
    <span className={cn('absolute top-2 left-2 px-2 py-1 text-xs font-semibold rounded-full shadow-sm z-10', badgeStyle, className)}>
      {type}
    </span>
  );
};

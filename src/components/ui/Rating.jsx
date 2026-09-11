import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '../../utils/helpers';

export const Rating = ({ rating = 0, count = 0, reviewCount = 0, size = 'md', showCount = true, className }) => {
  const displayCount = count || reviewCount;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };
  
  const iconSize = sizeClasses[size];

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex text-accent-500">
        {[...Array(Math.max(0, fullStars))].map((_, i) => (
          <Star key={`full-${i}`} className={cn("fill-current", iconSize)} />
        ))}
        {hasHalfStar && <StarHalf className={cn("fill-current", iconSize)} />}
        {[...Array(Math.max(0, emptyStars))].map((_, i) => (
          <Star key={`empty-${i}`} className={cn("text-gray-300", iconSize)} />
        ))}
      </div>
      <span className={cn("ml-2 font-medium text-gray-700", size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm')}>
        {Number(rating).toFixed(1)}
      </span>
      {showCount && displayCount > 0 && (
        <span className={cn("ml-1 text-gray-500", size === 'sm' ? 'text-xs' : 'text-sm')}>
          ({displayCount})
        </span>
      )}
    </div>
  );
};

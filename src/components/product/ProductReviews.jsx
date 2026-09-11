import React from 'react';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '../../utils/helpers';
import useUIStore from '../../store/uiStore';

export function ProductReviews({ product }) {
  const addToast = useUIStore((state) => state.addToast);
  
  const rating = product?.rating || 4.2;
  const reviewsCount = product?.reviews || 128;
  
  // Dummy distribution
  const distribution = [
    { stars: 5, percentage: 70 },
    { stars: 4, percentage: 15 },
    { stars: 3, percentage: 8 },
    { stars: 2, percentage: 4 },
    { stars: 1, percentage: 3 },
  ];

  const dummyReviews = [
    {
      id: 1,
      name: "Rahul S.",
      date: "Oct 12, 2023",
      rating: 5,
      title: "Excellent product!",
      text: "Really happy with the quality. Exceeded my expectations. The delivery was also very fast. Highly recommended!",
      helpful: 24,
      notHelpful: 2
    },
    {
      id: 2,
      name: "Priya M.",
      date: "Sep 28, 2023",
      rating: 4,
      title: "Good value for money",
      text: "The product is good and works as described. Took one star off because the packaging was a bit damaged, but the item itself was fine.",
      helpful: 12,
      notHelpful: 0
    },
    {
      id: 3,
      name: "Amit K.",
      date: "Aug 15, 2023",
      rating: 5,
      title: "Perfect!",
      text: "Just what I was looking for. Fits perfectly and looks great.",
      helpful: 8,
      notHelpful: 1
    }
  ];

  const handleWriteReview = () => {
    addToast('Login to write a review', 'info');
  };

  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-16 mb-10 border-b pb-10 border-gray-200">
        {/* Overall Rating */}
        <div className="flex flex-col items-center md:items-start w-full md:w-1/3">
          <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
          <div className="flex items-center gap-4 mb-2">
            <span className="text-5xl font-bold">{rating}</span>
            <div className="flex flex-col">
              <div className="flex text-accent-500 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={20} 
                    fill={star <= Math.round(rating) ? "currentColor" : "none"} 
                    className={star <= Math.round(rating) ? "text-accent-500" : "text-gray-300"} 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">Based on {reviewsCount} reviews</span>
            </div>
          </div>
          
          <button 
            onClick={handleWriteReview}
            className="mt-6 w-full md:w-auto px-6 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Write a Review
          </button>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1">
          <div className="flex flex-col gap-2">
            {distribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600 w-8">{item.stars} ★</span>
                <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent-500 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 w-10 text-right">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        <h4 className="font-semibold text-lg">Top Reviews</h4>
        
        {dummyReviews.map((review) => (
          <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                    {review.name.charAt(0)}
                  </div>
                  <span className="font-medium">{review.name}</span>
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium ml-2">Verified Purchase</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={14} 
                        fill={star <= review.rating ? "currentColor" : "none"} 
                        className={star <= review.rating ? "text-accent-500" : "text-gray-300"} 
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-sm">{review.title}</span>
                </div>
              </div>
              <span className="text-sm text-gray-500">{review.date}</span>
            </div>
            
            <p className="text-gray-700 text-sm md:text-base mt-2 mb-4 leading-relaxed">
              {review.text}
            </p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Was this helpful?</span>
              <button className="flex items-center gap-1 hover:text-primary-600 transition-colors">
                <ThumbsUp size={14} /> {review.helpful}
              </button>
              <button className="flex items-center gap-1 hover:text-rose-600 transition-colors">
                <ThumbsDown size={14} /> {review.notHelpful}
              </button>
            </div>
          </div>
        ))}
        
        <button className="w-full py-3 text-center text-primary-600 font-medium hover:bg-primary-50 rounded-md transition-colors">
          See All Reviews
        </button>
      </div>
    </div>
  );
}

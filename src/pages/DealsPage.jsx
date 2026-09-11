import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Timer, Tag, ChevronRight, Star } from 'lucide-react';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { formatPrice, formatDiscount } from '../utils/helpers';
import useCartStore from '../store/cartStore';
import { ProductCard } from '../components/product/ProductCard';

const DealsPage = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [activeCategory, setActiveCategory] = useState('All');
  const [discountFilter, setDiscountFilter] = useState(0);
  const { addItem: addToCart } = useCartStore();

  // Calculate time until end of day
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      const diff = endOfDay - now;
      
      if (diff > 0) {
        setTimeLeft({
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter and sort products
  const dealsProducts = products
    .filter(p => p.originalPrice > p.price) // Only products with discount
    .map(p => ({
      ...p,
      discountPercent: Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
    }))
    .filter(p => p.discountPercent >= discountFilter)
    .filter(p => activeCategory === 'All' || p.category === activeCategory)
    .sort((a, b) => b.discountPercent - a.discountPercent);

  const topDeal = dealsProducts.length > 0 ? dealsProducts[0] : null;

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0 max-w-xl">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium mb-4 backdrop-blur-sm">
              <Tag className="w-4 h-4 mr-2" />
              Super Saver Days
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Today's Best Deals <br/>Up to 60% Off
            </h1>
            <p className="text-primary-100 text-lg mb-8">Grab the hottest electronics and gadgets at unbeatable prices. Hurry, offers end soon!</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-center min-w-[300px]">
            <div className="flex items-center justify-center text-primary-100 mb-3">
              <Timer className="w-5 h-5 mr-2" />
              <span className="font-medium">Ends in</span>
            </div>
            <div className="flex justify-center space-x-4">
              <div className="flex flex-col">
                <span className="text-3xl font-bold bg-white text-primary-700 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-xs mt-2 font-medium">HOURS</span>
              </div>
              <div className="text-3xl font-bold mt-3">:</div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold bg-white text-primary-700 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-xs mt-2 font-medium">MINS</span>
              </div>
              <div className="text-3xl font-bold mt-3">:</div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold bg-white text-primary-700 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-xs mt-2 font-medium">SECS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[2400px] mx-auto px-2 sm:px-4 md:px-6 lg:px-8 -mt-6">
        {/* Deal of the Day */}
        {topDeal && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 mb-12 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-rose-500 text-white font-bold py-1 px-8 translate-x-8 translate-y-4 rotate-45">
              DEAL OF THE DAY
            </div>
            <div className="w-full md:w-1/3 aspect-square bg-gray-50 rounded-xl p-6 relative">
              <span className="absolute top-4 left-4 bg-error-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                {topDeal.discountPercent}% OFF
              </span>
              <img src={topDeal.image} alt={topDeal.name} className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            <div className="w-full md:w-2/3">
              <Link to={`/product/${topDeal.id}`}>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 hover:text-primary-600 transition-colors">
                  {topDeal.name}
                </h2>
              </Link>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex text-accent-500">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <span className="font-medium text-gray-700">{topDeal.rating}</span>
                <span className="text-gray-400">({topDeal.reviews} reviews)</span>
              </div>
              <div className="flex items-end space-x-4 mb-6">
                <span className="text-4xl font-bold text-gray-900">{formatPrice(topDeal.price)}</span>
                <span className="text-xl text-gray-400 line-through pb-1">{formatPrice(topDeal.originalPrice)}</span>
                <span className="text-lg text-success-600 font-medium pb-1">
                  Save {formatPrice(topDeal.originalPrice - topDeal.price)}
                </span>
              </div>
              <p className="text-gray-600 mb-8 line-clamp-3">{topDeal.description}</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => addToCart(topDeal)}
                  className="flex-1 md:flex-none bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  Add to Cart
                </button>
                <Link 
                  to={`/product/${topDeal.id}`}
                  className="flex-1 md:flex-none bg-gray-100 hover:bg-gray-200 text-gray-900 px-8 py-3 rounded-lg font-medium transition-colors text-center"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 hide-scrollbar space-x-2">
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                activeCategory === 'All' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              All Deals
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                  activeCategory === cat.name ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg p-1">
            {[0, 10, 20, 30, 50].map(discount => (
              <button
                key={discount}
                onClick={() => setDiscountFilter(discount)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  discountFilter === discount ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {discount === 0 ? 'Any' : `${discount}%+`}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Grid */}
        <div className="responsive-product-grid">
          {dealsProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {dealsProducts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
            <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No deals found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more products.</p>
            <button 
              onClick={() => { setActiveCategory('All'); setDiscountFilter(0); }}
              className="mt-6 text-primary-600 font-medium hover:text-primary-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealsPage;

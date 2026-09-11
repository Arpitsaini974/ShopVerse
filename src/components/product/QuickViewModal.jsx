import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, Check } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Rating } from '../ui/Rating';
import useUIStore from '../../store/uiStore';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import { formatPrice, formatDiscount, getDeliveryDate } from '../../utils/helpers';

const QuickViewModal = () => {
  const navigate = useNavigate();
  const { quickViewProduct, closeQuickView, toggleCartDrawer } = useUIStore();
  const { addItem: addCart, setBuyNowItem } = useCartStore();
  const { user, isLoggedIn } = useAuthStore();

  if (!quickViewProduct) return null;

  const product = quickViewProduct;

  const handleAddToCart = () => {
    addCart(product);
    closeQuickView();
    toggleCartDrawer(true);
  };

  const handleBuyNow = () => {
    setBuyNowItem(product, 1);
    closeQuickView();
    const checkoutUrl = `/checkout?buyNow=true&productId=${encodeURIComponent(product.id)}&qty=1`;
    if (!isLoggedIn || !user) {
      navigate(`/login?redirect=${encodeURIComponent(checkoutUrl)}`);
      return;
    }
    navigate(checkoutUrl);
  };

  const handleViewDetails = () => {
    closeQuickView();
    navigate(`/product/${product.id}`);
  };

  return (
    <Modal isOpen={!!product} onClose={closeQuickView} title="Quick View" size="xl">
      <div className="flex flex-col md:flex-row gap-6 p-1">
        {/* Image */}
        <div className="w-full md:w-1/2 bg-gray-50 rounded-lg p-6 flex items-center justify-center">
          <img 
            src={product.image || product.images?.[0] || 'https://via.placeholder.com/400'} 
            alt={product.name}
            className="max-h-[260px] max-w-full object-contain"
          />
        </div>

        {/* Details */}
        <div className="w-full md:w-1/2 flex flex-col">
          <span className="text-sm text-gray-500 mb-1">{product.brand}</span>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h2>
          
          <div className="mb-4">
            <Rating rating={product.rating} count={product.reviewCount || product.reviews} />
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  {product.discount}% OFF
                </span>
              </>
            )}
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Key Highlights</h4>
            <ul className="space-y-1.5">
              {product.highlights?.slice(0, 3).map((highlight, idx) => (
                <li key={idx} className="flex items-start text-sm text-gray-600">
                  <Check size={16} className="text-emerald-500 mr-2 shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto space-y-3">
            <div className="text-sm text-gray-600 flex items-center mb-2">
              <span className="font-medium mr-1">Delivery:</span> 
              {product.delivery || 'Free delivery'}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 py-2.5 px-4 rounded-md font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-4 rounded-md font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Zap size={18} />
                Buy Now
              </button>
            </div>
            
            <button 
              onClick={handleViewDetails}
              className="w-full text-center text-sm text-indigo-600 hover:text-indigo-800 font-medium py-2"
            >
              View Full Details &rarr;
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default QuickViewModal;

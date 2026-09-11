import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Eye, Zap } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Rating } from '../ui/Rating';
import useWishlistStore from '../../store/wishlistStore';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import useUIStore from '../../store/uiStore';
import { formatPrice, formatDiscount, cn } from '../../utils/helpers';

export const ProductCard = ({ product, showQuickView = true, showBuyNow = true }) => {
  const navigate = useNavigate();
  const { items: wishlistItems, addItem: addWishlist, removeItem: removeWishlist } = useWishlistStore();
  const { addItem: addCart, setBuyNowItem } = useCartStore();
  const { user, isLoggedIn } = useAuthStore();
  const { openQuickView, toggleCartDrawer, addToast } = useUIStore();

  const isWishlisted = wishlistItems.some(item => item.id === product.id);

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isWishlisted) {
      removeWishlist(product.id);
    } else {
      addWishlist(product);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    addCart(product);
    toggleCartDrawer(true);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!product.inStock) return;
    setBuyNowItem(product, 1);
    const targetUrl = `/checkout?buyNow=true&productId=${encodeURIComponent(product.id)}&qty=1`;
    if (!isLoggedIn || !user) {
      if (addToast) addToast('Please login to continue with your purchase.', 'info');
      navigate(`/login?redirect=${encodeURIComponent(targetUrl)}`);
    } else {
      navigate(targetUrl);
    }
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    e.preventDefault();
    openQuickView(product);
  };

  const [imgSrc, setImgSrc] = React.useState(product.image || product.images?.[0] || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80');

  return (
    <div 
      className="group relative flex flex-col justify-between bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 overflow-hidden cursor-pointer h-full"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {product.badge && (
          <Badge variant={product.badge.toLowerCase() === 'new' ? 'success' : (product.badge.toLowerCase() === 'best seller' ? 'primary' : 'warning')} size="sm">
            {product.badge}
          </Badge>
        )}
      </div>

      {/* Wishlist Button */}
      <button 
        onClick={handleWishlistToggle}
        className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-gray-500 hover:text-red-500 transition-colors shadow-sm"
        aria-label="Toggle wishlist"
      >
        <Heart size={18} className={cn("transition-colors", isWishlisted && "fill-red-500 text-red-500")} />
      </button>

      {/* Image Container - Aspect ratio container with object-contain so products are never cropped or stretched */}
      <div className="relative w-full aspect-square bg-gradient-to-b from-gray-50/80 to-white overflow-hidden flex items-center justify-center p-2.5 sm:p-3.5 border-b border-gray-100 shrink-0">
        <img 
          src={imgSrc} 
          alt={product.name}
          loading="lazy"
          onError={() => setImgSrc('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80')}
          className="max-h-full max-w-full w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105 select-none"
        />
        
        {/* Quick View Overlay */}
        {showQuickView && (
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center">
            <button
              onClick={handleQuickView}
              className="translate-y-2 group-hover:translate-y-0 transition-all duration-200 bg-white/95 backdrop-blur-sm text-gray-800 px-3.5 py-1.5 rounded-lg font-medium text-xs flex items-center shadow-lg hover:bg-white hover:text-indigo-600"
            >
              <Eye size={13} className="mr-1.5" />
              Quick View
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-center justify-between mb-1 gap-1">
            <span className="text-[11px] sm:text-xs font-semibold text-indigo-600 uppercase tracking-wider truncate">{product.brand}</span>
            <span className="text-[10px] sm:text-[11px] text-gray-400 capitalize truncate">{product.subcategory || product.category}</span>
          </div>

          <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1.5 line-clamp-2 h-9 sm:h-10 leading-snug group-hover:text-indigo-600 transition-colors" title={product.name}>
            {product.name}
          </h3>
          
          {/* Key Spec Snippet for tech products */}
          {product.specifications?.Processor && (
            <p className="text-[10px] sm:text-[11px] text-gray-500 line-clamp-1 mb-1.5 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
              ⚡ {product.specifications.Processor}
            </p>
          )}

          <div className="mb-2 flex items-center gap-1.5">
            <Rating rating={product.rating} count={product.reviewCount} size="sm" />
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-gray-50">
          <div className="flex items-baseline gap-1.5 sm:gap-2 mb-1 flex-wrap">
            <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-[10px] sm:text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                <span className="text-[10px] sm:text-xs font-bold text-emerald-600">{product.discount}% off</span>
              </>
            )}
          </div>
          
          <div className="text-[10px] sm:text-[11px] text-gray-500 mb-2.5 sm:mb-3 flex items-center justify-between">
            {product.delivery === 'Free delivery' ? (
              <span className="text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] sm:text-[11px]">Free Delivery</span>
            ) : (
              <span className="truncate">{product.delivery || 'Standard Delivery'}</span>
            )}
            <span className="text-gray-400 shrink-0">{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={cn(
                "w-full py-1.5 sm:py-2 px-1.5 sm:px-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1 shadow-sm",
                product.inStock 
                  ? "bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 active:scale-[0.98]" 
                  : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
              )}
              title={product.inStock ? 'Add to Cart' : 'Out of Stock'}
            >
              <ShoppingCart size={13} className="shrink-0" />
              <span className="truncate">{product.inStock ? 'Add' : 'Unavailable'}</span>
            </button>

            {showBuyNow && (
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className={cn(
                  "w-full py-1.5 sm:py-2 px-1.5 sm:px-2 rounded-lg text-[11px] sm:text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1 shadow-sm",
                  product.inStock
                    ? "bg-[#fb641b] hover:bg-[#e25712] text-white active:scale-[0.98]"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                )}
                title={product.inStock ? 'Buy Now' : 'Out of Stock'}
              >
                <Zap size={13} className="fill-current shrink-0" />
                <span className="truncate">Buy Now</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

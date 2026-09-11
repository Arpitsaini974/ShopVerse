import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, Share2, Shield, Truck, RotateCcw, 
  Tag, MapPin, ChevronRight, Star, Minus, Plus, AlertCircle, CheckCircle2, Loader2 
} from 'lucide-react';

import { api } from '../api/client';
import { getProductById as getLocalProductById, products as allLocalProducts } from '../data/products';
import { formatPrice, formatDiscount, getDeliveryDate, cn } from '../utils/helpers';
import useRecentStore from '../store/recentStore';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';
import useAuthStore from '../store/authStore';
import useUIStore from '../store/uiStore';

import { ImageGallery } from '../components/product/ImageGallery';
import { ProductReviews } from '../components/product/ProductReviews';
import { ProductCard } from '../components/product/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState([]);

  const addRecentProduct = useRecentStore((state) => state.addItem);
  const addToCart = useCartStore((state) => state.addItem);
  const setBuyNowItem = useCartStore((state) => state.setBuyNowItem);
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();
  const addToast = useUIStore((state) => state.addToast);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [pincode, setPincode] = useState('');
  const [activeTab, setActiveTab] = useState('specifications');

  // Load product from Backend API with local fallback
  useEffect(() => {
    setIsLoading(true);
    let isMounted = true;

    api.getProductById(id)
      .then(data => {
        if (isMounted && data) {
          setProduct(data);
          addRecentProduct(data);
          setIsLoading(false);

          // Fetch similar products in same category
          if (data.category) {
            api.getProducts({ category: data.category, limit: 6 })
              .then(res => {
                if (isMounted) {
                  setSimilarProducts((res.products || []).filter(p => p.id !== data.id).slice(0, 5));
                }
              })
              .catch(() => {});
          }
        }
      })
      .catch(err => {
        console.warn('Backend API product fetch failed, trying local fallback:', err);
        const local = getLocalProductById(id);
        if (isMounted) {
          if (local) {
            setProduct(local);
            addRecentProduct(local);
            setSimilarProducts(allLocalProducts.filter(p => p.category === local.category && p.id !== local.id).slice(0, 5));
          }
          setIsLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [id, addRecentProduct]);

  useEffect(() => {
    if (product) {
      if (product.variants && product.variants.length > 0) {
        const sizeVar = product.variants.find(v => v.variant_name.toLowerCase().includes('size'));
        if (sizeVar) setSelectedSize(sizeVar.value);
        const colorVar = product.variants.find(v => v.variant_name.toLowerCase().includes('color'));
        if (colorVar) setSelectedColor(colorVar.value);
      } else {
        if (product.sizes?.length > 0) setSelectedSize(product.sizes[0]);
        if (product.colors?.length > 0) setSelectedColor(product.colors[0]);
      }
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading authentic product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Product Not Found</h1>
        <p className="text-gray-500 mb-8">The product you are looking for does not exist or has been removed.</p>
        <Link to="/products" className="bg-primary-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors">
          Browse All Products
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlistItems.some(item => item.id === product.id);
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const maxAllowedQty = Math.min(Math.max(1, product.stock || 1), 10);

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      addToast('Removed from wishlist', 'info');
    } else {
      addToWishlist(product);
      addToast('Added to wishlist', 'success');
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) {
      addToast('Sorry, this product is currently out of stock', 'error');
      return;
    }

    if (product.sizes?.length > 0 && !selectedSize) {
      addToast('Please select a size', 'warning');
      return;
    }
    
    addToCart(product, quantity, selectedSize || selectedColor);
    addToast('Added to cart', 'success');
  };

  const handleBuyNow = async () => {
    if (isOutOfStock) {
      addToast('This product is currently out of stock.', 'error');
      return;
    }

    if (product.sizes?.length > 0 && !selectedSize) {
      addToast('Please select a size before proceeding', 'warning');
      return;
    }

    // Always preserve purchase intent in store so item is ready upon login/checkout
    setBuyNowItem(product, quantity, selectedSize || selectedColor);
    const targetUrl = `/checkout?buyNow=true&productId=${encodeURIComponent(product.id)}&qty=${quantity}`;

    // BUG 2 REQUIREMENT: Check authentication before proceeding to order
    if (!isLoggedIn || !user) {
      addToast('Please login to continue with your purchase.', 'info');
      navigate(`/login?redirect=${encodeURIComponent(targetUrl)}`);
      return;
    }

    setIsBuyingNow(true);
    try {
      // Validate live availability & stock from database before checkout
      const check = await api.checkProductAvailability(product.id);
      if (!check.exists) {
        addToast('This product is currently unavailable.', 'error');
        setIsBuyingNow(false);
        return;
      }

      if (!check.inStock || check.stock < quantity) {
        addToast(`Insufficient stock. Only ${check.stock} units available.`, 'error');
        setIsBuyingNow(false);
        return;
      }

      // Navigate to checkout with explicit query parameters
      navigate(targetUrl);
    } catch (err) {
      console.warn('Live availability check notice:', err);
      navigate(targetUrl);
    } finally {
      setIsBuyingNow(false);
    }
  };

  const deliveryDate = getDeliveryDate(3);

  return (
    <div className="bg-gray-50 pb-16">
      {/* Breadcrumbs Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="w-full mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-3 text-xs sm:text-sm text-gray-500 flex items-center gap-2 overflow-x-auto whitespace-nowrap hide-scrollbar max-w-[2400px]">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to={`/products?category=${encodeURIComponent(product.category || 'Electronics')}`} className="hover:text-primary-600 transition-colors capitalize">
            {product.category}
          </Link>
          {product.subcategory && (
            <>
              <ChevronRight size={14} />
              <Link to={`/products?subcategory=${encodeURIComponent(product.subcategorySlug || product.subcategory)}`} className="hover:text-primary-600 transition-colors capitalize">
                {product.subcategory}
              </Link>
            </>
          )}
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium truncate max-w-[200px] md:max-w-md">{product.name}</span>
        </div>
      </div>

      <div className="w-full mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6 max-w-[2400px]">
        <div className="flex flex-col lg:flex-row gap-8 bg-white p-4 md:p-7 rounded-2xl shadow-sm border border-gray-200">
          
          {/* Left Column: Product Images Gallery */}
          <div className="w-full lg:w-5/12 lg:sticky lg:top-24 self-start">
            <ImageGallery images={product.images || [product.image]} productName={product.name} />
          </div>

          {/* Right Column: Details, Specifications, Pricing & Stock */}
          <div className="w-full lg:w-7/12 flex flex-col">
            
            {/* Brand and SKU */}
            <div className="flex items-center justify-between gap-4 mb-2">
              <Link to={`/products?brand=${encodeURIComponent(product.brand)}`} className="text-primary-600 font-bold text-sm hover:underline tracking-wide uppercase">
                {product.brand}
              </Link>
              {product.sku && (
                <span className="text-xs text-gray-400 font-mono">
                  SKU: {product.sku}
                </span>
              )}
            </div>
            
            {/* Title */}
            <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-gray-900 mb-3 leading-tight tracking-tight">
              {product.name}
            </h1>

            {/* Ratings & Verified Badge */}
            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100 flex-wrap">
              <div className="flex items-center gap-1 bg-emerald-600 text-white px-2.5 py-0.5 rounded-md text-xs font-bold shadow-sm">
                {product.rating || 4.3} <Star size={12} className="fill-current" />
              </div>
              <span className="text-xs sm:text-sm text-gray-500">
                {product.reviewCount || 120} Customer Ratings & Verified Reviews
              </span>
              <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded border border-blue-200">
                100% Genuine
              </span>
            </div>

            {/* Price Section */}
            <div className="mb-5">
              <div className="flex items-baseline gap-3 mb-1 flex-wrap">
                <span className="text-3xl sm:text-4xl font-black text-gray-900">{formatPrice(product.price)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-base sm:text-lg text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="text-base sm:text-lg text-emerald-600 font-bold">
                      {formatDiscount(product.price, product.originalPrice)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500">Inclusive of all taxes & GST invoice available</p>
            </div>

            {/* Inventory Status Indicator */}
            <div className="mb-6">
              {isOutOfStock ? (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-bold">
                  <AlertCircle size={16} />
                  <span>Out of Stock</span>
                </div>
              ) : isLowStock ? (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold">
                  <AlertCircle size={16} />
                  <span>Hurry! Only {product.stock} items left in stock</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                  <CheckCircle2 size={15} />
                  <span>In Stock ({product.stock} units available)</span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="mb-6">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Select Quantity</h3>
                <div className="flex items-center border border-gray-300 w-32 rounded-lg bg-white overflow-hidden shadow-sm">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                  >
                    <Minus size={15} />
                  </button>
                  <div className="flex-1 h-10 flex items-center justify-center font-bold text-gray-900 border-x border-gray-300">
                    {quantity}
                  </div>
                  <button 
                    onClick={() => setQuantity(Math.min(maxAllowedQty, quantity + 1))}
                    disabled={quantity >= maxAllowedQty}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons (Add to Cart / Buy Now) */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 ${
                  isOutOfStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                    : 'bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50 shadow-sm active:scale-98'
                }`}
              >
                {isOutOfStock ? 'Currently Unavailable' : 'Add to Cart'}
              </button>
              
              <button 
                onClick={handleBuyNow}
                disabled={isOutOfStock || isBuyingNow}
                className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-base transition-all duration-200 shadow-md flex items-center justify-center gap-2 ${
                  isOutOfStock
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isBuyingNow
                    ? 'bg-amber-600 text-white cursor-wait opacity-90'
                    : 'bg-amber-500 hover:bg-amber-600 active:scale-98 text-white shadow-amber-500/25'
                }`}
              >
                {isBuyingNow ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Validating Order...
                  </>
                ) : isOutOfStock ? (
                  'Out of Stock'
                ) : (
                  'Buy Now'
                )}
              </button>
            </div>

            {/* Wishlist & Share */}
            <div className="flex items-center gap-6 border-b border-gray-100 pb-6 mb-6">
              <button 
                onClick={handleWishlistToggle}
                className={cn(
                  "flex items-center gap-2 text-sm font-semibold transition-colors",
                  isWishlisted ? "text-rose-600 hover:text-rose-700" : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
                <span>{isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
              </button>
              <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                <Share2 size={18} />
                <span>Share</span>
              </button>
            </div>

            {/* Delivery & Pincode Check */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <MapPin size={16} className="text-primary-600" /> Delivery Options
                </h3>
                <div className="flex gap-2 max-w-sm">
                  <input 
                    type="text" 
                    placeholder="Enter 6-digit Pincode" 
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button className="px-4 py-2 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                    Check
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Estimated Delivery by <strong className="text-gray-900">{deliveryDate}</strong> with Free Express Shipping.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100 text-center">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <Shield size={20} className="text-emerald-600 mx-auto mb-1" />
                  <span className="text-[11px] font-semibold text-gray-700 block">Brand Warranty</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <RotateCcw size={20} className="text-amber-600 mx-auto mb-1" />
                  <span className="text-[11px] font-semibold text-gray-700 block">7-Day Replacement</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <Truck size={20} className="text-blue-600 mx-auto mb-1" />
                  <span className="text-[11px] font-semibold text-gray-700 block">Free Shipping</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Tabbed Section: Category-Specific Specifications & Description */}
        <div className="mt-8 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-6 border-b border-gray-200 pb-4 mb-6">
            <button
              onClick={() => setActiveTab('specifications')}
              className={`text-base sm:text-lg font-bold pb-2 relative transition-all ${
                activeTab === 'specifications'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab('description')}
              className={`text-base sm:text-lg font-bold pb-2 relative transition-all ${
                activeTab === 'description'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Product Description
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`text-base sm:text-lg font-bold pb-2 relative transition-all ${
                activeTab === 'reviews'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Customer Reviews ({product.reviewCount || 120})
            </button>
          </div>

          {/* Dynamic Specifications Grid */}
          {activeTab === 'specifications' && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                Detailed Product Specifications for {product.category}
              </h3>
              {product.specifications && Object.keys(product.specifications).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="flex border-b border-gray-100 py-2.5 px-3 bg-gray-50/50 rounded-lg">
                      <span className="w-1/2 text-xs font-semibold text-gray-500">{key}</span>
                      <span className="w-1/2 text-xs font-bold text-gray-900">{val}</span>
                    </div>
                  ))}
                  <div className="flex border-b border-gray-100 py-2.5 px-3 bg-gray-50/50 rounded-lg">
                    <span className="w-1/2 text-xs font-semibold text-gray-500">Brand</span>
                    <span className="w-1/2 text-xs font-bold text-gray-900">{product.brand}</span>
                  </div>
                  <div className="flex border-b border-gray-100 py-2.5 px-3 bg-gray-50/50 rounded-lg">
                    <span className="w-1/2 text-xs font-semibold text-gray-500">Category</span>
                    <span className="w-1/2 text-xs font-bold text-gray-900">{product.category} / {product.subcategory || 'General'}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Standard manufacturer specifications apply for this item.</p>
              )}
            </div>
          )}

          {/* Description Tab */}
          {activeTab === 'description' && (
            <div className="text-sm text-gray-700 leading-relaxed max-w-3xl space-y-4">
              <p>{product.description}</p>
              <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100">
                <h4 className="font-bold text-gray-900 mb-2">Quality & Authenticity Assurance</h4>
                <p className="text-xs text-gray-600">
                  Every product shipped through ShopVerse passes our strict multi-point genuine hardware inspection. Comes with standard brand warranty and our zero-hassle 7-day replacement guarantee.
                </p>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <ProductReviews productId={product.id} rating={product.rating} reviewCount={product.reviewCount} />
          )}
        </div>

        {/* Similar Products Recommendation */}
        {similarProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                Similar Products in {product.category}
              </h2>
              <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="text-sm font-semibold text-primary-600 hover:underline">
                View All →
              </Link>
            </div>
            <div className="responsive-product-grid">
              {similarProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

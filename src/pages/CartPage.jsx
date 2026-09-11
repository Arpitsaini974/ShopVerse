import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, Heart, ShoppingBag, X, Tag } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import useUIStore from '../store/uiStore';
import { formatPrice } from '../utils/helpers';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, savedForLater, updateQuantity, removeItem, saveForLater, moveToCart, removeSaved } = useCartStore();
  const { user, isLoggedIn } = useAuthStore();
  const addToast = useUIStore((state) => state.addToast);
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Fallback calculations if store doesn't provide them natively
  const originalTotal = items.reduce((acc, item) => acc + (item.originalPrice || item.price) * item.quantity, 0);
  const currentTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = originalTotal - currentTotal;
  
  let deliveryCharge = 0;
  if (items.length > 0 && currentTotal < 499) {
    deliveryCharge = 40;
  }

  let finalDiscount = discount;
  if (appliedCoupon) {
    finalDiscount += 50; // Demo ₹50 coupon discount
  }

  const finalTotal = originalTotal - finalDiscount + deliveryCharge;

  const handleApplyCoupon = () => {
    if (couponCode.trim().toLowerCase() === 'shop50') {
      setAppliedCoupon('SHOP50');
      setCouponCode('');
      addToast('Coupon applied successfully!', 'success');
    } else {
      addToast('Invalid coupon code.', 'error');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon removed.', 'info');
  };

  const handleQuantity = (id, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty > 0 && newQty <= 10) {
      updateQuantity(id, newQty);
    } else if (newQty > 10) {
      addToast('Maximum quantity is 10.', 'warning');
    }
  };

  const handleRemove = (id) => {
    removeItem(id);
    addToast('Item removed from cart', 'info');
  };

  const handleSaveForLater = (id, item) => {
    saveForLater(item);
    addToast('Item saved for later', 'info');
  };

  if (items.length === 0 && (!savedForLater || savedForLater.length === 0)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="bg-indigo-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-indigo-700 transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <span>&gt;</span>
          <span className="text-gray-900 font-medium">Cart</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Cart Items */}
          <div className="flex-1 space-y-6">
            {items.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                  <h1 className="text-xl font-bold text-gray-900">Shopping Cart ({items.length})</h1>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-gray-50 transition-colors">
                      <Link to={`/product/${item.id}`} className="shrink-0 w-24 h-24 bg-gray-100 rounded-md overflow-hidden block">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply p-2" />
                      </Link>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <Link to={`/product/${item.id}`} className="text-base font-medium text-gray-900 hover:text-indigo-600 line-clamp-1">
                                {item.name}
                              </Link>
                              <p className="text-sm text-gray-500 mt-1">{item.brand}</p>
                              {item.variant && <p className="text-sm text-gray-500 mt-1">Variant: {item.variant}</p>}
                            </div>
                            <div className="text-right ml-4 shrink-0">
                              <span className="block text-lg font-bold text-gray-900">{formatPrice(item.price)}</span>
                              {item.originalPrice && item.originalPrice > item.price && (
                                <span className="block text-sm text-gray-400 line-through">{formatPrice(item.originalPrice)}</span>
                              )}
                              {item.originalPrice && item.originalPrice > item.price && (
                                <span className="block text-sm font-medium text-emerald-600">
                                  {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                          <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-md px-2 py-1">
                            <button onClick={() => handleQuantity(item.id, item.quantity, -1)} className="p-1 hover:bg-gray-100 rounded text-gray-600 disabled:opacity-50" disabled={item.quantity <= 1}>
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                            <button onClick={() => handleQuantity(item.id, item.quantity, 1)} className="p-1 hover:bg-gray-100 rounded text-gray-600 disabled:opacity-50" disabled={item.quantity >= 10}>
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex gap-4">
                            <button onClick={() => handleSaveForLater(item.id, item)} className="text-sm font-medium text-gray-500 hover:text-indigo-600 flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              <span className="hidden sm:inline">Save for Later</span>
                            </button>
                            <button onClick={() => handleRemove(item.id)} className="text-sm font-medium text-gray-500 hover:text-rose-600 flex items-center gap-1">
                              <Trash2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <Link to="/" className="text-indigo-600 font-medium hover:underline">Continue Shopping</Link>
              </div>
            )}

            {/* Saved for Later */}
            {savedForLater && savedForLater.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900">Saved for Later ({savedForLater.length})</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6">
                  {savedForLater.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex flex-col">
                      <div className="h-32 bg-gray-50 rounded-md mb-4 flex items-center justify-center p-2">
                        <img src={item.image} alt={item.name} className="max-h-full mix-blend-multiply" />
                      </div>
                      <Link to={`/product/${item.id}`} className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-indigo-600 mb-1">
                        {item.name}
                      </Link>
                      <div className="mt-auto pt-3">
                        <span className="font-bold text-gray-900">{formatPrice(item.price)}</span>
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => moveToCart(item)} className="flex-1 bg-indigo-50 text-indigo-600 text-sm font-medium py-2 rounded hover:bg-indigo-100 transition-colors">
                            Move to Cart
                          </button>
                          <button onClick={() => removeSaved(item.id)} className="px-3 text-gray-400 hover:text-rose-600 bg-gray-50 rounded hover:bg-rose-50 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Price Summary */}
          {items.length > 0 && (
            <div className="w-full lg:w-80 shrink-0">
              <div className="bg-white rounded-lg shadow-sm sticky top-24">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-base font-bold text-gray-500 uppercase tracking-wider">Price Details</h2>
                </div>
                
                <div className="p-6 space-y-4 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Price ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                    <span>{formatPrice(originalTotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span>- {formatPrice(finalDiscount)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Charges</span>
                    <span className={deliveryCharge === 0 ? "text-emerald-600" : ""}>
                      {deliveryCharge === 0 ? 'Free' : formatPrice(deliveryCharge)}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold text-gray-900">Total Amount</span>
                      <span className="text-xl font-bold text-gray-900">{formatPrice(finalTotal)}</span>
                    </div>
                    {finalDiscount > 0 && (
                      <div className="text-emerald-600 text-sm font-medium mb-4">
                        You will save {formatPrice(finalDiscount)} on this order
                      </div>
                    )}
                  </div>

                  {/* Coupon Section */}
                  <div className="pt-4 border-t border-gray-100">
                    {appliedCoupon ? (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-md p-3 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-emerald-700">
                          <Tag className="w-4 h-4" />
                          <span className="font-medium text-sm">'{appliedCoupon}' applied</span>
                        </div>
                        <button onClick={handleRemoveCoupon} className="text-emerald-600 hover:text-emerald-800">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Coupon code (try SHOP50)"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (!isLoggedIn || !user) {
                        addToast('Please login to continue with your purchase.', 'info');
                        navigate('/login?redirect=' + encodeURIComponent('/checkout'));
                        return;
                      }
                      navigate('/checkout');
                    }}
                    className="w-full bg-accent-500 hover:bg-accent-600 text-white font-bold py-3 px-4 rounded-md shadow-sm mt-4 transition-colors text-lg flex justify-center items-center gap-2 cursor-pointer"
                  >
                    Proceed to Checkout
                  </button>
                  <div className="flex justify-center items-center gap-2 text-xs text-gray-400 mt-4">
                    <span>Secure Payments</span>
                    <span>•</span>
                    <span>100% Authentic</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

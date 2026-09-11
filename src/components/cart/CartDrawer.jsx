import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import useUIStore from '../../store/uiStore';
import { formatPrice } from '../../utils/helpers';

export default function CartDrawer() {
  const navigate = useNavigate();
  const { items, removeItem } = useCartStore();
  const { user, isLoggedIn } = useAuthStore();
  const cartDrawerOpen = useUIStore((state) => state.cartDrawerOpen);
  const toggleCartDrawer = useUIStore((state) => state.toggleCartDrawer);
  const addToast = useUIStore((state) => state.addToast);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!cartDrawerOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
        onClick={() => toggleCartDrawer(false)}
      />
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-900">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="text-lg font-bold">Cart ({items.length})</h2>
          </div>
          <button 
            onClick={() => toggleCartDrawer(false)}
            className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-500">
              <ShoppingBag className="w-12 h-12 text-gray-300" />
              <p>Your cart is empty.</p>
              <button 
                onClick={() => {
                  toggleCartDrawer(false);
                  navigate('/');
                }}
                className="text-indigo-600 font-medium hover:underline"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                <Link 
                  to={`/product/${item.id}`} 
                  onClick={() => toggleCartDrawer(false)}
                  className="w-20 h-20 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center p-1"
                >
                  <img src={item.image} alt={item.name} className="max-w-full max-h-full mix-blend-multiply" />
                </Link>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link 
                      to={`/product/${item.id}`}
                      onClick={() => toggleCartDrawer(false)}
                      className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-indigo-600"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-gray-900">{formatPrice(item.price)}</span>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center mb-4 text-sm">
              <span className="text-gray-600 font-medium">Subtotal</span>
              <span className="text-lg font-bold text-gray-900">{formatPrice(subtotal)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => {
                  toggleCartDrawer(false);
                  navigate('/cart');
                }}
                className="w-full border border-indigo-600 text-indigo-600 font-medium py-2 rounded-md hover:bg-indigo-50 transition-colors"
              >
                View Cart
              </button>
              <button 
                onClick={() => {
                  toggleCartDrawer(false);
                  if (!isLoggedIn || !user) {
                    addToast('Please login to continue with your purchase.', 'info');
                    navigate('/login?redirect=' + encodeURIComponent('/checkout'));
                    return;
                  }
                  navigate('/checkout');
                }}
                className="w-full bg-indigo-600 text-white font-medium py-2 rounded-md hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

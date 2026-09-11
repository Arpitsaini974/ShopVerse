import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid3x3, ShoppingCart, User } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import { cn } from '../../utils/helpers';

const MobileNav = () => {
  const location = useLocation();
  const cartItems = useCartStore((state) => state.items) || [];
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 pb-safe">
      <div className="flex justify-around items-center h-16">
        <Link 
          to="/" 
          className={cn(
            "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
            isActive('/') ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'
          )}
        >
          <Home size={22} className={isActive('/') ? 'fill-primary-100' : ''} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        
        <Link 
          to="/categories" 
          className={cn(
            "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
            isActive('/categories') || isActive('/products') ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'
          )}
        >
          <Grid3x3 size={22} className={isActive('/categories') || isActive('/products') ? 'fill-primary-100' : ''} />
          <span className="text-[10px] font-medium">Categories</span>
        </Link>
        
        <Link 
          to="/cart" 
          className={cn(
            "relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
            isActive('/cart') ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'
          )}
        >
          <div className="relative">
            <ShoppingCart size={22} className={isActive('/cart') ? 'fill-primary-100' : ''} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Cart</span>
        </Link>
        
        <Link 
          to="/account" 
          className={cn(
            "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
            isActive('/account') ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'
          )}
        >
          <User size={22} className={isActive('/account') ? 'fill-primary-100' : ''} />
          <span className="text-[10px] font-medium">Account</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNav;

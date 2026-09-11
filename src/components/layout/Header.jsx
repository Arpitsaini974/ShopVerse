import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  MapPin, 
  ShoppingBag, 
  Heart, 
  ShoppingCart, 
  Menu, 
  Search, 
  X, 
  User,
  Laptop, 
  Smartphone, 
  Shirt, 
  Sparkles, 
  Home as HomeIcon, 
  Tv, 
  ShoppingBasket, 
  Dumbbell, 
  Gamepad2, 
  BookOpen,
  ChevronDown
} from 'lucide-react';
import useCartStore from '../../store/cartStore';
import useWishlistStore from '../../store/wishlistStore';
import useAuthStore from '../../store/authStore';
import { categories } from '../../data/categories';
import { SearchBar } from '../search/SearchBar';

// Clean category icon mapping
const CATEGORY_ICON_MAP = {
  'Electronics': Laptop,
  'Mobiles': Smartphone,
  'Fashion': Shirt,
  'Beauty': Sparkles,
  'Home': HomeIcon,
  'Appliances': Tv,
  'Grocery': ShoppingBasket,
  'Sports': Dumbbell,
  'Toys': Gamepad2,
  'Books': BookOpen
};

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeCategoryParam = searchParams.get('category');
  const isProductsPage = location.pathname === '/products';
  
  // Safe extraction of store data
  const cartItems = useCartStore((state) => state.items) || [];
  const wishlistItems = useWishlistStore((state) => state.items) || [];
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlistItems.length;
  
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Top Bar - Desktop Only */}
      <div className="hidden md:block bg-gray-100 text-xs text-gray-600 py-1.5 px-4 border-b border-gray-200">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-1 cursor-pointer hover:text-primary-600 transition-colors">
            <MapPin size={14} />
            <span>Deliver to <strong>New Delhi 110001</strong></span>
          </div>
          <div className="flex gap-4">
            <Link to="/sell" className="hover:text-primary-600 transition-colors">Sell on ShopVerse</Link>
            <Link to="/track" className="hover:text-primary-600 transition-colors">Track Order</Link>
            <Link to="/help" className="hover:text-primary-600 transition-colors">Help Center</Link>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between gap-4">
        {/* Mobile Menu & Logo */}
        <div className="flex items-center gap-3 md:w-1/4">
          <button 
            className="md:hidden p-1 text-gray-700 hover:text-primary-600 transition-colors"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <Link to="/" className="flex items-center gap-2 text-primary-600">
            <ShoppingBag size={28} className="text-primary-600" />
            <span className="text-xl md:text-2xl font-bold tracking-tight">ShopVerse</span>
          </Link>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:block flex-1 max-w-2xl">
          <SearchBar />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4 md:gap-6 md:w-1/4 justify-end">
          <button className="md:hidden text-gray-700 hover:text-primary-600 transition-colors" aria-label="Search">
            <Search size={24} />
          </button>
          
          {isLoggedIn && user ? (
            <Link to="/account" className="hidden md:flex items-center gap-1.5 text-gray-700 hover:text-primary-600 transition-colors">
              <User size={18} className="text-primary-600" />
              <span className="text-sm font-semibold truncate max-w-[100px]">{user.name?.split(' ')[0]}</span>
            </Link>
          ) : (
            <Link to="/login" className="hidden md:flex flex-col items-center text-gray-700 hover:text-primary-600 transition-colors">
              <span className="text-sm font-medium">Login</span>
            </Link>
          )}
          
          <Link to="/wishlist" className="hidden md:flex relative text-gray-700 hover:text-primary-600 transition-colors" aria-label="Wishlist">
            <Heart size={24} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-accent-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>
          
          <Link to="/cart" className="relative text-gray-700 hover:text-primary-600 transition-colors" aria-label="Cart">
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-primary-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Category Nav - Premium Horizontal Navigation */}
      <nav 
        aria-label="Shop by category"
        className="border-t border-gray-100 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
      >
        <div className="container mx-auto px-3 sm:px-4">
          <ul className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-5 overflow-x-auto scrollbar-hide py-1">
            {categories && categories.slice(0, 10).map((category) => {
              const IconComponent = CATEGORY_ICON_MAP[category.name] || Sparkles;
              const isActive = isProductsPage && activeCategoryParam?.toLowerCase() === category.name.toLowerCase();

              return (
                <li key={category.id} className="group relative shrink-0">
                  <Link 
                    to={`/products?category=${encodeURIComponent(category.name)}`} 
                    className={`relative flex items-center gap-1.5 px-2 sm:px-2.5 py-2.5 text-xs sm:text-[13px] md:text-sm font-[650] rounded-md transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? 'text-primary-600 bg-primary-50/70 font-bold'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50/80'
                    }`}
                  >
                    <IconComponent 
                      size={15} 
                      className={`transition-all duration-200 shrink-0 ${
                        isActive 
                          ? 'text-primary-600 scale-105 stroke-[2.2]' 
                          : 'text-gray-500 group-hover:text-primary-600 group-hover:scale-105'
                      }`} 
                    />
                    <span className="tracking-tight">{category.name}</span>
                    
                    {/* Active Bottom Indicator Bar */}
                    {isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary-600 rounded-full" />
                    )}

                    {/* Subtle Hover Indicator for Non-Active */}
                    {!isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    )}

                    {/* Subcategory Dropdown Arrow on Desktop */}
                    {category.subcategories && category.subcategories.length > 0 && (
                      <ChevronDown 
                        size={11} 
                        className="text-gray-400 group-hover:text-primary-600 group-hover:rotate-180 transition-transform duration-200 hidden lg:inline-block ml-0.5" 
                      />
                    )}
                  </Link>

                  {/* Dropdown for subcategories */}
                  {category.subcategories && category.subcategories.length > 0 && (
                    <div className="absolute top-full left-0 bg-white shadow-xl border border-gray-100 rounded-b-lg p-3 min-w-[210px] hidden group-hover:block transition-all z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
                        {category.name} Essentials
                      </div>
                      <ul className="space-y-1">
                        {category.subcategories.map((sub, idx) => (
                          <li key={idx}>
                            <Link 
                              to={`/products?category=${encodeURIComponent(category.name)}&sub=${encodeURIComponent(sub)}`} 
                              className="text-xs text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-2.5 py-1.5 rounded-md transition-colors block font-medium"
                            >
                              {sub}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] md:hidden transition-opacity">
          <div className="bg-white w-4/5 max-w-sm h-full flex flex-col shadow-xl animate-in slide-in-from-left duration-200">
            <div className="p-4 bg-primary-600 text-white flex justify-between items-center">
              <span className="font-bold text-lg flex items-center gap-2">
                <User size={20} /> Hello, {isLoggedIn && user?.name ? user.name.split(' ')[0] : 'Sign in'}
              </span>
              <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
              <h3 className="px-4 text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Shop by Category</h3>
              <ul className="space-y-1 px-2">
                {categories && categories.slice(0, 10).map((category) => {
                  const IconComponent = CATEGORY_ICON_MAP[category.name] || Sparkles;
                  const isActive = isProductsPage && activeCategoryParam?.toLowerCase() === category.name.toLowerCase();

                  return (
                    <li key={category.id}>
                      <Link 
                        to={`/products?category=${encodeURIComponent(category.name)}`}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                          isActive 
                            ? 'bg-primary-50 text-primary-600 font-bold' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <IconComponent size={18} className={isActive ? 'text-primary-600' : 'text-gray-500'} />
                        <span>{category.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

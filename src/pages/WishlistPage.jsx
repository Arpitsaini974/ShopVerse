import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ChevronRight } from 'lucide-react';
import useWishlistStore from '../store/wishlistStore';
import { ProductCard } from '../components/product/ProductCard';

const WishlistPage = () => {
  const { items } = useWishlistStore();

  return (
    <div className="w-full max-w-[2400px] mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8 min-h-[70vh]">
      {/* Breadcrumb */}
      <nav className="flex text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-600">Home</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900 font-medium">My Wishlist</span>
      </nav>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          My Wishlist
          <span className="ml-3 px-3 py-1 bg-primary-50 text-primary-600 text-sm font-medium rounded-full">
            {items.length} {items.length === 1 ? 'Item' : 'Items'}
          </span>
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8 max-w-md">
            Save items you love to your wishlist. Review them anytime and easily move them to your cart when you're ready to buy.
          </p>
          <Link 
            to="/products" 
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center space-x-2"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Start Shopping</span>
          </Link>
        </div>
      ) : (
        <div className="responsive-product-grid">
          {items.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;

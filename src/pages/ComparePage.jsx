import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, ChevronRight, Check } from 'lucide-react';
import useCompareStore from '../store/compareStore';
import useCartStore from '../store/cartStore';
import { formatPrice } from '../utils/helpers';

const ComparePage = () => {
  const { items, removeItem, clearCompare } = useCompareStore();
  const { addItem: addToCart } = useCartStore();
  const navigate = useNavigate();

  // Extract all unique specs keys from items to build rows
  const allSpecsKeys = Array.from(
    new Set(
      items.flatMap(item => Object.keys(item.specifications || {}))
    )
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-600">Home</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900 font-medium">Compare Products</span>
      </nav>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Compare Products</h1>
        {items.length > 0 && (
          <button 
            onClick={clearCompare}
            className="text-sm font-medium text-error-600 hover:text-error-700"
          >
            Clear All
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 px-4">
          <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Plus className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No products to compare</h2>
          <p className="text-gray-500 mb-8">Select products to compare their features and specifications.</p>
          <Link 
            to="/products" 
            className="inline-flex bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr>
                  <th className="w-48 bg-gray-50 p-6 border-b border-r border-gray-200 align-top text-left font-semibold text-gray-700">
                    Product
                  </th>
                  {items.map(item => (
                    <th key={item.id} className="w-64 p-6 border-b border-r border-gray-200 align-top relative bg-white">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-error-600 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <Link to={`/product/${item.id}`} className="block mb-4">
                        <div className="aspect-square bg-gray-50 rounded-lg p-4 mb-4 flex items-center justify-center">
                          <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                        </div>
                        <h3 className="font-medium text-gray-900 text-left line-clamp-2 hover:text-primary-600">{item.name}</h3>
                      </Link>
                      <div className="text-left mb-4">
                        <span className="text-lg font-bold text-gray-900 block">{formatPrice(item.price)}</span>
                        {item.originalPrice > item.price && (
                          <span className="text-sm text-gray-400 line-through">{formatPrice(item.originalPrice)}</span>
                        )}
                      </div>
                      <button
                        onClick={() => addToCart(item)}
                        className="w-full py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors text-sm"
                      >
                        Add to Cart
                      </button>
                    </th>
                  ))}
                  {items.length < 4 && (
                    <th className="w-64 p-6 border-b border-gray-200 align-middle bg-gray-50/50">
                      <Link
                        to="/products"
                        className="flex flex-col items-center justify-center h-full min-h-[200px] border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:text-primary-600 hover:border-primary-300 hover:bg-primary-50/50 transition-all"
                      >
                        <Plus className="w-8 h-8 mb-2" />
                        <span className="font-medium">Add Product</span>
                      </Link>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {/* Brand & Rating Rows */}
                <tr>
                  <td className="p-4 bg-gray-50 font-medium text-gray-700 border-b border-r border-gray-200">Brand</td>
                  {items.map(item => (
                    <td key={`brand-${item.id}`} className="p-4 border-b border-r border-gray-200 text-gray-600">{item.brand || '-'}</td>
                  ))}
                  {items.length < 4 && <td className="p-4 border-b border-gray-200 bg-gray-50/50"></td>}
                </tr>
                <tr>
                  <td className="p-4 bg-gray-50 font-medium text-gray-700 border-b border-r border-gray-200">Rating</td>
                  {items.map(item => (
                    <td key={`rating-${item.id}`} className="p-4 border-b border-r border-gray-200 text-gray-600">
                      {item.rating} ({item.reviews} reviews)
                    </td>
                  ))}
                  {items.length < 4 && <td className="p-4 border-b border-gray-200 bg-gray-50/50"></td>}
                </tr>
                
                {/* Specification Rows */}
                {allSpecsKeys.length > 0 && (
                  <tr>
                    <td colSpan={items.length + (items.length < 4 ? 2 : 1)} className="bg-gray-100 p-4 font-bold text-gray-900 border-b border-gray-200">
                      Key Specifications
                    </td>
                  </tr>
                )}
                
                {allSpecsKeys.map(specKey => (
                  <tr key={specKey}>
                    <td className="p-4 bg-gray-50 font-medium text-gray-700 border-b border-r border-gray-200 capitalize">
                      {specKey.replace(/([A-Z])/g, ' $1').trim()}
                    </td>
                    {items.map(item => (
                      <td key={`${specKey}-${item.id}`} className="p-4 border-b border-r border-gray-200 text-gray-600">
                        {item.specifications && item.specifications[specKey] ? item.specifications[specKey] : '-'}
                      </td>
                    ))}
                    {items.length < 4 && <td className="p-4 border-b border-gray-200 bg-gray-50/50"></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparePage;

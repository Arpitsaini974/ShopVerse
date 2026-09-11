import { useEffect, useState } from 'react';
import { Clock, TrendingUp, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useSearchStore from '../../store/searchStore';
import { searchProducts } from '../../data/products';
import { formatPrice } from '../../utils/helpers';

import { api } from '../../api/client';

export function SearchSuggestions({ query, onClose, onSelect }) {
  const navigate = useNavigate();
  const { recentSearches = [], removeRecentSearch, popularSearches = ['Smartphones', 'Laptops', 'Wireless Earbuds', 'Running Shoes'] } = useSearchStore(state => state);
  const [results, setResults] = useState([]);

  useEffect(() => {
    let isMounted = true;
    if (query.trim()) {
      api.getProducts({ q: query.trim(), limit: 6 })
        .then(data => {
          if (isMounted) setResults(data.products || []);
        })
        .catch(() => {
          const res = searchProducts(query.trim());
          if (isMounted) setResults(res.slice(0, 6));
        });
    } else {
      setResults([]);
    }
    return () => { isMounted = false; };
  }, [query]);

  const handleProductClick = (id) => {
    onClose();
    navigate(`/product/${id}`);
  };

  if (!query.trim()) {
    return (
      <div className="bg-white rounded-md shadow-lg border border-gray-200 py-4 px-4 w-full text-left">
        {recentSearches.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Recent Searches</h3>
            <ul className="space-y-2">
              {recentSearches.map((term, idx) => (
                <li key={idx} className="flex items-center justify-between group">
                  <button 
                    type="button"
                    onClick={() => onSelect(term)}
                    className="flex items-center text-sm text-gray-700 hover:text-primary-600 flex-1 text-left"
                  >
                    <Clock className="h-4 w-4 mr-2 text-gray-400 group-hover:text-primary-600" />
                    {term}
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (removeRecentSearch) removeRecentSearch(term);
                    }}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Popular Searches</h3>
          <ul className="space-y-2">
            {popularSearches.map((term, idx) => (
              <li key={idx}>
                <button 
                  type="button"
                  onClick={() => onSelect(term)}
                  className="flex items-center text-sm text-gray-700 hover:text-primary-600 w-full text-left group"
                >
                  <TrendingUp className="h-4 w-4 mr-2 text-gray-400 group-hover:text-primary-600" />
                  {term}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md shadow-lg border border-gray-200 py-2 w-full text-left">
      {results.length > 0 ? (
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-2">Products</h3>
          <ul className="max-h-80 overflow-y-auto">
            {results.map((product) => (
              <li key={product.id}>
                <button 
                  type="button"
                  onClick={() => handleProductClick(product.id)}
                  className="w-full flex items-center px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md overflow-hidden mr-3">
                    <img 
                      src={product.images?.[0] || product.image || 'https://via.placeholder.com/40'} 
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500 truncate">{product.brand}</p>
                  </div>
                  <div className="ml-2 text-sm font-semibold text-primary-600">
                    {formatPrice ? formatPrice(product.price) : `₹${product.price}`}
                  </div>
                </button>
              </li>
            ))}
          </ul>
          
          <div className="border-t border-gray-100 mt-2 p-2">
            <button 
              type="button"
              onClick={() => onSelect(query)}
              className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium py-2"
            >
              See all results for "{query}"
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 text-center text-sm text-gray-500">
          No results found for "{query}"
        </div>
      )}
    </div>
  );
}

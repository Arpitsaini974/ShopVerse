import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import useSearchStore from '../store/searchStore';
import { ProductCard } from '../components/product/ProductCard';
import { SearchX, Filter, Loader2 } from 'lucide-react';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [sortBy, setSortBy] = useState('relevance');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const addRecentSearch = useSearchStore(state => state.addRecentSearch);
  
  useEffect(() => {
    if (query && addRecentSearch) {
      addRecentSearch(query);
    }
  }, [query, addRecentSearch]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    let sortKey = 'relevance';
    if (sortBy === 'price-low-high') sortKey = 'price-low';
    else if (sortBy === 'price-high-low') sortKey = 'price-high';
    else if (sortBy === 'rating') sortKey = 'rating';

    api.getProducts({ q: query, sort: sortKey, limit: 40 })
      .then(data => {
        setResults(data.products || []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Search API error:', err);
        setIsLoading(false);
      });
  }, [query, sortBy]);

  if (!query) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Search ShopVerse Marketplace</h2>
        <p className="mt-2 text-gray-500 text-sm">Enter a keyword to search across 10 categories, authentic brands, and technical specifications.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[2400px] mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8 min-h-[70vh]">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Search Results
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Showing {results.length} result{results.length !== 1 && 's'} for <span className="font-semibold text-gray-900">"{query}"</span>
          </p>
        </div>
        
        {results.length > 0 && (
          <div className="flex items-center">
            <div className="flex items-center text-sm font-medium text-gray-700 mr-2">
              <Filter className="h-4 w-4 mr-1.5 text-primary-600" />
              <span>Sort by:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-48 pl-3 pr-8 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-lg bg-white cursor-pointer"
            >
              <option value="relevance">Relevance & Best Match</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <Loader2 size={36} className="animate-spin text-primary-600 mb-3" />
          <p className="text-sm text-gray-500">Searching database catalog...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="responsive-product-grid">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <SearchX className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-bold text-gray-900">No matching products found</h3>
          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
            We couldn't find anything matching "{query}". Try checking your spelling or searching by category like "Smartphones", "Laptops", "Shoes", or "Refrigerators".
          </p>
          <div className="mt-8">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Popular Searches</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {['Smartphones', 'MacBook', 'Nike Shoes', '4K TV', 'Refrigerators', 'Headphones', 'Books'].map(cat => (
                <Link 
                  key={cat}
                  to={`/search?q=${encodeURIComponent(cat)}`}
                  className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-full text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-primary-300 transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

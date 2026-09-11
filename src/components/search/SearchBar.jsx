import { useState, useRef, useEffect } from 'react';
import { Search, Mic, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useSearchStore from '../../store/searchStore';
import { SearchSuggestions } from './SearchSuggestions';
import { cn } from '../../utils/helpers';

export function SearchBar({ isMobileView = false }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const navigate = useNavigate();
  const searchRef = useRef(null);
  
  const addRecentSearch = useSearchStore(state => state.addRecentSearch);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (query.trim()) {
      if (addRecentSearch) addRecentSearch(query.trim());
      setIsFocused(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleVoiceSearch = () => {
    // Show toast
    alert('Voice search coming soon');
  };

  const handleClear = () => {
    setQuery('');
    setDebouncedQuery('');
    // Keep focus after clearing
    if (searchRef.current) {
      const input = searchRef.current.querySelector('input');
      if (input) input.focus();
    }
  };
  
  return (
    <div ref={searchRef} className={cn("relative w-full max-w-2xl", isMobileView && "w-full")}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search for products, brands and more"
          className="block w-full pl-10 pr-16 py-2.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-600 focus:border-primary-600 sm:text-sm transition duration-150 ease-in-out"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={handleVoiceSearch}
            className="p-1 rounded-full text-primary-600 hover:text-primary-700 hover:bg-gray-100 focus:outline-none transition-colors"
          >
            <Mic className="h-5 w-5" />
          </button>
        </div>
      </form>

      {isFocused && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1">
          <SearchSuggestions 
            query={debouncedQuery} 
            onClose={() => setIsFocused(false)} 
            onSelect={(q) => {
              setQuery(q);
              if (addRecentSearch) addRecentSearch(q);
              setIsFocused(false);
              navigate(`/search?q=${encodeURIComponent(q)}`);
            }}
          />
        </div>
      )}
    </div>
  );
}

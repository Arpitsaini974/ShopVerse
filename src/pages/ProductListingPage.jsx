import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { LayoutGrid, List, SlidersHorizontal, ArrowUpDown, X, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { api } from '../api/client';
import { ProductCard } from '../components/product/ProductCard';
import { FilterSidebar } from '../components/filters/FilterSidebar';
import { FilterChips } from '../components/filters/FilterChips';
import QuickViewModal from '../components/product/QuickViewModal';

const ProductListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);

  // Backend response state
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState(null);

  // Parse filters from URL search params
  const filters = useMemo(() => {
    return {
      category: searchParams.getAll('category'),
      subcategory: searchParams.getAll('subcategory').length > 0 
        ? searchParams.getAll('subcategory') 
        : (searchParams.get('sub') ? [searchParams.get('sub')] : []),
      brand: searchParams.getAll('brand'),
      price: searchParams.get('price'),
      rating: searchParams.get('rating'),
      discount: searchParams.get('discount'),
      inStock: searchParams.get('inStock') === 'true',
      q: searchParams.get('q') || '',
      page: parseInt(searchParams.get('page'), 10) || 1
    };
  }, [searchParams]);

  const sortOption = searchParams.get('sort') || 'relevance';

  // Load category metadata for header & subcategory pills
  useEffect(() => {
    const mainCat = filters.category[0];
    if (mainCat) {
      api.getCategory(mainCat)
        .then(cat => setCategoryInfo(cat))
        .catch(() => setCategoryInfo(null));
    } else {
      setCategoryInfo(null);
    }
  }, [filters.category]);

  // Fetch products from backend whenever filters or sort change
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    let minPrice = '';
    let maxPrice = '';
    if (filters.price) {
      if (filters.price.includes('-')) {
        const [min, max] = filters.price.split('-');
        minPrice = min;
        if (max !== 'max') maxPrice = max;
      }
    }

    const queryParams = {
      category: filters.category,
      subcategory: filters.subcategory,
      brand: filters.brand,
      minPrice,
      maxPrice,
      rating: filters.rating,
      inStock: filters.inStock,
      q: filters.q,
      sort: sortOption,
      page: filters.page,
      limit: 20
    };

    api.getProducts(queryParams)
      .then(data => {
        if (isMounted) {
          setProducts(data.products || []);
          setTotal(data.total || 0);
          setTotalPages(data.totalPages || 1);
          setAvailableBrands(data.availableBrands || []);
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.error('Error fetching products from backend API:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [filters, sortOption]);

  const handleFilterChange = (group, value) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', '1'); // Reset to first page on filter change
    
    if (group === 'clearAll') {
      const q = newParams.get('q');
      const newQuery = new URLSearchParams();
      if (q) newQuery.set('q', q);
      setSearchParams(newQuery);
      return;
    }

    if (Array.isArray(value)) {
      newParams.delete(group);
      value.forEach(v => newParams.append(group, v));
    } else if (value === null || value === undefined) {
      newParams.delete(group);
    } else {
      newParams.set(group, value);
    }
    
    setSearchParams(newParams);
  };

  const handleFilterRemove = (group, value) => {
    const currentValues = filters[group];
    if (Array.isArray(currentValues)) {
      handleFilterChange(group, currentValues.filter(v => v !== value));
    } else {
      handleFilterChange(group, null);
    }
  };

  const handleSortChange = (e) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', e.target.value);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('page', newPage.toString());
      setSearchParams(newParams);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubcategoryPillClick = (subSlug) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', '1');
    if (!subSlug) {
      newParams.delete('subcategory');
      newParams.delete('sub');
    } else {
      newParams.set('subcategory', subSlug);
      newParams.delete('sub');
    }
    // Clear brands when switching subcategories to ensure brand filter matches
    newParams.delete('brand');
    setSearchParams(newParams);
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    if (key === 'q' || key === 'page') return false;
    if (Array.isArray(filters[key])) return filters[key].length > 0;
    return !!filters[key];
  });

  const activeSubcategorySlug = filters.subcategory[0] || '';

  return (
    <div className="bg-gray-50 min-h-screen pt-4 pb-20 md:pb-12">
      <div className="w-full max-w-[2400px] mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        
        {/* Breadcrumb & Category Banner Header */}
        <div className="mb-6 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-xs text-gray-500 mb-2 flex items-center gap-1.5 flex-wrap">
            <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary-600 transition-colors">Products</Link>
            {filters.category.length > 0 && (
              <>
                <span>/</span>
                <span className="font-semibold text-gray-700">{filters.category[0]}</span>
              </>
            )}
            {activeSubcategorySlug && (
              <>
                <span>/</span>
                <span className="text-primary-600 font-semibold">{activeSubcategorySlug}</span>
              </>
            )}
            {filters.q && (
              <>
                <span>/</span>
                <span className="text-gray-900 font-semibold">Search: "{filters.q}"</span>
              </>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                {filters.q 
                  ? `Search Results for "${filters.q}"` 
                  : (categoryInfo ? categoryInfo.name : (filters.category[0] || 'All Products'))}
              </h1>
              {categoryInfo?.description && (
                <p className="text-sm text-gray-500 mt-1 max-w-2xl">
                  {categoryInfo.description}
                </p>
              )}
            </div>

            <div className="text-sm text-gray-600 font-medium shrink-0">
              Found <span className="text-gray-900 font-bold">{total}</span> products
            </div>
          </div>

          {/* Quick Subcategory Pills Navigation */}
          {categoryInfo?.subcategories && categoryInfo.subcategories.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button
                onClick={() => handleSubcategoryPillClick(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  !activeSubcategorySlug
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All {categoryInfo.name} ({categoryInfo.product_count || total})
              </button>
              {categoryInfo.subcategories.map(sub => {
                const isActive = activeSubcategorySlug.toLowerCase() === sub.slug.toLowerCase() || 
                                 activeSubcategorySlug.toLowerCase() === sub.name.toLowerCase();
                return (
                  <button
                    key={sub.id}
                    onClick={() => handleSubcategoryPillClick(sub.slug)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {sub.name} {sub.product_count ? `(${sub.product_count})` : ''}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Main Grid: Filters Sidebar + Products Display */}
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-20 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <FilterSidebar 
                filters={filters} 
                onFilterChange={handleFilterChange} 
                serverBrands={availableBrands} 
              />
            </div>
          </aside>

          {/* Products Content Area */}
          <main className="flex-1">
            
            {/* Controls Bar: Sort, Results Count & View Toggle */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-sm text-gray-600 font-medium">
                Page <span className="font-bold text-gray-900">{filters.page}</span> of <span className="font-bold text-gray-900">{totalPages}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="text-sm text-gray-600 font-medium">Sort by:</label>
                  <select 
                    id="sort"
                    value={sortOption}
                    onChange={handleSortChange}
                    className="text-sm border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 py-1.5 pl-3 pr-8 bg-white cursor-pointer"
                  >
                    <option value="relevance">Relevance & Top Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                    <option value="newest">Newest Arrivals</option>
                    <option value="discount">Biggest Discount</option>
                  </select>
                </div>
                
                <div className="hidden sm:flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                    aria-label="Grid view"
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                    aria-label="List view"
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <FilterChips filters={filters} onRemove={handleFilterRemove} />
            )}

            {/* Products Grid / Skeletons / Empty State */}
            {isLoading ? (
              <div className="responsive-product-grid">
                {[1,2,3,4,5,6,7,8].map(i => (
                  <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 animate-pulse h-80 flex flex-col justify-between">
                    <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                    <div className="bg-gray-200 h-4 w-3/4 mb-2 rounded"></div>
                    <div className="bg-gray-200 h-4 w-1/2 mb-4 rounded"></div>
                    <div className="bg-gray-200 h-8 w-full rounded"></div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className={`
                  ${viewMode === 'grid' 
                    ? 'responsive-product-grid items-stretch' 
                    : 'flex flex-col gap-4'}
                `}>
                  {products.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      showQuickView={viewMode === 'grid'}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(filters.page - 1)}
                      disabled={filters.page <= 1}
                      className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft size={16} />
                      <span>Previous</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPages || Math.abs(p - filters.page) <= 2)
                        .map((p, idx, arr) => {
                          const prev = arr[idx - 1];
                          return (
                            <React.Fragment key={p}>
                              {prev && p - prev > 1 && <span className="px-2 text-gray-400">...</span>}
                              <button
                                onClick={() => handlePageChange(p)}
                                className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
                                  p === filters.page
                                    ? 'bg-primary-600 text-white shadow-sm'
                                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {p}
                              </button>
                            </React.Fragment>
                          );
                        })}
                    </div>

                    <button
                      onClick={() => handlePageChange(filters.page + 1)}
                      disabled={filters.page >= totalPages}
                      className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <span>Next</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white py-16 px-4 text-center rounded-xl border border-gray-200">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LayoutGrid className="text-gray-400" size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6 text-sm">
                  We couldn't find any products matching your current filters. Try selecting a different brand, price range, or clearing active filters.
                </p>
                <button 
                  onClick={() => handleFilterChange('clearAll')}
                  className="bg-primary-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-sm"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Floating Filter and Sort Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex z-40 shadow-lg">
        <button 
          onClick={() => document.getElementById('sort').focus()}
          className="flex-1 flex items-center justify-center gap-2 font-medium text-gray-700 border-r border-gray-200"
        >
          <ArrowUpDown size={18} />
          Sort
        </button>
        <button 
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 font-medium text-gray-700 relative"
        >
          <SlidersHorizontal size={18} />
          Filter
          {hasActiveFilters && (
            <span className="absolute top-0 right-1/4 w-2.5 h-2.5 bg-primary-600 rounded-full border border-white"></span>
          )}
        </button>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col bg-white">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
            <button 
              onClick={() => setIsMobileFilterOpen(false)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <FilterSidebar 
              filters={filters} 
              onFilterChange={handleFilterChange} 
              serverBrands={availableBrands} 
            />
          </div>
          <div className="p-4 border-t border-gray-200 flex gap-4 bg-gray-50">
            <button 
              onClick={() => handleFilterChange('clearAll')}
              className="flex-1 py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium"
            >
              Clear All
            </button>
            <button 
              onClick={() => setIsMobileFilterOpen(false)}
              className="flex-1 py-3 px-4 bg-primary-600 text-white rounded-lg font-semibold shadow-sm"
            >
              Apply ({total} Results)
            </button>
          </div>
        </div>
      )}

      <QuickViewModal />
    </div>
  );
};

export default ProductListingPage;

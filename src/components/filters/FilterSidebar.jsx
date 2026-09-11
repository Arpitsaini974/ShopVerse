import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { api } from '../../api/client';

const CollapsibleSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 py-4 last:border-0">
      <button 
        className="flex items-center justify-between w-full text-left font-medium text-gray-900"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {isOpen ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
      </button>
      {isOpen && <div className="mt-4">{children}</div>}
    </div>
  );
};

export const FilterSidebar = ({ 
  filters, 
  onFilterChange, 
  serverBrands = [], 
  categories: propCategories = [] 
}) => {
  const [dynamicBrands, setDynamicBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [categoriesList, setCategoriesList] = useState(propCategories);

  const activeCategory = Array.isArray(filters.category) ? filters.category[0] : filters.category;
  const activeSubcategory = Array.isArray(filters.subcategory) ? filters.subcategory[0] : filters.subcategory;

  // Load categories if not provided
  useEffect(() => {
    if (propCategories.length === 0) {
      api.getCategories().then(data => {
        setCategoriesList(data.map(c => c.name));
      }).catch(err => console.error('Error loading categories:', err));
    } else {
      setCategoriesList(propCategories);
    }
  }, [propCategories]);

  // Dynamic brand fetching based on Category or Subcategory
  useEffect(() => {
    let isMounted = true;
    const fetchDynamicBrands = async () => {
      setLoadingBrands(true);
      try {
        let brandsData = [];
        if (activeSubcategory) {
          brandsData = await api.getCategoryBrands(activeSubcategory);
        } else if (activeCategory) {
          brandsData = await api.getCategoryBrands(activeCategory);
        } else if (serverBrands.length > 0) {
          brandsData = serverBrands;
        } else {
          brandsData = await api.getBrands();
        }

        if (isMounted) {
          setDynamicBrands(brandsData);

          // If current selected brands are no longer in the newly loaded dynamic brands, prune them
          if (filters.brand && filters.brand.length > 0) {
            const validBrandNames = new Set(brandsData.map(b => b.name.toLowerCase()));
            const currentSelected = Array.isArray(filters.brand) ? filters.brand : [filters.brand];
            const pruned = currentSelected.filter(b => validBrandNames.has(b.toLowerCase()));
            if (pruned.length !== currentSelected.length) {
              onFilterChange('brand', pruned.length > 0 ? pruned : null);
            }
          }
        }
      } catch (err) {
        console.error('Error updating dynamic brands:', err);
        if (isMounted && serverBrands.length > 0) {
          setDynamicBrands(serverBrands);
        }
      } finally {
        if (isMounted) setLoadingBrands(false);
      }
    };

    fetchDynamicBrands();

    return () => { isMounted = false; };
  }, [activeCategory, activeSubcategory]);

  const handleCheckboxChange = (group, value, checked) => {
    const currentValues = filters[group] || [];
    let newValues;
    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(v => v !== value);
    }
    onFilterChange(group, newValues.length > 0 ? newValues : null);
  };

  const handleRadioChange = (group, value) => {
    onFilterChange(group, value === filters[group] ? null : value);
  };

  const isBrandChecked = (brandName) => {
    if (!filters.brand) return false;
    if (Array.isArray(filters.brand)) {
      return filters.brand.some(b => b.toLowerCase() === brandName.toLowerCase());
    }
    return filters.brand.toLowerCase() === brandName.toLowerCase();
  };

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <button 
          onClick={() => onFilterChange('clearAll')}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="flex flex-col">
        {/* Dynamic Category Section */}
        {categoriesList.length > 0 && (
          <CollapsibleSection title="Category">
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {categoriesList.map(category => (
                <label key={category} className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={(filters.category || []).includes(category)}
                    onChange={(e) => handleCheckboxChange('category', category, e.target.checked)}
                  />
                  <span className="text-sm text-gray-700 group-hover:text-indigo-600 transition-colors">
                    {category}
                  </span>
                </label>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Dynamic Brand Section - Connected to Database */}
        <CollapsibleSection title={`Brand ${activeCategory ? `(${activeCategory})` : ''}`}>
          {loadingBrands ? (
            <div className="flex items-center gap-2 py-4 text-xs text-gray-500 justify-center">
              <Loader2 size={16} className="animate-spin text-indigo-600" />
              <span>Loading brands...</span>
            </div>
          ) : dynamicBrands.length > 0 ? (
            <div className="space-y-2 max-h-52 overflow-y-auto pr-2 custom-scrollbar">
              {dynamicBrands.map(b => (
                <label key={b.id || b.name} className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox"
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={isBrandChecked(b.name)}
                      onChange={(e) => handleCheckboxChange('brand', b.name, e.target.checked)}
                    />
                    <span className="text-sm text-gray-700 group-hover:text-indigo-600 transition-colors">
                      {b.name}
                    </span>
                  </div>
                  {b.count !== undefined && (
                    <span className="text-xs text-gray-400 font-medium">
                      ({b.count})
                    </span>
                  )}
                </label>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 py-2">No brands found for this selection.</p>
          )}
        </CollapsibleSection>

        {/* Price Bounds Filter */}
        <CollapsibleSection title="Price">
          <div className="space-y-2">
            {[
              { label: 'Under ₹1,000', value: '0-1000' },
              { label: '₹1,000 - ₹5,000', value: '1000-5000' },
              { label: '₹5,000 - ₹20,000', value: '5000-20000' },
              { label: '₹20,000 - ₹50,000', value: '20000-50000' },
              { label: 'Over ₹50,000', value: '50000-max' }
            ].map(range => (
              <label key={range.value} className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio"
                  name="price_range"
                  className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={filters.price === range.value}
                  onChange={() => handleRadioChange('price', range.value)}
                />
                <span className="text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
          </div>
        </CollapsibleSection>

        {/* Rating Filter */}
        <CollapsibleSection title="Customer Rating">
          <div className="space-y-2">
            {[4, 3, 2, 1].map(rating => (
              <label key={rating} className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio"
                  name="rating"
                  className="border-gray-300 text-amber-500 focus:ring-amber-500"
                  checked={filters.rating === rating.toString()}
                  onChange={() => handleRadioChange('rating', rating.toString())}
                />
                <div className="flex items-center text-sm text-gray-700">
                  {rating}★ & above
                </div>
              </label>
            ))}
          </div>
        </CollapsibleSection>

        {/* Discount Filter */}
        <CollapsibleSection title="Discount" defaultOpen={false}>
          <div className="space-y-2">
            {[50, 40, 30, 20, 10].map(discount => (
              <label key={discount} className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio"
                  name="discount"
                  className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={filters.discount === discount.toString()}
                  onChange={() => handleRadioChange('discount', discount.toString())}
                />
                <span className="text-sm text-gray-700">{discount}% and above</span>
              </label>
            ))}
          </div>
        </CollapsibleSection>

        {/* Availability Filter */}
        <CollapsibleSection title="Availability" defaultOpen={true}>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox"
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              checked={filters.inStock === true}
              onChange={(e) => onFilterChange('inStock', e.target.checked ? true : null)}
            />
            <span className="text-sm text-gray-700 font-medium">In Stock Only</span>
          </label>
        </CollapsibleSection>
      </div>
    </div>
  );
};

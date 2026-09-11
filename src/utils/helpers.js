export const formatPrice = (price) => {
  if (price === null || price === undefined) return '';
  return '₹' + price.toLocaleString('en-IN');
};

export const formatDiscount = (priceOrDiscount, originalPrice) => {
  if (originalPrice !== undefined) {
    const discount = Math.round(((originalPrice - priceOrDiscount) / originalPrice) * 100);
    return `${discount}% off`;
  }
  return `${priceOrDiscount}% off`;
};

export const getDeliveryDate = (days) => {
  if (!days) return null;
  const date = new Date();
  date.setDate(date.getDate() + days);
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-IN', options);
};

export const generateOrderId = () => {
  return 'SV' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
};

export const sortProducts = (products, sortBy) => {
  const sorted = [...products];
  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return sorted.sort((a, b) => b.id - a.id);
    case 'discount':
      return sorted.sort((a, b) => b.discount - a.discount);
    default:
      return sorted;
  }
};

export const filterProducts = (products, filters) => {
  let filtered = [...products];

  // Category filter (handles both string and array)
  if (filters.category && filters.category.length > 0) {
    if (Array.isArray(filters.category)) {
      filtered = filtered.filter((p) => filters.category.includes(p.category));
    } else {
      filtered = filtered.filter((p) => p.category === filters.category);
    }
  }

  // Subcategory filter
  if (filters.subcategory && filters.subcategory.length > 0) {
    if (Array.isArray(filters.subcategory)) {
      filtered = filtered.filter((p) => filters.subcategory.includes(p.subcategory));
    } else {
      filtered = filtered.filter((p) => p.subcategory === filters.subcategory);
    }
  }

  // Brand filter (handles brand / brands, single / array)
  const brandFilter = filters.brand || filters.brands;
  if (brandFilter && brandFilter.length > 0) {
    if (Array.isArray(brandFilter)) {
      filtered = filtered.filter((p) => brandFilter.includes(p.brand));
    } else {
      filtered = filtered.filter((p) => p.brand.toLowerCase() === brandFilter.toLowerCase());
    }
  }

  // Price filter
  if (filters.priceRange && Array.isArray(filters.priceRange)) {
    filtered = filtered.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );
  } else if (filters.price) {
    const [min, max] = String(filters.price).split('-').map(Number);
    if (!isNaN(min) && !isNaN(max)) {
      filtered = filtered.filter((p) => p.price >= min && p.price <= max);
    } else if (!isNaN(min)) {
      filtered = filtered.filter((p) => p.price >= min);
    }
  }

  // Rating filter
  if (filters.rating) {
    filtered = filtered.filter((p) => p.rating >= Number(filters.rating));
  }

  // Discount filter
  if (filters.discount) {
    filtered = filtered.filter((p) => p.discount >= Number(filters.discount));
  }

  // Availability / Stock filter
  if (filters.inStock) {
    filtered = filtered.filter((p) => p.inStock);
  }

  // RAM filter
  if (filters.ram && filters.ram.length > 0) {
    const ramValues = Array.isArray(filters.ram) ? filters.ram : [filters.ram];
    filtered = filtered.filter((p) => {
      const pRam = p.specifications?.RAM;
      return pRam && ramValues.some(r => pRam.toLowerCase().includes(r.toLowerCase()));
    });
  }

  // Storage filter
  if (filters.storage && filters.storage.length > 0) {
    const storageValues = Array.isArray(filters.storage) ? filters.storage : [filters.storage];
    filtered = filtered.filter((p) => {
      const pStorage = p.specifications?.Storage;
      return pStorage && storageValues.some(s => pStorage.toLowerCase().includes(s.toLowerCase()));
    });
  }

  // Search query (handles both q and search)
  const query = filters.q || filters.search;
  if (query && typeof query === 'string' && query.trim()) {
    const q = query.trim().toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }

  return filtered;
};

export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const cn = (...classes) => classes.filter(Boolean).join(' ');

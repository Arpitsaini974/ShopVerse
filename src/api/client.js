// Centralized API client for ShopVerse marketplace backend
const API_BASE = '/api';

export const api = {
  // Fetch paginated & filtered products
  async getProducts(params = {}) {
    const query = new URLSearchParams();

    if (params.category) {
      if (Array.isArray(params.category)) {
        params.category.forEach(c => query.append('category', c));
      } else {
        query.set('category', params.category);
      }
    }

    if (params.subcategory) {
      if (Array.isArray(params.subcategory)) {
        params.subcategory.forEach(s => query.append('subcategory', s));
      } else {
        query.set('subcategory', params.subcategory);
      }
    }

    if (params.brand) {
      if (Array.isArray(params.brand)) {
        query.set('brand', params.brand.join(','));
      } else {
        query.set('brand', params.brand);
      }
    }

    if (params.minPrice !== undefined && params.minPrice !== null && params.minPrice !== '') {
      query.set('minPrice', params.minPrice);
    }

    if (params.maxPrice !== undefined && params.maxPrice !== null && params.maxPrice !== '') {
      query.set('maxPrice', params.maxPrice);
    }

    if (params.rating) {
      query.set('rating', params.rating);
    }

    if (params.inStock) {
      query.set('inStock', 'true');
    }

    if (params.q) {
      query.set('q', params.q);
    }

    if (params.sort) {
      query.set('sort', params.sort);
    }

    if (params.page) {
      query.set('page', params.page);
    }

    if (params.limit) {
      query.set('limit', params.limit);
    }

    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }
    return res.json();
  },

  // Fetch single product by id or slug
  async getProductById(id) {
    const res = await fetch(`${API_BASE}/products/${encodeURIComponent(id)}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch product: ${res.statusText}`);
    }
    return res.json();
  },

  // Fetch all categories with subcategories
  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.statusText}`);
    }
    return res.json();
  },

  // Fetch category by identifier
  async getCategory(identifier) {
    const res = await fetch(`${API_BASE}/categories/${encodeURIComponent(identifier)}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch category: ${res.statusText}`);
    }
    return res.json();
  },

  // Dynamic Brand Fetching based on Category/Subcategory
  async getCategoryBrands(categoryIdentifier) {
    const res = await fetch(`${API_BASE}/categories/${encodeURIComponent(categoryIdentifier)}/brands`);
    if (!res.ok) {
      throw new Error(`Failed to fetch category brands: ${res.statusText}`);
    }
    return res.json();
  },

  // Fetch brands with optional filters
  async getBrands(params = {}) {
    const query = new URLSearchParams();
    if (params.category) query.set('category', params.category);
    if (params.subcategory) query.set('subcategory', params.subcategory);
    const res = await fetch(`${API_BASE}/brands?${query.toString()}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch brands: ${res.statusText}`);
    }
    return res.json();
  },

  // Check product live availability & stock
  async checkProductAvailability(id) {
    const res = await fetch(`${API_BASE}/products/${encodeURIComponent(id)}/availability`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Product unavailable' }));
      throw new Error(err.error || `Product check failed (${res.status})`);
    }
    return res.json();
  },

  // Pre-validate checkout items & compute trusted price totals from database
  async validateCheckout(checkoutData) {
    const res = await fetch(`${API_BASE}/checkout/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(checkoutData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Checkout validation failed' }));
      throw new Error(err.error || `Validation failed with status ${res.status}`);
    }
    return res.json();
  },

  // ==========================================
  // PAYMENT & ORDER CHECKOUT FLOW
  // ==========================================

  // Step 1: Initiate Checkout on server (verifies prices & creates pending order)
  async initiateCheckout(checkoutData) {
    const res = await fetch(`${API_BASE}/checkout/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(checkoutData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err.error?.message || (typeof err.error === 'string' ? err.error : null) || "We couldn't start the payment. Please try again.";
      throw new Error(msg);
    }
    return res.json();
  },

  // Confirm Cash on Delivery (COD) Order
  async confirmCODOrder(checkoutData) {
    const res = await fetch(`${API_BASE}/checkout/cod-confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(checkoutData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err.error?.message || (typeof err.error === 'string' ? err.error : null) || "Unable to confirm Cash on Delivery order.";
      throw new Error(msg);
    }
    return res.json();
  },

  // Step 2: Verify Gateway Payment on server (cryptographically confirms order & commits inventory)
  async verifyPayment(paymentVerificationData) {
    const res = await fetch(`${API_BASE}/checkout/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentVerificationData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Payment verification failed' }));
      throw new Error(err.error || `Payment verification rejected with status ${res.status}`);
    }
    return res.json();
  },

  // Report payment failure
  async reportPaymentFailed(orderId, error) {
    const res = await fetch(`${API_BASE}/checkout/payment-failed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, error })
    });
    return res.json();
  },

  // Report payment cancellation
  async reportPaymentCancelled(orderId) {
    const res = await fetch(`${API_BASE}/checkout/payment-cancelled`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId })
    });
    return res.json();
  },

  // Get order by ID from database
  async getOrderById(orderId) {
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderId)}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Order not found' }));
      throw new Error(err.error || `Order not found (${res.status})`);
    }
    return res.json();
  },

  // Get confirmed orders for user
  async getMyOrders() {
    const res = await fetch(`${API_BASE}/orders`);
    if (!res.ok) {
      throw new Error('Failed to fetch orders');
    }
    return res.json();
  },

  // Update order status (Admin)
  async updateOrderStatus(orderId, status) {
    const res = await fetch(`${API_BASE}/admin/orders/${encodeURIComponent(orderId)}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Update failed' }));
      throw new Error(err.error || 'Failed to update order status');
    }
    return res.json();
  }
};

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Helper to normalize any product/item shape into a standard cart/checkout item
export const normalizeCartItem = (productOrWrapper, quantity = 1, variant = null) => {
  if (!productOrWrapper) return null;

  // If passed an object that has a nested `.product` property (e.g. { product, quantity, selectedSize })
  const baseProduct = productOrWrapper.product || productOrWrapper;
  const rawId = baseProduct.productId ?? baseProduct.product_id ?? baseProduct.id ?? productOrWrapper.productId ?? productOrWrapper.product_id ?? productOrWrapper.id;
  const rawVariantId = productOrWrapper.variantId ?? productOrWrapper.variant_id ?? baseProduct.variantId ?? baseProduct.variant_id ?? null;
  const qty = Number(productOrWrapper.quantity || quantity) || 1;
  const varVal = variant || productOrWrapper.selectedSize || productOrWrapper.selectedColor || productOrWrapper.variant || baseProduct.variant || null;

  const validId = rawId !== undefined && rawId !== null ? (isNaN(Number(rawId)) ? String(rawId) : Number(rawId)) : undefined;

  return {
    id: validId,
    productId: validId,
    variantId: rawVariantId !== null && !isNaN(Number(rawVariantId)) ? Number(rawVariantId) : rawVariantId,
    name: baseProduct.name || 'Product',
    price: Number(baseProduct.price) || 0,
    originalPrice: Number(baseProduct.originalPrice || baseProduct.mrp || baseProduct.price) || 0,
    discount: Number(baseProduct.discount) || 0,
    image: baseProduct.image || baseProduct.thumbnail || (Array.isArray(baseProduct.images) ? baseProduct.images[0] : null) || 'https://via.placeholder.com/300',
    brand: baseProduct.brand || 'ShopVerse',
    stock: Number(baseProduct.stock) || 0,
    quantity: Math.max(1, qty),
    variant: varVal,
    addedAt: Date.now()
  };
};

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      savedForLater: [],
      buyNowItem: null, // Dedicated Buy Now item without polluting standard cart

      // Add item to cart with defensive normalization
      addItem: (productOrWrapper, quantity = 1, variant = null) => {
        const normalized = normalizeCartItem(productOrWrapper, quantity, variant);
        if (!normalized || normalized.id === undefined || normalized.id === null) return;

        set((state) => {
          // Purge any stale invalid items with no valid ID
          const cleanItems = state.items.filter(item => item && (item.id !== undefined && item.id !== null));
          const existingIndex = cleanItems.findIndex(
            (item) => String(item.id) === String(normalized.id) && item.variant === normalized.variant
          );
          if (existingIndex >= 0) {
            const newItems = [...cleanItems];
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: Math.min(10, newItems[existingIndex].quantity + normalized.quantity),
            };
            return { items: newItems };
          }
          return {
            items: [...cleanItems, normalized],
          };
        });
      },

      // Buy Now state actions
      setBuyNowItem: (productOrWrapper, quantity = 1, variant = null) => {
        const normalized = normalizeCartItem(productOrWrapper, quantity, variant);
        set({ buyNowItem: normalized });
        return normalized;
      },

      clearBuyNowItem: () => {
        set({ buyNowItem: null });
      },

      removeItem: (productId, variant = null) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.id === productId && item.variant === variant)
          ),
        }));
      },

      updateQuantity: (productId, quantity, variant = null) => {
        if (quantity < 1) return;
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId && item.variant === variant
              ? { ...item, quantity: Math.min(quantity, 10) }
              : item
          ),
        }));
      },

      saveForLater: (productId, variant = null) => {
        const item = get().items.find(
          (i) => i.id === productId && i.variant === variant
        );
        if (!item) return;
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.id === productId && i.variant === variant)
          ),
          savedForLater: [...state.savedForLater, { ...item, savedAt: Date.now() }],
        }));
      },

      moveToCart: (productId, variant = null) => {
        const item = get().savedForLater.find(
          (i) => i.id === productId && i.variant === variant
        );
        if (!item) return;
        set((state) => ({
          savedForLater: state.savedForLater.filter(
            (i) => !(i.id === productId && i.variant === variant)
          ),
          items: [...state.items, { ...item, addedAt: Date.now() }],
        }));
      },

      removeSavedItem: (productId, variant = null) => {
        set((state) => ({
          savedForLater: state.savedForLater.filter(
            (i) => !(i.id === productId && i.variant === variant)
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => get().items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0),

      getSubtotal: () =>
        get().items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0),

      getOriginalTotal: () =>
        get().items.reduce((sum, item) => sum + (Number(item.originalPrice || item.price) || 0) * (Number(item.quantity) || 1), 0),

      getDiscount: () => {
        const state = get();
        return Math.max(0, state.getOriginalTotal() - state.getSubtotal());
      },

      getDeliveryCharge: () => {
        const subtotal = get().getSubtotal();
        return subtotal >= 499 ? 0 : 40;
      },

      getTotal: () => {
        const state = get();
        return state.getSubtotal() + state.getDeliveryCharge();
      },

      appliedCoupon: null,
      couponDiscount: 0,

      applyCoupon: (code) => {
        const coupons = {
          SAVE10: { discount: 10, type: 'percent', maxDiscount: 500 },
          FLAT200: { discount: 200, type: 'flat' },
          WELCOME: { discount: 15, type: 'percent', maxDiscount: 1000 },
          COUPON20: { discount: 20, type: 'percent', maxDiscount: 2000 },
          SHOP500: { discount: 500, type: 'flat' },
        };
        const coupon = coupons[code.toUpperCase()];
        if (!coupon) return false;

        const subtotal = get().getSubtotal();
        let discount = 0;
        if (coupon.type === 'percent') {
          discount = Math.min((subtotal * coupon.discount) / 100, coupon.maxDiscount || Infinity);
        } else {
          discount = coupon.discount;
        }

        set({ appliedCoupon: code.toUpperCase(), couponDiscount: Math.round(discount) });
        return true;
      },

      removeCoupon: () => set({ appliedCoupon: null, couponDiscount: 0 }),

      getFinalTotal: () => {
        const state = get();
        return Math.max(0, state.getTotal() - state.couponDiscount);
      },

      isInCart: (productId) => get().items.some((item) => item.id === productId),
    }),
    { name: 'shopverse-cart' }
  )
);

export default useCartStore;

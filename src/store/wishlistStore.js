import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          if (state.items.some((i) => i.id === product.id)) return state;
          return { items: [...state.items, { ...product, addedAt: Date.now() }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== productId),
        }));
      },

      toggleItem: (product) => {
        if (get().isInWishlist(product.id)) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      isInWishlist: (productId) => get().items.some((i) => i.id === productId),

      getCount: () => get().items.length,

      clearWishlist: () => set({ items: [] }),
    }),
    { name: 'shopverse-wishlist' }
  )
);

export default useWishlistStore;

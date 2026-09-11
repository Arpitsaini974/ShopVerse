import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCompareStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          if (state.items.length >= 4) return state;
          if (state.items.some((i) => i.id === product.id)) return state;
          return { items: [...state.items, product] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== productId),
        }));
      },

      toggleItem: (product) => {
        if (get().isInCompare(product.id)) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      isInCompare: (productId) => get().items.some((i) => i.id === productId),

      getCount: () => get().items.length,

      clearCompare: () => set({ items: [] }),
    }),
    { name: 'shopverse-compare' }
  )
);

export default useCompareStore;

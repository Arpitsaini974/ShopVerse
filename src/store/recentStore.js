import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useRecentStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          const filtered = state.items.filter((i) => i.id !== product.id);
          const newItems = [{ id: product.id, viewedAt: Date.now() }, ...filtered].slice(0, 20);
          return { items: newItems };
        });
      },

      getRecentIds: () => get().items.map((i) => i.id),

      clearRecent: () => set({ items: [] }),
    }),
    { name: 'shopverse-recent' }
  )
);

export default useRecentStore;

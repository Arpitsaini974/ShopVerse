import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSearchStore = create(
  persist(
    (set, get) => ({
      recentSearches: [],
      popularSearches: [
        'iPhone 16', 'Laptop', 'Headphones', 'Running Shoes',
        'Saree', 'Watch', 'Air Purifier', 'Protein Powder',
      ],

      addRecentSearch: (query) => {
        if (!query.trim()) return;
        set((state) => {
          const filtered = state.recentSearches.filter((s) => s !== query);
          return { recentSearches: [query, ...filtered].slice(0, 10) };
        });
      },

      removeRecentSearch: (query) => {
        set((state) => ({
          recentSearches: state.recentSearches.filter((s) => s !== query),
        }));
      },

      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    { name: 'shopverse-search' }
  )
);

export default useSearchStore;

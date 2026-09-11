import { create } from 'zustand';

const useUIStore = create((set) => ({
  cartDrawerOpen: false,
  mobileMenuOpen: false,
  searchOpen: false,
  quickViewProduct: null,
  toasts: [],

  openCartDrawer: () => set({ cartDrawerOpen: true }),
  closeCartDrawer: () => set({ cartDrawerOpen: false }),
  toggleCartDrawer: () => set((s) => ({ cartDrawerOpen: !s.cartDrawerOpen })),

  openMobileMenu: () => set({ mobileMenuOpen: true }),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),

  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),

  openQuickView: (product) => set({ quickViewProduct: product }),
  closeQuickView: () => set({ quickViewProduct: null }),

  addToast: (toast) => {
    const id = Date.now();
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },

  removeToast: (id) => {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },
}));

export default useUIStore;

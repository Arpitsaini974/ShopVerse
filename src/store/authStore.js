import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      addresses: [
        {
          id: 1,
          name: 'Rahul Sharma',
          phone: '9876543210',
          address: '42, MG Road, Koramangala',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560034',
          type: 'Home',
          isDefault: true,
        },
      ],
      orders: [],

      login: (userData) => {
        set({
          user: userData,
          isLoggedIn: true,
        });
      },

      logout: () => {
        set({ user: null, isLoggedIn: false });
      },

      addAddress: (address) => {
        set((state) => ({
          addresses: [
            ...state.addresses,
            { ...address, id: Date.now() },
          ],
        }));
      },

      updateAddress: (id, address) => {
        set((state) => ({
          addresses: state.addresses.map((a) =>
            a.id === id ? { ...a, ...address } : a
          ),
        }));
      },

      removeAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== id),
        }));
      },

      setDefaultAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.map((a) => ({
            ...a,
            isDefault: a.id === id,
          })),
        }));
      },

      getDefaultAddress: () => get().addresses.find((a) => a.isDefault) || get().addresses[0],

      addOrder: (order) => {
        set((state) => ({
          orders: [{ ...order, id: `SV${Date.now()}`, createdAt: new Date().toISOString(), status: 'Order Placed' }, ...state.orders],
        }));
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, status } : o
          ),
        }));
      },
    }),
    { name: 'shopverse-auth' }
  )
);

export default useAuthStore;

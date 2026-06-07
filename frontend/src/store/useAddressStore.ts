import { create } from 'zustand';
import api from '@/api/axios';
import { useAuthStore } from './useAuthStore';

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface AddressState {
  addresses: Address[];
  isLoading: boolean;
  error: string | null;
  fetchAddresses: () => Promise<void>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
}

const mapApiAddressToFrontend = (addr: any): Address => {
  const user = useAuthStore.getState().user;
  return {
    id: addr.id,
    fullName: user ? `${user.firstName} ${user.lastName}`.trim() : 'Valued Customer',
    phone: user?.phone || '',
    addressLine1: addr.line1,
    addressLine2: addr.line2 || undefined,
    city: addr.city,
    state: addr.state,
    zipCode: addr.zipCode,
    country: addr.countryCode === 'IN' ? 'India' : addr.countryCode,
    isDefault: addr.isDefault
  };
};

export const useAddressStore = create<AddressState>((set, get) => ({
  addresses: [],
  isLoading: false,
  error: null,

  fetchAddresses: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/users/address');
      const apiAddresses = data.data || [];
      const mapped = apiAddresses.map(mapApiAddressToFrontend);
      set({ addresses: mapped, isLoading: false });
    } catch (err: any) {
      console.error('Failed to fetch addresses:', err);
      set({ isLoading: false, error: err.message });
    }
  },

  addAddress: async (addressInput) => {
    set({ isLoading: true, error: null });
    try {
      const payload = {
        line1: addressInput.addressLine1,
        line2: addressInput.addressLine2 || null,
        city: addressInput.city,
        state: addressInput.state,
        zipCode: addressInput.zipCode,
        countryCode: addressInput.country.toLowerCase() === 'india' ? 'IN' : addressInput.country.slice(0, 2).toUpperCase(),
        isDefault: addressInput.isDefault
      };
      await api.post('/users/address', payload);
      await get().fetchAddresses();
    } catch (err: any) {
      console.error('Failed to add address:', err);
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  updateAddress: async (id, addressInput) => {
    set({ isLoading: true, error: null });
    try {
      const payload: any = {};
      if (addressInput.addressLine1 !== undefined) payload.line1 = addressInput.addressLine1;
      if (addressInput.addressLine2 !== undefined) payload.line2 = addressInput.addressLine2 || null;
      if (addressInput.city !== undefined) payload.city = addressInput.city;
      if (addressInput.state !== undefined) payload.state = addressInput.state;
      if (addressInput.zipCode !== undefined) payload.zipCode = addressInput.zipCode;
      if (addressInput.country !== undefined) {
        payload.countryCode = addressInput.country.toLowerCase() === 'india' ? 'IN' : addressInput.country.slice(0, 2).toUpperCase();
      }
      if (addressInput.isDefault !== undefined) payload.isDefault = addressInput.isDefault;

      await api.put(`/users/address/${id}`, payload);
      await get().fetchAddresses();
    } catch (err: any) {
      console.error('Failed to update address:', err);
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  deleteAddress: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/users/address/${id}`);
      await get().fetchAddresses();
    } catch (err: any) {
      console.error('Failed to delete address:', err);
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  setDefaultAddress: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.put(`/users/address/${id}`, { isDefault: true });
      await get().fetchAddresses();
    } catch (err: any) {
      console.error('Failed to set default address:', err);
      set({ isLoading: false, error: err.message });
      throw err;
    }
  }
}));

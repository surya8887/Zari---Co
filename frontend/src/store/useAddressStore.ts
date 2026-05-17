import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const MOCK_ADDRESSES: Address[] = [
  {
    id: "addr-1",
    fullName: "Surya Prakash",
    phone: "+91 9876543210",
    addressLine1: "12, Royal Heritage Enclave",
    addressLine2: "Opposite Tanishq Showroom, Jayanagar",
    city: "Bengaluru",
    state: "Karnataka",
    zipCode: "560041",
    country: "India",
    isDefault: true
  }
];

export const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      addresses: MOCK_ADDRESSES,

      addAddress: (addressInput) => {
        set((state) => {
          const id = `addr-${Date.now()}`;
          const isDefault = state.addresses.length === 0 ? true : addressInput.isDefault;

          const updatedAddresses = state.addresses.map((a) => 
            isDefault ? { ...a, isDefault: false } : a
          );

          return {
            addresses: [...updatedAddresses, { ...addressInput, id, isDefault }]
          };
        });
      },

      updateAddress: (id, addressInput) => {
        set((state) => {
          const isSettingDefault = addressInput.isDefault;
          const updatedAddresses = state.addresses.map((a) => {
            if (a.id === id) {
              return { ...a, ...addressInput };
            }
            if (isSettingDefault) {
              return { ...a, isDefault: false };
            }
            return a;
          });
          return { addresses: updatedAddresses };
        });
      },

      deleteAddress: (id) => {
        set((state) => {
          const remaining = state.addresses.filter((a) => a.id !== id);
          if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
            remaining[0].isDefault = true;
          }
          return { addresses: remaining };
        });
      },

      setDefaultAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.map((a) => ({
            ...a,
            isDefault: a.id === id,
          })),
        }));
      },
    }),
    {
      name: 'zari-address-storage',
    }
  )
);

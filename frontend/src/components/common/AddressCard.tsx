import { ShieldCheck, Trash2 } from 'lucide-react';
import type { Address } from '@/store/useAddressStore';

interface AddressCardProps {
  address: Address;
  onDelete: (id: string) => void;
  onSetDefault?: (id: string) => void;
}

export const AddressCard = ({
  address,
  onDelete,
  onSetDefault,
}: AddressCardProps) => {
  return (
    <div
      className={`border rounded-2xl p-5 flex flex-col justify-between select-none ${
        address.isDefault
          ? 'border-blue-500 bg-blue-50/20 shadow-sm'
          : 'border-slate-100 hover:border-blue-300'
      }`}
    >
      <div className="text-xs">
        <div className="flex items-center justify-between border-b border-slate-50 pb-2 mb-3">
          <span className="font-extrabold text-slate-800">{address.fullName}</span>
          {address.isDefault && (
            <span className="bg-blue-600 text-white text-[7px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded">
              Default
            </span>
          )}
        </div>
        <p className="text-slate-500 leading-relaxed">{address.addressLine1}</p>
        <p className="text-slate-500">
          {address.city}, {address.state} - {address.zipCode}
        </p>
        <span className="block mt-2 font-bold text-slate-400">Phone: {address.phone}</span>
      </div>

      <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-4">
        {!address.isDefault && onSetDefault ? (
          <button
            type="button"
            onClick={() => onSetDefault(address.id)}
            className="text-[8px] font-bold uppercase tracking-widest text-blue-600 hover:underline cursor-pointer focus:outline-none"
          >
            Set Default
          </button>
        ) : (
          <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-700 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Active Address
          </span>
        )}

        <button
          type="button"
          onClick={() => onDelete(address.id)}
          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg cursor-pointer focus:outline-none"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
export default AddressCard;

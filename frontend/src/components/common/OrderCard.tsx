import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Order } from '@/store/useOrderStore';

interface OrderCardProps {
  order: Order;
}

export const OrderCard = ({ order }: OrderCardProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 border border-slate-100 rounded-2xl p-5 gap-4">
      <div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-extrabold text-slate-800 tracking-wider">
            {order.orderNumber}
          </span>
          <span className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-[8px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded">
            {order.status}
          </span>
        </div>
        <span className="text-[9px] text-slate-400 block mt-1">Placed on {order.createdAt}</span>
        <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
          {order.items.length} Diamond masterpieces
        </span>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
        <div>
          <span className="block text-[8px] uppercase tracking-widest text-slate-400 font-bold leading-none mb-1">
            Receipt Value
          </span>
          <span className="text-sm font-serif font-extrabold text-blue-600">
            ₹{order.grandTotal.toLocaleString('en-IN')}
          </span>
        </div>

        <Link
          to={`/orders/${order.id}`}
          className="h-9 border border-blue-200 hover:border-blue-600 text-blue-600 hover:bg-blue-50/50 px-4 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>Receipt Details</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
export default OrderCard;

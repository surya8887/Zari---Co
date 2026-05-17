import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { useAuth } from '@/hooks/useAuth';
import { useOrderStore } from '@/store/useOrderStore';
import { ArrowLeft, ShieldCheck, MapPin, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { getOrderById, selectedOrder } = useOrderStore();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warning("Please sign in to view this receipt.");
      navigate('/login');
      return;
    }

    if (id) {
      const ord = getOrderById(id);
      if (!ord) {
        toast.error("Order details not found!");
        navigate('/orders');
      }
    }
  }, [id, isAuthenticated, getOrderById, navigate]);

  if (!isAuthenticated || !selectedOrder) return null;

  const ord = selectedOrder;

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#2c221e]">
      <Header />

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Back Link */}
        <Link 
          to="/orders"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8b7355] hover:text-[#6e583e] mb-8 select-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Orders
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Columns: Receipt breakdown */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {/* Header info card */}
            <div className="bg-white border border-[#8b7355]/10 rounded-3xl p-6 shadow-sm">
              <div className="flex flex-wrap justify-between items-center gap-4 border-b border-neutral-100 pb-4 mb-4 select-none">
                <div>
                  <span className="block text-[8px] uppercase tracking-widest text-neutral-400 font-bold leading-none mb-1">Receipt ID</span>
                  <h3 className="text-xs font-extrabold text-[#4e3a24]">{ord.orderNumber}</h3>
                </div>
                <div>
                  <span className="block text-[8px] uppercase tracking-widest text-neutral-400 font-bold leading-none mb-1">Status</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[8px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full">{ord.status}</span>
                </div>
              </div>

              {/* Items listing */}
              <div className="flex flex-col gap-5 select-none">
                {ord.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center justify-between pb-4 border-b border-neutral-50 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-[#faf9f6] border border-neutral-100 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-xs">
                        <h4 className="font-bold text-[#4e3a24] line-clamp-1">{item.product.name}</h4>
                        <div className="text-[9px] text-[#8b7355] font-extrabold uppercase tracking-wider mt-0.5 flex gap-2">
                          <span>{item.product.category}</span>
                          {item.selectedSize && (
                            <>
                              <span>•</span>
                              <span>{item.selectedSize}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-neutral-700">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* BIS hallmarked security statement */}
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 select-none flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <h4 className="font-extrabold uppercase tracking-wider text-emerald-800 mb-1">BIS 916 Assured Quality Guarantee</h4>
                <p className="text-neutral-500 leading-relaxed">
                  Zari & Co guarantees that every diamond and solid gold masterpiece item included in this purchase receipt is certified, BIS Hallmarked, and fully backed by our lifetime exchange guidelines.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Tracking destinations */}
          <div className="flex flex-col gap-6 select-none">
            {/* Delivery address details */}
            <div className="bg-white border border-[#8b7355]/10 rounded-2xl p-5 shadow-sm">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#4e3a24] border-b border-neutral-100 pb-2.5 mb-3 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#8b7355]" />
                Shipping Destination
              </h4>
              <div className="text-[11px] font-sans text-neutral-600 leading-relaxed">
                <span className="font-extrabold text-[#4e3a24] block mb-1">{ord.shippingAddress.fullName}</span>
                <p>{ord.shippingAddress.addressLine1}</p>
                <p>{ord.shippingAddress.city}, {ord.shippingAddress.state} - {ord.shippingAddress.zipCode}</p>
                <span className="block mt-2 font-bold text-neutral-400">Phone: {ord.shippingAddress.phone}</span>
              </div>
            </div>

            {/* Payment method details */}
            <div className="bg-white border border-[#8b7355]/10 rounded-2xl p-5 shadow-sm">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#4e3a24] border-b border-neutral-100 pb-2.5 mb-3 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#8b7355]" />
                Billing Summary
              </h4>
              <div className="text-[11px] font-sans text-neutral-600 flex flex-col gap-2">
                <div className="flex justify-between">
                  <span>Method</span>
                  <span className="font-bold text-[#4e3a24]">{ord.paymentMethod}</span>
                </div>
                <div className="w-full h-px bg-neutral-100 my-1" />
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{ord.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {ord.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>- ₹{ord.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST Tax (3%)</span>
                  <span>₹{ord.tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{ord.shipping === 0 ? 'Free' : `₹${ord.shipping.toLocaleString('en-IN')}`}</span>
                </div>
                <div className="w-full h-px bg-neutral-100 my-1" />
                <div className="flex justify-between text-xs font-bold text-[#8b7355]">
                  <span>Total</span>
                  <span className="font-serif">₹{ord.grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetailPage;

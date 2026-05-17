import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { useAuth } from '@/hooks/useAuth';
import { useOrderStore } from '@/store/useOrderStore';
import { ClipboardList, Calendar, Truck, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { filteredOrders, pagination, setPage } = useOrderStore();

  // Guard route against non-authenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      toast.warning("Please sign in to view your order histories.");
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#2c221e]">
      <Header />

      <main className="container mx-auto px-6 py-12">
        {/* Editorial Header */}
        <div className="text-center mb-12 select-none">
          <p className="text-[#8b7355] font-bold uppercase tracking-[4px] text-[10px] mb-2.5">
            ✦ Purchases tracking ✦
          </p>
          <h2 className="text-3xl font-serif text-[#4e3a24] font-extrabold italic leading-none">
            Your Order History
          </h2>
          <div className="w-12 h-0.5 bg-[#8b7355]/40 mx-auto mt-4" />
        </div>

        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white border border-neutral-100 rounded-3xl py-20 px-6 text-center shadow-sm select-none">
            <ClipboardList className="w-16 h-16 text-[#8b7355]/25 mb-4" />
            <h3 className="text-base font-extrabold uppercase tracking-widest text-[#4e3a24] mb-2">
              No Orders Found
            </h3>
            <p className="text-xs text-neutral-400 max-w-xs mb-6">
              You haven't placed any jewelry orders with Zari & Co yet.
            </p>
            <Link
              to="/products"
              className="h-10 bg-[#8b7355] hover:bg-[#6e583e] text-white px-8 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center cursor-pointer shadow-sm"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto flex flex-col justify-between select-none">
            {/* Orders List */}
            <div className="flex flex-col gap-5">
              {filteredOrders.map((ord) => (
                <div 
                  key={ord.id}
                  className="bg-white border border-[#8b7355]/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-extrabold text-[#4e3a24] tracking-wider">
                        {ord.orderNumber}
                      </span>
                      <span className={`text-[8px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                        ord.status === 'Delivered' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : ord.status === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] text-neutral-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#8b7355]" />
                        {ord.createdAt}
                      </span>
                      <span className="w-px h-2.5 bg-neutral-200" />
                      <span className="flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-[#8b7355]" />
                        {ord.items.length} {ord.items.length === 1 ? 'Masterpiece' : 'Masterpieces'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                    <div className="text-left md:text-right">
                      <span className="block text-[8px] uppercase tracking-widest text-neutral-400 font-bold leading-none mb-1">Grand Value</span>
                      <span className="text-sm font-serif font-extrabold text-[#8b7355]">
                        ₹{ord.grandTotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <Link
                      to={`/orders/${ord.id}`}
                      className="h-9 border border-[#8b7355]/20 hover:border-[#8b7355] text-[#8b7355] hover:bg-[#8b7355]/5 px-4 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Receipt</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination panel */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  disabled={pagination.page === 1}
                  onClick={() => setPage(pagination.page - 1)}
                  className="h-9 px-4 rounded-lg border border-[#8b7355]/20 text-neutral-500 hover:border-[#8b7355] text-xs font-bold uppercase tracking-wider disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all"
                >
                  Prev
                </button>

                {Array.from({ length: pagination.totalPages }, (_, idx) => idx + 1).map((pNum) => (
                  <button
                    key={pNum}
                    onClick={() => setPage(pNum)}
                    className={`w-9 h-9 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      pagination.page === pNum
                        ? 'bg-[#8b7355] text-white'
                        : 'border border-neutral-100 hover:border-[#8b7355]/30 text-neutral-600'
                    }`}
                  >
                    {pNum}
                  </button>
                ))}

                <button
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => setPage(pagination.page + 1)}
                  className="h-9 px-4 rounded-lg border border-[#8b7355]/20 text-neutral-500 hover:border-[#8b7355] text-xs font-bold uppercase tracking-wider disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default OrdersPage;

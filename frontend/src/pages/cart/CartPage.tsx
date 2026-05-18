import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingBag, Trash2, Plus, Minus, Tag, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const CartPage = () => {
  const { items, updateQuantity, removeItem, appliedCoupon, applyCoupon, removeCoupon, getTotals } = useCartStore();
  const [couponCode, setCouponCode] = useState('');

  const totals = getTotals();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    const success = applyCoupon(couponCode);
    if (success) {
      toast.success(`Coupon code ${couponCode.toUpperCase()} applied successfully! 🏷️`);
      setCouponCode('');
    } else {
      toast.error("Invalid coupon code! Try 'GOLD10' or 'WELCOME5000'.");
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    toast.info("Coupon code removed.");
  };

  const handleQtyChange = (itemId: string, size: string | undefined, currentQty: number, change: number) => {
    updateQuantity(itemId, currentQty + change, size);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#2c221e]">
      <Header />

      <main className="container mx-auto px-6 py-12">
        {/* Page title */}
        <div className="text-center mb-12 select-none">
          <p className="text-[#8b7355] font-bold uppercase tracking-[4px] text-[10px] mb-2.5">
            ✦ Your Selection ✦
          </p>
          <h2 className="text-3xl font-serif text-[#4e3a24] font-extrabold italic leading-none">
            Shopping Bag
          </h2>
          <div className="w-12 h-0.5 bg-[#8b7355]/40 mx-auto mt-4" />
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white border border-neutral-100 rounded-3xl py-20 px-6 text-center shadow-sm select-none">
            <ShoppingBag className="w-16 h-16 text-[#8b7355]/25 mb-4 animate-bounce" />
            <h3 className="text-base font-extrabold uppercase tracking-widest text-[#4e3a24] mb-2">
              Your Bag Is Empty
            </h3>
            <p className="text-xs text-neutral-400 max-w-xs mb-6">
              You haven't added any luxury creations to your collection yet.
            </p>
            <Link
              to="/products"
              className="h-10 bg-[#8b7355] hover:bg-[#6e583e] text-white px-8 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center cursor-pointer shadow-sm"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {items.map((item, idx) => (
                <div 
                  key={`${item.product.id}-${item.selectedSize || idx}`} 
                  className="bg-white border border-[#8b7355]/10 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col sm:flex-row items-center gap-5 justify-between"
                >
                  {/* Thumbnail & Title */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-20 h-20 bg-[#faf9f6] rounded-xl border border-neutral-100 overflow-hidden flex-shrink-0">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#8b7355] block mb-1">
                        {item.product.category}
                      </span>
                      <Link 
                        to={`/products/${item.product.slug}`}
                        className="text-xs font-bold text-[#4e3a24] hover:text-[#8b7355] transition-colors leading-tight block mb-1"
                      >
                        {item.product.name}
                      </Link>
                      <div className="text-[10px] text-neutral-400 flex items-center gap-3 select-none">
                        <span>SKU: {item.product.sku}</span>
                        {item.selectedSize && (
                          <>
                            <span className="w-px h-2.5 bg-neutral-200" />
                            <span>Size: {item.selectedSize}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Actions */}
                  <div className="flex items-center gap-3 select-none">
                    <button
                      onClick={() => handleQtyChange(item.product.id, item.selectedSize, item.quantity, -1)}
                      className="p-1.5 rounded-lg border border-neutral-100 hover:border-[#8b7355]/30 text-neutral-500 hover:text-neutral-700 active:scale-95 cursor-pointer transition-all"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold w-6 text-center text-[#4e3a24]">{item.quantity}</span>
                    <button
                      onClick={() => handleQtyChange(item.product.id, item.selectedSize, item.quantity, 1)}
                      className="p-1.5 rounded-lg border border-neutral-100 hover:border-[#8b7355]/30 text-neutral-500 hover:text-neutral-700 active:scale-95 cursor-pointer transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Item Pricing & Delete */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                    <div className="text-right">
                      <span className="block text-xs font-extrabold text-[#4e3a24]">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-[9px] text-neutral-400 block mt-0.5">
                          ₹{item.product.price.toLocaleString('en-IN')} each
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        removeItem(item.product.id, item.selectedSize);
                        toast.info(`Removed ${item.product.name} from bag.`);
                      }}
                      className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Pricing calculations */}
            <div className="flex flex-col gap-6">
              
              {/* Order checkout summary */}
              <div className="bg-white border border-[#8b7355]/15 rounded-3xl p-6 shadow-sm select-none">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#4e3a24] border-b border-neutral-100 pb-3 mb-4">
                  Order Summary
                </h3>

                <div className="flex flex-col gap-3.5 text-xs font-sans">
                  <div className="flex justify-between text-neutral-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-neutral-700">₹{totals.subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {totals.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Discount {appliedCoupon ? `(${appliedCoupon.code})` : ''}</span>
                      <span>- ₹{totals.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-500">
                    <span>GST Tax (3% GST)</span>
                    <span className="font-semibold text-neutral-700">₹{totals.tax.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between text-neutral-500 pb-3.5 border-b border-neutral-100">
                    <span>Insured Shipping</span>
                    {totals.shipping === 0 ? (
                      <span className="text-emerald-600 font-bold uppercase tracking-wider text-[9px] mt-0.5">Free</span>
                    ) : (
                      <span className="font-semibold text-neutral-700">₹{totals.shipping.toLocaleString('en-IN')}</span>
                    )}
                  </div>

                  <div className="flex justify-between text-sm font-extrabold text-[#4e3a24] pt-2">
                    <span>Grand Total</span>
                    <span className="text-base text-[#8b7355] font-serif font-bold">₹{totals.grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Checkout Link button */}
                <Link
                  to="/checkout"
                  className="w-full h-11 bg-[#8b7355] hover:bg-[#6e583e] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md mt-6 active:scale-98"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Coupon inputs */}
              <div className="bg-white border border-[#8b7355]/10 rounded-2xl p-5 shadow-sm">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-800">
                    <div className="flex items-center gap-2 select-none">
                      <Tag className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="block font-bold leading-none">{appliedCoupon.code}</span>
                        <span className="text-[9px] text-emerald-600 block mt-0.5">
                          {appliedCoupon.discountType === 'percentage' 
                            ? `${appliedCoupon.discountValue}% discount applied` 
                            : `₹${appliedCoupon.discountValue.toLocaleString('en-IN')} off applied`}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={handleRemoveCoupon}
                      className="text-[9px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter Coupon (GOLD10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="bg-[#faf9f6] border border-[#8b7355]/20 rounded-lg text-xs px-3 py-2 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#8b7355] w-full uppercase tracking-wider"
                    />
                    <button 
                      type="submit" 
                      className="bg-[#8b7355] hover:bg-[#6e583e] text-white text-[10px] font-bold uppercase tracking-wider px-4 rounded-lg cursor-pointer transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;

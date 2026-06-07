import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { useAuth } from '@/hooks/useAuth';
import { useCartStore } from '@/store/useCartStore';
import { useAddressStore } from '@/store/useAddressStore';
import { useOrderStore } from '@/store/useOrderStore';
import { CreditCard, Wallet, Landmark, Lock, ShieldCheck, MapPin, Plus } from 'lucide-react';
import { toast } from 'sonner';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { items, getTotals, clearCart } = useCartStore();
  const { addresses, fetchAddresses } = useAddressStore();
  const { placeOrder } = useOrderStore();

  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  // Address creation form states (For quick address addition during checkout if none exists)
  const { addAddress } = useAddressStore();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddressLine1, setNewAddressLine1] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newZipCode, setNewZipCode] = useState('');

  // 1. Guard against non-authenticated users and load addresses
  useEffect(() => {
    if (!isAuthenticated) {
      toast.warning("Please sign in to configure your checkout securely.");
      navigate('/login');
    } else {
      fetchAddresses();
    }
  }, [isAuthenticated, navigate, fetchAddresses]);

  // 2. Set default selected address
  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddressId(defaultAddr.id);
    }
  }, [addresses]);

  // 3. Guard against empty cart
  useEffect(() => {
    if (items.length === 0 && !isProcessing) {
      toast.error("Your Shopping Bag is empty!");
      navigate('/cart');
    }
  }, [items, navigate, isProcessing]);

  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  const totals = getTotals();
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  const handleQuickAddressAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newPhone || !newAddressLine1 || !newCity || !newState || !newZipCode) {
      toast.warning("Please complete all required shipping fields.");
      return;
    }

    addAddress({
      fullName: newFullName,
      phone: newPhone,
      addressLine1: newAddressLine1,
      city: newCity,
      state: newState,
      zipCode: newZipCode,
      country: 'India',
      isDefault: true,
    });

    toast.success("Shipping address registered successfully! 📍");
    setShowAddressForm(false);
    
    // Clear forms
    setNewFullName('');
    setNewPhone('');
    setNewAddressLine1('');
    setNewCity('');
    setNewState('');
    setNewZipCode('');
  };

  const handleCheckoutSubmit = () => {
    if (!selectedAddress) {
      toast.warning("Please configure your delivery destination address.");
      return;
    }

    setIsProcessing(true);
    toast.loading("Securing gateway connection... 🔒");

    // Mock transaction duration (1.5s)
    setTimeout(() => {
      placeOrder({
        items,
        shippingAddress: selectedAddress,
        paymentMethod: paymentMethod === 'card' 
          ? 'Credit Card' 
          : paymentMethod === 'upi' 
            ? 'UPI Transfer' 
            : 'Net Banking',
        subtotal: totals.subtotal,
        discount: totals.discount,
        tax: totals.tax,
        shipping: totals.shipping,
        grandTotal: totals.grandTotal,
      });

      // Clear the cart
      clearCart();

      toast.dismiss();
      toast.success("Order Placed Successfully! ✦", {
        description: "Your receipt and invoice are generated.",
      });
      setIsProcessing(false);
      navigate('/orders');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#2c221e]">
      <Header />

      <main className="container mx-auto px-6 py-12">
        {/* Editorial Title */}
        <div className="text-center mb-12 select-none">
          <p className="text-[#8b7355] font-bold uppercase tracking-[4px] text-[10px] mb-2.5">
            ✦ Secured Checkout Gate ✦
          </p>
          <h2 className="text-3xl font-serif text-[#4e3a24] font-extrabold italic leading-none">
            Secure Checkout
          </h2>
          <div className="w-12 h-0.5 bg-[#8b7355]/40 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Forms and selectors */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* 1. Shipping Address Selector */}
            <div className="bg-white border border-[#8b7355]/10 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3.5 mb-5 select-none">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#4e3a24] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#8b7355]" />
                  Shipping Destination
                </h3>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="text-[10px] font-bold uppercase tracking-wider text-[#8b7355] hover:text-[#6e583e] flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Address
                </button>
              </div>

              {showAddressForm ? (
                <form onSubmit={handleQuickAddressAdd} className="flex flex-col gap-4 bg-[#faf9f6] p-5 rounded-2xl border border-dashed border-[#8b7355]/20 mb-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400 block mb-1.5">Full Name</label>
                      <input
                        type="text"
                        required
                        value={newFullName}
                        onChange={(e) => setNewFullName(e.target.value)}
                        placeholder="E.g. Surya Prakash"
                        className="w-full bg-white border border-[#8b7355]/20 rounded-lg p-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#8b7355]"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400 block mb-1.5">Contact Number</label>
                      <input
                        type="tel"
                        required
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder="E.g. +91 98765 43210"
                        className="w-full bg-white border border-[#8b7355]/20 rounded-lg p-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#8b7355]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400 block mb-1.5">Address Details (Street, Building)</label>
                    <input
                      type="text"
                      required
                      value={newAddressLine1}
                      onChange={(e) => setNewAddressLine1(e.target.value)}
                      placeholder="E.g. Flat 101, Prestige Heights"
                      className="w-full bg-white border border-[#8b7355]/20 rounded-lg p-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#8b7355]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400 block mb-1.5">City</label>
                      <input
                        type="text"
                        required
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        placeholder="E.g. Bengaluru"
                        className="w-full bg-white border border-[#8b7355]/20 rounded-lg p-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#8b7355]"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400 block mb-1.5">State</label>
                      <input
                        type="text"
                        required
                        value={newState}
                        onChange={(e) => setNewState(e.target.value)}
                        placeholder="E.g. Karnataka"
                        className="w-full bg-white border border-[#8b7355]/20 rounded-lg p-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#8b7355]"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400 block mb-1.5">Zip Code</label>
                      <input
                        type="text"
                        required
                        value={newZipCode}
                        onChange={(e) => setNewZipCode(e.target.value)}
                        placeholder="E.g. 560041"
                        className="w-full bg-white border border-[#8b7355]/20 rounded-lg p-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#8b7355]"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end mt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-4 py-2 text-neutral-500 hover:text-neutral-700 text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#8b7355] hover:bg-[#6e583e] text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Register Address
                    </button>
                  </div>
                </form>
              ) : null}

              {addresses.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-[#8b7355]/25 rounded-2xl select-none">
                  <p className="text-xs text-neutral-400 italic mb-4">No shipping addresses configured yet.</p>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="h-9 bg-[#8b7355] hover:bg-[#6e583e] text-white px-6 rounded-lg text-[10px] font-bold uppercase tracking-widest cursor-pointer"
                  >
                    Add Shipping Address
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 select-none">
                  {addresses.map((addr) => (
                    <label 
                      key={addr.id}
                      className={`border rounded-2xl p-4 flex items-start gap-4 cursor-pointer transition-all duration-300 ${
                        selectedAddressId === addr.id
                          ? 'border-[#8b7355] bg-[#faf9f6]/40 shadow-sm'
                          : 'border-neutral-100 hover:border-[#8b7355]/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingAddress"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 accent-[#8b7355]"
                      />
                      <div className="text-xs font-sans">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#4e3a24]">{addr.fullName}</span>
                          {addr.isDefault && (
                            <span className="bg-[#8b7355]/10 text-[#8b7355] text-[7px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded">Default</span>
                          )}
                        </div>
                        <p className="text-neutral-500 mt-1 leading-relaxed">{addr.addressLine1}, {addr.addressLine2 ? `${addr.addressLine2}, ` : ''}{addr.city}, {addr.state} - {addr.zipCode}</p>
                        <span className="text-[10px] text-neutral-400 block mt-1.5 font-bold">Contact: {addr.phone}</span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Secured Payment Selection Panel */}
            <div className="bg-white border border-[#8b7355]/10 rounded-3xl p-6 shadow-sm select-none">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#4e3a24] border-b border-neutral-100 pb-3.5 mb-5 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#8b7355]" />
                Secured Payment Gateway
              </h3>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'card', icon: <CreditCard className="w-5 h-5" />, label: 'Credit Card' },
                  { id: 'upi', icon: <Wallet className="w-5 h-5" />, label: 'UPI / Wallet' },
                  { id: 'banking', icon: <Landmark className="w-5 h-5" />, label: 'Net Banking' },
                ].map((pay) => (
                  <button
                    key={pay.id}
                    type="button"
                    onClick={() => setPaymentMethod(pay.id)}
                    className={`border rounded-2xl p-4 flex flex-col items-center gap-2 text-center transition-all cursor-pointer ${
                      paymentMethod === pay.id
                        ? 'border-[#8b7355] bg-[#faf9f6]/40 text-[#8b7355] shadow-sm font-semibold'
                        : 'border-neutral-100 text-neutral-400 hover:border-[#8b7355]/20 hover:text-neutral-600'
                    }`}
                  >
                    {pay.icon}
                    <span className="text-[10px] uppercase tracking-wider">{pay.label}</span>
                  </button>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <div className="mt-6 flex flex-col gap-4 bg-[#faf9f6] p-5 rounded-2xl border border-neutral-100 max-w-md">
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400 block mb-1">Card Number</label>
                    <input
                      type="text"
                      disabled
                      placeholder="**** **** **** 9481  (Saved Card)"
                      className="w-full bg-neutral-100/50 border border-neutral-200 rounded-lg p-2.5 text-xs text-neutral-500 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400 block mb-1">Expiry Date</label>
                      <input
                        type="text"
                        disabled
                        placeholder="08 / 2030"
                        className="w-full bg-neutral-100/50 border border-neutral-200 rounded-lg p-2.5 text-xs text-neutral-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400 block mb-1">CVV Code</label>
                      <input
                        type="password"
                        placeholder="***"
                        disabled
                        className="w-full bg-neutral-100/50 border border-neutral-200 rounded-lg p-2.5 text-xs text-neutral-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="mt-6 bg-[#faf9f6] p-4 rounded-xl border border-neutral-100 max-w-md text-xs text-neutral-500 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Securely request UPI connection via registered phone number.</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Checkout Pricing list */}
          <div className="flex flex-col gap-6 select-none">
            <div className="bg-white border border-[#8b7355]/15 rounded-3xl p-6 shadow-sm">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#4e3a24] border-b border-neutral-100 pb-3 mb-4">
                Order Review
              </h3>

              {/* Items Summary list */}
              <div className="flex flex-col gap-3.5 mb-5 max-h-[220px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center text-xs">
                    <div className="flex flex-col">
                      <span className="font-bold text-neutral-800 line-clamp-1">{item.product.name}</span>
                      <span className="text-[9px] text-neutral-400 mt-0.5">Qty: {item.quantity} {item.selectedSize ? `| ${item.selectedSize}` : ''}</span>
                    </div>
                    <span className="font-semibold text-neutral-700">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              {/* Pricing breakdown */}
              <div className="flex flex-col gap-3.5 text-xs font-sans pt-4 border-t border-neutral-100">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-700">₹{totals.subtotal.toLocaleString('en-IN')}</span>
                </div>

                {totals.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>- ₹{totals.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-500">
                  <span>GST Tax (3%)</span>
                  <span className="font-semibold text-neutral-700">₹{totals.tax.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-neutral-500 pb-3.5 border-b border-neutral-100">
                  <span>Shipping</span>
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

              {/* Place Order triggers */}
              <button
                disabled={isProcessing}
                onClick={handleCheckoutSubmit}
                className="w-full h-11 bg-[#8b7355] hover:bg-[#6e583e] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md mt-6 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]"
              >
                {isProcessing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Transaction...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Pay & Place Order</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;

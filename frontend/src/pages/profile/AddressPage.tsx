import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { useAuth } from '@/hooks/useAuth';
import { useAddressStore } from '@/store/useAddressStore';
import { MapPin, Plus, Trash2, User, ClipboardList, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const AddressPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { addresses, addAddress, deleteAddress, setDefaultAddress } = useAddressStore();

  const [showForm, setShowForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  // Guard routing against non-authenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      toast.warning("Please sign in to view your addresses.");
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) return null;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !addressLine1 || !city || !state || !zipCode) {
      toast.warning("Please fill out all required fields.");
      return;
    }

    addAddress({
      fullName,
      phone,
      addressLine1,
      city,
      state,
      zipCode,
      country: 'India',
      isDefault: false,
    });

    toast.success("New shipping address added successfully! 📍");
    setShowForm(false);
    
    // Clear forms
    setFullName('');
    setPhone('');
    setAddressLine1('');
    setCity('');
    setState('');
    setZipCode('');
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#2c221e]">
      <Header />

      <main className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Left Sidebar Account Navigation */}
          <div className="md:col-span-1 bg-white border border-[#8b7355]/15 rounded-3xl p-5 shadow-sm h-fit select-none">
            <div className="flex flex-col items-center text-center pb-6 border-b border-neutral-100 mb-6">
              <div className="w-16 h-16 bg-[#faf9f6] border border-[#8b7355]/20 rounded-full flex items-center justify-center mb-3">
                <User className="w-8 h-8 text-[#8b7355]" />
              </div>
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#4e3a24]">
                {user.firstName} {user.lastName}
              </h3>
              <span className="text-[9px] text-[#8b7355] font-extrabold uppercase tracking-widest bg-[#8b7355]/10 px-2 py-0.5 rounded-full mt-1.5">
                {user.role} Member
              </span>
            </div>

            <div className="flex flex-col gap-2 text-xs font-extrabold uppercase tracking-wider">
              <Link 
                to="/profile" 
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-transparent text-neutral-500 hover:bg-[#faf9f6] hover:text-[#8b7355] transition-colors"
              >
                <User className="w-4 h-4 text-[#8b7355]" />
                <span>Profile Info</span>
              </Link>

              <Link 
                to="/addresses" 
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#8b7355] text-white"
              >
                <MapPin className="w-4 h-4" />
                <span>My Addresses</span>
              </Link>

              <Link 
                to="/orders" 
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-transparent text-neutral-500 hover:bg-[#faf9f6] hover:text-[#8b7355] transition-colors"
              >
                <ClipboardList className="w-4 h-4 text-[#8b7355]" />
                <span>My Orders</span>
              </Link>
            </div>
          </div>

          {/* Right Addresses Details Grid */}
          <div className="md:col-span-3 bg-white border border-[#8b7355]/10 rounded-3xl p-8 shadow-sm">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3.5 mb-6 select-none">
              <h3 className="text-base font-extrabold uppercase tracking-widest text-[#4e3a24]">
                Shipping Addresses
              </h3>
              <button
                onClick={() => setShowForm(!showForm)}
                className="text-[10px] font-bold uppercase tracking-widest text-[#8b7355] hover:text-[#6e583e] flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add New Address
              </button>
            </div>

            {/* Form */}
            {showForm && (
              <form onSubmit={handleAddressSubmit} className="flex flex-col gap-4 bg-[#faf9f6] p-5 rounded-2xl border border-dashed border-[#8b7355]/20 mb-6 select-none">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400 block mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="E.g. Surya Prakash"
                      className="w-full bg-white border border-[#8b7355]/20 rounded-lg p-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#8b7355]"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400 block mb-1.5">Contact Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
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
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
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
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="E.g. Bengaluru"
                      className="w-full bg-white border border-[#8b7355]/20 rounded-lg p-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#8b7355]"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400 block mb-1.5">State</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="E.g. Karnataka"
                      className="w-full bg-white border border-[#8b7355]/20 rounded-lg p-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#8b7355]"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400 block mb-1.5">Zip Code</label>
                    <input
                      type="text"
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="E.g. 560041"
                      className="w-full bg-white border border-[#8b7355]/20 rounded-lg p-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#8b7355]"
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-neutral-500 hover:text-neutral-700 text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#8b7355] hover:bg-[#6e583e] text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Add Address
                  </button>
                </div>
              </form>
            )}

            {/* Addresses Grid list */}
            {addresses.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-[#8b7355]/20 rounded-2xl select-none">
                <MapPin className="w-10 h-10 text-[#8b7355]/20 mx-auto mb-3" />
                <p className="text-xs text-neutral-400 italic mb-4">No shipping addresses configured yet.</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="h-9 bg-[#8b7355] hover:bg-[#6e583e] text-white px-6 rounded-lg text-[10px] font-bold uppercase tracking-widest cursor-pointer"
                >
                  Add Your First Address
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div 
                    key={addr.id}
                    className={`border rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 select-none ${
                      addr.isDefault 
                        ? 'border-[#8b7355] bg-[#faf9f6]/35 shadow-sm'
                        : 'border-neutral-100 hover:border-[#8b7355]/20'
                    }`}
                  >
                    <div className="text-xs font-sans">
                      <div className="flex items-center justify-between gap-2 border-b border-neutral-50 pb-2 mb-3.5">
                        <span className="font-extrabold text-[#4e3a24]">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="bg-[#8b7355] text-white text-[7px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded shadow-sm">Default</span>
                        )}
                      </div>
                      <p className="text-neutral-500 leading-relaxed">{addr.addressLine1}</p>
                      <p className="text-neutral-500">{addr.city}, {addr.state} - {addr.zipCode}</p>
                      <span className="block mt-2 font-bold text-neutral-400">Phone: {addr.phone}</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-neutral-50 pt-3 mt-4">
                      {!addr.isDefault ? (
                        <button
                          onClick={() => {
                            setDefaultAddress(addr.id);
                            toast.success("Default address updated successfully! ✨");
                          }}
                          className="text-[8px] font-bold uppercase tracking-widest text-[#8b7355] hover:text-[#6e583e] cursor-pointer"
                        >
                          Set Default
                        </button>
                      ) : (
                        <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-700 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          Default Delivery
                        </span>
                      )}

                      <button
                        onClick={() => {
                          deleteAddress(addr.id);
                          toast.info("Shipping address deleted.");
                        }}
                        className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                        title="Delete Address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddressPage;

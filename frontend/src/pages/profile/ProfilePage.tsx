import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { useAuth } from '@/hooks/useAuth';
import { useAddressStore } from '@/store/useAddressStore';
import { useOrderStore } from '@/store/useOrderStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { 
  User, Mail, Phone, ShieldCheck, MapPin, ClipboardList, 
  CreditCard, Bell, Plus, Trash2, Edit2, Check, ArrowRight, ShoppingBag
} from 'lucide-react';
import { toast } from 'sonner';

type ActiveTab = 'dashboard' | 'details' | 'addresses' | 'orders' | 'preferences';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  // Zustand Stores
  const { addresses, addAddress, deleteAddress, setDefaultAddress } = useAddressStore();
  const { orders } = useOrderStore();
  const { items: wishlistItems, toggleWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  // Tab Selection
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Form State: Edit Profile Info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [isEditingInfo, setIsEditingInfo] = useState(false);

  // Form State: Add Address
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addrFullName, setAddrFullName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrLine1, setAddrLine1] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrZip, setAddrZip] = useState('');

  // Preference Settings States
  const [optSMSNotifications, setOptSMSNotifications] = useState(true);
  const [optEmailReceipts, setOptEmailReceipts] = useState(true);
  const [optSavedCards, setOptSavedCards] = useState(false);

  // 1. Guard against non-authenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      toast.warning("Please sign in to configure your personal preferences.");
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // 2. Pre-fill details
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  if (!isAuthenticated || !user) return null;

  const handleUpdateInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !phone) {
      toast.warning("Please fill out all personal fields.");
      return;
    }

    toast.loading("Recording changes... ✦");
    setTimeout(() => {
      toast.dismiss();
      setIsEditingInfo(false);
      toast.success("Personal details updated successfully! ✨");
    }, 800);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrFullName || !addrPhone || !addrLine1 || !addrCity || !addrState || !addrZip) {
      toast.warning("Please complete all shipping address fields.");
      return;
    }

    addAddress({
      fullName: addrFullName,
      phone: addrPhone,
      addressLine1: addrLine1,
      city: addrCity,
      state: addrState,
      zipCode: addrZip,
      country: 'India',
      isDefault: addresses.length === 0,
    });

    toast.success("Address added successfully! 📍");
    setShowAddressForm(false);
    
    // Clear fields
    setAddrFullName('');
    setAddrPhone('');
    setAddrLine1('');
    setAddrCity('');
    setAddrState('');
    setAddrZip('');
  };

  const handleWishlistMoveToBag = (prod: any) => {
    addItem(prod, 1);
    toggleWishlist(prod);
    toast.success(`Moved ${prod.name} to your Shopping Bag! ✦`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column: Customer Card and Tab Navigation */}
          <div className="lg:col-span-1 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm h-fit select-none">
            <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100 mb-6">
              <div className="w-16 h-16 bg-blue-50/70 border border-blue-200 rounded-full flex items-center justify-center mb-3">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-800">
                {firstName} {lastName}
              </h3>
              <span className="text-[9px] text-blue-600 font-extrabold uppercase tracking-widest bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mt-2.5">
                {user.role} Member
              </span>
            </div>

            {/* Sidebar Tabs */}
            <div className="flex flex-col gap-1.5 text-xs font-extrabold uppercase tracking-wider">
              {[
                { id: 'dashboard', label: 'Dashboard Overview', icon: <User className="w-4 h-4" /> },
                { id: 'details', label: 'Personal Details', icon: <Edit2 className="w-4 h-4" /> },
                { id: 'addresses', label: 'Address Manager', icon: <MapPin className="w-4 h-4" /> },
                { id: 'orders', label: 'Order History', icon: <ClipboardList className="w-4 h-4" /> },
                { id: 'preferences', label: 'Preferences & Notifications', icon: <Bell className="w-4 h-4" /> },
              ].map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as ActiveTab)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left cursor-pointer transition-all duration-300 ${
                      active
                        ? 'bg-blue-50 text-blue-700 font-extrabold border-l-4 border-blue-600 border-slate-200'
                        : 'border-transparent text-slate-400 hover:bg-slate-50 hover:text-blue-600'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Tab Panels */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* 1. Dashboard Overview Tab */}
            {activeTab === 'dashboard' && (
              <div className="flex flex-col gap-6">
                
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm select-none">
                    <span className="text-[9px] uppercase tracking-widest font-extrabold text-slate-400 block mb-1">Total Orders</span>
                    <span className="text-xl font-bold font-serif text-slate-800">{orders.length} Placed</span>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm select-none">
                    <span className="text-[9px] uppercase tracking-widest font-extrabold text-slate-400 block mb-1">Saved Wishlist</span>
                    <span className="text-xl font-bold font-serif text-slate-800">{wishlistItems.length} Gems</span>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm select-none">
                    <span className="text-[9px] uppercase tracking-widest font-extrabold text-slate-400 block mb-1">Default Address</span>
                    <span className="text-[11px] font-bold text-slate-500 line-clamp-1 block mt-1">
                      {addresses.find((a) => a.isDefault)?.city || 'None Registered'}
                    </span>
                  </div>
                </div>

                {/* Personal summary card */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-2xl">
                      <ShieldCheck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Security Credentials Verified</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Phone contact: {phone || 'Not registered'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('details')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    Configure Settings
                  </button>
                </div>

                {/* Recent Orders log */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-800 border-b border-slate-50 pb-3 mb-4 select-none">
                    Recent Orders Summary
                  </h3>

                  {orders.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400 italic">No historical orders found.</div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {orders.slice(0, 2).map((ord) => (
                        <div key={ord.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <div>
                            <span className="block text-[10px] font-extrabold text-slate-600">{ord.orderNumber}</span>
                            <span className="text-[9px] text-slate-400 block mt-0.5">{ord.createdAt}</span>
                          </div>
                          <div className="text-right">
                            <span className="block text-xs font-bold text-slate-800">₹{ord.grandTotal.toLocaleString('en-IN')}</span>
                            <span className="text-[8px] uppercase tracking-widest text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded mt-1 inline-block">{ord.status}</span>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => setActiveTab('orders')}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 justify-center mt-2 cursor-pointer"
                      >
                        View All Orders History
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Wishlist quick carousels */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-800 border-b border-slate-50 pb-3 mb-4 select-none">
                    Wishlist Shortcut Vault
                  </h3>

                  {wishlistItems.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400 italic">
                      Your vault is currently empty.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-4">
                      {wishlistItems.slice(0, 3).map((prod) => (
                        <div key={prod.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex flex-col justify-between items-center text-center">
                          <img src={prod.image} alt={prod.name} className="w-12 h-12 object-cover rounded-lg mb-2" />
                          <h4 className="text-[10px] font-bold text-slate-700 line-clamp-1">{prod.name}</h4>
                          <span className="text-[10px] text-blue-600 font-semibold block mt-1">₹{prod.price.toLocaleString('en-IN')}</span>
                          <button
                            onClick={() => handleWishlistMoveToBag(prod)}
                            className="mt-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-1.5 cursor-pointer text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>Add Bag</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. Personal Details Edit Tab */}
            {activeTab === 'details' && (
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center border-b border-slate-50 pb-3 mb-5 select-none">
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-800">
                    Personal Details Card
                  </h3>
                  {!isEditingInfo && (
                    <button
                      onClick={() => setIsEditingInfo(true)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit Info
                    </button>
                  )}
                </div>

                <form onSubmit={handleUpdateInfo} className="flex flex-col gap-5 max-w-xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1.5">First Name</label>
                      <input
                        type="text"
                        disabled={!isEditingInfo}
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={`w-full border rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none ${
                          isEditingInfo 
                            ? 'bg-slate-50 border-blue-300 focus:border-blue-500' 
                            : 'bg-neutral-100/50 border-neutral-200 cursor-not-allowed text-slate-500'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1.5">Last Name</label>
                      <input
                        type="text"
                        disabled={!isEditingInfo}
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className={`w-full border rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none ${
                          isEditingInfo 
                            ? 'bg-slate-50 border-blue-300 focus:border-blue-500' 
                            : 'bg-neutral-100/50 border-neutral-200 cursor-not-allowed text-slate-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-blue-600" />
                      Verified Email Address
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full bg-neutral-100/50 border border-neutral-200 rounded-xl p-2.5 text-xs text-slate-400 cursor-not-allowed focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      disabled={!isEditingInfo}
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full border rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none ${
                        isEditingInfo 
                          ? 'bg-slate-50 border-blue-300 focus:border-blue-500' 
                          : 'bg-neutral-100/50 border-neutral-200 cursor-not-allowed text-slate-500'
                      }`}
                    />
                  </div>

                  {isEditingInfo && (
                    <div className="flex gap-3 mt-3 select-none">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingInfo(false);
                          setFirstName(user.firstName || '');
                          setLastName(user.lastName || '');
                          setPhone(user.phone || '');
                        }}
                        className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-500 hover:bg-slate-50 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm"
                      >
                        <Check className="w-4 h-4" />
                        Save Changes
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* 3. Address Management Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center border-b border-slate-50 pb-3 mb-5 select-none">
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-800">
                    Address Management Section
                  </h3>
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New Delivery
                  </button>
                </div>

                {/* Form */}
                {showAddressForm && (
                  <form onSubmit={handleAddAddress} className="flex flex-col gap-4 bg-slate-50 p-5 rounded-2xl border border-dashed border-blue-200 mb-6 select-none animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1.5">Recipient Full Name</label>
                        <input
                          type="text"
                          required
                          value={addrFullName}
                          onChange={(e) => setAddrFullName(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1.5">Contact phone</label>
                        <input
                          type="tel"
                          required
                          value={addrPhone}
                          onChange={(e) => setAddrPhone(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1.5">Address Details (Street, Building)</label>
                      <input
                        type="text"
                        required
                        value={addrLine1}
                        onChange={(e) => setAddrLine1(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1.5">City</label>
                        <input
                          type="text"
                          required
                          value={addrCity}
                          onChange={(e) => setAddrCity(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1.5">State</label>
                        <input
                          type="text"
                          required
                          value={addrState}
                          onChange={(e) => setAddrState(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1.5">Zip Code</label>
                        <input
                          type="text"
                          required
                          value={addrZip}
                          onChange={(e) => setAddrZip(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end mt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="px-4 py-2 text-slate-500 hover:text-slate-700 text-xs font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Add Shipping Address
                      </button>
                    </div>
                  </form>
                )}

                {/* List */}
                {addresses.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl select-none">
                    <p className="text-xs text-slate-400 italic mb-4">No shipping addresses found.</p>
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="h-9 bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl text-[10px] font-bold uppercase tracking-widest cursor-pointer"
                    >
                      Add Shipping Destination
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div 
                        key={addr.id}
                        className={`border rounded-2xl p-5 flex flex-col justify-between select-none ${
                          addr.isDefault 
                            ? 'border-blue-500 bg-blue-50/20 shadow-sm'
                            : 'border-slate-100 hover:border-blue-300'
                        }`}
                      >
                        <div className="text-xs">
                          <div className="flex items-center justify-between border-b border-slate-50 pb-2 mb-3">
                            <span className="font-extrabold text-slate-800">{addr.fullName}</span>
                            {addr.isDefault && (
                              <span className="bg-blue-600 text-white text-[7px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded">Default</span>
                            )}
                          </div>
                          <p className="text-slate-500 leading-relaxed">{addr.addressLine1}</p>
                          <p className="text-slate-500">{addr.city}, {addr.state} - {addr.zipCode}</p>
                          <span className="block mt-2 font-bold text-slate-400">Phone: {addr.phone}</span>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-4">
                          {!addr.isDefault ? (
                            <button
                              onClick={() => {
                                setDefaultAddress(addr.id);
                                toast.success("Updated default delivery preset! ✦");
                              }}
                              className="text-[8px] font-bold uppercase tracking-widest text-blue-600 hover:underline cursor-pointer"
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
                            onClick={() => {
                              deleteAddress(addr.id);
                              toast.info("Deleted shipping preset.");
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. Orders History Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-800 border-b border-slate-50 pb-3.5 mb-5 select-none">
                  Orders summary
                </h3>

                {orders.length === 0 ? (
                  <div className="text-center py-10 text-xs text-slate-400 italic">No historical orders found.</div>
                ) : (
                  <div className="flex flex-col gap-4 select-none animate-fadeIn">
                    {orders.map((ord) => (
                      <div key={ord.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 border border-slate-100 rounded-2xl p-5 gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-extrabold text-slate-800 tracking-wider">{ord.orderNumber}</span>
                            <span className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-[8px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded">{ord.status}</span>
                          </div>
                          <span className="text-[9px] text-slate-400 block mt-1">Placed on {ord.createdAt}</span>
                          <span className="text-[10px] text-slate-500 font-medium block mt-0.5">{ord.items.length} Diamond masterpieces</span>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                          <div>
                            <span className="block text-[8px] uppercase tracking-widest text-slate-400 font-bold leading-none mb-1">Receipt Value</span>
                            <span className="text-sm font-serif font-extrabold text-blue-600">₹{ord.grandTotal.toLocaleString('en-IN')}</span>
                          </div>
                          
                          <Link
                            to={`/orders/${ord.id}`}
                            className="h-9 border border-blue-200 hover:border-blue-600 text-blue-600 hover:bg-blue-50/50 px-4 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>Receipt Details</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. Preferences & Notification Tab */}
            {activeTab === 'preferences' && (
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm select-none">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-800 border-b border-slate-50 pb-3.5 mb-5">
                  Saved Preferences
                </h3>

                <div className="flex flex-col gap-6 max-w-xl">
                  {/* Delivery preference */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-xl">
                        <Bell className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">SMS Order Status Alerts</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Receive transit and BIS hallmarked details direct to mobile.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={optSMSNotifications} 
                        onChange={() => {
                          setOptSMSNotifications(!optSMSNotifications);
                          toast.success("SMS notification preferences updated.");
                        }}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Email preference */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-xl">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">Instant Email Receipts</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Instant secure invoicing and certificate PDF copies.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={optEmailReceipts} 
                        onChange={() => {
                          setOptEmailReceipts(!optEmailReceipts);
                          toast.success("Email preferences updated.");
                        }}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Billing payment preference */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-xl">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">Fast checkout (Saved Card tokens)</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Encrypt and retain saved Visa card presets.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={optSavedCards} 
                        onChange={() => {
                          setOptSavedCards(!optSavedCards);
                          toast.success("Saved billing card tokens toggled.");
                        }}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;

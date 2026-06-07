import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { useAuth } from '@/hooks/useAuth';
import { useAddressStore } from '@/store/useAddressStore';
import { useOrderStore } from '@/store/useOrderStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';

// DRY Extracted Reusable Components
import StatsCard from '@/components/common/StatsCard';
import SectionCard from '@/components/common/SectionCard';
import FormInput from '@/components/common/FormInput';
import AddressCard from '@/components/common/AddressCard';
import OrderCard from '@/components/common/OrderCard';

import { 
  User, Mail, Phone, ShieldCheck, MapPin, ClipboardList, 
  CreditCard, Bell, Plus, Edit2, Check, ArrowRight, ShoppingBag
} from 'lucide-react';
import { toast } from 'sonner';

type ActiveTab = 'dashboard' | 'details' | 'addresses' | 'orders' | 'preferences';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  // Zustand Stores
  const { addresses, addAddress, deleteAddress, setDefaultAddress, fetchAddresses } = useAddressStore();
  const { orders, fetchOrders } = useOrderStore();
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

  // 1. Guard against non-authenticated users and load details
  useEffect(() => {
    if (!isAuthenticated) {
      toast.warning("Please sign in to configure your personal preferences.");
      navigate('/login');
    } else {
      fetchAddresses();
      fetchOrders();
    }
  }, [isAuthenticated, navigate, fetchAddresses, fetchOrders]);

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
                    type="button"
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
                
                {/* Stats Cards Row */}
                <div className="grid grid-cols-3 gap-4">
                  <StatsCard title="Total Orders" value={`${orders.length} Placed`} />
                  <StatsCard title="Saved Wishlist" value={`${wishlistItems.length} Gems`} />
                  <StatsCard 
                    title="Default Address" 
                    value={addresses.find((a) => a.isDefault)?.city || 'None Registered'} 
                  />
                </div>

                {/* Security verified panel */}
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
                    type="button"
                    onClick={() => setActiveTab('details')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer focus:outline-none"
                  >
                    Configure Settings
                  </button>
                </div>

                {/* Recent Orders log */}
                <SectionCard title="Recent Orders Summary">
                  {orders.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400 italic">No historical orders found.</div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {orders.slice(0, 2).map((ord) => (
                        <OrderCard key={ord.id} order={ord} />
                      ))}
                      <button 
                        type="button"
                        onClick={() => setActiveTab('orders')}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 justify-center mt-2 cursor-pointer focus:outline-none"
                      >
                        View All Orders History
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </SectionCard>

                {/* Wishlist shortcut vault */}
                <SectionCard title="Wishlist Shortcut Vault">
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
                            type="button"
                            onClick={() => handleWishlistMoveToBag(prod)}
                            className="mt-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-1.5 cursor-pointer text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 focus:outline-none"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>Add Bag</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </SectionCard>
              </div>
            )}

            {/* 2. Personal Details Edit Tab */}
            {activeTab === 'details' && (
              <SectionCard
                title="Personal Details Card"
                action={!isEditingInfo && (
                  <button
                    type="button"
                    onClick={() => setIsEditingInfo(true)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer focus:outline-none"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit Info
                  </button>
                )}
              >
                <form onSubmit={handleUpdateInfo} className="flex flex-col gap-5 max-w-xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                      label="First Name"
                      disabled={!isEditingInfo}
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />

                    <FormInput
                      label="Last Name"
                      disabled={!isEditingInfo}
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>

                  <FormInput
                    label="Verified Email Address"
                    disabled
                    value={user.email}
                    onChange={() => {}}
                    icon={<Mail className="w-3.5 h-3.5 text-blue-600" />}
                  />

                  <FormInput
                    label="Contact Number"
                    disabled={!isEditingInfo}
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    icon={<Phone className="w-3.5 h-3.5 text-blue-600" />}
                  />

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
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm focus:outline-none"
                      >
                        <Check className="w-4 h-4" />
                        Save Changes
                      </button>
                    </div>
                  )}
                </form>
              </SectionCard>
            )}

            {/* 3. Address Management Tab */}
            {activeTab === 'addresses' && (
              <SectionCard
                title="Address Management Section"
                action={
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer focus:outline-none"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New Delivery
                  </button>
                }
              >
                {/* Add Address Form inside card */}
                {showAddressForm && (
                  <form onSubmit={handleAddAddress} className="flex flex-col gap-4 bg-slate-50 p-5 rounded-2xl border border-dashed border-blue-200 mb-6 select-none animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormInput
                        label="Recipient Full Name"
                        required
                        value={addrFullName}
                        onChange={(e) => setAddrFullName(e.target.value)}
                      />
                      <FormInput
                        label="Contact Phone"
                        type="tel"
                        required
                        value={addrPhone}
                        onChange={(e) => setAddrPhone(e.target.value)}
                      />
                    </div>

                    <FormInput
                      label="Address Details (Street, Building)"
                      required
                      value={addrLine1}
                      onChange={(e) => setAddrLine1(e.target.value)}
                    />

                    <div className="grid grid-cols-3 gap-4">
                      <FormInput
                        label="City"
                        required
                        value={addrCity}
                        onChange={(e) => setAddrCity(e.target.value)}
                      />
                      <FormInput
                        label="State"
                        required
                        value={addrState}
                        onChange={(e) => setAddrState(e.target.value)}
                      />
                      <FormInput
                        label="Zip Code"
                        required
                        value={addrZip}
                        onChange={(e) => setAddrZip(e.target.value)}
                      />
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

                {/* Addresses Grid list */}
                {addresses.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl select-none">
                    <p className="text-xs text-slate-400 italic mb-4">No shipping addresses found.</p>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(true)}
                      className="h-9 bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl text-[10px] font-bold uppercase tracking-widest cursor-pointer focus:outline-none"
                    >
                      Add Shipping Destination
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <AddressCard
                        key={addr.id}
                        address={addr}
                        onDelete={deleteAddress}
                        onSetDefault={setDefaultAddress}
                      />
                    ))}
                  </div>
                )}
              </SectionCard>
            )}

            {/* 4. Orders History Tab */}
            {activeTab === 'orders' && (
              <SectionCard title="Orders summary">
                {orders.length === 0 ? (
                  <div className="text-center py-10 text-xs text-slate-400 italic">No historical orders found.</div>
                ) : (
                  <div className="flex flex-col gap-4 select-none animate-fadeIn">
                    {orders.map((ord) => (
                      <OrderCard key={ord.id} order={ord} />
                    ))}
                  </div>
                )}
              </SectionCard>
            )}

            {/* 5. Preferences & Notification Tab */}
            {activeTab === 'preferences' && (
              <SectionCard title="Saved Preferences">
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
              </SectionCard>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;

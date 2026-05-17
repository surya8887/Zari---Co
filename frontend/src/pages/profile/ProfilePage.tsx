import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { useAuth } from '@/hooks/useAuth';
import { User, Mail, Phone, ShieldCheck, MapPin, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Local Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // 1. Guard against non-authenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      toast.warning("Please sign in to view your profile settings.");
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // 2. Pre-fill state
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  if (!isAuthenticated || !user) return null;

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      toast.success("Profile updated successfully! ✨", {
        description: "Your configurations are safely recorded.",
      });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#2c221e]">
      <Header />

      <main className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* 1. Account Settings Left Sidebar */}
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
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#8b7355] text-white"
              >
                <User className="w-4 h-4" />
                <span>Profile Info</span>
              </Link>

              <Link 
                to="/addresses" 
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-transparent text-neutral-500 hover:bg-[#faf9f6] hover:text-[#8b7355] transition-colors"
              >
                <MapPin className="w-4 h-4 text-[#8b7355]" />
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

          {/* 2. Profile Details Right Panel */}
          <div className="md:col-span-3 bg-white border border-[#8b7355]/10 rounded-3xl p-8 shadow-sm">
            <h3 className="text-base font-extrabold uppercase tracking-widest text-[#4e3a24] border-b border-neutral-100 pb-3.5 mb-6 select-none">
              Personal Profile Info
            </h3>

            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-5 max-w-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400 block mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-[#faf9f6] border border-[#8b7355]/20 rounded-lg p-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#8b7355]"
                  />
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400 block mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-[#faf9f6] border border-[#8b7355]/20 rounded-lg p-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#8b7355]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400 block mb-1.5 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#8b7355]" />
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full bg-neutral-100/50 border border-neutral-200 rounded-lg p-2.5 text-xs text-neutral-400 cursor-not-allowed focus:outline-none"
                />
                <span className="text-[9px] text-neutral-400 mt-1 select-none block leading-relaxed">
                  Email addresses are permanently tied to secure registration tokens and cannot be changed.
                </span>
              </div>

              <div>
                <label className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400 block mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#8b7355]" />
                  Contact Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="E.g. +91 98765 43210"
                  className="w-full bg-[#faf9f6] border border-[#8b7355]/20 rounded-lg p-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#8b7355]"
                />
              </div>

              <div className="border-t border-neutral-100 pt-5 mt-3 select-none flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-[9px] uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Account Credentials</span>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="h-10 bg-[#8b7355] hover:bg-[#6e583e] text-white px-8 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98 disabled:opacity-50"
                >
                  {isSaving ? 'Recording Changes...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;

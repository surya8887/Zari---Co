import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, MapPin, Phone, Heart, Menu, X, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useProductStore } from '@/store/useProductStore';
import CategoryNav from './CategoryNav';
import ProfileDropdown from './ProfileDropdown';

const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');

  const { categories: dbCategories, fetchCategories, setCategory, resetFilters } = useProductStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const defaultCategories = [
    'Rings', 
    'Earrings', 
    'Pendants', 
    'Bangles', 
    'Gifts', 
    'Collections', 
    'Try At Home', 
    'Bespoke', 
    '10+1 Plan'
  ];

  const categories = dbCategories.length > 0 
    ? dbCategories.filter(c => !c.parentId && !(c as any).parent_id).map(c => c.name) 
    : defaultCategories;
  
  // Real-Time Zustand subscriptions
  const { items: cartItems, getTotals } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();

  const totals = getTotals();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  return (
    <header className="w-full bg-white sticky top-0 z-50 shadow-sm transition-all duration-300">
      {/* 1. Thin Luxury Top Promotional Bar */}
      <div className="bg-[#8b7355] text-white py-2 px-4 text-[8px] sm:text-[9px] uppercase tracking-[2px] sm:tracking-[2.5px] font-semibold flex flex-wrap justify-center items-center gap-x-6 gap-y-1 select-none text-center">
        <span className="hover:text-amber-200 transition-colors duration-200 cursor-default">✨ Free Insured Delivery</span>
        <span className="opacity-40 hidden sm:inline">•</span>
        <span className="hover:text-amber-200 transition-colors duration-200 cursor-default">Easy 15-Day Exchanges</span>
        <span className="opacity-40 hidden sm:inline">•</span>
        <span className="hover:text-amber-200 transition-colors duration-200 cursor-default">100% Certified Purity</span>
      </div>

      {/* 2. Sleek Utility Navigation Bar */}
      <div className="bg-[#faf9f6] border-b border-neutral-100 py-2 hidden md:block">
        <div className="container mx-auto px-6 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-500">
          <div className="flex items-center gap-6">
            <a href="#" className="flex items-center gap-1.5 hover:text-[#8b7355] transition-colors">
              <MapPin className="w-3.5 h-3.5 text-[#8b7355]" />
              <span>Find A Store</span>
            </a>
            <a href="tel:+918178028397" className="flex items-center gap-1.5 hover:text-[#8b7355] transition-colors">
              <Phone className="w-3.5 h-3.5 text-[#8b7355]" />
              <span>+91 8178028397</span>
            </a>
          </div>

          <div className="hidden sm:block text-[10px] text-[#8b7355] italic font-serif tracking-normal normal-case">
            Exquisite jewelry, handcrafted with love.
          </div>

          <div className="flex items-center gap-6">
            <a 
              href="https://www.instagram.com/znira.co?igsh=MTBwMGQzdWZ6bzFzYg==" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1.5 text-[#e1306c] hover:opacity-80 transition-opacity font-extrabold"
              title="Follow Znira & Co on Instagram"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>@znira.co</span>
            </a>
            <a href="#" className="hover:text-[#8b7355] transition-colors">Our Legacy</a>
            <a href="#" className="hover:text-[#8b7355] transition-colors">Book Consultation</a>
          </div>
        </div>
      </div>

      {/* 3. Main Brand Header Area */}
      <div className="bg-white border-b border-neutral-100">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-neutral-700 hover:text-[#8b7355] focus:outline-none cursor-pointer animate-in fade-in duration-200"
              aria-label="Open Menu"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>
            
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <img 
                src="/logo.png" 
                alt="Znira & Co Logo" 
                className="h-10 sm:h-12 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]" 
              />
            </Link>
          </div>

          {/* Elegant Search Bar */}
          <div className="flex-grow max-w-xl mx-4 relative hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for Diamonds, Gold Rings, Pendants..."
                className="w-full bg-[#faf9f6] border border-[#8b7355]/20 rounded-full py-2.5 pl-6 pr-12 text-xs tracking-wider text-neutral-800 placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-[#8b7355] focus:ring-1 focus:ring-[#8b7355]/25 transition-all duration-300"
              />
              <button 
                onClick={() => navigate('/products')}
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#8b7355] hover:bg-[#6e583e] text-white p-2 rounded-full cursor-pointer transition-colors duration-300"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Action Icons Panel */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Wishlist Icon */}
            <Link to="/wishlist" className="text-neutral-700 hover:text-[#8b7355] transition-colors hidden sm:block relative" title="Wishlist">
              <div className="p-2 hover:bg-[#faf9f6] rounded-full transition-colors relative">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-[8px] rounded-full w-4.5 h-4.5 flex items-center justify-center font-bold shadow-md shadow-red-500/10">
                    {wishlistCount}
                  </span>
                )}
              </div>
            </Link>

            {/* User Session Handler */}
            {isAuthenticated ? (
              <ProfileDropdown />
            ) : (
              <Link 
                to="/login" 
                className="flex items-center gap-2.5 text-neutral-700 hover:text-[#8b7355] transition-all duration-300 group"
                title="Login / Register"
              >
                <div className="p-2 group-hover:bg-[#faf9f6] rounded-full transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <div className="hidden lg:flex flex-col text-left select-none">
                  <span className="text-[8px] uppercase tracking-widest text-neutral-400 font-bold leading-none">Account</span>
                  <span className="text-[10px] font-bold text-neutral-700 mt-1 leading-none">Login</span>
                </div>
              </Link>
            )}

            {/* Shopping Bag Cart */}
            <Link 
              to="/cart"
              className="flex items-center gap-2.5 text-neutral-700 hover:text-[#8b7355] transition-all duration-300 group relative"
              title="View Cart"
            >
              <div className="p-2 group-hover:bg-[#faf9f6] rounded-full transition-colors relative">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute top-1 right-1 bg-[#8b7355] text-white text-[8px] rounded-full w-4.5 h-4.5 flex items-center justify-center font-bold shadow-md shadow-[#8b7355]/10 group-hover:scale-105 transition-transform duration-350">
                  {cartCount}
                </span>
              </div>
              <div className="hidden lg:flex flex-col text-left select-none text-[#2c221e]">
                <span className="text-[8px] uppercase tracking-widest text-neutral-400 font-bold leading-none">Your Bag</span>
                <span className="text-[10px] font-bold text-neutral-700 mt-1 leading-none">₹{totals.grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Luxury Navigation Category Bar with Hover Mega Menu */}
      <div className="hidden md:block">
        <CategoryNav />
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/45 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Drawer Content */}
          <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
            {/* Header */}
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <img 
                src="/logo.png" 
                alt="Znira & Co" 
                className="h-10 w-auto object-contain" 
              />
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 -mr-2 text-neutral-500 hover:text-neutral-800 focus:outline-none cursor-pointer"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="p-4 border-b border-neutral-100">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (mobileSearchQuery.trim()) {
                    navigate(`/products?search=${encodeURIComponent(mobileSearchQuery)}`);
                    setIsMobileMenuOpen(false);
                  }
                }}
                className="relative"
              >
                <input
                  type="text"
                  placeholder="Search Znira & Co..."
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  className="w-full bg-[#faf9f6] border border-[#8b7355]/20 rounded-xl py-2 pl-4 pr-10 text-xs tracking-wider text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#8b7355]"
                />
                <button 
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-[#8b7355]"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Links and Categories */}
            <div className="flex-grow overflow-y-auto p-5">
              <span className="block text-[9px] uppercase tracking-widest text-neutral-400 font-extrabold mb-3">Shop Categories</span>
              <ul className="flex flex-col gap-4 font-sans font-bold text-xs uppercase tracking-wider text-[#4e3a24] mb-8">
                {categories.map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => {
                        resetFilters();
                        setCategory(item);
                        setIsMobileMenuOpen(false);
                        navigate('/products');
                      }}
                      className="w-full text-left py-1 hover:text-[#8b7355] flex justify-between items-center bg-transparent border-none uppercase font-bold text-xs tracking-wider cursor-pointer"
                    >
                      <span>{item}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-45" />
                    </button>
                  </li>
                ))}
              </ul>

              <div className="border-t border-neutral-100 pt-6">
                <span className="block text-[9px] uppercase tracking-widest text-neutral-400 font-extrabold mb-3">Customer Service</span>
                <ul className="flex flex-col gap-3.5 text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
                  <li>
                    <a href="#" className="flex items-center gap-2.5 hover:text-[#8b7355]">
                      <MapPin className="w-4 h-4 text-[#8b7355]/70" />
                      <span>Find A Store</span>
                    </a>
                  </li>
                  <li>
                    <a href="tel:+918178028397" className="flex items-center gap-2.5 hover:text-[#8b7355]">
                      <Phone className="w-4 h-4 text-[#8b7355]/70" />
                      <span>Contact (+91 8178028397)</span>
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://www.instagram.com/znira.co?igsh=MTBwMGQzdWZ6bzFzYg==" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-2.5 text-[#e1306c] hover:opacity-80 transition-opacity font-extrabold"
                    >
                      <InstagramIcon className="w-4 h-4 text-[#e1306c]" />
                      <span>Instagram (@znira.co)</span>
                    </a>
                  </li>
                  <li>
                    <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2.5 hover:text-[#8b7355]">
                      <Heart className="w-4 h-4 text-[#8b7355]/70" />
                      <span>My Wishlist ({wishlistCount})</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-5 border-t border-neutral-100 bg-[#faf9f6]">
              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <Link 
                    to="/profile" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full h-9 bg-[#8b7355] hover:bg-[#6e583e] text-white rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>My Account</span>
                  </Link>
                </div>
              ) : (
                <Link 
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full h-9 border border-[#8b7355]/30 hover:border-[#8b7355] text-[#8b7355] rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 bg-white"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Login / Register</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

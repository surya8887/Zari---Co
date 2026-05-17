import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, MapPin, Phone, Heart, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useProductStore } from '@/store/useProductStore';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  
  // Real-Time Zustand subscriptions
  const { items: cartItems, getTotals } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { setCategory } = useProductStore();

  const totals = getTotals();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const handleCategoryClick = (cat: string) => {
    // If it's one of our registered categories, filter, else reset to All
    const validCategories = ['Rings', 'Earrings', 'Pendants', 'Bangles', 'Gifts'];
    if (validCategories.includes(cat)) {
      setCategory(cat);
    } else {
      setCategory('All');
    }
    navigate('/products');
  };

  return (
    <header className="w-full bg-white sticky top-0 z-50 shadow-sm transition-all duration-300">
      {/* 1. Thin Luxury Top Promotional Bar */}
      <div className="bg-[#8b7355] text-white py-1.5 text-[9px] uppercase tracking-[2.5px] font-semibold flex justify-center items-center gap-10 select-none">
        <span className="hover:text-amber-200 transition-colors duration-200 cursor-default">✨ Free Insured Delivery</span>
        <span className="opacity-40">•</span>
        <span className="hover:text-amber-200 transition-colors duration-200 cursor-default">Easy 15-Day Exchanges</span>
        <span className="opacity-40">•</span>
        <span className="hover:text-amber-200 transition-colors duration-200 cursor-default">100% Certified Purity</span>
      </div>

      {/* 2. Sleek Utility Navigation Bar */}
      <div className="bg-[#faf9f6] border-b border-neutral-100 py-2">
        <div className="container mx-auto px-6 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-500">
          <div className="flex items-center gap-6">
            <a href="#" className="flex items-center gap-1.5 hover:text-[#8b7355] transition-colors">
              <MapPin className="w-3.5 h-3.5 text-[#8b7355]" />
              <span>Find A Store</span>
            </a>
            <a href="tel:+1800123456" className="flex items-center gap-1.5 hover:text-[#8b7355] transition-colors">
              <Phone className="w-3.5 h-3.5 text-[#8b7355]" />
              <span>Contact Us</span>
            </a>
          </div>

          <div className="hidden sm:block text-[10px] text-[#8b7355] italic font-serif tracking-normal normal-case">
            Exquisite jewelry, handcrafted with love.
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#8b7355] transition-colors">Our Legacy</a>
            <a href="#" className="hover:text-[#8b7355] transition-colors">Book Consultation</a>
          </div>
        </div>
      </div>

      {/* 3. Main Brand Header Area */}
      <div className="bg-white border-b border-neutral-100">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-6">
          {/* Logo (Clean & centered brand representation) */}
          <Link to="/" className="flex-shrink-0 flex items-center group">
            <img 
              src="/logo.png" 
              alt="Zari & Co Logo" 
              className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]" 
            />
          </Link>

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
          <div className="flex items-center gap-6">
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
              <div className="flex items-center gap-3 bg-[#faf9f6] border border-[#8b7355]/15 px-4 py-1.5 rounded-full shadow-sm">
                <Link 
                  to="/profile" 
                  className="text-[10px] text-[#8b7355] font-extrabold uppercase tracking-wider hover:underline"
                  title="View Settings"
                >
                  Hi, {user?.firstName || 'User'}
                </Link>
                <span className="w-px h-3 bg-neutral-200" />
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
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

      {/* 4. Luxury Navigation Category Bar */}
      <nav className="bg-white border-b border-neutral-100 shadow-sm">
        <div className="container mx-auto px-6">
          <ul className="flex items-center justify-center gap-8 lg:gap-12 py-3.5 text-[11px] font-extrabold uppercase tracking-[2.5px] text-[#4e3a24] overflow-x-auto whitespace-nowrap scrollbar-none select-none">
            {['Rings', 'Earrings', 'Pendants', 'Bangles', 'Gifts', 'Collections', 'Try At Home', 'Bespoke', '10+1 Plan', 'Kids'].map((item) => (
              <li key={item} className="relative group">
                <button 
                  onClick={() => handleCategoryClick(item)}
                  className="hover:text-[#8b7355] transition-colors duration-300 block cursor-pointer bg-transparent border-none font-extrabold text-[11px] uppercase tracking-[2.5px] text-[#4e3a24]"
                >
                  {item}
                </button>
                <span className="absolute -bottom-3.5 left-0 w-0 h-[2.5px] bg-[#8b7355] transition-all duration-300 group-hover:w-full" />
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;

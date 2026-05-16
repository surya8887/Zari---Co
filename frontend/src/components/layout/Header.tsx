import React from 'react';
import { Search, User, ShoppingBag, MapPin, Phone, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  return (
    <header className="w-full">
      {/* Top Promotional Bar */}
      <div className="bg-[#b09d81] text-white py-1.5 text-[10px] uppercase tracking-[2px] font-medium flex justify-center gap-12">
        <span>Free Shipping</span>
        <span className="opacity-50">|</span>
        <span>Free Returns</span>
        <span className="opacity-50">|</span>
        <span>Lifetime Buyback</span>
      </div>

      {/* Main Header Area */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img src="/logo.png" alt="Zari & Co Logo" className="h-16 w-auto object-contain" />
        </div>

        {/* Search Bar */}
        <div className="flex-grow max-w-2xl mx-12 relative">
          <input
            type="text"
            placeholder="Search for jewelry..."
            className="w-full border border-gray-200 rounded-full py-2.5 px-6 pr-12 focus:outline-none focus:ring-1 focus:ring-[#b09d81]"
          />
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        {/* Action Links */}
        <div className="flex items-center gap-6 text-[11px] font-semibold uppercase text-gray-600 tracking-wider">
          <a href="#" className="flex items-center gap-1 hover:text-[#b09d81]">
            <MapPin className="w-4 h-4" /> Stores
          </a>
          <a href="#" className="flex items-center gap-1 hover:text-[#b09d81]">
            <Phone className="w-4 h-4" /> Contact Us
          </a>
          <a href="#" className="flex items-center gap-1 hover:text-[#b09d81]">
            <Info className="w-4 h-4" /> About Us
          </a>
          <div className="flex items-center gap-4 ml-4">
            <User className="w-6 h-6 text-gray-700 cursor-pointer" />
            <div className="relative">
              <ShoppingBag className="w-6 h-6 text-gray-700 cursor-pointer" />
              <span className="absolute -top-1 -right-1 bg-[#b09d81] text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center font-bold">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-[#b09d81] text-white">
        <div className="container mx-auto px-4">
          <ul className="flex items-center justify-center gap-8 py-3 text-[11px] font-bold uppercase tracking-widest">
            {['Rings', 'Earrings', 'Pendants', 'Others', 'Gifts', 'Collections', 'TryAtHome', 'Blogs', '10+1 Monthly Plan', 'Kids'].map((item) => (
              <li key={item}>
                <a href="#" className="hover:opacity-70 transition-opacity">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;

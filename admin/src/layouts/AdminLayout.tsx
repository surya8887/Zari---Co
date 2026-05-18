import React, { useState } from "react";
import { 
  LayoutGrid, 
  Package, 
  ClipboardList, 
  Users, 
  Megaphone, 
  BarChart3, 
  Settings, 
  MessageSquare,
  Search,
  Bell,
  Mail,
  ChevronDown,
  ChevronRight
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isProductsOpen, setIsProductsOpen] = useState(true);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isMarketingOpen, setIsMarketingOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex text-foreground font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-border bg-sidebar p-5 flex flex-col justify-between select-none shrink-0">
        <div className="space-y-6">
          {/* Elegant gold serif branding logo */}
          <div className="px-4 py-2">
            <h2 className="text-lg font-bold tracking-[0.2em] text-primary uppercase font-serif text-center md:text-left">
              Aurélia
            </h2>
            <p className="text-[9px] font-medium tracking-[0.3em] text-[#a58b68] uppercase text-center md:text-left mt-0.5 pl-0.5">
              Jewels
            </p>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {/* Dashboard (Active) */}
            <a 
              href="#" 
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#241e17] border border-[#3b3227] text-primary font-medium text-xs transition-colors"
            >
              <LayoutGrid size={16} className="text-primary" />
              Dashboard
            </a>

            {/* Products (Collapsible) */}
            <div>
              <button 
                onClick={() => setIsProductsOpen(!isProductsOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-muted-foreground hover:text-foreground font-medium text-xs transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Package size={16} />
                  Products
                </div>
                {isProductsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              
              {isProductsOpen && (
                <div className="pl-11 pr-2 py-1 space-y-1 border-l border-border/40 ml-6 mt-0.5">
                  <a href="#" className="block py-1.5 text-xs text-primary font-medium hover:text-foreground transition-colors">Products List</a>
                  <a href="#" className="block py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">New Product</a>
                  <a href="#" className="block py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">Collections</a>
                  <a href="#" className="block py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">Inventory</a>
                </div>
              )}
            </div>

            {/* Orders (Collapsible) */}
            <div>
              <button 
                onClick={() => setIsOrdersOpen(!isOrdersOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-muted-foreground hover:text-foreground font-medium text-xs transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ClipboardList size={16} />
                  Orders
                </div>
                {isOrdersOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              
              {isOrdersOpen && (
                <div className="pl-11 pr-2 py-1 space-y-1 border-l border-border/40 ml-6 mt-0.5">
                  <a href="#" className="block py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">All Orders</a>
                  <a href="#" className="block py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">New Orders</a>
                  <a href="#" className="block py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">Shipped</a>
                  <a href="#" className="block py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">Returns</a>
                </div>
              )}
            </div>

            {/* Customers */}
            <a 
              href="#" 
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground hover:text-foreground font-medium text-xs transition-colors"
            >
              <Users size={16} />
              Customers
            </a>

            {/* Marketing (Collapsible) */}
            <div>
              <button 
                onClick={() => setIsMarketingOpen(!isMarketingOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-muted-foreground hover:text-foreground font-medium text-xs transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Megaphone size={16} />
                  Marketing
                </div>
                {isMarketingOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              {isMarketingOpen && (
                <div className="pl-11 pr-2 py-1 space-y-1 border-l border-border/40 ml-6 mt-0.5">
                  <a href="#" className="block py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">Campaigns</a>
                  <a href="#" className="block py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">Promotions</a>
                </div>
              )}
            </div>

            {/* Reports (Collapsible) */}
            <div>
              <button 
                onClick={() => setIsReportsOpen(!isReportsOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-muted-foreground hover:text-foreground font-medium text-xs transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BarChart3 size={16} />
                  Reports
                </div>
                {isReportsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              {isReportsOpen && (
                <div className="pl-11 pr-2 py-1 space-y-1 border-l border-border/40 ml-6 mt-0.5">
                  <a href="#" className="block py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">Sales Report</a>
                  <a href="#" className="block py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">Traffic Report</a>
                </div>
              )}
            </div>

            {/* Settings */}
            <a 
              href="#" 
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground hover:text-foreground font-medium text-xs transition-colors"
            >
              <Settings size={16} />
              Settings
            </a>

            {/* Reviews */}
            <a 
              href="#" 
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground hover:text-foreground font-medium text-xs transition-colors"
            >
              <MessageSquare size={16} />
              Reviews
            </a>
          </nav>
        </div>

        {/* Footer Sidebar Profile (matching the aesthetic of Zari & Co admin panel) */}
        <div className="border-t border-border pt-4">
          <p className="text-[10px] text-muted-foreground text-center tracking-widest font-semibold uppercase">
            Zari & Co Admin
          </p>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* HEADER */}
        <header className="h-16 border-b border-border bg-sidebar px-8 flex items-center justify-between shrink-0 select-none">
          {/* Left search block */}
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/80" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-9 pr-4 py-2 text-xs border border-border bg-[#0d0f14]/50 rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Right badges & profile section */}
          <div className="flex items-center gap-4">
            {/* Messages Bell */}
            <button className="w-8 h-8 rounded-lg border border-border bg-[#0d0f14]/50 flex items-center justify-center relative hover:bg-secondary/35 text-foreground transition-colors cursor-pointer">
              <Bell size={15} />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] text-white flex items-center justify-center font-bold leading-none">
                3
              </span>
            </button>

            {/* Envelope Envelope */}
            <button className="w-8 h-8 rounded-lg border border-border bg-[#0d0f14]/50 flex items-center justify-center relative hover:bg-secondary/35 text-foreground transition-colors cursor-pointer">
              <Mail size={15} />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] text-white flex items-center justify-center font-bold leading-none">
                1
              </span>
            </button>

            {/* Profile info Sarah J. */}
            <div className="flex items-center gap-3 cursor-pointer pl-4 border-l border-border/80 hover:opacity-95 transition-opacity">
              {/* Gold avatar circle with initials */}
              <div className="w-9 h-9 rounded-lg bg-primary border border-primary/20 flex items-center justify-center text-primary-foreground font-bold text-xs select-none">
                SJ
              </div>
              <div className="hidden md:block text-left select-none">
                <p className="text-xs font-semibold text-foreground leading-none">Sarah J.</p>
                <p className="text-[9px] text-muted-foreground mt-0.5 tracking-wider uppercase font-semibold">
                  Administrator
                </p>
              </div>
              <ChevronDown size={14} className="text-muted-foreground hidden md:block" />
            </div>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="p-8 flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
};

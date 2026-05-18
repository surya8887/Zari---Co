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
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useAppStore } from "@/store";
import { toast } from "sonner";

export const AdminSidebar: React.FC = () => {
  const { currentPage, setCurrentPage } = useAppStore();
  
  // Sidebar states for collapsible menus
  const [isProductsOpen, setIsProductsOpen] = useState(true);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isMarketingOpen, setIsMarketingOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);

  const navigateTo = (pageId: string, label: string) => {
    setCurrentPage(pageId);
    toast.info(`Navigated to ${label} ✦`, {
      description: "Switching workspace context.",
      duration: 1500
    });
  };

  const getActiveStyle = (pageId: string) => {
    if (currentPage === pageId) {
      return "flex items-center gap-3.5 px-4 py-3 rounded-lg bg-[#241e17] border border-[#3b3227] text-primary font-semibold text-base shadow-[0_0_15px_rgba(197,168,128,0.05)]";
    }
    return "flex items-center gap-3.5 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground font-semibold text-base transition-colors";
  };

  const getSubActiveStyle = (pageId: string) => {
    if (currentPage === pageId) {
      return "block py-2 text-sm text-primary font-medium pl-3 border-l border-primary/60 transition-colors";
    }
    return "block py-2 text-sm text-muted-foreground hover:text-foreground pl-3 border-l border-transparent hover:border-border transition-colors";
  };

  return (
    <aside className="w-64 border-r border-border bg-[#101216] p-5 flex flex-col justify-between select-none shrink-0 min-h-screen">
      <div className="space-y-6">
        {/* Elegant gold serif branding logo */}
        <div className="px-4 py-2 border-b border-border/20 pb-4">
          <h2 className="text-2xl font-bold tracking-[0.25em] text-primary uppercase font-serif text-center md:text-left select-none drop-shadow-[0_0_8px_rgba(197,168,128,0.15)]">
            Aurélia
          </h2>
          <p className="text-xs font-medium tracking-[0.35em] text-[#a58b68] uppercase text-center md:text-left mt-0.5 pl-0.5 select-none">
            Jewels
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {/* Dashboard */}
          <button 
            onClick={() => navigateTo("dashboard", "Dashboard Overview")}
            className={`w-full text-left cursor-pointer ${getActiveStyle("dashboard")}`}
          >
            <LayoutGrid size={18} />
            Dashboard
          </button>

          {/* Products (Collapsible) */}
          <div className="space-y-0.5">
            <button 
              onClick={() => setIsProductsOpen(!isProductsOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground font-semibold text-base transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <Package size={18} />
                Products
              </div>
              {isProductsOpen ? <ChevronDown size={15} className="text-primary" /> : <ChevronRight size={15} />}
            </button>
            
            {isProductsOpen && (
              <div className="pl-12 pr-2 py-1 space-y-1 ml-3 mt-0.5">
                <button 
                  onClick={() => navigateTo("products-list", "Products List")} 
                  className={`w-full text-left cursor-pointer ${getSubActiveStyle("products-list")}`}
                >
                  Products List
                </button>
                <button 
                  onClick={() => navigateTo("new-product", "Create New Product")} 
                  className={`w-full text-left cursor-pointer ${getSubActiveStyle("new-product")}`}
                >
                  New Product
                </button>
                <button 
                  onClick={() => navigateTo("collections", "Jewelry Collections")} 
                  className={`w-full text-left cursor-pointer ${getSubActiveStyle("collections")}`}
                >
                  Collections
                </button>
                <button 
                  onClick={() => navigateTo("inventory", "Inventory & Stock")} 
                  className={`w-full text-left cursor-pointer ${getSubActiveStyle("inventory")}`}
                >
                  Inventory
                </button>
              </div>
            )}
          </div>

          {/* Orders (Collapsible) */}
          <div className="space-y-0.5">
            <button 
              onClick={() => setIsOrdersOpen(!isOrdersOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground font-semibold text-base transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <ClipboardList size={18} />
                Orders
              </div>
              {isOrdersOpen ? <ChevronDown size={15} className="text-primary" /> : <ChevronRight size={15} />}
            </button>
            
            {isOrdersOpen && (
              <div className="pl-12 pr-2 py-1 space-y-1 ml-3 mt-0.5">
                <button 
                  onClick={() => navigateTo("all-orders", "All Orders")} 
                  className={`w-full text-left cursor-pointer ${getSubActiveStyle("all-orders")}`}
                >
                  All Orders
                </button>
                <button 
                  onClick={() => navigateTo("new-orders", "New Transaction Orders")} 
                  className={`w-full text-left cursor-pointer ${getSubActiveStyle("new-orders")}`}
                >
                  New Orders
                </button>
                <button 
                  onClick={() => navigateTo("shipped", "Shipped & Dispatched")} 
                  className={`w-full text-left cursor-pointer ${getSubActiveStyle("shipped")}`}
                >
                  Shipped
                </button>
                <button 
                  onClick={() => navigateTo("returns", "Returns & Refunds")} 
                  className={`w-full text-left cursor-pointer ${getSubActiveStyle("returns")}`}
                >
                  Returns
                </button>
              </div>
            )}
          </div>

          {/* Customers */}
          <button 
            onClick={() => navigateTo("customers", "Customer Directory")}
            className={`w-full text-left cursor-pointer ${getActiveStyle("customers")}`}
          >
            <Users size={18} />
            Customers
          </button>

          {/* Marketing (Collapsible) */}
          <div className="space-y-0.5">
            <button 
              onClick={() => setIsMarketingOpen(!isMarketingOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground font-semibold text-base transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <Megaphone size={18} />
                Marketing
              </div>
              {isMarketingOpen ? <ChevronDown size={15} className="text-primary" /> : <ChevronRight size={15} />}
            </button>
            {isMarketingOpen && (
              <div className="pl-12 pr-2 py-1 space-y-1 ml-3 mt-0.5">
                <button 
                  onClick={() => navigateTo("campaigns", "Marketing Campaigns")} 
                  className={`w-full text-left cursor-pointer ${getSubActiveStyle("campaigns")}`}
                >
                  Campaigns
                </button>
                <button 
                  onClick={() => navigateTo("promotions", "Promotions & Offers")} 
                  className={`w-full text-left cursor-pointer ${getSubActiveStyle("promotions")}`}
                >
                  Promotions
                </button>
              </div>
            )}
          </div>

          {/* Reports (Collapsible) */}
          <div className="space-y-0.5">
            <button 
              onClick={() => setIsReportsOpen(!isReportsOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground font-semibold text-base transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <BarChart3 size={18} />
                Reports
              </div>
              {isReportsOpen ? <ChevronDown size={15} className="text-primary" /> : <ChevronRight size={15} />}
            </button>
            {isReportsOpen && (
              <div className="pl-12 pr-2 py-1 space-y-1 ml-3 mt-0.5">
                <button 
                  onClick={() => navigateTo("sales-report", "House Sales Report")} 
                  className={`w-full text-left cursor-pointer ${getSubActiveStyle("sales-report")}`}
                >
                  Sales Report
                </button>
                <button 
                  onClick={() => navigateTo("traffic-report", "Digital Traffic Audit")} 
                  className={`w-full text-left cursor-pointer ${getSubActiveStyle("traffic-report")}`}
                >
                  Traffic Report
                </button>
              </div>
            )}
          </div>

          {/* Settings */}
          <button 
            onClick={() => navigateTo("settings", "Dashboard Settings")}
            className={`w-full text-left cursor-pointer ${getActiveStyle("settings")}`}
          >
            <Settings size={18} />
            Settings
          </button>

          {/* Reviews */}
          <button 
            onClick={() => navigateTo("reviews", "Customer Feedback")}
            className={`w-full text-left cursor-pointer ${getActiveStyle("reviews")}`}
          >
            <MessageSquare size={18} />
            Reviews
          </button>
        </nav>
      </div>

      {/* Footer Sidebar Profile (matching the aesthetic of Zari & Co admin panel) */}
      <div className="border-t border-border/20 pt-4 flex flex-col items-center justify-center gap-1 select-none">
        <p className="text-xs text-[#a58b68] tracking-widest font-semibold uppercase">
          Zari & Co Admin
        </p>
        <p className="text-[10px] text-muted-foreground opacity-60">
          v1.2.0 Stable Build
        </p>
      </div>
    </aside>
  );
};

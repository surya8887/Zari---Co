import React, { useState } from "react";
import { MoreHorizontal, ChevronDown, Sparkles, FolderOpen, AlertTriangle } from "lucide-react";
import { useAppStore } from "@/store";
import { toast } from "sonner";
import { EmptyState } from "./EmptyState";

export const InventoryAlertsTable: React.FC = () => {
  const { searchQuery, inventory, setCurrentPage } = useAppStore();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filter real low stock items from backend
  const lowStockItems = inventory.filter(item => item.isLowStock);

  // Filter rows based on search query
  const filteredAlerts = lowStockItems.filter(item => 
    (item.variant?.product?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.variant?.sku || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleActionClick = (_id: string, action: string) => {
    setActiveMenuId(null);
    if (action === "Adjust Stock") {
      setCurrentPage("inventory");
      toast.success("Navigating to Inventory Control ✦", {
        description: "Open the adjustment slide-over to modify stock levels."
      });
      return;
    }
    toast.success(`Action Executed: "${action}"`, {
      description: "Triggering database dispatch sequence.",
      icon: <Sparkles size={14} className="text-primary animate-pulse" />
    });
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4 transition-all duration-300 hover:shadow-[0_0_15px_rgba(197,168,128,0.03)] relative overflow-visible text-left">
      <div className="flex justify-between items-center border-b border-border/50 pb-4">
        <div>
          <h3 className="text-sm font-bold text-foreground tracking-wide uppercase">Critical Stock Alerts</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Real-time alerts for vault items falling below configured threshold limits</p>
        </div>
        <button 
          onClick={() => {
            setCurrentPage("inventory");
            toast.info("Navigating to advanced inventory panel...");
          }}
          className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-1"
          title="View Advanced Inventory Panel"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Table structure */}
      <div className="overflow-x-auto min-h-48 overflow-y-visible">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border text-muted-foreground font-semibold">
              <th className="pb-3 pl-2">Product Variant</th>
              <th className="pb-3">SKU / Code</th>
              <th className="pb-3 text-center">Available Stock</th>
              <th className="pb-3 text-center">Limit Threshold</th>
              <th className="pb-3 text-center">Status</th>
              <th className="pb-3 pr-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 overflow-y-visible">
            {filteredAlerts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center">
                  <EmptyState 
                    title="All Stock Levels Healthy"
                    description="Your luxury jewelry catalogue is perfectly synchronized. There are no critical low stock items pending restock."
                    icon={<FolderOpen size={18} className="opacity-50 text-muted-foreground" />}
                  />
                </td>
              </tr>
            ) : (
              filteredAlerts.map((item) => (
                <tr key={item.id} className="hover:bg-secondary/20 transition-colors group">
                  <td className="py-3.5 pl-2 flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-lg bg-[#1b1e26] border border-border group-hover:border-primary/50 transition-colors flex items-center justify-center text-primary font-bold">
                        <AlertTriangle size={16} className="text-amber-500 animate-pulse" />
                      </div>
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 block border-2 border-card" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground group-hover:text-primary-foreground transition-all">
                        {item.variant?.product?.name || "Bespoke Jewelry"}
                      </h5>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Setting: {item.variant?.name || "Standard Setting"}
                      </p>
                    </div>
                  </td>
                  <td className="py-3.5 font-mono text-muted-foreground">{item.variant?.sku}</td>
                  <td className="py-3.5 text-center font-bold text-rose-400 font-mono text-sm">{item.availableQuantity}</td>
                  <td className="py-3.5 text-center font-semibold text-muted-foreground font-mono">{item.lowStockThreshold}</td>
                  <td className="py-3.5 text-center select-none">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      Low Stock Alert
                    </span>
                  </td>
                  <td className="py-3.5 pr-2 text-right relative overflow-visible">
                    <div className="inline-block text-left">
                      <button 
                        onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                        className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-bold cursor-pointer hover:underline select-none"
                      >
                        Options <ChevronDown size={12} className={`transition-transform duration-200 ${activeMenuId === item.id ? "rotate-180" : ""}`} />
                      </button>

                      {/* Dropdown Action Portal */}
                      {activeMenuId === item.id && (
                        <div className="absolute right-0 mt-1 w-36 rounded-lg border border-border bg-[#12141a] shadow-lg py-1 z-50 animate-in fade-in duration-100">
                          <button
                            onClick={() => handleActionClick(item.id, "Adjust Stock")}
                            className="w-full text-left px-3 py-1.5 hover:bg-[#241e17]/50 hover:text-primary text-[11px] text-muted-foreground transition-colors cursor-pointer"
                          >
                            Adjust Stock
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};;

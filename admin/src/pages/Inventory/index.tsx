import React, { useState, useEffect } from "react";
import { useAppStore } from "@/store";
import { useAuth } from "@/hooks/useAuth";
import { 
  Search, Edit3, AlertTriangle, Clipboard, Check, RefreshCw, X, Save, ShieldAlert, Package, Layers, Activity
} from "lucide-react";
import { toast } from "sonner";

export const Inventory: React.FC = () => {
  const { user } = useAuth();
  const { 
    inventory, 
    isLoadingInventory, 
    fetchInventory, 
    adjustStock 
  } = useAppStore();

  // Local UI & form states
  const [searchTerm, setSearchTerm] = useState("");
  const [lowStockFilter, setLowStockFilter] = useState(false);
  const [copiedSku, setCopiedSku] = useState<string | null>(null);
  
  // Dialog state for adjusting stock
  const [adjustingItem, setAdjustingItem] = useState<any>(null);
  const [adjustForm, setAdjustForm] = useState({
    quantity: 0,
    reservedQuantity: 0,
    lowStockThreshold: 5,
    note: "",
    referenceId: ""
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronise list upon mount or filter toggle
  useEffect(() => {
    fetchInventory({ lowStockOnly: lowStockFilter });
  }, [lowStockFilter]);

  const handleRefresh = () => {
    fetchInventory({ lowStockOnly: lowStockFilter });
    toast.success("Inventory Reloaded ✦", {
      description: "Fetched fresh stock metrics from Postgres."
    });
  };

  const handleCopySku = (sku: string) => {
    navigator.clipboard.writeText(sku);
    setCopiedSku(sku);
    toast.success("SKU Copied ✦", {
      description: `"${sku}" added to system clipboard.`
    });
    setTimeout(() => setCopiedSku(null), 2000);
  };

  const openAdjustDialog = (item: any) => {
    setAdjustingItem(item);
    setAdjustForm({
      quantity: item.quantity,
      reservedQuantity: item.reservedQuantity,
      lowStockThreshold: item.lowStockThreshold,
      note: "",
      referenceId: ""
    });
    setFormErrors({});
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingItem) return;

    // Client-side validations
    const errors: Record<string, string> = {};
    if (adjustForm.quantity < 0) {
      errors.quantity = "Total stock cannot be negative.";
    }
    if (adjustForm.reservedQuantity < 0) {
      errors.reservedQuantity = "Reserved stock cannot be negative.";
    }
    if (adjustForm.reservedQuantity > adjustForm.quantity) {
      errors.reservedQuantity = "Reserved stock cannot exceed total stock.";
    }
    if (adjustForm.lowStockThreshold < 0) {
      errors.lowStockThreshold = "Threshold cannot be negative.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Validation Failed ✕", {
        description: "Please fix input errors before updating."
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await adjustStock(adjustingItem.id, {
        quantity: Number(adjustForm.quantity),
        reservedQuantity: Number(adjustForm.reservedQuantity),
        lowStockThreshold: Number(adjustForm.lowStockThreshold),
        note: adjustForm.note || "Warehouse stock manual adjustment",
        referenceId: adjustForm.referenceId || "ADJ-MANUAL",
        performedById: user?.id
      });
      setAdjustingItem(null);
    } catch (err) {
      // Errors are already toasted inside slice
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter local inventory on search term (case-insensitive product name or SKU matching)
  const filteredInventory = inventory.filter(item => {
    const productName = item.variant?.product?.name || "";
    const variantName = item.variant?.name || "";
    const sku = item.variant?.sku || "";
    const matchString = `${productName} ${variantName} ${sku}`.toLowerCase();
    return matchString.includes(searchTerm.toLowerCase());
  });

  // Derived KPI values
  const totalSKUs = inventory.length;
  const criticalItems = inventory.filter(item => item.isLowStock).length;
  const totalUnits = inventory.reduce((acc, curr) => acc + curr.quantity, 0);
  const reservedUnits = inventory.reduce((acc, curr) => acc + curr.reservedQuantity, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-left">
      
      {/* 1. TOP METRIC STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 select-none">
        
        {/* KPI 1 */}
        <div className="relative overflow-hidden rounded-xl border border-[#22252e] bg-[#12141a] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all hover:border-primary/20 group">
          <div className="absolute right-4 top-4 p-2 bg-[#1b1e26] rounded-lg text-primary">
            <Package size={18} className="group-hover:rotate-6 transition-transform" />
          </div>
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Total Active SKUs</p>
          <p className="text-2xl font-bold text-foreground mt-2 font-serif">{totalSKUs}</p>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-400 font-semibold">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Active Collection Stock
          </div>
        </div>

        {/* KPI 2 */}
        <div className="relative overflow-hidden rounded-xl border border-[#22252e] bg-[#12141a] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all hover:border-amber-500/20 group">
          <div className="absolute right-4 top-4 p-2 bg-[#2c1d1a]/50 rounded-lg text-amber-500">
            <ShieldAlert size={18} className="group-hover:animate-pulse" />
          </div>
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Low Stock Alerts</p>
          <p className={`text-2xl font-bold mt-2 font-serif ${criticalItems > 0 ? "text-amber-500" : "text-foreground"}`}>
            {criticalItems}
          </p>
          <p className="text-[10px] text-muted-foreground mt-2">
            {criticalItems > 0 ? "Requires immediate restock" : "All levels healthy"}
          </p>
        </div>

        {/* KPI 3 */}
        <div className="relative overflow-hidden rounded-xl border border-[#22252e] bg-[#12141a] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all hover:border-blue-400/20 group">
          <div className="absolute right-4 top-4 p-2 bg-[#1b1e26] rounded-lg text-blue-400">
            <Layers size={18} />
          </div>
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Total On-Hand Pieces</p>
          <p className="text-2xl font-bold text-foreground mt-2 font-serif">{totalUnits}</p>
          <p className="text-[10px] text-muted-foreground mt-2">Physical vaults inventory</p>
        </div>

        {/* KPI 4 */}
        <div className="relative overflow-hidden rounded-xl border border-[#22252e] bg-[#12141a] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all hover:border-purple-400/20 group">
          <div className="absolute right-4 top-4 p-2 bg-[#1b1e26] rounded-lg text-purple-400">
            <Activity size={18} />
          </div>
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Reserved Units</p>
          <p className="text-2xl font-bold text-foreground mt-2 font-serif">{reservedUnits}</p>
          <p className="text-[10px] text-muted-foreground mt-2">Allocated for pending orders</p>
        </div>

      </div>

      {/* 2. LIVE FILTER CONTROLS */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#12141a] border border-[#22252e] p-4 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search SKU or Product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1b1e26] border border-[#22252e] rounded-lg pl-9 pr-4 py-2 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          
          {/* Low stock toggle */}
          <button
            onClick={() => setLowStockFilter(!lowStockFilter)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              lowStockFilter 
                ? "bg-amber-500/10 border-amber-500/40 text-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.1)]" 
                : "bg-[#1b1e26] border-[#22252e] text-muted-foreground hover:text-foreground"
            }`}
          >
            <AlertTriangle size={14} />
            Low Stock Only
          </button>

          {/* Sync Refresh */}
          <button
            onClick={handleRefresh}
            disabled={isLoadingInventory}
            className="p-2 bg-[#1b1e26] border border-[#22252e] text-muted-foreground hover:text-foreground rounded-lg cursor-pointer disabled:opacity-50 transition-colors"
            title="Force refresh database sync"
          >
            <RefreshCw size={14} className={isLoadingInventory ? "animate-spin text-primary" : ""} />
          </button>

        </div>

      </div>

      {/* 3. STOCK TABLE */}
      <div className="border border-[#22252e] bg-[#12141a] rounded-xl overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.4)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#22252e] bg-[#171a23]/30 text-muted-foreground font-bold uppercase tracking-wider select-none">
                <th className="py-4 px-5">Product & Variant</th>
                <th className="py-4 px-5">SKU / Code</th>
                <th className="py-4 px-5 text-center">On-Hand</th>
                <th className="py-4 px-5 text-center">Reserved</th>
                <th className="py-4 px-5 text-center">Available</th>
                <th className="py-4 px-5 text-center">Threshold</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingInventory && filteredInventory.length === 0 ? (
                // Skeleton loading rows
                [...Array(5)].map((_, idx) => (
                  <tr key={idx} className="border-b border-[#22252e] animate-pulse">
                    <td className="py-5 px-5"><div className="h-4 w-40 bg-secondary/20 rounded" /></td>
                    <td className="py-5 px-5"><div className="h-4 w-24 bg-secondary/20 rounded" /></td>
                    <td className="py-5 px-5 text-center"><div className="h-4 w-8 bg-secondary/20 rounded mx-auto" /></td>
                    <td className="py-5 px-5 text-center"><div className="h-4 w-8 bg-secondary/20 rounded mx-auto" /></td>
                    <td className="py-5 px-5 text-center"><div className="h-4 w-8 bg-secondary/20 rounded mx-auto" /></td>
                    <td className="py-5 px-5 text-center"><div className="h-4 w-8 bg-secondary/20 rounded mx-auto" /></td>
                    <td className="py-5 px-5"><div className="h-5 w-16 bg-secondary/20 rounded" /></td>
                    <td className="py-5 px-5 text-right"><div className="h-6 w-12 bg-secondary/20 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : filteredInventory.length === 0 ? (
                // Empty state
                <tr>
                  <td colSpan={8} className="py-16 text-center select-none">
                    <Package className="mx-auto text-muted-foreground/30 mb-3" size={32} />
                    <p className="font-serif font-bold text-foreground text-sm">No Stock Records Found</p>
                    <p className="text-[10px] text-muted-foreground mt-1 max-w-xs mx-auto">
                      There are no variants that match your search filters. Try toggling active flags.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr 
                    key={item.id} 
                    className="border-b border-[#22252e]/60 hover:bg-[#181a22]/30 transition-colors"
                  >
                    {/* Product & Variant */}
                    <td className="py-4 px-5">
                      <div className="font-serif font-bold text-foreground text-sm">
                        {item.variant?.product?.name || "Bespoke Jewelry"}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-medium mt-0.5">
                        {item.variant?.name || "Default Setting"}
                      </div>
                    </td>

                    {/* SKU Code */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-muted-foreground">{item.variant?.sku || "N/A"}</span>
                        {item.variant?.sku && (
                          <button
                            onClick={() => handleCopySku(item.variant!.sku)}
                            className="p-1 bg-[#1b1e26] hover:bg-[#22252e] rounded text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                            title="Copy SKU code"
                          >
                            {copiedSku === item.variant.sku ? <Check size={10} className="text-emerald-400" /> : <Clipboard size={10} />}
                          </button>
                        )}
                      </div>
                    </td>

                    {/* On-hand */}
                    <td className="py-4 px-5 text-center font-bold font-mono text-foreground text-sm">
                      {item.quantity}
                    </td>

                    {/* Reserved */}
                    <td className="py-4 px-5 text-center font-mono text-muted-foreground text-sm">
                      {item.reservedQuantity}
                    </td>

                    {/* Available */}
                    <td className="py-4 px-5 text-center font-bold font-mono text-foreground text-sm">
                      {item.availableQuantity}
                    </td>

                    {/* Threshold */}
                    <td className="py-4 px-5 text-center font-mono text-muted-foreground">
                      {item.lowStockThreshold}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-5">
                      {item.isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 select-none animate-pulse">
                          <AlertTriangle size={8} />
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 select-none">
                          <Check size={8} />
                          In Stock
                        </span>
                      )}
                    </td>

                    {/* Action button */}
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => openAdjustDialog(item)}
                        className="inline-flex items-center gap-1 bg-[#171e2c] border border-blue-500/20 hover:border-blue-500/40 text-blue-400 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer hover:bg-blue-500/5 select-none"
                      >
                        <Edit3 size={11} />
                        Adjust Stock
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. HIGH FIDELITY ADJ MODAL OVERLAY */}
      {adjustingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-md bg-[#12141a] border border-[#22252e] rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.8)] overflow-hidden animate-in slide-in-from-bottom-8 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-[#22252e] p-5 select-none text-left">
              <div>
                <h3 className="font-serif font-bold text-lg text-foreground">Adjust Stock Level</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                  Variant SKU: {adjustingItem.variant?.sku}
                </p>
              </div>
              <button 
                onClick={() => setAdjustingItem(null)}
                className="p-1.5 bg-[#1b1e26] hover:bg-[#22252e] rounded-lg text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-5 space-y-4 text-left">
              
              {/* Variant info banner */}
              <div className="p-3 bg-secondary/10 border border-border/20 rounded-xl select-none">
                <span className="text-[9px] uppercase font-bold text-primary tracking-wider">Target Asset</span>
                <p className="text-xs font-bold text-foreground mt-0.5">
                  {adjustingItem.variant?.product?.name} ({adjustingItem.variant?.name})
                </p>
              </div>

              {/* Quantity Fields row */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* On Hand */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wide">Total Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={adjustForm.quantity}
                    onChange={(e) => {
                      setAdjustForm({ ...adjustForm, quantity: Number(e.target.value) });
                      if (formErrors.quantity) setFormErrors({ ...formErrors, quantity: "" });
                    }}
                    className={`w-full bg-[#1b1e26] border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none font-semibold ${
                      formErrors.quantity ? "border-red-500/60 focus:border-red-500" : "border-[#22252e] focus:border-primary"
                    }`}
                  />
                  {formErrors.quantity && <p className="text-[9px] text-red-400 font-semibold">{formErrors.quantity}</p>}
                </div>

                {/* Reserved */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wide">Reserved Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={adjustForm.reservedQuantity}
                    onChange={(e) => {
                      setAdjustForm({ ...adjustForm, reservedQuantity: Number(e.target.value) });
                      if (formErrors.reservedQuantity) setFormErrors({ ...formErrors, reservedQuantity: "" });
                    }}
                    className={`w-full bg-[#1b1e26] border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none font-semibold ${
                      formErrors.reservedQuantity ? "border-red-500/60 focus:border-red-500" : "border-[#22252e] focus:border-primary"
                    }`}
                  />
                  {formErrors.reservedQuantity && <p className="text-[9px] text-red-400 font-semibold">{formErrors.reservedQuantity}</p>}
                </div>

              </div>

              {/* Low stock threshold */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wide">Low Stock Alert Limit</label>
                <input
                  type="number"
                  min="0"
                  value={adjustForm.lowStockThreshold}
                  onChange={(e) => {
                    setAdjustForm({ ...adjustForm, lowStockThreshold: Number(e.target.value) });
                    if (formErrors.lowStockThreshold) setFormErrors({ ...formErrors, lowStockThreshold: "" });
                  }}
                  className={`w-full bg-[#1b1e26] border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none font-semibold ${
                    formErrors.lowStockThreshold ? "border-red-500/60 focus:border-red-500" : "border-[#22252e] focus:border-primary"
                  }`}
                />
                {formErrors.lowStockThreshold && <p className="text-[9px] text-red-400 font-semibold">{formErrors.lowStockThreshold}</p>}
              </div>

              <div className="h-[1px] bg-[#22252e] my-3 select-none" />

              {/* Audit fields */}
              <div className="space-y-3">
                <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block select-none">
                  Audit Log Information (Required)
                </span>

                {/* Reference ID */}
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-bold text-muted-foreground">Reference / PO Number</label>
                  <input
                    type="text"
                    placeholder="e.g. PO-1002, ADJ-Warehouse"
                    value={adjustForm.referenceId}
                    onChange={(e) => setAdjustForm({ ...adjustForm, referenceId: e.target.value })}
                    className="w-full bg-[#1b1e26] border border-[#22252e] rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Adjustment Notes */}
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-bold text-muted-foreground">Audit Remarks</label>
                  <textarea
                    placeholder="Provide details about why stock is being modified..."
                    rows={2}
                    value={adjustForm.note}
                    onChange={(e) => setAdjustForm({ ...adjustForm, note: e.target.value })}
                    className="w-full bg-[#1b1e26] border border-[#22252e] rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary resize-none"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 pt-2 select-none">
                <button
                  type="button"
                  onClick={() => setAdjustingItem(null)}
                  className="w-1/2 bg-[#1b1e26] hover:bg-[#22252e] text-muted-foreground px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer border border-[#22252e]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-1/2 flex items-center justify-center gap-1.5 bg-primary text-[#090a0f] px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Save size={14} />
                  {isSubmitting ? "Syncing..." : "Update Stock"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

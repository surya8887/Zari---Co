import React, { useState } from "react";
import { MoreHorizontal, ChevronDown, Sparkles } from "lucide-react";
import { useAppStore } from "@/store";
import { toast } from "sonner";

interface AlertRow {
  id: string;
  image: string;
  name: string;
  customer: string;
  date: string;
  amount: string;
  status: "Processing" | "Low Stock" | "Dispatched";
  payment: "Paid" | "Pending" | "Refunded";
}

export const InventoryAlertsTable: React.FC = () => {
  const { searchQuery } = useAppStore();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const rows: AlertRow[] = [
    {
      id: "AUR-901",
      image: "/assets/aurora_earrings.png",
      name: "Aurora Earrings - Gold",
      customer: "Liam Chen",
      date: "27 Oct 2023",
      amount: "$1,850",
      status: "Processing",
      payment: "Paid"
    },
    {
      id: "SER-302",
      image: "/assets/serenity_bracelet.png",
      name: "Serenity Bracelet",
      customer: "Liam Chen",
      date: "27 Oct 2023",
      amount: "$1,850",
      status: "Processing",
      payment: "Paid"
    },
    {
      id: "ELY-004",
      image: "/assets/elysian_ring.png",
      name: "Elysian Diamond Ring",
      customer: "Emily R. (Custom Bespoke)",
      date: "18 May 2026",
      amount: "$28,450",
      status: "Low Stock",
      payment: "Pending"
    }
  ];

  // Filter rows based on search query
  const filteredRows = rows.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleActionClick = (id: string, action: string) => {
    setActiveMenuId(null);
    toast.success(`Action Executed: "${action}" for item ${id}`, {
      description: "Triggering database dispatch sequence.",
      icon: <Sparkles size={14} className="text-primary animate-pulse" />
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Processing":
        return "bg-[#241e17] text-[#c5a880] border border-[#3b3227]";
      case "Low Stock":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      default:
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    }
  };

  const getPaymentBadge = (payment: string) => {
    switch (payment) {
      case "Paid":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "Pending":
        return "bg-[#241e17] text-[#c5a880] border border-[#3b3227]";
      default:
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4 transition-all duration-300 hover:shadow-[0_0_15px_rgba(197,168,128,0.03)] relative overflow-visible">
      <div className="flex justify-between items-center border-b border-border/50 pb-4">
        <div>
          <h3 className="text-sm font-bold text-foreground tracking-wide uppercase">Inventory Alerts</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Critical low stocks and custom order approvals</p>
        </div>
        <button 
          onClick={() => toast.info("Accessing advanced inventory dashboard lists.")}
          className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-1"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Table structure */}
      <div className="overflow-x-auto min-h-48 overflow-y-visible">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border text-muted-foreground font-semibold">
              <th className="pb-3 pl-2">Order ID / Product</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3 text-center">Status</th>
              <th className="pb-3 text-center">Payment</th>
              <th className="pb-3 pr-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 overflow-y-visible">
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-muted-foreground italic">
                  No matching inventory alerts found.
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => (
                <tr key={row.id} className="hover:bg-secondary/20 transition-colors group">
                  <td className="py-3.5 pl-2 flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src={row.image} 
                        alt={row.name} 
                        className="w-10 h-10 rounded-lg object-cover border border-border group-hover:border-primary/50 transition-colors"
                      />
                      {row.status === "Low Stock" && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 block border-2 border-card" />
                      )}
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground group-hover:text-primary-foreground transition-all">{row.name}</h5>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Code: <span className="font-mono text-primary/80">{row.id}</span> | Customer: {row.customer}
                      </p>
                    </div>
                  </td>
                  <td className="py-3.5 font-medium text-muted-foreground">{row.date}</td>
                  <td className="py-3.5 font-semibold text-foreground">{row.amount}</td>
                  <td className="py-3.5 text-center select-none">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold ${getStatusBadge(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-center select-none">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold ${getPaymentBadge(row.payment)}`}>
                      {row.payment}
                    </span>
                  </td>
                  <td className="py-3.5 pr-2 text-right relative overflow-visible">
                    <div className="inline-block text-left">
                      <button 
                        onClick={() => setActiveMenuId(activeMenuId === row.id ? null : row.id)}
                        className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-bold cursor-pointer hover:underline select-none"
                      >
                        View/Edit <ChevronDown size={12} className={`transition-transform duration-200 ${activeMenuId === row.id ? "rotate-180" : ""}`} />
                      </button>

                      {/* Dropdown Action Portal */}
                      {activeMenuId === row.id && (
                        <div className="absolute right-0 mt-1 w-36 rounded-lg border border-border bg-[#12141a] shadow-lg py-1 z-50 animate-in fade-in duration-100">
                          <button
                            onClick={() => handleActionClick(row.id, "View Order Details")}
                            className="w-full text-left px-3 py-1.5 hover:bg-[#241e17]/50 hover:text-primary text-[11px] text-muted-foreground transition-colors cursor-pointer"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => handleActionClick(row.id, "Configure Stock")}
                            className="w-full text-left px-3 py-1.5 hover:bg-[#241e17]/50 hover:text-primary text-[11px] text-muted-foreground transition-colors cursor-pointer"
                          >
                            Adjust Stock
                          </button>
                          <button
                            onClick={() => handleActionClick(row.id, "Approve Bespoke")}
                            className="w-full text-left px-3 py-1.5 hover:bg-[#241e17]/50 hover:text-primary text-[11px] text-muted-foreground transition-colors cursor-pointer"
                          >
                            Approve Order
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
};

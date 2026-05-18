import React, { useState } from "react";
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Gem,
  MessageSquare,
  ChevronDown,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { StatCard } from "@/components/common/StatCard";
import { SalesChart } from "@/components/charts/SalesChart";
import { TopProductsCard } from "@/components/common/TopProductsCard";
import { InventoryAlertsTable } from "@/components/common/InventoryAlertsTable";
import { RecentReviewsCard } from "@/components/common/RecentReviewsCard";
import { toast } from "sonner";

const Dashboard: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    const toastId = toast.loading("Fetching fresh boutique sales metrics from house APIs...");
    
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Dashboard metrics synchronized successfully! ✦", {
        id: toastId,
        description: "Re-calculated daily revenue metrics and inventory counts.",
        icon: <Sparkles size={14} className="text-primary animate-pulse" />
      });
    }, 1100);
  };

  const handleMessagesAction = (filter: string) => {
    toast.info(`Filtering quick message feeds: "${filter}"`, {
      description: "Sorting recent patron chat logs."
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Dashboard Overview Header */}
      <div className="flex justify-between items-center border-b border-border/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground font-serif">Dashboard Overview</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Real-time overview of jewelry house activities and patron acquisitions.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <button 
            onClick={handleRefresh}
            className={`flex items-center justify-center border border-border bg-[#101216]/50 text-foreground w-8 h-8 rounded-lg hover:bg-secondary/40 transition-all cursor-pointer ${isRefreshing ? "animate-spin text-primary" : ""}`}
            title="Refresh Metrics"
          >
            <RefreshCw size={14} />
          </button>
          
          {/* Messages Filter Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 border border-border bg-[#101216]/50 text-foreground px-4 py-2 rounded-lg text-xs font-semibold hover:bg-secondary/40 transition-all cursor-pointer select-none">
              <MessageSquare size={14} className="text-primary" />
              Messages
              <ChevronDown size={12} className="text-muted-foreground ml-1 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute right-0 mt-1 w-32 rounded-lg border border-border bg-[#12141a] shadow-lg py-1 z-50 hidden group-hover:block animate-in fade-in duration-75">
              <button 
                onClick={() => handleMessagesAction("Unread Only")}
                className="w-full text-left px-3 py-1.5 hover:bg-[#241e17]/50 hover:text-primary text-[11px] text-muted-foreground transition-colors cursor-pointer"
              >
                Unread Only
              </button>
              <button 
                onClick={() => handleMessagesAction("Archived")}
                className="w-full text-left px-3 py-1.5 hover:bg-[#241e17]/50 hover:text-primary text-[11px] text-muted-foreground transition-colors cursor-pointer"
              >
                Archived Feed
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Layout (Left 3/4, Right 1/4) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* LEFT COLUMN: Stat cards, Chart, and Table */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard 
              title="Total Revenue"
              value="$28,450.30"
              trend="▲ 15.8%"
              icon={<DollarSign size={20} className="text-primary" />}
              iconBgClass="bg-[#241e17] border border-[#3b3227]"
            />
            <StatCard 
              title="Total Orders"
              value="114"
              trend="▲ 9.3%"
              icon={<ShoppingBag size={20} className="text-[#a07c55]" />}
              iconBgClass="bg-[#241e17] border border-[#3b3227]"
            />
            <StatCard 
              title="New Customers"
              value="43"
              trend="▲ 12%"
              icon={<Users size={20} className="text-blue-400" />}
              iconBgClass="bg-[#171e2c] border border-[#252f44]"
            />
            <StatCard 
              title="Active Products"
              value="245"
              icon={<Gem size={20} className="text-blue-300" />}
              iconBgClass="bg-[#171c2a] border border-[#252d42]"
            />
          </div>

          {/* Line/Area Chart */}
          <SalesChart />

          {/* Inventory Alerts Table */}
          <InventoryAlertsTable />

        </div>

        {/* RIGHT COLUMN: Top Selling Products and Recent Reviews */}
        <div className="space-y-6">
          
          {/* Top Selling Products Block */}
          <TopProductsCard />

          {/* Recent Reviews Block */}
          <RecentReviewsCard />

        </div>

      </div>
    </div>
  );
};

export default Dashboard;

import React from "react";
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Gem,
  MessageSquare,
  ChevronDown,
  MoreHorizontal
} from "lucide-react";
import { MetricCard } from "@/components/common/MetricCard";
import { ProductListRow } from "@/components/common/ProductListRow";
import { ReviewItem } from "@/components/common/ReviewItem";
import { SalesChart } from "@/components/charts/SalesChart";

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Dashboard Overview Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground font-serif">Dashboard Overview</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Real-time overview of jewelry house activities.</p>
        </div>
        <button className="flex items-center gap-1.5 border border-border bg-[#101216]/50 text-foreground px-4 py-2 rounded-lg text-xs font-semibold hover:bg-secondary/40 transition-all cursor-pointer">
          <MessageSquare size={14} className="text-primary" />
          Messages
          <ChevronDown size={12} className="text-muted-foreground ml-1" />
        </button>
      </div>

      {/* Main Grid Layout (Left 3/4, Right 1/4) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* LEFT COLUMN: Stat cards, Chart, and Table */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard 
              title="Total Revenue"
              value="$28,450.30"
              trend="▲ 15.8%"
              icon={<DollarSign size={20} className="text-primary" />}
              iconBgClass="bg-[#241e17] border border-[#3b3227]"
            />
            <MetricCard 
              title="Total Orders"
              value="114"
              trend="▲ 9.3%"
              icon={<ShoppingBag size={20} className="text-[#a07c55]" />}
              iconBgClass="bg-[#241e17] border border-[#3b3227]"
            />
            <MetricCard 
              title="New Customers"
              value="43"
              trend="▲ 12%"
              icon={<Users size={20} className="text-blue-400" />}
              iconBgClass="bg-[#171e2c] border border-[#252f44]"
            />
            <MetricCard 
              title="Active Products"
              value="245"
              icon={<Gem size={20} className="text-blue-300" />}
              iconBgClass="bg-[#171c2a] border border-[#252d42]"
            />
          </div>

          {/* Line/Area Chart */}
          <SalesChart />

          {/* Inventory Alerts Table */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-border/50 pb-4">
              <div>
                <h3 className="text-base font-semibold text-foreground tracking-wide">Inventory Alerts</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Critical low stocks and custom order approvals</p>
              </div>
              <button className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                <MoreHorizontal size={18} />
              </button>
            </div>

            {/* Table structure */}
            <div className="overflow-x-auto">
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
                <tbody className="divide-y divide-border/40">
                  {/* Row 1 */}
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="py-4 pl-2 flex items-center gap-3">
                      <img 
                        src="/assets/aurora_earrings.png" 
                        alt="Aurora Earrings" 
                        className="w-10 h-10 rounded-lg object-cover border border-border"
                      />
                      <div>
                        <h5 className="font-semibold text-foreground">Aurora Earrings - Gold</h5>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Customer: Liam Chen</p>
                      </div>
                    </td>
                    <td className="py-4 font-medium text-muted-foreground">27 Oct 2023</td>
                    <td className="py-4 font-semibold text-foreground">$1,850</td>
                    <td className="py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-semibold bg-[#241e17] text-[#c5a880] border border-[#3b3227]">
                        Processing
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Paid
                      </span>
                    </td>
                    <td className="py-4 pr-2 text-right">
                      <button className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-semibold cursor-pointer">
                        View/Edit <ChevronDown size={12} />
                      </button>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="py-4 pl-2 flex items-center gap-3">
                      <img 
                        src="/assets/serenity_bracelet.png" 
                        alt="Serenity Bracelet" 
                        className="w-10 h-10 rounded-lg object-cover border border-border"
                      />
                      <div>
                        <h5 className="font-semibold text-foreground">Serenity Bracelet</h5>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Customer: Liam Chen</p>
                      </div>
                    </td>
                    <td className="py-4 font-medium text-muted-foreground">27 Oct 2023</td>
                    <td className="py-4 font-semibold text-foreground">$1,850</td>
                    <td className="py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-semibold bg-[#241e17] text-[#c5a880] border border-[#3b3227]">
                        Processing
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Paid
                      </span>
                    </td>
                    <td className="py-4 pr-2 text-right">
                      <button className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-semibold cursor-pointer">
                        View/Edit <ChevronDown size={12} />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Top Selling Products and Recent Reviews */}
        <div className="space-y-6">
          
          {/* Top Selling Products Block */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-border/50 pb-3">
              <h3 className="text-base font-semibold text-foreground tracking-wide">Top Selling Products</h3>
              <button className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                <MoreHorizontal size={18} />
              </button>
            </div>
            
            <div className="space-y-1.5">
              <ProductListRow 
                rank={1}
                image="/assets/elysian_ring.png"
                name="Elysian Diamond Ring"
                salesDetail="3 sales today"
                revenue="$28,450.30"
              />
              <ProductListRow 
                rank={2}
                image="/assets/sapphire_necklace.png"
                name="Sapphire Necklace"
                salesDetail="2 sales today"
                revenue="$13,430.30"
              />
              <ProductListRow 
                rank={3}
                image="/assets/gold_hoops.png"
                name="Gold Hoop Earrings"
                salesDetail="5 sales today"
                revenue="$13,850.00"
              />
              <ProductListRow 
                rank={4}
                image="/assets/halo_ring.png"
                name="Halo Engagement Ring"
                salesDetail="1 sale today"
                revenue="$7,980.00"
              />
              {/* Order index item display */}
              <div className="p-3 rounded-lg bg-secondary/20 border border-border/50 space-y-2 mt-2">
                <div className="flex justify-between items-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <span>Order ID</span>
                  <span>Payment</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="text-xs font-bold text-foreground">Honor #10982</h5>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Customer: Liam Chen</p>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Paid
                  </span>
                </div>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-1.5 py-2 text-xs border border-border rounded-lg bg-secondary/30 font-semibold hover:bg-secondary/60 transition-colors cursor-pointer text-foreground mt-2">
              View More <ChevronDown size={14} className="text-muted-foreground" />
            </button>
          </div>

          {/* Recent Reviews Block */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-border/50 pb-3">
              <h3 className="text-base font-semibold text-foreground tracking-wide">Recent Reviews</h3>
              <button className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                <MoreHorizontal size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <ReviewItem 
                rating={5}
                text="This ring is absolutely stunning and the diamond craftsmanship is spectacular. I got so many compliments."
                author="Emily R."
              />
              <ReviewItem 
                rating={5}
                text="Very high quality 18k yellow gold Hoops. Highly recommend Zari & Co to everyone who loves luxury jewelry pieces."
                author="Marcus K."
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;

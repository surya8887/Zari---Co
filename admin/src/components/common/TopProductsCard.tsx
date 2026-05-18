import React, { useState } from "react";
import { MoreHorizontal, ChevronDown, Sparkles } from "lucide-react";
import { useAppStore } from "@/store";
import { ProductListRow } from "./ProductListRow";
import { toast } from "sonner";

interface ProductItem {
  rank: number;
  image: string;
  name: string;
  salesDetail: string;
  revenue: string;
}

export const TopProductsCard: React.FC = () => {
  const { searchQuery } = useAppStore();
  const [limit, setLimit] = useState(4);

  const products: ProductItem[] = [
    {
      rank: 1,
      image: "/assets/elysian_ring.png",
      name: "Elysian Diamond Ring",
      salesDetail: "3 sales today",
      revenue: "$28,450.30"
    },
    {
      rank: 2,
      image: "/assets/sapphire_necklace.png",
      name: "Sapphire Necklace",
      salesDetail: "2 sales today",
      revenue: "$13,430.30"
    },
    {
      rank: 3,
      image: "/assets/gold_hoops.png",
      name: "Gold Hoop Earrings",
      salesDetail: "5 sales today",
      revenue: "$13,850.00"
    },
    {
      rank: 4,
      image: "/assets/halo_ring.png",
      name: "Halo Engagement Ring",
      salesDetail: "1 sale today",
      revenue: "$7,980.00"
    },
    {
      rank: 5,
      image: "/assets/serenity_bracelet.png",
      name: "Eternity Serenity Bracelet",
      salesDetail: "4 sales today",
      revenue: "$9,200.00"
    }
  ];

  // Filter products based on search query
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewMore = () => {
    if (limit === 4) {
      setLimit(5);
      toast.success("Loaded all best-selling jewelry catalog items.", {
        icon: <Sparkles size={14} className="text-primary animate-pulse" />
      });
    } else {
      setLimit(4);
      toast.info("Collapsed products listing view.");
    }
  };

  const handleCardAction = () => {
    toast.info("Accessing full bestsellers analytics reports.");
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4 transition-all duration-300 hover:shadow-[0_0_15px_rgba(197,168,128,0.03)] flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center border-b border-border/50 pb-3">
          <div>
            <h3 className="text-sm font-bold text-foreground tracking-wide uppercase">Top Selling Products</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Ranked by daily transaction yield</p>
          </div>
          <button 
            onClick={handleCardAction}
            className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-1"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
        
        <div className="space-y-1.5 mt-3">
          {filteredProducts.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-10 italic">
              No matching products found.
            </p>
          ) : (
            filteredProducts.slice(0, limit).map((p) => (
              <ProductListRow 
                key={p.rank}
                rank={p.rank}
                image={p.image}
                name={p.name}
                salesDetail={p.salesDetail}
                revenue={p.revenue}
              />
            ))
          )}

          {/* Elegant Order summary sub-card */}
          {searchQuery === "" && (
            <div className="p-3 rounded-lg bg-secondary/20 border border-border/50 space-y-2 mt-2 select-none hover:bg-secondary/35 transition-colors">
              <div className="flex justify-between items-center text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">
                <span>Order ID</span>
                <span>Payment Status</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="text-xs font-bold text-foreground">Honor #10982</h5>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Customer: Liam Chen</p>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Paid
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {filteredProducts.length > 4 && (
        <button 
          onClick={handleViewMore}
          className="w-full flex items-center justify-center gap-1.5 py-2 text-xs border border-border rounded-lg bg-secondary/30 font-semibold hover:bg-secondary/60 transition-all cursor-pointer text-foreground mt-2"
        >
          {limit === 4 ? "View More" : "View Less"} 
          <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${limit > 4 ? "rotate-180" : ""}`} />
        </button>
      )}
    </div>
  );
};

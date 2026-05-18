import React from "react";
import { useAppStore } from "@/store";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminHeader } from "@/components/layout/AdminHeader";
import Dashboard from "@/pages/Dashboard";
import Orders from "@/pages/Orders";
import Products from "@/pages/Products";
import { useAuth } from "@/hooks/useAuth";
import Login from "@/pages/Login";
import { 
  Megaphone, 
  HelpCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Tag
} from "lucide-react";
import { toast } from "sonner";

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = () => {
  const { currentPage } = useAppStore();
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  const handleActionMock = (title: string) => {
    toast.success(`Action Triggered: "${title}"`, {
      description: "Successfully processed the administration task.",
      icon: <Sparkles size={14} className="text-primary animate-pulse" />
    });
  };

  // State-Based Router Views
  const renderPageView = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      
      case "products-list":
      case "new-product":
      case "collections":
      case "inventory":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground font-serif capitalize">
                  {currentPage.replace("-", " ")}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Aurélia Jewels premium inventory control and collection manager.
                </p>
              </div>
              <button 
                onClick={() => handleActionMock(`Export ${currentPage}`)}
                className="flex items-center gap-1.5 border border-border bg-[#101216]/50 text-foreground px-4 py-2 rounded-lg text-xs font-semibold hover:bg-secondary/40 transition-all cursor-pointer"
              >
                Export Catalogue
              </button>
            </div>
            <Products />
          </div>
        );

      case "all-orders":
      case "new-orders":
      case "shipped":
      case "returns":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground font-serif capitalize">
                  {currentPage.replace("-", " ")}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Monitor client luxury boutique acquisitions and shipping status.
                </p>
              </div>
              <button 
                onClick={() => handleActionMock(`Process ${currentPage}`)}
                className="flex items-center gap-1.5 border border-border bg-[#101216]/50 text-foreground px-4 py-2 rounded-lg text-xs font-semibold hover:bg-secondary/40 transition-all cursor-pointer"
              >
                Fulfill Batch
              </button>
            </div>
            <Orders />
          </div>
        );

      case "customers":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground font-serif">Customer Directory</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manage profiles, spend analysis, and communications for elite patrons.
                </p>
              </div>
              <button 
                onClick={() => handleActionMock("Export Patrons")}
                className="flex items-center gap-1.5 border border-border bg-[#101216]/50 text-foreground px-4 py-2 rounded-lg text-xs font-semibold hover:bg-secondary/40 transition-all cursor-pointer"
              >
                Export VIP List
              </button>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Active Jewelry Patron Profiles</h3>
                <span className="text-[10px] text-primary bg-[#241e17] border border-[#3b3227] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  3 Elite Members
                </span>
              </div>
              <div className="divide-y divide-border/40">
                {[
                  { name: "Liam Chen", email: "l.chen@emeraldholdings.com", tier: "Gold Patron", spend: "$45,200", orders: 12 },
                  { name: "Emily R.", email: "emily.r@luxuryestate.com", tier: "Diamond VIP", spend: "$120,400", orders: 28 },
                  { name: "Marcus K.", email: "marcus.k@vip.zariandco.com", tier: "Platinum Patron", spend: "$78,500", orders: 19 }
                ].map((c, i) => (
                  <div key={i} className="py-3 flex items-center justify-between hover:bg-secondary/15 px-2 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#241e17] border border-[#3b3227] flex items-center justify-center text-xs font-bold text-primary">
                        {c.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-foreground">{c.name}</h4>
                        <p className="text-[10px] text-muted-foreground">{c.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-right">
                      <div>
                        <span className="text-[9px] text-muted-foreground uppercase block">Patron Tier</span>
                        <span className="text-xs font-bold text-primary">{c.tier}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-muted-foreground uppercase block">Life Spend</span>
                        <span className="text-xs font-semibold text-foreground">{c.spend}</span>
                      </div>
                      <button 
                        onClick={() => handleActionMock(`View Profile for ${c.name}`)}
                        className="text-primary hover:text-primary-foreground font-bold text-[11px] cursor-pointer flex items-center gap-0.5"
                      >
                        Profile <ArrowRight size={10} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "campaigns":
      case "promotions":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground font-serif">Marketing Campaigns</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Launch promotions, custom luxury lookbooks, and email brochures.
                </p>
              </div>
              <button 
                onClick={() => handleActionMock("New lookbook campaign")}
                className="flex items-center gap-1.5 bg-primary text-[#090a0f] px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary/95 transition-all cursor-pointer shadow-[0_0_12px_rgba(197,168,128,0.2)]"
              >
                Create Lookbook Campaign
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded-lg bg-[#241e17] border border-[#3b3227] text-primary">
                    <Megaphone size={16} />
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Active
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Royal Solitaire Campaign</h4>
                  <p className="text-xs text-muted-foreground mt-1">Targeted luxury brochure dispatch to Diamond & Platinum VIP tiers.</p>
                </div>
                <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-2 border-t border-border/40">
                  <span>Reach: 24,000 clients</span>
                  <span>Conversion: 12.4%</span>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded-lg bg-[#171e2c] border border-[#252f44] text-blue-400">
                    <Tag size={16} />
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Scheduled
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Summer Solstice Gold Specials</h4>
                  <p className="text-xs text-muted-foreground mt-1">Simulated 10% special collection price discount applied automatically on gold hoops.</p>
                </div>
                <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-2 border-t border-border/40">
                  <span>Scheduled: June 21, 2026</span>
                  <span>Target: All Patrons</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "sales-report":
      case "traffic-report":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground font-serif capitalize">
                  {currentPage.replace("-", " ")}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Analytical charts, conversion stats, and performance indexes.
                </p>
              </div>
              <button 
                onClick={() => handleActionMock(`Export CSV ${currentPage}`)}
                className="flex items-center gap-1.5 border border-border bg-[#101216]/50 text-foreground px-4 py-2 rounded-lg text-xs font-semibold hover:bg-secondary/40 transition-all cursor-pointer"
              >
                Download PDF Audit
              </button>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center justify-center py-16 space-y-3">
              <div className="p-4 rounded-full bg-[#241e17] border border-[#3b3227] text-primary">
                <TrendingUp size={28} className="animate-bounce" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-base font-semibold text-foreground">Generating Performance Metrics</h3>
                <p className="text-xs text-muted-foreground max-w-sm">
                  The system is rendering high-performance data reports. Real-time graphs will display shortly.
                </p>
              </div>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground font-serif">System Settings</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Configure Aurelia Jewels boutique, payout schemes, branding parameters, and APIs.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Administrative Preferences</h3>
              <form onSubmit={(e) => { e.preventDefault(); handleActionMock("Save Settings"); }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Boutique House Name</label>
                    <input 
                      type="text" 
                      defaultValue="Aurélia Jewels Boutique" 
                      className="w-full px-3 py-2 text-xs border border-border bg-[#0d0f14]/50 rounded-lg text-foreground focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Notification Email</label>
                    <input 
                      type="email" 
                      defaultValue="admin@aureliajewels.com" 
                      className="w-full px-3 py-2 text-xs border border-border bg-[#0d0f14]/50 rounded-lg text-foreground focus:outline-none focus:border-primary/50"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button 
                    type="submit"
                    className="bg-primary text-[#090a0f] text-xs font-bold px-4 py-2 rounded-lg hover:bg-primary/95 transition-colors cursor-pointer select-none"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      case "reviews":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground font-serif">Patron Feedback</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Review and approve client feedback, star ratings, and response logs.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Boutique Feedback Logs</h3>
              <div className="divide-y divide-border/40">
                {[
                  { author: "Emily R.", date: "18 May 2026", rating: 5, text: "This ring is absolutely stunning and the diamond craftsmanship is spectacular. I got so many compliments." },
                  { author: "Marcus K.", date: "15 May 2026", rating: 5, text: "Very high quality 18k yellow gold Hoops. Highly recommend Zari & Co to everyone who loves luxury jewelry pieces." },
                  { author: "Sarah P.", date: "12 May 2026", rating: 4, text: "Bespoke custom order shipping took slightly longer than estimated, but the quality of the packaging and the piece is phenomenal." }
                ].map((r, i) => (
                  <div key={i} className="py-4 space-y-1.5 first:pt-0 last:pb-0">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-foreground">{r.author}</span>
                      <span className="text-[10px] text-muted-foreground">{r.date}</span>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} size={10} className={idx < r.rating ? "fill-primary text-primary" : "text-muted"} />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground italic">"{r.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
            <HelpCircle size={32} className="text-muted-foreground animate-pulse" />
            <div>
              <h3 className="text-base font-semibold text-foreground">Workspace Page Not Found</h3>
              <p className="text-xs text-muted-foreground">The page route you requested is currently unconfigured.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex text-foreground font-sans overflow-x-hidden">
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* HEADER */}
        <AdminHeader />

        {/* PAGE CONTENT CONTAINER */}
        <main className="p-8 flex-grow">
          {renderPageView()}
        </main>
      </div>
    </div>
  );
};

// Help helper for ratings
const Star: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

import React from "react";
import { Plus, Trash2, Edit3, Eye, EyeOff } from "lucide-react";
import { type Product, type Category } from "@/store";
import { EmptyState } from "@/components/common/EmptyState";

interface ProductTableViewProps {
  products: Product[];
  categories: Category[];
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string, name: string) => void;
  onAddNew: () => void;
}

const getCategoryBadgeTheme = (id: string) => {
  switch (id) {
    case "cat-rings":
      return "text-primary bg-[#241e17] border-[#3b3227]";
    case "cat-necklaces":
      return "text-blue-400 bg-[#171e2c] border-[#252f44]";
    case "cat-earrings":
      return "text-[#a58b68] bg-[#241e17] border-[#3b3227]";
    case "cat-bracelets":
      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    default:
      return "text-muted-foreground bg-secondary/30 border-border";
  }
};

export const ProductTableView: React.FC<ProductTableViewProps> = ({
  products,
  categories,
  onView,
  onEdit,
  onDelete,
  onAddNew,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-left select-none">
      {/* Products Table Card */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex justify-between items-center border-b border-border/50 pb-4">
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Boutique Catalog Database</h3>
            <p className="text-xs text-muted-foreground mt-0.5">View GIA registered pieces and edit corresponding rich text descriptions.</p>
          </div>
          <button
            onClick={onAddNew}
            className="flex items-center gap-1.5 bg-primary text-[#090a0f] px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-primary/95 transition-all cursor-pointer shadow-[0_0_8px_rgba(197,168,128,0.15)]"
          >
            <Plus size={14} />
            Add Piece
          </button>
        </div>

        {products.length === 0 ? (
          <div className="py-8">
            <EmptyState
              title="Catalog is Currently Empty"
              description="No luxury jewelry pieces exist in your database yet. Start by adding your first collection piece above."
              actionText="Launch New Piece"
              onAction={onAddNew}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-semibold">
                  <th className="pb-3 pl-2">Product Details</th>
                  <th className="pb-3">Catalog SKU</th>
                  <th className="pb-3">Category Relation</th>
                  <th className="pb-3">GIA Price</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {products.map((prod) => {
                  const resolvedCategory = categories.find((c) => c.id === prod.categoryId);
                  const catName = resolvedCategory ? resolvedCategory.name : "Unknown";
                  return (
                    <tr key={prod.id} className="hover:bg-secondary/20 transition-colors group">
                      <td
                        className="py-4 pl-2 flex items-center gap-3 cursor-pointer"
                        onClick={() => onView(prod)}
                        title="Click to view full luxury specifications"
                      >
                        {prod.images && prod.images.length > 0 ? (
                          (() => {
                            const mainImg = prod.images.find((img) => img.isPrimary) || prod.images[0];
                            const mainSrc = mainImg.imageUrl.startsWith("http") ? mainImg.imageUrl : `http://localhost:5000${mainImg.imageUrl}`;
                            return (
                              <img
                                src={mainSrc}
                                alt={prod.name}
                                className="w-10 h-10 rounded-lg object-cover border border-[#3b3227] group-hover:border-primary/50 transition-all shadow-[0_0_10px_rgba(197,168,128,0.08)]"
                              />
                            );
                          })()
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-[#241e17] border border-[#3b3227] flex items-center justify-center text-primary font-bold text-xs select-none shadow-[0_0_10px_rgba(197,168,128,0.05)]">
                            {prod.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                        )}
                        <div>
                          <h5 className="font-semibold text-foreground group-hover:text-primary-foreground group-hover:underline transition-all">
                            {prod.name}
                          </h5>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Code: {prod.sku}</p>
                        </div>
                      </td>
                      <td className="py-4 font-mono font-medium text-muted-foreground uppercase">{prod.sku}</td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold border ${getCategoryBadgeTheme(prod.categoryId)}`}>
                          {catName}
                        </span>
                      </td>
                      <td className="py-4 font-semibold text-foreground">
                        ${Number(prod.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

                      {/* Publish / Draft status mapping schema */}
                      <td className="py-4 text-center select-none">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[9px] font-bold border ${
                            prod.isPublished
                              ? "text-primary bg-[#241e17] border-[#3b3227]"
                              : "text-muted-foreground bg-secondary/30 border-border"
                          }`}
                        >
                          {prod.isPublished ? <Eye size={10} /> : <EyeOff size={10} />}
                          {prod.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>

                      <td className="py-4 pr-2 text-right">
                        <div className="flex justify-end gap-2.5 select-none">
                          {/* Edit Button */}
                          <button
                            onClick={() => onEdit(prod)}
                            className="w-7 h-7 rounded-lg border border-border bg-[#0d0f14]/50 flex items-center justify-center text-primary hover:bg-primary hover:text-[#090a0f] transition-all cursor-pointer"
                            title="Edit GIA rich sheets"
                          >
                            <Edit3 size={12} />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => onDelete(prod.id, prod.name)}
                            className="w-7 h-7 rounded-lg border border-border bg-[#0d0f14]/50 flex items-center justify-center text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                            title="Delete piece"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

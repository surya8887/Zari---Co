import React, { useState } from "react";
import { X, Sparkles, Gem, FolderTree, Eye, EyeOff, Heart, Edit3 } from "lucide-react";
import { type Product, type Category } from "@/store";
import { cn } from "@/lib/utils";

interface ProductDetailModalProps {
  product: Product;
  categories: Category[];
  onClose: () => void;
  onEdit: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  categories,
  onClose,
  onEdit,
}) => {
  const resolvedCategory = categories.find((c) => c.id === product.categoryId);
  const catName = resolvedCategory ? resolvedCategory.name : "Unknown Category";

  const [activeImageId, setActiveImageId] = useState<string | null>(null);

  // Compute selected or fallback primary image
  const activeImg = product.images && product.images.length > 0
    ? (product.images.find((img) => img.id === activeImageId) || product.images.find((img) => img.isPrimary) || product.images[0])
    : null;

  const activeSrc = activeImg
    ? (activeImg.imageUrl.startsWith("http") ? activeImg.imageUrl : `http://localhost:5000${activeImg.imageUrl}`)
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#090a0f]/80 backdrop-blur-md p-4 animate-in fade-in duration-300 text-left">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-[#0d0f14]/95 text-foreground shadow-2xl p-6 md:p-8 space-y-6 animate-in scale-in duration-300">
        {/* Elegant Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full border border-border bg-[#090a0f]/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Header Sheet Info */}
        <div className="border-b border-border/50 pb-4 pr-10">
          <span className="text-[10px] text-primary font-bold tracking-widest uppercase flex items-center gap-1.5 mb-1.5 animate-pulse">
            <Sparkles size={12} className="text-primary" />
            GIA Luxury Specification Sheet
          </span>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground">{product.name}</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Catalogue ID: <span className="font-mono text-primary/95">{product.sku}</span> | Assigned Category ID: <span className="font-mono">{product.categoryId}</span>
          </p>
        </div>

        {/* Two-Column Space Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Image Carousel / Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-xl bg-secondary/10 border border-border/60 overflow-hidden flex items-center justify-center group shadow-[0_0_20px_rgba(197,168,128,0.05)]">
              {activeSrc ? (
                <img
                  src={activeSrc}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="text-center p-6 space-y-3 animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto border border-border/40 shadow-xs">
                    <Gem size={28} className="text-primary opacity-50 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">No Media Artifacts Uploaded</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Please add product photos inside GIA catalog editor.</p>
                  </div>
                </div>
              )}

              {/* Glassmorphic price tag pill */}
              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-[#090a0f]/80 backdrop-blur-md border border-primary/20 text-xs font-bold text-primary select-none">
                ${Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>

            {/* Optional gallery thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1 select-none">
                {product.images.map((img) => {
                  const isCurrentlyActive = activeImageId ? img.id === activeImageId : img.isPrimary;
                  const normalizedImgUrl = img.imageUrl.startsWith("http") ? img.imageUrl : `http://localhost:5000${img.imageUrl}`;
                  return (
                    <div
                      key={img.id}
                      onClick={() => setActiveImageId(img.id)}
                      className={cn(
                        "w-14 h-14 rounded-lg overflow-hidden border bg-secondary/10 cursor-pointer transition-all duration-200 flex-shrink-0",
                        isCurrentlyActive ? "border-primary shadow-[0_0_8px_rgba(197,168,128,0.15)]" : "border-border/50 hover:border-border"
                      )}
                    >
                      <img src={normalizedImgUrl} alt="Gallery thumbnail" className="w-full h-full object-cover" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Dynamic Tabs Specifications & Info */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category, SKU and Status badges */}
              <div className="flex flex-wrap gap-2 select-none text-left">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#241e17] border border-[#3b3227] text-primary">
                  <FolderTree size={10} />
                  {catName}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#0d0f14] border border-border text-muted-foreground">
                  <Gem size={10} />
                  SKU: {product.sku}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border",
                    product.isPublished
                      ? "bg-[#142417] border-[#203c26] text-emerald-400"
                      : "bg-secondary/40 border-border text-muted-foreground"
                  )}
                >
                  {product.isPublished ? <Eye size={10} /> : <EyeOff size={10} />}
                  {product.isPublished ? "Active Catalog" : "Draft Workspace"}
                </span>
              </div>

              {/* Specifications and Tabs Details */}
              <div className="space-y-4 text-xs">
                {/* Story & Description */}
                {product.description && (
                  <div className="p-4 rounded-xl bg-secondary/15 border border-border/40 space-y-1.5 text-left animate-in slide-in-from-bottom-2 duration-200">
                    <h4 className="font-semibold text-foreground uppercase tracking-widest text-[9px] text-primary flex items-center gap-1">
                      <Sparkles size={10} />
                      Creation Narrative
                    </h4>
                    <div
                      className="text-muted-foreground leading-relaxed font-light prose prose-invert max-w-none text-[11px]"
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  </div>
                )}

                {/* GIA Specifications Details */}
                {product.details && (
                  <div className="p-4 rounded-xl bg-secondary/15 border border-border/40 space-y-1.5 text-left animate-in slide-in-from-bottom-2 duration-300">
                    <h4 className="font-semibold text-foreground uppercase tracking-widest text-[9px] text-primary flex items-center gap-1">
                      <Gem size={10} />
                      GIA Jewelry Specifications
                    </h4>
                    <div
                      className="text-muted-foreground leading-relaxed font-light prose prose-invert max-w-none text-[11px]"
                      dangerouslySetInnerHTML={{ __html: product.details }}
                    />
                  </div>
                )}

                {/* Heritage & Care Instructions */}
                {product.careInstructions && (
                  <div className="p-4 rounded-xl bg-secondary/15 border border-border/40 space-y-1.5 text-left animate-in slide-in-from-bottom-2 duration-400">
                    <h4 className="font-semibold text-foreground uppercase tracking-widest text-[9px] text-primary flex items-center gap-1">
                      <Heart size={10} />
                      Care & Heritage Guidance
                    </h4>
                    <div
                      className="text-muted-foreground leading-relaxed font-light prose prose-invert max-w-none text-[11px]"
                      dangerouslySetInnerHTML={{ __html: product.careInstructions }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Actions Sheet Footer Buttons */}
            <div className="flex gap-3 border-t border-border/50 pt-4 mt-auto">
              <button
                onClick={() => onEdit(product)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-[#090a0f] py-2 rounded-lg text-xs font-bold hover:bg-primary/95 transition-all cursor-pointer"
              >
                <Edit3 size={12} />
                Edit Rich Specifications
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg border border-border text-xs font-bold hover:bg-secondary text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              >
                Close Sheet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { X, Sparkles, Gem, FolderTree, Eye, EyeOff, Heart, Edit3 } from "lucide-react";
import { type Product, type Category, useAppStore } from "@/store";
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

  // Zustand Store Variant Actions
  const addProductVariant = useAppStore((state) => state.addProductVariant);
  const updateProductVariant = useAppStore((state) => state.updateProductVariant);
  const deleteProductVariant = useAppStore((state) => state.deleteProductVariant);

  // Variant Form States
  const [isAddingVariant, setIsAddingVariant] = useState(false);
  const [variantForm, setVariantForm] = useState({
    name: "",
    sku: "",
    priceOverride: "",
    isActive: true,
  });

  // Compute selected or fallback primary image
  const activeImg = product.images && product.images.length > 0
    ? (product.images.find((img) => img.id === activeImageId) || product.images.find((img) => img.isPrimary) || product.images[0])
    : null;

  const activeSrc = activeImg
    ? (activeImg.imageUrl.startsWith("http") ? activeImg.imageUrl : `http://localhost:5000${activeImg.imageUrl}`)
    : "";

  const handleCreateVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!variantForm.name || !variantForm.sku) return;

    await addProductVariant(product.id, {
      name: variantForm.name,
      sku: variantForm.sku,
      priceOverride: variantForm.priceOverride ? parseFloat(variantForm.priceOverride) : null,
      isActive: variantForm.isActive,
      attributes: {}
    });

    setVariantForm({
      name: "",
      sku: "",
      priceOverride: "",
      isActive: true,
    });
    setIsAddingVariant(false);
  };

  const handleToggleVariantStatus = async (variantId: string, currentStatus: boolean) => {
    await updateProductVariant(product.id, variantId, {
      isActive: !currentStatus
    });
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (confirm("Are you sure you want to delete this product variant? This will purge its matching inventory record.")) {
      await deleteProductVariant(product.id, variantId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#08090d] overflow-y-auto animate-in fade-in duration-300 text-left select-none scrollbar-thin">
      <div className="relative w-full min-h-screen p-8 md:p-16 max-w-7xl mx-auto space-y-10 animate-in zoom-in-95 duration-300">
        
        {/* Elegant Prominent Close Button */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 md:right-16 md:top-12 px-5 py-2.5 rounded-xl border border-border bg-[#0d0f14]/90 flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all cursor-pointer shadow-lg active:scale-95"
        >
          <X size={14} />
          <span>Exit Immersive View</span>
        </button>

        {/* Header Sheet Info */}
        <div className="border-b border-border/50 pb-6 pr-40">
          <span className="text-xs text-primary font-bold tracking-widest uppercase flex items-center gap-1.5 mb-2 animate-pulse">
            <Sparkles size={14} className="text-primary" />
            GIA Luxury Specification Immersive Hub
          </span>
          <h2 className="font-serif text-4xl font-extrabold tracking-tight text-foreground leading-tight">{product.name}</h2>
          <p className="text-xs text-muted-foreground mt-2">
            Catalogue SKU: <span className="font-mono text-primary font-bold tracking-wider">{product.sku}</span> | Assigned Category ID: <span className="font-mono">{product.categoryId}</span>
          </p>
        </div>

        {/* Two-Column Immersive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Image Carousel / Gallery */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative aspect-square rounded-2xl bg-secondary/10 border border-border/60 overflow-hidden flex items-center justify-center group shadow-[0_0_30px_rgba(197,168,128,0.08)]">
              {activeSrc ? (
                <img
                  src={activeSrc}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="text-center p-6 space-y-3 animate-in fade-in">
                  <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto border border-border/40 shadow-xs">
                    <Gem size={32} className="text-primary opacity-50 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">No Media Artifacts Uploaded</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Please add product photos inside GIA catalog editor.</p>
                  </div>
                </div>
              )}

              {/* Glassmorphic price tag pill */}
              <div className="absolute bottom-4 right-4 px-4 py-2 rounded-xl bg-[#090a0f]/90 backdrop-blur-md border border-primary/20 text-sm font-bold text-primary select-none shadow-md">
                ${Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>

            {/* Optional gallery thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 select-none">
                {product.images.map((img) => {
                  const isCurrentlyActive = activeImageId ? img.id === activeImageId : img.isPrimary;
                  const normalizedImgUrl = img.imageUrl.startsWith("http") ? img.imageUrl : `http://localhost:5000${img.imageUrl}`;
                  return (
                    <div
                      key={img.id}
                      onClick={() => setActiveImageId(img.id)}
                      className={cn(
                        "w-16 h-16 rounded-xl overflow-hidden border bg-secondary/10 cursor-pointer transition-all duration-200 flex-shrink-0 p-1",
                        isCurrentlyActive ? "border-primary shadow-[0_0_12px_rgba(197,168,128,0.25)] scale-[1.03]" : "border-border/50 hover:border-border"
                      )}
                    >
                      <img src={normalizedImgUrl} alt="Gallery thumbnail" className="w-full h-full object-cover rounded-lg" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Dynamic Tabs Specifications & Info */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Category, SKU and Status badges */}
              <div className="flex flex-wrap gap-3 select-none text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#241e17] border border-[#3b3227] text-primary">
                  <FolderTree size={12} />
                  {catName}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0d0f14] border border-border text-muted-foreground">
                  <Gem size={12} />
                  SKU: {product.sku}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border",
                    product.isPublished
                      ? "bg-[#142417] border-[#203c26] text-emerald-400"
                      : "bg-secondary/40 border-border text-muted-foreground"
                  )}
                >
                  {product.isPublished ? <Eye size={12} /> : <EyeOff size={12} />}
                  {product.isPublished ? "Active Catalog" : "Draft Workspace"}
                </span>
              </div>

              {/* Specifications and Tabs Details */}
              <div className="space-y-6 text-sm">
                {/* Story & Description */}
                {product.description && (
                  <div className="p-6 rounded-2xl bg-secondary/15 border border-border/40 space-y-2.5 text-left animate-in slide-in-from-bottom-2 duration-200">
                    <h4 className="font-bold text-foreground uppercase tracking-widest text-[10px] text-primary flex items-center gap-1.5">
                      <Sparkles size={12} />
                      Creation Narrative
                    </h4>
                    <div
                      className="text-neutral-200 leading-relaxed font-normal prose prose-invert max-w-none text-sm"
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Actions Sheet Footer Buttons */}
            <div className="flex gap-4 border-t border-border/50 pt-6 mt-auto">
              <button
                onClick={() => onEdit(product)}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-[#090a0f] py-3 rounded-xl text-xs font-extrabold hover:bg-primary/95 transition-all cursor-pointer shadow-md active:scale-98"
              >
                <Edit3 size={14} />
                Edit Rich Specifications
              </button>
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-xl border border-border text-xs font-extrabold hover:bg-secondary text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              >
                Close Sheet
              </button>
            </div>
          </div>
        </div>

        {/* Specifications and Care side-by-side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border/50 pt-8">
          {/* Column 1: Diamond Specifications */}
          {product.details && (
            <div className="p-6 rounded-2xl bg-secondary/15 border border-border/40 space-y-4 text-left animate-in slide-in-from-bottom-2 duration-300">
              <h4 className="font-bold text-foreground uppercase tracking-widest text-[10px] text-primary flex items-center gap-1.5 border-b border-border/30 pb-2.5">
                <Gem size={14} className="text-primary animate-pulse" />
                Diamond Specifications
              </h4>
              <div
                className="text-neutral-200 leading-relaxed font-normal prose prose-invert max-w-none text-sm"
                dangerouslySetInnerHTML={{ __html: product.details }}
              />
            </div>
          )}

          {/* Column 2: Jewelry Care Instructions */}
          {product.careInstructions && (
            <div className="p-6 rounded-2xl bg-secondary/15 border border-border/40 space-y-4 text-left animate-in slide-in-from-bottom-2 duration-400">
              <h4 className="font-bold text-foreground uppercase tracking-widest text-[10px] text-primary flex items-center gap-1.5 border-b border-border/30 pb-2.5">
                <Heart size={14} className="text-rose-400" />
                Jewelry Care Instructions
              </h4>
              <div
                className="text-neutral-200 leading-relaxed font-normal prose prose-invert max-w-none text-sm"
                dangerouslySetInnerHTML={{ __html: product.careInstructions }}
              />
            </div>
          )}
        </div>
        {/* Full-width Product Variants Section */}
        <div className="border-t border-border/50 pt-8 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-serif text-2xl font-extrabold text-foreground flex items-center gap-2">
                <Gem className="text-primary w-6 h-6 animate-pulse" />
                Product Variants & Inventory Matrix
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Define sizing, custom metal finishes, price overrides, and track individual stock allocations.
              </p>
            </div>
            {!isAddingVariant && (
              <button
                onClick={() => setIsAddingVariant(true)}
                className="px-5 py-2 rounded-xl bg-primary/10 border border-primary/20 text-xs font-bold text-primary hover:bg-primary/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles size={12} />
                + Add Custom Variant
              </button>
            )}
          </div>

          {/* Inline Add Variant Form */}
          {isAddingVariant && (
            <form
              onSubmit={handleCreateVariant}
              className="p-6 rounded-2xl border border-primary/20 bg-[#161310]/30 space-y-4 animate-in slide-in-from-top-2 duration-300"
            >
              <div className="flex items-center justify-between border-b border-border/30 pb-2">
                <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <Sparkles size={12} />
                  New Product Variant Specs
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingVariant(false)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-muted-foreground uppercase font-semibold">Variant Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 18K Yellow Gold / Size 6"
                    value={variantForm.name}
                    onChange={(e) => setVariantForm({ ...variantForm, name: e.target.value })}
                    className="w-full bg-[#0d0f14] border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-muted-foreground uppercase font-semibold">Unique SKU</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RG-ASTG-YG6"
                    value={variantForm.sku}
                    onChange={(e) => setVariantForm({ ...variantForm, sku: e.target.value })}
                    className="w-full bg-[#0d0f14] border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-muted-foreground uppercase font-semibold">Price Override ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Inherit base price"
                    value={variantForm.priceOverride}
                    onChange={(e) => setVariantForm({ ...variantForm, priceOverride: e.target.value })}
                    className="w-full bg-[#0d0f14] border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingVariant(false)}
                  className="px-4 py-1.5 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-lg bg-primary text-[#090a0f] text-xs font-bold hover:bg-primary/95 transition-all cursor-pointer"
                >
                  Persist Variant Live
                </button>
              </div>
            </form>
          )}

          {/* Variants Table / Grid */}
          {!product.variants || product.variants.length === 0 ? (
            <div className="p-8 rounded-2xl border border-border/40 bg-secondary/5 text-center space-y-2">
              <p className="text-sm font-semibold text-muted-foreground">No custom variants defined yet</p>
              <p className="text-xs text-muted-foreground/75">
                Click "+ Add Custom Variant" above to define catalog options for this piece.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border/50 bg-[#0d0f14]/50 shadow-md">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border/40 bg-secondary/10 select-none">
                    <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Variant Details</th>
                    <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Unique SKU</th>
                    <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Price Allocation</th>
                    <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                    <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants.map((variant) => {
                    const price = variant.priceOverride 
                      ? `$${Number(variant.priceOverride).toFixed(2)}` 
                      : `Inherited ($${Number(product.price).toFixed(2)})`;

                    return (
                      <tr key={variant.id} className="border-b border-border/20 hover:bg-secondary/5 transition-colors">
                        <td className="p-4 font-semibold text-foreground text-sm">{variant.name}</td>
                        <td className="p-4 font-mono text-primary/80 text-sm">{variant.sku}</td>
                        <td className="p-4 text-muted-foreground text-sm">{price}</td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleVariantStatus(variant.id, variant.isActive)}
                            className={cn(
                              "px-3 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer",
                              variant.isActive
                                ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25"
                                : "bg-secondary/40 border-border text-muted-foreground hover:bg-secondary/60"
                            )}
                          >
                            {variant.isActive ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteVariant(variant.id)}
                            className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all cursor-pointer"
                            title="Delete Variant"
                          >
                            <X size={16} />
                          </button>
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
    </div>
  );
};

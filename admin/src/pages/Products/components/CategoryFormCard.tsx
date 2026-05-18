import React from "react";
import { Sparkles, Save } from "lucide-react";
import { type Category } from "@/store";
import { RichTextEditor } from "@/components/common/RichTextEditor";

interface CategoryFormCardProps {
  isEditingCategory: boolean;
  editingCategoryId: string | null;
  categories: Category[];
  catName: string;
  catSlug: string;
  catParentId: string;
  catDescription: string;
  catIsPublished: boolean;
  categoryError: string;
  onCatNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setCatSlug: (val: string) => void;
  setCatParentId: (val: string) => void;
  setCatDescription: (val: string) => void;
  setCatIsPublished: (val: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const CategoryFormCard: React.FC<CategoryFormCardProps> = ({
  isEditingCategory,
  editingCategoryId,
  categories,
  catName,
  catSlug,
  catParentId,
  catDescription,
  catIsPublished,
  categoryError,
  onCatNameChange,
  setCatSlug,
  setCatParentId,
  setCatDescription,
  setCatIsPublished,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="lg:col-span-1 rounded-xl border border-border bg-card p-6 space-y-4 h-fit">
      <div className="flex justify-between items-center border-b border-border/50 pb-3">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 select-none">
          <Sparkles size={14} className="text-primary animate-pulse" />
          {isEditingCategory ? "Modify Category" : "Add DB Category"}
        </h3>
        {isEditingCategory && (
          <button
            onClick={onCancel}
            type="button"
            className="text-[10px] text-muted-foreground hover:text-foreground font-semibold hover:underline cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Error Feedback */}
        {categoryError && (
          <p className="p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-[10px] font-semibold text-rose-400 leading-relaxed text-left">
            {categoryError}
          </p>
        )}

        {/* Name */}
        <div className="space-y-1 text-left">
          <label className="text-[10px] font-bold text-muted-foreground uppercase">Category Name</label>
          <input
            type="text"
            value={catName}
            onChange={onCatNameChange}
            placeholder="e.g. Royal Necklaces"
            className="w-full px-3 py-2 text-xs border border-border bg-[#0d0f14]/50 rounded-lg text-foreground focus:outline-none focus:border-primary/50"
          />
        </div>

        {/* Slug Auto-Generated */}
        <div className="space-y-1 text-left">
          <label className="text-[10px] font-bold text-muted-foreground uppercase">Slug URL (Unique)</label>
          <input
            type="text"
            value={catSlug}
            onChange={(e) => setCatSlug(e.target.value)}
            placeholder="e.g. royal-necklaces"
            className="w-full px-3 py-2 text-xs border border-border bg-[#0d0f14]/50 rounded-lg text-foreground focus:outline-none focus:border-primary/50 font-mono"
          />
        </div>

        {/* Parent Category Tree */}
        <div className="space-y-1 text-left">
          <label className="text-[10px] font-bold text-muted-foreground uppercase">Parent Category (Prisma Tree)</label>
          <select
            value={catParentId}
            onChange={(e) => setCatParentId(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-border bg-[#0d0f14] rounded-lg text-foreground focus:outline-none focus:border-primary/50 cursor-pointer"
          >
            <option value="">— None (Top-Level Category) —</option>
            {categories
              .filter((c) => c.id !== editingCategoryId && !c.parentId) // Prevent self-referential or deeper nesting loop
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>

        {/* TinyMCE Description for Category */}
        <div className="space-y-1 text-left">
          <label className="text-[10px] font-bold text-muted-foreground uppercase">Category Description Narrative</label>
          <RichTextEditor
            value={catDescription}
            onChange={setCatDescription}
            placeholder="Rich description for the collection brochure..."
          />
        </div>

        {/* Category Published Toggle */}
        <div className="flex items-center gap-2 select-none pt-1 text-left">
          <input
            type="checkbox"
            id="catIsPublished"
            checked={catIsPublished}
            onChange={(e) => setCatIsPublished(e.target.checked)}
            className="w-4 h-4 rounded border-border bg-[#0d0f14] text-primary focus:ring-primary/20 accent-[#c5a880] cursor-pointer"
          />
          <label htmlFor="catIsPublished" className="text-xs font-semibold text-foreground cursor-pointer select-none">
            Publish Category to Storefront
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-primary text-[#090a0f] py-2 rounded-lg text-xs font-bold hover:bg-primary/95 transition-all cursor-pointer shadow-[0_0_8px_rgba(197,168,128,0.15)] flex items-center justify-center gap-1"
        >
          <Save size={13} />
          {isEditingCategory ? "Update Category" : "Save DB Category"}
        </button>
      </form>
    </div>
  );
};

import { type StateCreator } from "zustand";
import { type AppStore, type CategorySlice } from "../types";
import { CategoryStateSchema } from "../schemas";
import { api } from "@/api";
import { toast } from "sonner";

export const createCategorySlice: StateCreator<AppStore, [], [], CategorySlice> = (set) => ({
  categories: [],

  addCategory: async (category) => {
    const parsed = CategoryStateSchema.safeParse(category);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map((e) => e.message).join(", ");
      toast.error("Category Validation Failed ✕", {
        description: errorMsg
      });
      return;
    }
    try {
      const created = await api.createCategory(category);
      set((state) => ({
        categories: [...state.categories, created]
      }));
      toast.success("Category Created Live ✦", {
        description: `Successfully added ${created.name} to database.`
      });
    } catch (error: any) {
      console.error("Failed to create category on backend:", error);
      toast.error("Database Sync Error ✕", {
        description: error?.message || "Could not persist new category on remote host."
      });
    }
  },

  updateCategory: async (id, fields) => {
    const parsed = CategoryStateSchema.partial().safeParse(fields);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map((e) => e.message).join(", ");
      toast.error("Category Validation Failed ✕", {
        description: errorMsg
      });
      return;
    }

    try {
      const updated = await api.updateCategory(id, fields);
      set((state) => ({
        categories: state.categories.map((c) => c.id === id ? { ...c, ...updated } : c)
      }));
      toast.success("Category Sync Successful ✦", {
        description: "Updates persistently written to database."
      });
    } catch (error: any) {
      console.error("Failed to update category on backend:", error);
      toast.error("Database Sync Error ✕", {
        description: error?.message || "Could not persist category updates on remote host."
      });
    }
  },

  deleteCategory: async (id) => {
    try {
      await api.deleteCategory(id);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
        // Relational safety: Fallback products referencing the deleted category to rings
        products: state.products.map((p) => p.categoryId === id ? { ...p, categoryId: "cat-rings" } : p)
      }));
      toast.success("Category Deleted Live ✦", {
        description: "Prisma relations successfully un-mapped."
      });
    } catch (error) {
      console.error("Failed to delete category on backend:", error);
      toast.error("Database Sync Error ✕", {
        description: "Could not drop category relations from database."
      });
    }
  }
});

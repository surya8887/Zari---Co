import { type StateCreator } from "zustand";
import { type AppStore, type InventorySlice } from "../types";
import { InventoryStateSchema } from "../schemas";
import { api } from "@/api";
import { toast } from "sonner";

export const createInventorySlice: StateCreator<AppStore, [], [], InventorySlice> = (set) => ({
  inventory: [],
  inventoryPagination: {
    total: 0,
    page: 1,
    limit: 20,
    pages: 0
  },
  isLoadingInventory: false,

  fetchInventory: async (params) => {
    set({ isLoadingInventory: true });
    try {
      const data = await api.getInventory(params);
      set({
        inventory: data.inventory || [],
        inventoryPagination: data.pagination || {
          total: (data.inventory || []).length,
          page: 1,
          limit: 20,
          pages: 1
        },
        isLoadingInventory: false
      });
    } catch (error) {
      console.error("Failed to fetch inventory from backend:", error);
      set({ isLoadingInventory: false });
    }
  },

  initializeStock: async (payload) => {
    const parsed = InventoryStateSchema.safeParse(payload);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map((e) => e.message).join(", ");
      toast.error("Stock Validation Failed ✕", {
        description: errorMsg
      });
      return;
    }

    try {
      const created = await api.createInventory(payload);
      set((state) => ({
        inventory: [created, ...state.inventory]
      }));
      toast.success("Stock Initialized Live ✦", {
        description: `Registered new inventory entry successfully.`
      });
    } catch (error) {
      console.error("Failed to initialize stock on backend:", error);
      toast.error("Database Sync Error ✕", {
        description: "Could not create inventory stock entry on remote host."
      });
    }
  },

  adjustStock: async (id, payload) => {
    const parsed = InventoryStateSchema.safeParse(payload);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map((e) => e.message).join(", ");
      toast.error("Stock Validation Failed ✕", {
        description: errorMsg
      });
      return;
    }

    try {
      const updated = await api.updateInventory(id, payload);
      set((state) => ({
        inventory: state.inventory.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              ...updated,
              variant: item.variant
            };
          }
          return item;
        })
      }));
      toast.success("Stock Synced Successfully ✦", {
        description: "Stock changes persistently recorded on database ledger."
      });
    } catch (error) {
      console.error("Failed to update inventory on backend:", error);
      toast.error("Database Sync Error ✕", {
        description: "Could not adjust inventory stock on remote host."
      });
    }
  },

  deleteStock: async (id) => {
    try {
      await api.deleteInventory(id);
      set((state) => ({
        inventory: state.inventory.filter((item) => item.id !== id)
      }));
      toast.success("Stock Record Dropped ✦", {
        description: "Successfully deleted stock row from database."
      });
    } catch (error) {
      console.error("Failed to delete inventory row on backend:", error);
      toast.error("Database Sync Error ✕", {
        description: error instanceof Error ? error.message : "Could not drop stock record from database."
      });
    }
  }
});

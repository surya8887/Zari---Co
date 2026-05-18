import { type StateCreator } from "zustand";
import { type AppStore, type ProductSlice } from "../types";
import { ProductStateSchema } from "../schemas";
import { api } from "@/api";
import { toast } from "sonner";

export const createProductSlice: StateCreator<AppStore, [], [], ProductSlice> = (set) => ({
  products: [],

  addProduct: async (product) => {
    const parsed = ProductStateSchema.safeParse(product);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map((e) => e.message).join(", ");
      toast.error("Product Validation Failed ✕", {
        description: errorMsg
      });
      return undefined;
    }

    try {
      const created = await api.createProduct(product);
      set((state) => ({
        products: [...state.products, created]
      }));
      toast.success("Product Created Live ✦", {
        description: `Successfully added ${created.name} to catalog database.`
      });
      return created;
    } catch (error) {
      console.error("Failed to create product on backend:", error);
      toast.error("Database Sync Error ✕", {
        description: "Could not persist new product in catalog database."
      });
      return undefined;
    }
  },

  updateProduct: async (id, fields) => {
    const parsed = ProductStateSchema.partial().safeParse(fields);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map((e) => e.message).join(", ");
      toast.error("Product Validation Failed ✕", {
        description: errorMsg
      });
      return;
    }

    try {
      const updated = await api.updateProduct(id, fields);
      set((state) => ({
        products: state.products.map((p) => p.id === id ? { ...p, ...updated } : p)
      }));
      toast.success("Product Sync Successful ✦", {
        description: "Updates persistently written to catalogue database."
      });
    } catch (error) {
      console.error("Failed to update product on backend:", error);
      toast.error("Database Sync Error ✕", {
        description: "Could not persist product updates in database."
      });
    }
  },

  deleteProduct: async (id) => {
    try {
      await api.deleteProduct(id);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id)
      }));
      toast.success("Product Deleted Live ✦", {
        description: "Item successfully soft-deleted in database."
      });
    } catch (error) {
      console.error("Failed to delete product on backend:", error);
      toast.error("Database Sync Error ✕", {
        description: "Could not mark product as deleted in database."
      });
    }
  },

  uploadProductImages: async (productId, files) => {
    try {
      const newImages = await api.uploadProductImages(productId, files);
      set((state) => ({
        products: state.products.map((p) =>
          p.id === productId
            ? { ...p, images: [...p.images, ...newImages] }
            : p
        )
      }));
      toast.success("Images Uploaded Successfully ✦", {
        description: `${newImages.length} images added to item catalog.`
      });
    } catch (error) {
      console.error("Failed to upload product images in store:", error);
      toast.error("Image Upload Error ✕", {
        description: "Could not upload product images to server."
      });
    }
  },

  deleteProductImage: async (productId, imageId) => {
    try {
      await api.deleteProductImage(imageId);
      set((state) => ({
        products: state.products.map((p) => {
          if (p.id !== productId) return p;
          const updatedImages = p.images.filter((img) => img.id !== imageId);
          // Auto-promote first remaining sibling cover if we unlinked the primary thumbnail
          const deletedImg = p.images.find((img) => img.id === imageId);
          if (deletedImg?.isPrimary && updatedImages.length > 0) {
            updatedImages[0].isPrimary = true;
          }
          return { ...p, images: updatedImages };
        })
      }));
      toast.success("Image Deleted Successfully ✦", {
        description: "Physical file unlinked and database references dropped."
      });
    } catch (error) {
      console.error("Failed to delete product image in store:", error);
      toast.error("Image Deletion Error ✕", {
        description: "Could not unlink target image from server."
      });
    }
  },

  setPrimaryImage: async (productId, imageId) => {
    try {
      await api.setPrimaryImage(imageId);
      set((state) => ({
        products: state.products.map((p) => {
          if (p.id !== productId) return p;
          return {
            ...p,
            images: p.images.map((img) => ({
              ...img,
              isPrimary: img.id === imageId
            }))
          };
        })
      }));
      toast.success("Primary Cover Updated ✦", {
        description: "New catalog thumbnail designated."
      });
    } catch (error) {
      console.error("Failed to set primary image in store:", error);
      toast.error("Cover Update Error ✕", {
        description: "Could not update cover designation on server."
      });
    }
  }
});

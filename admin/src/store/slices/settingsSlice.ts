import { type StateCreator } from "zustand";
import { type AppStore, type SettingsSlice } from "../types";
import { CollectionStorySchema, ShippingNotesSchema } from "../schemas";
import { toast } from "sonner";

export const createSettingsSlice: StateCreator<AppStore, [], [], SettingsSlice> = (set) => ({
  collectionStory: "<h3>Heritage of Zari & Co.</h3><p>Founded with a dedication to timeless elegance and re-imagined for global connoisseurs, <strong>Zari & Co.</strong> creates hand-crafted masterpieces. Every piece of jewelry tells a unique story of ancient precious gems, GIA-inspected luxury, and micro-precision craftsmanship.</p><p>We believe in pure structural beauty, sustainable recycled gold castings, and creating heirloom memories that transition elegantly across generations.</p>",
  
  updateCollectionStory: (story) => {
    const parsed = CollectionStorySchema.safeParse(story);
    if (!parsed.success) {
      toast.error("Story Validation Failed ✕", {
        description: parsed.error.issues[0].message
      });
      return;
    }
    set({ collectionStory: story });
  },

  shippingNotes: "<h3>Premium Boutique Delivery System</h3><p>Every Zari & Co. dispatch features secure signature-required transit, fully insured under a global cargo policy. Packaging includes our leather jewelry case, GIA certification sheets, and clean gold polishing cloths.</p><h4>Returns Policy</h4><p>We provide a complimentary <strong>30-day window</strong> for exchanges and returns. Returned items must remain completely unworn with security seals and certificates intact.</p>",

  updateShippingNotes: (notes) => {
    const parsed = ShippingNotesSchema.safeParse(notes);
    if (!parsed.success) {
      toast.error("Policy Validation Failed ✕", {
        description: parsed.error.issues[0].message
      });
      return;
    }
    set({ shippingNotes: notes });
  }
});

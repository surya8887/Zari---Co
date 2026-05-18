import { type StateCreator } from "zustand";
import { type AppStore, type UISlice } from "../types";
import { ThemeSchema, PageSchema, SearchQuerySchema } from "../schemas";
import { toast } from "sonner";

export const createUISlice: StateCreator<AppStore, [], [], UISlice> = (set) => ({
  theme: "dark",
  setTheme: (theme) => {
    const parsed = ThemeSchema.safeParse(theme);
    if (!parsed.success) {
      toast.error("Theme Error ✕", {
        description: parsed.error.issues[0].message
      });
      return;
    }
    set({ theme });
  },
  
  currentPage: "dashboard",
  setCurrentPage: (page) => {
    const parsed = PageSchema.safeParse(page);
    if (!parsed.success) {
      toast.error("Navigation Denied ✕", {
        description: parsed.error.issues[0].message
      });
      return;
    }
    set({ currentPage: page });
  },
  
  searchQuery: "",
  setSearchQuery: (query) => {
    const parsed = SearchQuerySchema.safeParse(query);
    if (!parsed.success) return;
    set({ searchQuery: query });
  },
  
  notifications: [
    {
      id: 1,
      title: "New Custom Order Ring Approval Required",
      desc: "A bespoke 18k Halo Diamond Ring requires design review.",
      read: false,
      time: "5m ago"
    },
    {
      id: 2,
      title: "Critical Low Stock Alert",
      desc: "Serenity Bracelet stock falls below threshold (2 items remaining).",
      read: false,
      time: "1h ago"
    },
    {
      id: 3,
      title: "High-Value Transaction Captured",
      desc: "Order #10982 ($1,850) successfully captured from Liam Chen.",
      read: true,
      time: "2h ago"
    }
  ],
  markNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),

  messages: [
    {
      id: 1,
      sender: "Emily R.",
      avatar: "ER",
      text: "Is the Elysian Diamond Ring available in size 6.5? I need to purchase it today.",
      read: false,
      time: "10m ago"
    },
    {
      id: 2,
      sender: "Marcus K.",
      avatar: "MK",
      text: "I would love to order custom engraving for the 18k Gold Hoop Earrings. Can we organize that?",
      read: true,
      time: "3h ago"
    },
    {
      id: 3,
      sender: "Liam Chen",
      avatar: "LC",
      text: "Please expedite shipping for the Serenity Bracelet order Honor #10982. Thank you!",
      read: true,
      time: "1d ago"
    }
  ],
  markMessagesRead: () => set((state) => ({
    messages: state.messages.map(m => ({ ...m, read: true }))
  }))
});

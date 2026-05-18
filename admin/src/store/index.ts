import { create } from "zustand";

export interface NotificationItem {
  id: number;
  title: string;
  desc: string;
  read: boolean;
  time: string;
}

export interface MessageItem {
  id: number;
  sender: string;
  avatar: string;
  text: string;
  read: boolean;
  time: string;
}

interface AppStore {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  notifications: NotificationItem[];
  markNotificationsRead: () => void;
  messages: MessageItem[];
  markMessagesRead: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  theme: "dark", // Premium dark dashboard by default
  setTheme: (theme) => set({ theme }),
  
  currentPage: "dashboard",
  setCurrentPage: (page) => set({ currentPage: page }),
  
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  
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
}));

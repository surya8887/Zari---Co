import { create } from "zustand";

interface AppStore {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

export const useAppStore = create<AppStore>((set) => ({
  theme: "light",
  setTheme: (theme) => set({ theme }),
}));

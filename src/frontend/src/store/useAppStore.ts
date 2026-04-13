import { create } from "zustand";
import type { AppState } from "../types";

type Theme = "dark" | "light";

interface AppStore {
  // State
  appState: AppState;
  soundEnabled: boolean;
  hasEntered: boolean;
  theme: Theme;

  // Actions
  setAppState: (state: AppState) => void;
  toggleSound: () => void;
  setSoundEnabled: (enabled: boolean) => void;
  setHasEntered: () => void;
  toggleTheme: () => void;
}

const isMobile = (): boolean => {
  if (typeof window === "undefined") return false;
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    ) || window.matchMedia("(max-width: 768px)").matches
  );
};

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "dark";
  return (localStorage.getItem("tr-theme") as Theme) ?? "dark";
};

const applyTheme = (theme: Theme) => {
  const html = document.documentElement;
  html.classList.remove("dark", "light");
  html.classList.add(theme);
  localStorage.setItem("tr-theme", theme);
};

export const useAppStore = create<AppStore>((set) => ({
  appState: "loading",
  soundEnabled: !isMobile(),
  hasEntered: false,
  theme: getInitialTheme(),

  setAppState: (state) => set({ appState: state }),

  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),

  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),

  setHasEntered: () => set({ hasEntered: true }),

  toggleTheme: () =>
    set((s) => {
      const next: Theme = s.theme === "dark" ? "light" : "dark";
      applyTheme(next);
      return { theme: next };
    }),
}));

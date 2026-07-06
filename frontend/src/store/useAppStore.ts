import { create } from "zustand";
import type { User } from "../types";

type AppState = {
  token: string | null;
  user: User | null;
  darkMode: boolean;
  favorites: number[];
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  toggleDarkMode: () => void;
  toggleFavorite: (recipeId: number) => void;
};

const savedDarkMode = localStorage.getItem("smartchef-dark") === "true";
if (savedDarkMode) document.documentElement.classList.add("dark");

export const useAppStore = create<AppState>((set) => ({
  token: localStorage.getItem("smartchef-token"),
  user: null,
  darkMode: savedDarkMode,
  favorites: [1, 3],
  setToken: (token) => {
    if (token) localStorage.setItem("smartchef-token", token);
    else localStorage.removeItem("smartchef-token");
    set({ token });
  },
  setUser: (user) => set({ user }),
  toggleDarkMode: () =>
    set((state) => {
      const next = !state.darkMode;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("smartchef-dark", String(next));
      return { darkMode: next };
    }),
  toggleFavorite: (recipeId) =>
    set((state) => ({
      favorites: state.favorites.includes(recipeId)
        ? state.favorites.filter((id) => id !== recipeId)
        : [...state.favorites, recipeId]
    }))
}));


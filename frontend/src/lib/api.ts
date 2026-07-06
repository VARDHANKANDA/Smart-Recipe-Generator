import axios from "axios";
import type { GeneratedRecipe, PantryItem, Recipe, Recommendation, ShoppingItem, User } from "../types";
import { demoUser, pantryItems, recipes, recommendations, shoppingItems } from "./mockData";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1",
  timeout: 8000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("smartchef-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const fallback = async <T>(request: Promise<{ data: T }>, value: T): Promise<T> => {
  try {
    const response = await request;
    return response.data;
  } catch {
    return value;
  }
};

export const authApi = {
  login: async (email: string, password: string) =>
    fallback(api.post<{ access_token: string }>("/auth/login", { email, password }), { access_token: "demo-token" }),
  register: async (payload: Record<string, string>) =>
    fallback(api.post<{ access_token: string }>("/auth/register", payload), { access_token: "demo-token" }),
  me: async () => fallback<User>(api.get("/auth/me"), demoUser)
};

export const recipeApi = {
  list: async (params?: Record<string, string | number | string[]>) =>
    fallback(api.get<{ items: Recipe[]; total: number }>("/recipes", { params }), { items: recipes, total: recipes.length }),
  trending: async () => fallback<Recipe[]>(api.get("/recipes/trending/list"), recipes),
  detail: async (id: string | number) => fallback<Recipe>(api.get(`/recipes/${id}`), recipes.find((recipe) => recipe.id === Number(id)) ?? recipes[0]),
  similar: async (id: string | number) =>
    fallback<Recommendation[]>(api.get(`/recipes/${id}/similar`), recommendations.filter((item) => item.recipe.id !== Number(id))),
  favorite: async (id: number) => fallback(api.post(`/recipes/${id}/favorite`), { message: "Recipe saved" })
};

export const aiApi = {
  recommendations: async () => fallback<Recommendation[]>(api.post("/ai/recommendations"), recommendations),
  generate: async (payload: Record<string, unknown>) =>
    fallback<GeneratedRecipe>(api.post("/ai/generate-recipe", payload), {
      title: "SmartChef Pantry Harvest Bowl",
      ingredients: ["chickpeas", "rice", "lemon", "olive oil", "fresh herbs"],
      missing_ingredients: ["fresh herbs"],
      instructions: ["Cook the rice.", "Warm chickpeas with spices.", "Build a lemon olive oil dressing.", "Assemble and garnish."],
      nutrition: { calories: 520, protein: 21, carbs: 68, fat: 16 },
      ai_explanation: "This balances protein, pantry availability, and quick cooking time while keeping flavors bright.",
      estimated_cooking_time: 28,
      confidence: 91
    }),
  substitutions: async (ingredient: string) => fallback(api.post(`/ai/substitutions?ingredient=${ingredient}`), { substitutions: ["tofu", "mushrooms", "lentils"], confidence: 86 })
};

export const pantryApi = {
  list: async () => fallback<PantryItem[]>(api.get("/pantry"), pantryItems),
  alerts: async () => fallback(api.get("/pantry/alerts"), { expiring: ["Lemon"], low_stock: [] })
};

export const shoppingApi = {
  list: async () => fallback<ShoppingItem[]>(api.get("/shopping-list"), shoppingItems),
  generate: async () => fallback<ShoppingItem[]>(api.post("/shopping-list/generate"), shoppingItems),
  toggle: async (id: number) => fallback<ShoppingItem>(api.patch(`/shopping-list/${id}/toggle`), shoppingItems.find((item) => item.id === id) ?? shoppingItems[0])
};

export const adminApi = {
  analytics: async () =>
    fallback(api.get("/admin/analytics"), {
      cards: { users: 1840, recipes: 326, reviews: 920, ai_requests: 1240 },
      user_growth: [8, 16, 31, 55, 91, 140, 211],
      recipe_views: recipes.slice(0, 5).map((recipe) => ({ title: recipe.title, views: recipe.views })),
      ai_usage: [120, 180, 260, 410, 530, 680, 820]
    })
};


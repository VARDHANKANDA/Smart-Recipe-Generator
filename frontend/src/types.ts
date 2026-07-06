export type User = {
  id: number;
  email: string;
  full_name: string;
  role: "user" | "admin";
  dietary_preferences: string;
  allergies: string;
  avatar_url?: string | null;
  created_at: string;
};

export type Recipe = {
  id: number;
  title: string;
  slug: string;
  cuisine: string;
  difficulty: string;
  diet: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prep_time: number;
  cook_time: number;
  servings: number;
  image_url?: string | null;
  video_url?: string | null;
  ingredients: string[];
  instructions: string[];
  tags: string[];
  rating: number;
  views: number;
  saves: number;
  created_at: string;
};

export type Recommendation = {
  recipe: Recipe;
  confidence: number;
  reasons: string[];
};

export type PantryItem = {
  id: number;
  user_id: number;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expiry_date?: string | null;
  low_stock_threshold: number;
};

export type GeneratedRecipe = {
  title: string;
  ingredients: string[];
  missing_ingredients: string[];
  instructions: string[];
  nutrition: Record<string, number>;
  ai_explanation: string;
  estimated_cooking_time: number;
  confidence: number;
};

export type ShoppingItem = {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  checked: boolean;
};


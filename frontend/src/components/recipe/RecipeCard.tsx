import { Clock, Flame, Heart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { Recipe } from "../../types";
import { useAppStore } from "../../store/useAppStore";

type RecipeCardProps = {
  recipe: Recipe;
  confidence?: number;
};

export function RecipeCard({ recipe, confidence }: RecipeCardProps) {
  const { favorites, toggleFavorite } = useAppStore();
  const isFavorite = favorites.includes(recipe.id);
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-soft dark:border-white/10 dark:bg-white/10"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={recipe.image_url ?? ""}
          alt={recipe.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <button
          aria-label={isFavorite ? "Remove favorite" : "Save favorite"}
          onClick={() => toggleFavorite(recipe.id)}
          className="focus-ring absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-slate-900 shadow-soft"
        >
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-berry-500 text-berry-500" : ""}`} />
        </button>
        {confidence ? (
          <span className="absolute left-3 top-3 rounded-full bg-herb-500 px-3 py-1 text-xs font-black text-white">
            {confidence}% match
          </span>
        ) : null}
      </div>
      <div className="space-y-4 p-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-saffron-600">
            <span>{recipe.cuisine}</span>
            <span aria-hidden="true">/</span>
            <span>{recipe.difficulty}</span>
          </div>
          <Link to={`/recipes/${recipe.id}`} className="mt-2 block text-lg font-black text-slate-950 hover:text-saffron-600 dark:text-white">
            {recipe.title}
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" />{recipe.prep_time + recipe.cook_time}m</span>
          <span className="inline-flex items-center gap-1"><Flame className="h-4 w-4" />{recipe.calories} kcal</span>
          <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 fill-saffron-500 text-saffron-500" />{recipe.rating}</span>
        </div>
      </div>
    </motion.article>
  );
}

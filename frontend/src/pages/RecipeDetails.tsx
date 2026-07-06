import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { Bookmark, Clock, Flame, Printer, Share2, Star, Timer } from "lucide-react";
import { recipeApi } from "../lib/api";
import { RecipeCard } from "../components/recipe/RecipeCard";

export default function RecipeDetails() {
  const { id = "1" } = useParams();
  const [seconds, setSeconds] = useState(15 * 60);
  const { data: recipe } = useQuery({ queryKey: ["recipe", id], queryFn: () => recipeApi.detail(id) });
  const { data: similar = [] } = useQuery({ queryKey: ["similar", id], queryFn: () => recipeApi.similar(id) });

  if (!recipe) return <div className="skeleton h-96" />;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[8px] bg-slate-950 text-white">
        <img src={recipe.image_url ?? ""} alt={recipe.title} className="h-[500px] w-full object-cover opacity-70" />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent p-5 sm:p-8">
          <div className="max-w-4xl">
            <p className="text-sm font-black uppercase tracking-wide text-saffron-400">{recipe.cuisine} / {recipe.difficulty}</p>
            <h1 className="mt-3 text-4xl font-black sm:text-6xl">{recipe.title}</h1>
            <div className="mt-5 flex flex-wrap gap-3 text-sm font-black">
              <span className="rounded-full bg-white/15 px-4 py-2"><Clock className="mr-1 inline h-4 w-4" />{recipe.prep_time + recipe.cook_time} min</span>
              <span className="rounded-full bg-white/15 px-4 py-2"><Flame className="mr-1 inline h-4 w-4" />{recipe.calories} kcal</span>
              <span className="rounded-full bg-white/15 px-4 py-2"><Star className="mr-1 inline h-4 w-4 fill-saffron-500 text-saffron-500" />{recipe.rating}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="card">
            <div className="flex flex-wrap gap-3">
              <button className="btn-primary"><Bookmark className="h-4 w-4" />Bookmark</button>
              <button className="btn-secondary" onClick={() => navigator.share?.({ title: recipe.title })}><Share2 className="h-4 w-4" />Share</button>
              <button className="btn-secondary" onClick={() => window.print()}><Printer className="h-4 w-4" />Print</button>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="card">
              <h2 className="text-2xl font-black">Ingredients</h2>
              <ul className="mt-5 space-y-3">
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient} className="flex items-center gap-3 font-semibold">
                    <span className="h-2.5 w-2.5 rounded-full bg-herb-500" />
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h2 className="text-2xl font-black">Nutrition</h2>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  ["Calories", recipe.calories],
                  ["Protein", `${recipe.protein}g`],
                  ["Carbs", `${recipe.carbs}g`],
                  ["Fat", `${recipe.fat}g`]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[8px] bg-slate-50 p-4 dark:bg-white/10">
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
                    <p className="mt-1 text-xl font-black">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="card">
            <h2 className="text-2xl font-black">Instructions</h2>
            <ol className="mt-5 space-y-4">
              {recipe.instructions.map((step, index) => (
                <li key={step} className="flex gap-4 rounded-[8px] bg-slate-50 p-4 dark:bg-white/10">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-saffron-500 text-sm font-black text-slate-950">{index + 1}</span>
                  <span className="font-semibold leading-7">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <aside className="space-y-5">
          <div className="card">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">Cooking timer</h2>
              <Timer className="h-5 w-5 text-saffron-500" />
            </div>
            <p className="mt-5 text-center text-5xl font-black tabular-nums">
              {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
            </p>
            <div className="mt-5 grid grid-cols-3 gap-2">
              <button className="btn-secondary px-2 py-2" onClick={() => setSeconds((value) => Math.max(0, value - 60))}>-1m</button>
              <button className="btn-primary px-2 py-2" onClick={() => setSeconds(15 * 60)}>Reset</button>
              <button className="btn-secondary px-2 py-2" onClick={() => setSeconds((value) => value + 60)}>+1m</button>
            </div>
          </div>
          <div className="card">
            <h2 className="text-xl font-black">Reviews</h2>
            <div className="mt-4 rounded-[8px] bg-slate-50 p-4 dark:bg-white/10">
              <p className="font-bold">Beautifully balanced and easy to follow.</p>
              <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Rated 5 stars by SmartChef users</p>
            </div>
          </div>
        </aside>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-black">Related recipes</h2>
          <Link to="/search" className="text-sm font-black text-saffron-600">More</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {similar.slice(0, 3).map((item) => <RecipeCard key={item.recipe.id} recipe={item.recipe} confidence={item.confidence} />)}
        </div>
      </section>
    </div>
  );
}

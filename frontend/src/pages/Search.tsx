import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter, Grid2X2, List, Mic, Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import { recipeApi } from "../lib/api";
import { RecipeCard } from "../components/recipe/RecipeCard";

export default function Search() {
  const [query, setQuery] = useState("");
  const [diet, setDiet] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("ai");
  const { data, isLoading } = useQuery({
    queryKey: ["recipes", query, diet, sort],
    queryFn: () => recipeApi.list({ q: query, diet, sort })
  });
  const recipes = useMemo(() => data?.items ?? [], [data]);

  const startVoiceSearch = () => {
    const recognitionApi = window.webkitSpeechRecognition ?? window.SpeechRecognition;
    if (!recognitionApi) return;
    const recognition = new recognitionApi();
    recognition.onresult = (event: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => setQuery(event.results[0][0].transcript);
    recognition.start();
  };

  return (
    <div className="space-y-6">
      <section className="glass rounded-[8px] p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-saffron-600">AI ranked search</p>
            <h1 className="mt-2 text-3xl font-black">Find recipes by ingredients, time, diet, and mood</h1>
          </div>
          <div className="flex gap-2">
            <button className={`btn-secondary px-4 py-2 ${view === "grid" ? "border-saffron-500" : ""}`} onClick={() => setView("grid")} aria-label="Grid view"><Grid2X2 className="h-4 w-4" /></button>
            <button className={`btn-secondary px-4 py-2 ${view === "list" ? "border-saffron-500" : ""}`} onClick={() => setView("list")} aria-label="List view"><List className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_180px_180px_auto]">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 dark:border-white/10 dark:bg-white/10">
            <SearchIcon className="h-5 w-5 text-slate-400" />
            <input className="w-full bg-transparent py-3 text-sm font-semibold outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search ingredients or recipe name" />
            <button onClick={startVoiceSearch} className="focus-ring rounded-full p-2" aria-label="Voice search"><Mic className="h-4 w-4" /></button>
          </div>
          <select className="input" value={diet} onChange={(event) => setDiet(event.target.value)}>
            <option value="">All diets</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="High Protein">High Protein</option>
          </select>
          <select className="input" value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="ai">AI ranking</option>
            <option value="rating">Top rated</option>
            <option value="time">Fastest</option>
            <option value="calories">Lowest calories</option>
          </select>
          <button className="btn-secondary"><SlidersHorizontal className="h-4 w-4" />Filters</button>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <aside className="card h-fit">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-saffron-500" />
            <h2 className="text-lg font-black">Refine</h2>
          </div>
          <div className="mt-5 space-y-5">
            <label className="block text-sm font-bold">Cooking time<input type="range" min="10" max="90" defaultValue="35" className="mt-3 w-full" /></label>
            <label className="block text-sm font-bold">Calories<input type="range" min="200" max="900" defaultValue="650" className="mt-3 w-full" /></label>
            {["Easy", "Medium", "Hard"].map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" />{item}</label>
            ))}
          </div>
        </aside>
        <div>
          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="skeleton h-80" />)}</div>
          ) : recipes.length ? (
            <div className={view === "grid" ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3" : "grid gap-4"}>
              {recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
            </div>
          ) : (
            <div className="card grid min-h-80 place-items-center text-center">
              <div>
                <p className="text-2xl font-black">No recipes found</p>
                <p className="mt-2 font-semibold text-slate-500 dark:text-slate-400">Try fewer filters or generate a recipe from your ingredients.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

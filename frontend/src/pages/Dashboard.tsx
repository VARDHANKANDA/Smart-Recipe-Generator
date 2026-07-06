import { useQuery } from "@tanstack/react-query";
import { Bot, CalendarDays, Flame, Heart, ShoppingBasket, Sparkles, Warehouse } from "lucide-react";
import { Bar, Doughnut } from "react-chartjs-2";
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from "chart.js";
import { Link } from "react-router-dom";
import { aiApi, pantryApi, recipeApi } from "../lib/api";
import { RecipeCard } from "../components/recipe/RecipeCard";
import { StatCard } from "../components/ui/StatCard";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Dashboard() {
  const { data: recommendations = [] } = useQuery({ queryKey: ["recommendations"], queryFn: aiApi.recommendations });
  const { data: trending = [] } = useQuery({ queryKey: ["trending"], queryFn: recipeApi.trending });
  const { data: pantry = [] } = useQuery({ queryKey: ["pantry"], queryFn: pantryApi.list });
  const calories = trending.slice(0, 3).reduce((sum, recipe) => sum + recipe.calories, 0);

  return (
    <div className="space-y-8">
      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass overflow-hidden rounded-[8px] p-6 sm:p-8">
          <div className="grid gap-6 md:grid-cols-[1fr_280px] md:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-saffron-600">Today&apos;s kitchen brief</p>
              <h1 className="mt-3 text-3xl font-black sm:text-4xl">Your pantry can make {recommendations[0]?.recipe.title ?? "something brilliant"}.</h1>
              <p className="mt-4 max-w-2xl font-medium leading-7 text-slate-600 dark:text-slate-300">
                SmartChef ranked recipes by pantry overlap, preference fit, nutrition balance, and trending behavior.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/generator" className="btn-primary"><Bot className="h-4 w-4" />Generate recipe</Link>
                <Link to="/planner" className="btn-secondary"><CalendarDays className="h-4 w-4" />Plan week</Link>
              </div>
            </div>
            <div className="rounded-[8px] bg-white p-5 dark:bg-slate-950/70">
              <Doughnut
                data={{
                  labels: ["Protein", "Carbs", "Fat"],
                  datasets: [{ data: [34, 46, 20], backgroundColor: ["#22c55e", "#f59e0b", "#e11d48"], borderWidth: 0 }]
                }}
                options={{ plugins: { legend: { position: "bottom" } } }}
              />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black">AI suggestions</h2>
            <Sparkles className="h-5 w-5 text-saffron-500" />
          </div>
          <div className="mt-5 space-y-3">
            {recommendations.slice(0, 3).map((item) => (
              <div key={item.recipe.id} className="rounded-[8px] bg-slate-50 p-4 dark:bg-white/10">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-black">{item.recipe.title}</p>
                  <span className="rounded-full bg-herb-500 px-2.5 py-1 text-xs font-black text-white">{item.confidence}%</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">{item.reasons.join(" / ")}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Calories planned" value={`${calories || 1540}`} icon={Flame} tone="bg-berry-500/10 text-berry-500" />
        <StatCard label="Pantry items" value={`${pantry.length}`} icon={Warehouse} tone="bg-herb-100 text-herb-700" />
        <StatCard label="Favorites" value="12" icon={Heart} tone="bg-saffron-100 text-saffron-600" />
        <StatCard label="Shopping tasks" value="8" icon={ShoppingBasket} tone="bg-sky-100 text-sky-700" />
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-black">Today&apos;s recommendations</h2>
          <Link to="/search" className="text-sm font-black text-saffron-600">View all</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {recommendations.slice(0, 4).map((item) => <RecipeCard key={item.recipe.id} recipe={item.recipe} confidence={item.confidence} />)}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="card">
          <h2 className="text-xl font-black">Weekly meal planner</h2>
          <div className="mt-5 grid gap-3">
            {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => (
              <div key={day} className="flex items-center justify-between rounded-[8px] bg-slate-50 p-3 dark:bg-white/10">
                <span className="font-black">{day}</span>
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{trending[index]?.title ?? "AI pick pending"}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h2 className="text-xl font-black">Nutrition trend</h2>
          <div className="mt-5">
            <Bar
              data={{
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [{ label: "Calories", data: [1420, 1680, 1510, 1740, 1590, 1860, 1490], backgroundColor: "#f59e0b", borderRadius: 8 }]
              }}
              options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

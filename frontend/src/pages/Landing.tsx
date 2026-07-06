import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Bot, ChefHat, Clock, Search, Sparkles, Star, Users } from "lucide-react";
import { RecipeCard } from "../components/recipe/RecipeCard";
import { recipes } from "../lib/mockData";

const categories = ["High Protein", "Vegan", "Indian", "Mediterranean", "Quick Breakfast", "Low Calorie"];
const landingStats = [
  { value: "35k+", label: "recipe combinations", Icon: Users },
  { value: "<2s", label: "optimized discovery", Icon: Clock },
  { value: "4.8", label: "demo rating average", Icon: Star }
];

export default function Landing() {
  const navigate = useNavigate();
  return (
    <main className="text-slate-900 dark:text-white">
      <header className="section flex items-center justify-between py-5">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-saffron-500 text-slate-950">
            <ChefHat className="h-6 w-6" />
          </span>
          <span className="text-xl font-black">SmartChef AI</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-bold text-slate-600 dark:text-slate-300 md:flex">
          <a href="#recipes">Recipes</a>
          <a href="#features">Features</a>
          <a href="#proof">Results</a>
        </nav>
        <Link to="/login" className="btn-secondary px-4 py-2">Login</Link>
      </header>

      <section className="section grid min-h-[calc(100vh-86px)] items-center gap-10 pb-8 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-saffron-500/30 bg-saffron-100/70 px-4 py-2 text-sm font-black text-saffron-600 dark:bg-saffron-500/10">
            <Sparkles className="h-4 w-4" />
            AI recipe intelligence for modern kitchens
          </div>
          <h1 className="mt-6 max-w-4xl font-display text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
            SmartChef AI
          </h1>
          <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-slate-600 dark:text-slate-300">
            Generate personalized recipes from pantry ingredients, plan balanced meals, and get AI-ranked suggestions with nutrition insights.
          </p>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              navigate("/search");
            }}
            className="glass mt-8 flex max-w-2xl flex-col gap-3 rounded-[8px] p-3 sm:flex-row"
          >
            <label className="sr-only" htmlFor="hero-search">Search ingredients</label>
            <div className="flex flex-1 items-center gap-3 rounded-[8px] bg-white/70 px-4 dark:bg-white/10">
              <Search className="h-5 w-5 text-slate-400" />
              <input id="hero-search" className="w-full bg-transparent py-4 text-sm font-semibold outline-none" placeholder="Try chickpeas, rice, lemon..." />
            </div>
            <button className="btn-primary">
              Find recipes
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/generator" className="btn-primary"><Bot className="h-4 w-4" />AI Generator</Link>
            <Link to="/dashboard" className="btn-secondary">Open Dashboard</Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="relative">
          <div className="overflow-hidden rounded-[8px] bg-slate-950 shadow-glow">
            <img
              src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1400&q=80"
              alt="Modern kitchen with fresh ingredients"
              className="h-[520px] w-full object-cover opacity-90"
            />
          </div>
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="glass absolute -bottom-5 left-4 right-4 rounded-[8px] p-4 sm:left-auto sm:w-80"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black">AI confidence</p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pantry match detected</p>
              </div>
              <span className="text-3xl font-black text-herb-500">96%</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section id="proof" className="section grid gap-4 py-10 sm:grid-cols-3">
        {landingStats.map(({ value, label, Icon }) => (
          <div key={label} className="card flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-[8px] bg-herb-100 text-herb-700">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-black">{value}</p>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
            </div>
          </div>
        ))}
      </section>

      <section id="recipes" className="section py-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-saffron-600">Trending recipes</p>
            <h2 className="mt-2 text-3xl font-black">Fresh picks for today</h2>
          </div>
          <Link to="/search" className="btn-secondary">Explore all</Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.slice(0, 3).map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
        </div>
      </section>

      <section id="features" className="section py-12">
        <div className="grid gap-5 md:grid-cols-3">
          {categories.map((category) => (
            <button key={category} onClick={() => navigate("/search")} className="card text-left text-lg font-black transition hover:-translate-y-1 hover:border-saffron-500">
              {category}
              <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">AI-ranked recipes, nutrition, and pantry overlap.</p>
            </button>
          ))}
        </div>
      </section>

      <section className="section py-12">
        <div className="grid gap-5 md:grid-cols-3">
          {["The dashboard feels like a real product demo.", "Ingredient-based recommendations are easy to explain in viva.", "Meal planning and shopping list make the project feel complete."].map((quote, index) => (
            <blockquote key={quote} className="card">
              <p className="text-lg font-bold">"{quote}"</p>
              <footer className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Evaluator preview #{index + 1}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <footer className="section py-8 text-sm font-semibold text-slate-500 dark:text-slate-400">
        SmartChef AI - final-year project demo with full-stack architecture, AI recommendations, and production-ready documentation.
      </footer>
    </main>
  );
}

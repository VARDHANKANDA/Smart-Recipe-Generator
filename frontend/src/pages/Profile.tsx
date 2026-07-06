import { Award, Camera, Heart, History, ShieldCheck, UserRound } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { recipes } from "../lib/mockData";
import { RecipeCard } from "../components/recipe/RecipeCard";

const profileStats = [
  { label: "Saved recipes", value: "24", Icon: Heart },
  { label: "Cooking history", value: "68", Icon: History },
  { label: "Diet match", value: "94%", Icon: ShieldCheck }
];

export default function Profile() {
  const user = useAppStore((state) => state.user);

  return (
    <div className="space-y-6">
      <section className="glass overflow-hidden rounded-[8px]">
        <div className="h-40 bg-[url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center" />
        <div className="p-6">
          <div className="-mt-16 flex flex-col gap-5 sm:flex-row sm:items-end">
            <div className="relative grid h-28 w-28 place-items-center rounded-full border-4 border-white bg-saffron-500 text-slate-950 shadow-soft dark:border-slate-950">
              <UserRound className="h-12 w-12" />
              <button className="focus-ring absolute bottom-0 right-0 grid h-9 w-9 place-items-center rounded-full bg-slate-950 text-white" aria-label="Upload profile picture">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-saffron-600">Cooking profile</p>
              <h1 className="mt-1 text-3xl font-black">{user?.full_name ?? "Demo Student"}</h1>
              <p className="mt-2 font-semibold text-slate-500 dark:text-slate-400">{user?.email ?? "student@smartchef.ai"}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-5">
          <div className="card">
            <h2 className="text-xl font-black">Preferences</h2>
            <div className="mt-5 space-y-3">
              <label className="block text-sm font-bold">Dietary restrictions<input className="input mt-2" defaultValue={user?.dietary_preferences ?? "High protein, vegetarian friendly"} /></label>
              <label className="block text-sm font-bold">Allergies<input className="input mt-2" defaultValue={user?.allergies ?? "Peanuts"} /></label>
              <label className="flex items-center justify-between rounded-[8px] bg-slate-50 p-3 font-bold dark:bg-white/10">Push notifications<input type="checkbox" defaultChecked /></label>
              <label className="flex items-center justify-between rounded-[8px] bg-slate-50 p-3 font-bold dark:bg-white/10">Offline PWA sync<input type="checkbox" defaultChecked /></label>
            </div>
          </div>
          <div className="card">
            <h2 className="text-xl font-black">Achievements</h2>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {["Planner Pro", "Protein Streak", "Zero Waste", "Recipe Critic"].map((badge) => (
                <div key={badge} className="rounded-[8px] bg-saffron-100 p-3 text-center text-sm font-black text-slate-950">
                  <Award className="mx-auto mb-2 h-5 w-5" />
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </aside>
        <div className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-3">
            {profileStats.map(({ label, value, Icon }) => (
              <div key={label} className="card">
                <Icon className="h-5 w-5 text-saffron-500" />
                <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
                <p className="text-2xl font-black">{value}</p>
              </div>
            ))}
          </div>
          <div>
            <h2 className="mb-5 text-2xl font-black">Saved recipes</h2>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {recipes.slice(0, 3).map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

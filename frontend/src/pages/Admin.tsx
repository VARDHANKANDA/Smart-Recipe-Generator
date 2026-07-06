import { useQuery } from "@tanstack/react-query";
import { Bar, Line } from "react-chartjs-2";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip } from "chart.js";
import { Activity, Bot, ChefHat, MessageSquare, Users } from "lucide-react";
import { adminApi } from "../lib/api";
import { StatCard } from "../components/ui/StatCard";

ChartJS.register(BarElement, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

export default function Admin() {
  const { data } = useQuery({ queryKey: ["admin-analytics"], queryFn: adminApi.analytics });
  const cards = data?.cards ?? { users: 0, recipes: 0, reviews: 0, ai_requests: 0 };
  const recipeViews = data?.recipe_views ?? [];

  return (
    <div className="space-y-6">
      <section className="glass rounded-[8px] p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-[8px] bg-slate-950 text-white dark:bg-white dark:text-slate-950"><Activity className="h-6 w-6" /></span>
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-saffron-600">Admin panel</p>
            <h1 className="text-3xl font-black">Analytics, content, and platform health</h1>
          </div>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Users" value={`${cards.users}`} icon={Users} tone="bg-sky-100 text-sky-700" />
        <StatCard label="Recipes" value={`${cards.recipes}`} icon={ChefHat} tone="bg-herb-100 text-herb-700" />
        <StatCard label="Reviews" value={`${cards.reviews}`} icon={MessageSquare} tone="bg-saffron-100 text-saffron-600" />
        <StatCard label="AI usage" value={`${cards.ai_requests}`} icon={Bot} tone="bg-berry-500/10 text-berry-500" />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="card">
          <h2 className="text-xl font-black">User growth</h2>
          <div className="mt-5">
            <Line
              data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
                datasets: [{ label: "Users", data: data?.user_growth ?? [], borderColor: "#22c55e", backgroundColor: "#22c55e", tension: 0.35 }]
              }}
              options={{ responsive: true, plugins: { legend: { display: false } } }}
            />
          </div>
        </div>
        <div className="card">
          <h2 className="text-xl font-black">Most viewed recipes</h2>
          <div className="mt-5">
            <Bar
              data={{
                labels: recipeViews.map((item: { title: string }) => item.title.split(" ").slice(0, 2).join(" ")),
                datasets: [{ label: "Views", data: recipeViews.map((item: { views: number }) => item.views), backgroundColor: "#f59e0b", borderRadius: 8 }]
              }}
              options={{ responsive: true, plugins: { legend: { display: false } } }}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="card">
          <h2 className="text-xl font-black">Reports</h2>
          <div className="mt-5 space-y-3">
            {["Ingredient substitution requests increased 18%", "Mobile traffic is 64% of demo sessions", "Average recommendation confidence is 89%"].map((item) => (
              <div key={item} className="rounded-[8px] bg-slate-50 p-4 font-bold dark:bg-white/10">{item}</div>
            ))}
          </div>
        </div>
        <div className="card">
          <h2 className="text-xl font-black">Moderation queue</h2>
          <div className="mt-5 space-y-3">
            {["2 recipe edits pending", "5 reviews awaiting sentiment check", "1 flagged barcode scan"].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-[8px] bg-slate-50 p-4 font-bold dark:bg-white/10">
                {item}
                <button className="text-sm font-black text-saffron-600">Review</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


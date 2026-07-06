import { Fragment, useState } from "react";
import { CalendarDays, Download, GripVertical, Plus, ShoppingBasket } from "lucide-react";
import { recipes } from "../lib/mockData";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const slots = ["Breakfast", "Lunch", "Dinner"];

export default function MealPlanner() {
  const [draggedRecipe, setDraggedRecipe] = useState<number | null>(null);
  const [plan, setPlan] = useState<Record<string, string>>({
    "Monday-Lunch": recipes[0].title,
    "Wednesday-Dinner": recipes[2].title
  });

  return (
    <div className="space-y-6">
      <section className="glass rounded-[8px] p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-saffron-600">Weekly meal planner</p>
            <h1 className="mt-2 text-3xl font-black">Drag meals into your week</h1>
          </div>
          <div className="flex gap-3">
            <button className="btn-secondary" onClick={() => window.print()}><Download className="h-4 w-4" />Export PDF</button>
            <button className="btn-primary"><ShoppingBasket className="h-4 w-4" />Shopping list</button>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[300px_1fr]">
        <aside className="card h-fit">
          <h2 className="text-xl font-black">Recipe bank</h2>
          <div className="mt-5 space-y-3">
            {recipes.slice(0, 5).map((recipe) => (
              <div
                key={recipe.id}
                draggable
                onDragStart={() => setDraggedRecipe(recipe.id)}
                className="flex cursor-grab items-center gap-3 rounded-[8px] bg-slate-50 p-3 dark:bg-white/10"
              >
                <GripVertical className="h-4 w-4 text-slate-400" />
                <img src={recipe.image_url ?? ""} alt="" className="h-12 w-12 rounded-[8px] object-cover" />
                <div>
                  <p className="text-sm font-black">{recipe.title}</p>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{recipe.calories} kcal</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
        <div className="card overflow-x-auto">
          <div className="grid min-w-[920px] grid-cols-[120px_repeat(7,1fr)] gap-2">
            <div />
            {days.map((day) => <div key={day} className="rounded-[8px] bg-slate-950 p-3 text-center text-sm font-black text-white dark:bg-white dark:text-slate-950">{day.slice(0, 3)}</div>)}
            {slots.map((slot) => (
              <Fragment key={slot}>
                <div key={slot} className="flex items-center font-black">{slot}</div>
                {days.map((day) => {
                  const key = `${day}-${slot}`;
                  return (
                    <div
                      key={key}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => {
                        const recipe = recipes.find((item) => item.id === draggedRecipe);
                        if (recipe) setPlan({ ...plan, [key]: recipe.title });
                      }}
                      className="min-h-28 rounded-[8px] border border-dashed border-slate-300 p-2 dark:border-white/20"
                    >
                      {plan[key] ? (
                        <div className="h-full rounded-[8px] bg-saffron-100 p-3 text-sm font-black text-slate-950">{plan[key]}</div>
                      ) : (
                        <div className="grid h-full place-items-center text-slate-400"><Plus className="h-5 w-5" /></div>
                      )}
                    </div>
                  );
                })}
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-4">
        {[
          ["Calories", "10,420"],
          ["Protein", "422g"],
          ["Carbs", "1,080g"],
          ["Planned meals", `${Object.keys(plan).length}`]
        ].map(([label, value]) => (
          <div key={label} className="card">
            <CalendarDays className="h-5 w-5 text-saffron-500" />
            <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
            <p className="text-2xl font-black">{value}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

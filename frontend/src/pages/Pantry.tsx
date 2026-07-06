import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CalendarClock, Plus, Trash2, Warehouse } from "lucide-react";
import { pantryApi } from "../lib/api";
import type { PantryItem } from "../types";

export default function Pantry() {
  const { data: items = [] } = useQuery({ queryKey: ["pantry"], queryFn: pantryApi.list });
  const { data: alerts } = useQuery({ queryKey: ["pantry-alerts"], queryFn: pantryApi.alerts });
  const [localItems, setLocalItems] = useState<PantryItem[]>([]);
  const allItems = localItems.length ? localItems : items;

  const addDemoItem = () => {
    setLocalItems([
      ...allItems,
      { id: Date.now(), user_id: 1, name: "Spinach", quantity: 1, unit: "bunch", category: "Produce", expiry_date: "2026-07-09", low_stock_threshold: 1 }
    ]);
  };

  return (
    <div className="space-y-6">
      <section className="glass rounded-[8px] p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-saffron-600">Pantry management</p>
            <h1 className="mt-2 text-3xl font-black">Track stock, expiry, and recipe readiness</h1>
          </div>
          <button className="btn-primary" onClick={addDemoItem}><Plus className="h-4 w-4" />Add ingredient</button>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left">
              <thead className="text-sm text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="py-3">Ingredient</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Expiry</th>
                  <th>Status</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {allItems.map((item) => (
                  <tr key={item.id} className="border-t border-slate-200 dark:border-white/10">
                    <td className="py-4 font-black">{item.name}</td>
                    <td className="font-semibold text-slate-500 dark:text-slate-400">{item.category}</td>
                    <td className="font-semibold">{item.quantity} {item.unit}</td>
                    <td className="font-semibold">{item.expiry_date ?? "No date"}</td>
                    <td><span className="rounded-full bg-herb-500/10 px-3 py-1 text-xs font-black text-herb-700">Ready</span></td>
                    <td><button className="focus-ring rounded-full p-2" onClick={() => setLocalItems(allItems.filter((row) => row.id !== item.id))} aria-label="Remove item"><Trash2 className="h-4 w-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <aside className="space-y-5">
          <div className="card">
            <div className="flex items-center gap-3">
              <Warehouse className="h-5 w-5 text-saffron-500" />
              <h2 className="text-xl font-black">Pantry status</h2>
            </div>
            <p className="mt-5 text-5xl font-black">{allItems.length}</p>
            <p className="font-semibold text-slate-500 dark:text-slate-400">ingredients currently tracked</p>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-berry-500" />
              <h2 className="text-xl font-black">Alerts</h2>
            </div>
            <div className="mt-5 space-y-3">
              {(alerts?.expiring ?? ["Lemon"]).map((item: string) => (
                <div key={item} className="flex items-center gap-3 rounded-[8px] bg-berry-500/10 p-3 font-bold text-berry-500">
                  <CalendarClock className="h-4 w-4" />{item} expires soon
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}


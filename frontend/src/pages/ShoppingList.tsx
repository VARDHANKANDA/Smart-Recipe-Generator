import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Download, Printer, RefreshCw, ShoppingBasket } from "lucide-react";
import { shoppingApi } from "../lib/api";
import type { ShoppingItem } from "../types";

export default function ShoppingList() {
  const { data: items = [] } = useQuery({ queryKey: ["shopping-list"], queryFn: shoppingApi.list });
  const [localItems, setLocalItems] = useState<ShoppingItem[]>([]);
  const visibleItems = localItems.length ? localItems : items;

  const toggle = (id: number) => {
    setLocalItems(visibleItems.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  return (
    <div className="space-y-6">
      <section className="glass rounded-[8px] p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-saffron-600">Shopping list</p>
            <h1 className="mt-2 text-3xl font-black">Missing ingredients, grouped and ready</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="btn-secondary" onClick={() => setLocalItems(items)}><RefreshCw className="h-4 w-4" />Generate</button>
            <button className="btn-secondary" onClick={() => window.print()}><Printer className="h-4 w-4" />Print</button>
            <button className="btn-primary"><Download className="h-4 w-4" />Download</button>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="card">
          <div className="space-y-3">
            {visibleItems.map((item) => (
              <label key={item.id} className="flex cursor-pointer items-center justify-between gap-4 rounded-[8px] bg-slate-50 p-4 dark:bg-white/10">
                <span className="flex items-center gap-3">
                  <input checked={item.checked} onChange={() => toggle(item.id)} type="checkbox" className="h-5 w-5 rounded" />
                  <span className={item.checked ? "font-black text-slate-400 line-through" : "font-black"}>{item.name}</span>
                </span>
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{item.quantity} {item.unit} / {item.category}</span>
              </label>
            ))}
          </div>
        </div>
        <aside className="card h-fit">
          <ShoppingBasket className="h-8 w-8 text-saffron-500" />
          <p className="mt-5 text-5xl font-black">{visibleItems.filter((item) => !item.checked).length}</p>
          <p className="font-semibold text-slate-500 dark:text-slate-400">items left to buy</p>
          <div className="mt-6 rounded-[8px] bg-herb-500/10 p-4 text-herb-700 dark:text-herb-100">
            <CheckCircle2 className="h-5 w-5" />
            <p className="mt-2 font-black">Auto-generated from your meal plan and pantry stock.</p>
          </div>
        </aside>
      </section>
    </div>
  );
}


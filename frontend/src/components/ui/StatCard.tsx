import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: string;
};

export function StatCard({ label, value, icon: Icon, tone = "bg-saffron-100 text-saffron-600" }: StatCardProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{value}</p>
        </div>
        <div className={`grid h-12 w-12 place-items-center rounded-[8px] ${tone}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}


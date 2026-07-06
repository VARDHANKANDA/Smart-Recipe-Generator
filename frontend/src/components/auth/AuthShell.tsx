import { ChefHat } from "lucide-react";
import { Link } from "react-router-dom";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10 text-slate-900 dark:text-white">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1fr_420px]">
        <section className="hidden overflow-hidden rounded-[8px] bg-slate-950 text-white shadow-glow lg:block">
          <img
            src="https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80"
            alt="Chef preparing ingredients"
            className="h-80 w-full object-cover opacity-80"
          />
          <div className="p-8">
            <div className="flex items-center gap-3">
              <ChefHat className="h-8 w-8 text-saffron-500" />
              <span className="text-2xl font-black">SmartChef AI</span>
            </div>
            <p className="mt-5 max-w-md text-lg text-slate-300">
              Personalized recipes, pantry-aware meal plans, and nutrition insights in one polished final-year project.
            </p>
          </div>
        </section>
        <section className="glass rounded-[8px] p-6 sm:p-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-black text-saffron-600">
            <ChefHat className="h-5 w-5" />
            SmartChef AI
          </Link>
          <h1 className="mt-8 text-3xl font-black">{title}</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </section>
      </div>
    </main>
  );
}


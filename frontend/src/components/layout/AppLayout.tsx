import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Bot, CalendarDays, ChefHat, ClipboardList, Home, Moon, Search, Shield, ShoppingBasket, Sun, User, Warehouse } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "../../lib/api";
import { useAppStore } from "../../store/useAppStore";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/search", label: "Search", icon: Search },
  { to: "/generator", label: "Generator", icon: Bot },
  { to: "/pantry", label: "Pantry", icon: Warehouse },
  { to: "/planner", label: "Planner", icon: CalendarDays },
  { to: "/shopping-list", label: "List", icon: ShoppingBasket },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/admin", label: "Admin", icon: Shield }
];

export function AppLayout() {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode, setUser, user } = useAppStore();
  const { data: profile } = useQuery({
    queryKey: ["me"],
    queryFn: authApi.me
  });

  useEffect(() => {
    if (profile) setUser(profile);
  }, [profile, setUser]);

  return (
    <div className="min-h-screen text-slate-900 dark:text-white">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200/70 bg-white/75 p-5 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70 lg:block">
        <button onClick={() => navigate("/")} className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-saffron-500 text-slate-950">
            <ChefHat className="h-6 w-6" />
          </span>
          <span className="text-xl font-black">SmartChef AI</span>
        </button>
        <nav className="mt-10 space-y-2">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `focus-ring flex items-center gap-3 rounded-[8px] px-4 py-3 text-sm font-bold transition ${
                  isActive ? "bg-slate-950 text-white shadow-soft dark:bg-white dark:text-slate-950" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/70 px-4 py-3 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-saffron-600">Personalized kitchen</p>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Welcome, {user?.full_name ?? "Demo Student"}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-secondary px-4 py-2" onClick={toggleDarkMode} aria-label="Toggle dark mode">
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button className="btn-primary px-4 py-2" onClick={() => navigate("/generator")}>
                <Bot className="h-4 w-4" />
                Generate
              </button>
            </div>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {nav.slice(0, 6).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex min-w-fit items-center gap-2 rounded-full px-3 py-2 text-xs font-bold ${
                    isActive ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "bg-white/80 text-slate-600 dark:bg-white/10 dark:text-slate-300"
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}

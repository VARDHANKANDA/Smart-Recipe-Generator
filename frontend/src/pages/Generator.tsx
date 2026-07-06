import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Bot, ScanLine, Sparkles, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { aiApi } from "../lib/api";

type FormValues = {
  ingredients: string;
  preferred_cuisine: string;
  cooking_time: number;
  dietary_restrictions: string;
  skill_level: string;
};

export default function Generator() {
  const { register, handleSubmit, setValue } = useForm<FormValues>({
    defaultValues: {
      ingredients: "chickpeas, rice, lemon, tomato",
      preferred_cuisine: "Mediterranean",
      cooking_time: 30,
      dietary_restrictions: "vegetarian",
      skill_level: "Beginner"
    }
  });
  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      aiApi.generate({
        ...values,
        ingredients: values.ingredients.split(",").map((item) => item.trim()).filter(Boolean),
        dietary_restrictions: values.dietary_restrictions.split(",").map((item) => item.trim()).filter(Boolean)
      })
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <section className="glass h-fit rounded-[8px] p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-[8px] bg-saffron-500 text-slate-950"><Bot className="h-6 w-6" /></span>
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-saffron-600">AI Recipe Generator</p>
            <h1 className="text-2xl font-black">Build from what you have</h1>
          </div>
        </div>
        <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="mt-6 space-y-4">
          <textarea className="input min-h-28" placeholder="Available ingredients" {...register("ingredients", { required: true })} />
          <select className="input" {...register("preferred_cuisine")}>
            <option>Mediterranean</option>
            <option>Indian</option>
            <option>Italian</option>
            <option>Thai</option>
            <option>Global</option>
          </select>
          <label className="block text-sm font-bold">
            Cooking time
            <input type="range" min="10" max="75" className="mt-3 w-full" {...register("cooking_time", { valueAsNumber: true })} />
          </label>
          <input className="input" placeholder="Dietary restrictions" {...register("dietary_restrictions")} />
          <select className="input" {...register("skill_level")}>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" className="btn-secondary" onClick={() => setValue("ingredients", "paneer, onion, bell pepper, yogurt")}>
              <ScanLine className="h-4 w-4" />
              OCR scan
            </button>
            <button className="btn-primary" disabled={mutation.isPending}>
              <Wand2 className="h-4 w-4" />
              {mutation.isPending ? "Generating" : "Generate"}
            </button>
          </div>
        </form>
      </section>

      <section className="min-h-[620px]">
        {mutation.data ? (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-herb-500 px-3 py-1 text-xs font-black text-white">
                  <Sparkles className="h-3.5 w-3.5" />
                  {mutation.data.confidence}% confidence
                </p>
                <h2 className="mt-4 text-4xl font-black">{mutation.data.title}</h2>
                <p className="mt-3 max-w-3xl font-semibold leading-7 text-slate-600 dark:text-slate-300">{mutation.data.ai_explanation}</p>
              </div>
              <div className="rounded-[8px] bg-saffron-100 p-4 text-slate-950">
                <p className="text-sm font-bold">Estimated time</p>
                <p className="text-3xl font-black">{mutation.data.estimated_cooking_time}m</p>
              </div>
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="text-xl font-black">Ingredients</h3>
                <ul className="mt-4 space-y-2">
                  {mutation.data.ingredients.map((item) => <li key={item} className="rounded-[8px] bg-slate-50 p-3 font-semibold dark:bg-white/10">{item}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-black">Missing ingredients</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {mutation.data.missing_ingredients.map((item) => <span key={item} className="rounded-full bg-berry-500/10 px-3 py-2 text-sm font-black text-berry-500">{item}</span>)}
                </div>
                <h3 className="mt-8 text-xl font-black">Nutrition</h3>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {Object.entries(mutation.data.nutrition).map(([label, value]) => (
                    <div key={label} className="rounded-[8px] bg-slate-50 p-4 dark:bg-white/10">
                      <p className="text-sm font-semibold capitalize text-slate-500 dark:text-slate-400">{label}</p>
                      <p className="text-2xl font-black">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-black">Step-by-step instructions</h3>
              <ol className="mt-4 space-y-3">
                {mutation.data.instructions.map((step, index) => (
                  <li key={step} className="flex gap-3 rounded-[8px] bg-slate-50 p-4 dark:bg-white/10">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-saffron-500 text-sm font-black text-slate-950">{index + 1}</span>
                    <span className="font-semibold">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        ) : (
          <div className="card grid min-h-[620px] place-items-center text-center">
            <div className="max-w-md">
              <Bot className="mx-auto h-14 w-14 text-saffron-500" />
              <h2 className="mt-5 text-3xl font-black">Your generated recipe will appear here</h2>
              <p className="mt-3 font-semibold text-slate-500 dark:text-slate-400">Enter ingredients, cuisine, diet, and skill level to receive a structured recipe with nutrition and missing ingredients.</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

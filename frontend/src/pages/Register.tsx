import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../lib/api";
import { AuthShell } from "../components/auth/AuthShell";
import { useAppStore } from "../store/useAppStore";

type FormValues = {
  full_name: string;
  email: string;
  password: string;
  dietary_preferences: string;
  allergies: string;
};

export default function Register() {
  const navigate = useNavigate();
  const setToken = useAppStore((state) => state.setToken);
  const { register, handleSubmit, formState } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    const result = await authApi.register(values);
    setToken(result.access_token);
    navigate("/dashboard");
  };

  return (
    <AuthShell title="Create your kitchen profile" subtitle="Tell SmartChef how you cook and what you avoid.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input className="input" placeholder="Full name" {...register("full_name", { required: true })} />
        <input className="input" type="email" placeholder="Email" {...register("email", { required: true })} />
        <input className="input" type="password" placeholder="Password" {...register("password", { required: true, minLength: 8 })} />
        <input className="input" placeholder="Dietary preferences" {...register("dietary_preferences")} />
        <input className="input" placeholder="Allergies" {...register("allergies")} />
        <button className="btn-primary w-full" disabled={formState.isSubmitting}>{formState.isSubmitting ? "Creating..." : "Register"}</button>
      </form>
      <p className="mt-6 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
        Already registered? <Link to="/login" className="text-saffron-600">Login</Link>
      </p>
    </AuthShell>
  );
}


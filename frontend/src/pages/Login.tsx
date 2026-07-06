import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../lib/api";
import { AuthShell } from "../components/auth/AuthShell";
import { useAppStore } from "../store/useAppStore";

type FormValues = { email: string; password: string };

export default function Login() {
  const navigate = useNavigate();
  const setToken = useAppStore((state) => state.setToken);
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: { email: "student@smartchef.ai", password: "password123" }
  });

  const onSubmit = async (values: FormValues) => {
    const result = await authApi.login(values.email, values.password);
    setToken(result.access_token);
    navigate("/dashboard");
  };

  return (
    <AuthShell title="Welcome back" subtitle="Continue to your personalized SmartChef workspace.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input className="input" type="email" placeholder="Email" {...register("email", { required: true })} />
        <input className="input" type="password" placeholder="Password" {...register("password", { required: true })} />
        <div className="flex items-center justify-between text-sm font-semibold">
          <label className="flex items-center gap-2"><input type="checkbox" className="h-4 w-4 rounded" />Remember me</label>
          <Link to="/forgot-password" className="text-saffron-600">Forgot password?</Link>
        </div>
        <button className="btn-primary w-full" disabled={formState.isSubmitting}>{formState.isSubmitting ? "Signing in..." : "Login"}</button>
      </form>
      <p className="mt-6 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
        New here? <Link to="/register" className="text-saffron-600">Create an account</Link>
      </p>
    </AuthShell>
  );
}


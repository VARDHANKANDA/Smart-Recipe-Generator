import { Link } from "react-router-dom";
import { AuthShell } from "../components/auth/AuthShell";

export default function ForgotPassword() {
  return (
    <AuthShell title="Reset password" subtitle="A secure reset flow is ready for SMTP integration.">
      <form className="space-y-4">
        <input className="input" type="email" placeholder="Email address" />
        <button className="btn-primary w-full" type="button">Send reset link</button>
      </form>
      <p className="mt-6 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
        Remembered it? <Link to="/login" className="text-saffron-600">Back to login</Link>
      </p>
    </AuthShell>
  );
}


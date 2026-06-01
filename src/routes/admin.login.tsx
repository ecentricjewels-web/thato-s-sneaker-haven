import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin login — Thato's Storefront" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const { signIn, signUp, session, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && session && isAdmin) navigate({ to: "/admin" });
  }, [loading, session, isAdmin, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = mode === "signin"
      ? await signIn(email, password)
      : await signUp(email, password);
    setSubmitting(false);
    if (error) { toast.error(error); return; }
    if (mode === "signup") toast.success("Account created. The first signup becomes admin.");
    else toast.success("Signed in");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="mx-auto grid min-h-screen max-w-md place-items-center px-4">
        <form onSubmit={onSubmit} className="w-full space-y-5 rounded-sm border border-border bg-card p-8">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-primary">Admin</div>
            <h1 className="mt-1 font-display text-3xl font-bold">{mode === "signin" ? "Sign in" : "Create account"}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "signin" ? "Sign in to manage orders, products and wishlists." : "The first account created becomes the admin."}
            </p>
          </div>
          <label className="grid gap-1.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="rounded-sm border border-border bg-background px-3.5 py-3 text-sm outline-none focus:border-primary" />
          </label>
          <label className="grid gap-1.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Password
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="rounded-sm border border-border bg-background px-3.5 py-3 text-sm outline-none focus:border-primary" />
          </label>
          <button type="submit" disabled={submitting}
            className="w-full rounded-sm bg-primary py-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground hover:opacity-90 disabled:opacity-50">
            {submitting ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="hover:text-foreground">
              {mode === "signin" ? "Need an account? Create one" : "Have an account? Sign in"}
            </button>
            <Link to="/" className="hover:text-foreground">← Back to store</Link>
          </div>
        </form>
      </section>
    </div>
  );
}

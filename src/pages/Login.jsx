import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Logged in successfully!");
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20 fade-in">
      <div className="rounded-3xl bg-white border border-border p-8 text-center shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
        <div className="mb-8">
          <h1 className="font-serif text-3xl tracking-tight mb-2">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Enter your details to access your account.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-primary transition-colors text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-border rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-primary transition-colors text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
              Remember me
            </label>
            <button type="button" className="text-xs text-primary hover:underline font-medium">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-[#1F382A] transition-colors"
          >
            Log in <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-8 text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

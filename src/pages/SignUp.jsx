import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Lock, Mail, User, ArrowRight } from "lucide-react";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Account created successfully!");
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20 fade-in">
      <div className="rounded-3xl bg-white border border-border p-8 text-center shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
        <div className="mb-8">
          <h1 className="font-serif text-3xl tracking-tight mb-2">Create an account</h1>
          <p className="text-sm text-muted-foreground">Join us to start planning your next adventure.</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4 text-left">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-border rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-primary transition-colors text-sm"
              />
            </div>
          </div>
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

          <button
            type="submit"
            className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-[#1F382A] transition-colors"
          >
            Sign up <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-8 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

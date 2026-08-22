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

  const handleSocialSignUp = (provider) => {
    toast.success(`Signed up with ${provider}`);
    navigate("/");
  };

  return (
    <div className="flex-1 flex fade-in">
      {/* Left side: Image */}
      <div className="hidden lg:block relative w-1/2 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop"
          alt="Signup background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F2036]/80 to-transparent"></div>
        <div className="absolute bottom-12 left-12 text-white">
          <h2 className="font-serif text-4xl mb-4 text-white">Join the adventure.</h2>
          <p className="text-white/80 max-w-md">Create your profile, set your preferences, and let us help you plan the perfect trip tailored just for you.</p>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="font-serif text-4xl tracking-tight mb-2">Create an account</h1>
            <p className="text-muted-foreground">Join us to start planning your next adventure.</p>
          </div>

          <div className="space-y-4 mb-8">
            <button
              type="button"
              onClick={() => handleSocialSignUp("Google")}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl border border-border bg-white text-sm font-medium hover:bg-secondary transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.81 15.74 17.58V20.34H19.3C21.38 18.42 22.56 15.58 22.56 12.25Z" fill="#4285F4"/>
                <path d="M12 23C14.97 23 17.46 22.02 19.3 20.34L15.74 17.58C14.75 18.25 13.48 18.66 12 18.66C9.13 18.66 6.7 16.73 5.82 14.13H2.15V16.98C3.96 20.58 7.68 23 12 23Z" fill="#34A853"/>
                <path d="M5.82 14.13C5.59 13.46 5.46 12.74 5.46 12C5.46 11.26 5.59 10.54 5.82 9.87V7.02H2.15C1.41 8.51 1 10.21 1 12C1 13.79 1.41 15.49 2.15 16.98L5.82 14.13Z" fill="#FBBC05"/>
                <path d="M12 5.34C13.62 5.34 15.07 5.9 16.21 6.99L19.39 3.81C17.45 2 14.97 1 12 1C7.68 1 3.96 3.42 2.15 7.02L5.82 9.87C6.7 7.27 9.13 5.34 12 5.34Z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </button>
            
            <button
              type="button"
              onClick={() => handleSocialSignUp("Apple")}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl border border-border bg-white text-sm font-medium hover:bg-secondary transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.1 4.7C16.9 3.7 17.4 2.4 17.3 1C16.1 1 14.7 1.8 13.9 2.8C13.2 3.6 12.6 4.9 12.8 6.2C14.1 6.3 15.4 5.6 16.1 4.7ZM21 17.5C20.6 18.5 18.8 22 16.5 22C15.4 22 14.9 21.3 13.6 21.3C12.2 21.3 11.6 22 10.7 22C8.3 22 6.3 18.2 4.9 16.2C3.5 14.1 2.2 10.6 3.7 7.9C4.4 6.6 5.8 5.7 7.2 5.7C8.4 5.7 9.4 6.5 10.2 6.5C11 6.5 12.3 5.6 13.7 5.6C14.2 5.6 16.4 5.7 17.8 7.8C17.7 7.9 15.2 9.4 15.2 12.4C15.2 15.7 18 16.8 18.1 16.9C18 17.1 17.5 18.9 16.3 20.7"/>
              </svg>
              Sign up with Apple
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or sign up with email</span>
            </div>
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
                  className="w-full border border-border rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary transition-colors text-sm"
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
                  className="w-full border border-border rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary transition-colors text-sm"
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
                  className="w-full border border-border rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary transition-colors text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-[#1F382A] transition-colors"
            >
              Sign up <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen relative">
      <Navbar />
      <main className="relative z-10">
        <Outlet />
      </main>
      <footer className="mt-24 border-t border-border/70 bg-[#F1EDDE]/60">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌍</span>
            <span className="font-serif text-xl">GlobeTrotter</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Empowering personalized travel planning — © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

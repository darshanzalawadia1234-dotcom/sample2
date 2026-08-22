import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Bell, Menu, X, Globe2 } from "lucide-react";
import { useTrips } from "@/context/TripContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const links = [
  { to: "/", label: "Home" },
  { to: "/trips", label: "My Trips" },
  { to: "/explore", label: "Explore" },
  { to: "/plan", label: "Plan Trip" },
];

export default function Navbar() {
  const { user } = useTrips();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Plan page is light theme, others are dark theme
  const isLight = location.pathname === '/plan';
  
  const navBg = isLight ? "bg-white/60 border-black/10" : "bg-[var(--runway-navy)]/40 border-white/10";
  const textColor = isLight ? "text-black" : "text-white";
  const hoverBg = isLight ? "hover:bg-black/5" : "hover:bg-white/10";
  const activeBg = isLight ? "bg-black text-white" : "bg-white text-black";

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${navBg} ${textColor}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <Link to="/" data-testid="brand-logo" className="flex items-center gap-2 group">
          <Globe2 className={`w-6 h-6 transition-transform group-hover:rotate-12 ${isLight ? 'text-[var(--coral)]' : 'text-[var(--compass-brass)]'}`} strokeWidth={1.5} />
          <span className="font-serif text-xl font-bold tracking-tight">GlobeTrotter</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive ? activeBg : `${hoverBg} opacity-80 hover:opacity-100`
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            className={`w-10 h-10 rounded-full grid place-items-center transition-colors relative ${hoverBg}`}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" strokeWidth={1.5} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--coral)] rounded-full" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full transition-colors ${hoverBg}`}>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.photo} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user.name}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white/90 backdrop-blur-xl border-white/20">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/dashboard")}>Dashboard</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/profile")}>Profile & Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/trips")}>My Trips</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <button
          className={`md:hidden w-10 h-10 rounded-full grid place-items-center ${hoverBg}`}
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className={`md:hidden border-t backdrop-blur-xl ${navBg}`}>
          <div className="px-4 py-3 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg text-sm font-medium ${
                    isActive ? activeBg : hoverBg
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <NavLink to="/profile" onClick={() => setOpen(false)} className={`px-4 py-3 rounded-lg text-sm ${hoverBg}`}>Profile</NavLink>
          </div>
        </div>
      )}
    </header>
  );
}

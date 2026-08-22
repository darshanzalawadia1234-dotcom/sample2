import { Link, NavLink, useNavigate } from "react-router-dom";
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
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#FAF9F6]/75 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <Link to="/" data-testid="brand-logo" className="flex items-center gap-2 group">
          <Globe2 className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform" strokeWidth={1.5} />
          <span className="font-serif text-xl font-bold tracking-tight">GlobeTrotter</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              data-testid={`nav-${l.label.toLowerCase().replace(/\s/g, "-")}`}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            data-testid="notifications-btn"
            className="w-10 h-10 rounded-full grid place-items-center hover:bg-secondary transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" strokeWidth={1.5} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button data-testid="profile-menu" className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-secondary transition-colors">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.photo} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user.name}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/dashboard")} data-testid="menu-dashboard">Dashboard</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/profile")} data-testid="menu-profile">Profile & Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/trips")}>My Trips</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <button
          data-testid="mobile-menu-btn"
          className="md:hidden w-10 h-10 rounded-full grid place-items-center hover:bg-secondary"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-[#FAF9F6]">
          <div className="px-4 py-3 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg text-sm font-medium ${
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <NavLink to="/profile" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-sm hover:bg-secondary">Profile</NavLink>
          </div>
        </div>
      )}
    </header>
  );
}

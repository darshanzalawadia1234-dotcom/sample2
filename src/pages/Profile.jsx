import { useState } from "react";
import { Heart, Camera, Trash2, Lock } from "lucide-react";
import { toast } from "sonner";
import { useTrips } from "@/context/TripContext";
import { DESTINATIONS, findDestination, INTERESTS, TRAVEL_STYLES } from "@/data/mockData";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Profile() {
  const { user, setUser, savedDestinations, toggleSaved } = useTrips();
  const [form, setForm] = useState(user);

  const save = () => {
    setUser(form);
    toast.success("Profile updated");
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 md:py-14 fade-in">
      <div className="mb-8">
        <div className="eyebrow text-muted-foreground mb-2">Account</div>
        <h1 className="font-serif text-4xl md:text-5xl tracking-tight">Profile & Settings</h1>
      </div>

      <div className="grid md:grid-cols-[1fr_2fr] gap-6">
        {/* Left card */}
        <div className="rounded-3xl bg-white border border-border p-6 text-center">
          <div className="relative w-28 h-28 mx-auto">
            <Avatar className="w-28 h-28">
              <AvatarImage src={form.photo} alt={form.name} />
              <AvatarFallback>{form.name?.[0]}</AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primary text-white grid place-items-center hover:bg-[#1F382A]"><Camera className="w-4 h-4" /></button>
          </div>
          <h2 className="font-serif text-2xl mt-4">{form.name}</h2>
          <p className="text-sm text-muted-foreground">{form.email}</p>
          <div className="mt-6 border-t border-border pt-6 space-y-3 text-left">
            <button className="w-full flex items-center justify-between text-sm hover:text-primary"><span className="flex items-center gap-2"><Lock className="w-4 h-4" /> Change password</span><span>→</span></button>
            <button data-testid="delete-account-btn" className="w-full flex items-center justify-between text-sm text-destructive hover:opacity-80"><span className="flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete account</span><span>→</span></button>
          </div>
        </div>

        {/* Right side */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-white border border-border p-6">
            <div className="eyebrow text-muted-foreground mb-3">Personal</div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Name</label>
                <input data-testid="profile-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-border rounded-xl px-4 py-2.5 outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Email</label>
                <input data-testid="profile-email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-border rounded-xl px-4 py-2.5 outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Language</label>
                <select data-testid="profile-lang" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className="w-full border border-border rounded-xl px-4 py-2.5 outline-none focus:border-primary">
                  <option>English</option><option>Français</option><option>Español</option><option>हिन्दी</option><option>日本語</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Travel style</label>
                <select value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })} className="w-full border border-border rounded-xl px-4 py-2.5 outline-none focus:border-primary">
                  {TRAVEL_STYLES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-border p-6">
            <div className="eyebrow text-muted-foreground mb-3">Favourite activities</div>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((i) => {
                const active = form.favouriteActivities.includes(i.label);
                return (
                  <button
                    key={i.id}
                    onClick={() => setForm({ ...form, favouriteActivities: active ? form.favouriteActivities.filter((x) => x !== i.label) : [...form.favouriteActivities, i.label] })}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${active ? "chip-selected" : "border-border hover:bg-secondary"}`}
                  >
                    {i.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-border p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="eyebrow text-muted-foreground">Saved destinations</div>
              <span className="text-xs text-muted-foreground">{savedDestinations.length} saved</span>
            </div>
            {savedDestinations.length ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {savedDestinations.map((id) => {
                  const d = findDestination(id);
                  if (!d) return null;
                  return (
                    <div key={id} className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                      <img src={d.image} alt={d.city} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1B1A]/80 to-transparent" />
                      <div className="absolute bottom-2 left-3 text-white text-sm font-semibold">{d.city}</div>
                      <button onClick={() => toggleSaved(id)} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/85 grid place-items-center">
                        <Heart className="w-4 h-4 fill-[#9E2A2B] stroke-[#9E2A2B]" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nothing saved yet — bookmark a destination from the explore page.</p>
            )}
          </div>

          <div className="flex justify-end">
            <button data-testid="save-profile-btn" onClick={save} className="px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-[#1F382A]">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}

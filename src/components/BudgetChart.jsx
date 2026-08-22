import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

const COLORS = ["#2C4C3B", "#D4A373", "#3A5A40", "#B08163", "#5E635F"];
const CATEGORIES = [
  { key: "accommodation", label: "Stay" },
  { key: "food", label: "Food" },
  { key: "transport", label: "Transport" },
  { key: "activities", label: "Activities" },
  { key: "misc", label: "Misc" },
];

export function BudgetDonut({ breakdown, size = 220 }) {
  const data = CATEGORIES.map((c) => ({ name: c.label, value: breakdown[c.key] || 0 }));
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="relative" style={{ height: size }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} innerRadius={size * 0.28} outerRadius={size * 0.42} paddingAngle={2} dataKey="value" strokeWidth={0}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} contentStyle={{ borderRadius: 12, border: "1px solid #E5E5E0" }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <div className="text-center">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Total</div>
          <div className="font-serif text-2xl">₹{total.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}

export function BudgetBar({ breakdown }) {
  const data = CATEGORIES.map((c) => ({ name: c.label, amount: breakdown[c.key] || 0 }));
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E0" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#5E635F" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "#5E635F" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
        <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} contentStyle={{ borderRadius: 12, border: "1px solid #E5E5E0" }} />
        <Bar dataKey="amount" fill="#2C4C3B" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DailySpendChart({ days = [] }) {
  const data = days.map((d, i) => ({
    day: `Day ${i + 1}`,
    spend: d.spend || 0,
  }));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E0" vertical={false} />
        <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#5E635F" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "#5E635F" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
        <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} contentStyle={{ borderRadius: 12, border: "1px solid #E5E5E0" }} />
        <Bar dataKey="spend" fill="#D4A373" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

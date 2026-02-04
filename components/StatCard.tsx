import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  badge?: string;
  accent?: "blue" | "green" | "orange";
}

const accentMap = {
  blue: "bg-blue-500/15 text-blue-400",
  green: "bg-emerald-500/15 text-emerald-400",
  orange: "bg-orange-500/15 text-orange-400",
};

export default function StatCard({
  icon,
  label,
  value,
  badge,
  accent = "blue",
}: StatCardProps) {
  return (
    <div className="glass-card rounded-2xl p-6 h-[150px] flex flex-col justify-between">
      {/* Top */}
      <div className="flex items-start justify-between">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${accentMap[accent]}`}
        >
          {icon}
        </div>

        {badge && (
          <span className="text-[11px] px-2 py-1 rounded-full bg-blue-500/10 text-blue-300">
            {badge}
          </span>
        )}
      </div>

      {/* Bottom */}
      <div className="space-y-1">
        <p className="text-sm text-slate-400 leading-none">{label}</p>
        <p className="text-2xl font-semibold tracking-tight text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

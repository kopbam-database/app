import { ReactNode } from "react";
import {
  Users,
  Wallet,
  ArrowDownCircle,
  Target,
} from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: "users" | "wallet" | "income" | "target";
  subtitle?: string;
};

const iconMap: Record<StatCardProps["icon"], ReactNode> = {
  users: <Users size={26} strokeWidth={2.2} />,
  wallet: <Wallet size={26} strokeWidth={2.2} />,
  income: <ArrowDownCircle size={26} strokeWidth={2.2} />,
  target: <Target size={26} strokeWidth={2.2} />,
};

export default function StatCard({
  title,
  value,
  icon,
  subtitle,
}: StatCardProps) {
  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-3">
      {/* ICON */}
      <div className="w-11 h-11 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400 [shape-rendering:geometricPrecision]">
        {iconMap[icon]}
      </div>

      {/* TITLE */}
      <div className="text-sm text-slate-400">
        {title}
      </div>

      {/* VALUE */}
      <div className="text-2xl font-semibold text-white">
        {value}
      </div>

      {/* SUBTITLE */}
      {subtitle && (
        <div className="text-xs text-slate-500">
          {subtitle}
        </div>
      )}
    </div>
  );
}

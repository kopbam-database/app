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

const iconClass =
  "icon-smooth text-blue-400";

const iconMap: Record<StatCardProps["icon"], ReactNode> = {
  users: <Users size={24} strokeWidth={2.5} className={iconClass} />,
  wallet: <Wallet size={24} strokeWidth={2.5} className={iconClass} />,
  income: <ArrowDownCircle size={24} strokeWidth={2.5} className={iconClass} />,
  target: <Target size={24} strokeWidth={2.5} className={iconClass} />,
};

export default function StatCard({
  title,
  value,
  icon,
  subtitle,
}: StatCardProps) {
  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        {iconMap[icon]}
      </div>

      <div className="text-sm text-slate-400">{title}</div>

      <div className="text-2xl font-semibold text-white">
        {value}
      </div>

      {subtitle && (
        <div className="text-xs text-slate-500">
          {subtitle}
        </div>
      )}
    </div>
  );
}

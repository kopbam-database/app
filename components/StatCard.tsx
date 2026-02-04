import { ReactNode } from "react";
import {
  Users,
  Wallet,
  ArrowDownCircle,
  Target
} from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: "users" | "wallet" | "income" | "target";
  subtitle?: string;
};

const iconMap: Record<StatCardProps["icon"], ReactNode> = {
  users: <Users size={28} strokeWidth={1.5} />,
  wallet: <Wallet size={28} strokeWidth={1.5} />,
  income: <ArrowDownCircle size={28} strokeWidth={1.5} />,
  target: <Target size={28} strokeWidth={1.5} />,
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
        <div className="text-blue-400">{iconMap[icon]}</div>
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

import { ReactNode } from "react";
import {
  Users,
  Wallet,
  TrendingDown,
  Target,
  HelpCircle
} from "lucide-react";

type IconKey = "users" | "wallet" | "income" | "target";

type StatCardProps = {
  title: string;
  value: string | number;
  icon?: IconKey;
  subtitle?: string;
};

const iconStyle = {
  size: 28,
  strokeWidth: 2
};

const iconMap: Record<IconKey, ReactNode> = {
  users: <Users {...iconStyle} />,
  wallet: <Wallet {...iconStyle} />,
  income: <TrendingDown {...iconStyle} />,
  target: <Target {...iconStyle} />
};

export default function StatCard({
  title,
  value,
  icon = "users",
  subtitle
}: StatCardProps) {
  const Icon = iconMap[icon] ?? <HelpCircle {...iconStyle} />;

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="text-blue-400">
          {Icon}
        </div>
      </div>

      <div className="text-sm text-slate-400">
        {title}
      </div>

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

import { LucideIcon, Target } from "lucide-react";

type ColorVariant = "green" | "blue" | "orange" | "purple" | "red";

interface InsightCardProps {
  icon: LucideIcon;
  title: string;
  insight: string;
  actionable?: string;
  color: ColorVariant;
  value?: string | number;
  trend?: string;
}

const colorClasses: Record<ColorVariant, string> = {
  green: "from-green-500 to-emerald-600",
  blue: "from-blue-500 to-cyan-600",
  orange: "from-orange-500 to-amber-600",
  purple: "from-purple-500 to-violet-600",
  red: "from-red-500 to-rose-600",
};

export const InsightCard = ({
  icon: Icon,
  title,
  insight,
  actionable,
  color,
  value,
  trend,
}: InsightCardProps) => {
  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-6 text-white relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-white/20 rounded-lg">
            <Icon className="w-6 h-6" />
          </div>
          {value !== undefined && (
            <div className="text-right">
              <div className="text-2xl font-bold">{value}</div>
              {trend && <div className="text-xs opacity-80">{trend}</div>}
            </div>
          )}
        </div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-white/90 text-sm pb-2">{insight}</p>
        {actionable && (
          <div className="flex items-center text-sm bg-white/20 rounded-lg p-3">
            <Target className="w-4 h-4 mr-2" />
            <span className="text-xs">{actionable}</span>
          </div>
        )}
      </div>
    </div>
  );
};

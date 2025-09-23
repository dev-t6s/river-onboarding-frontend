import { LucideIcon } from "lucide-react";

type Color = "blue" | "green" | "red" | "yellow" | "purple" | "gray";

interface MetricCardProps {
  title: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
  trend?: number;
  icon: LucideIcon;
  color?: Color;
}

const colorMap: Record<Color, { text: string; bg: string }> = {
  blue: { text: "text-blue-600", bg: "bg-blue-100" },
  green: { text: "text-green-600", bg: "bg-green-100" },
  red: { text: "text-red-600", bg: "bg-red-100" },
  yellow: { text: "text-yellow-600", bg: "bg-yellow-100" },
  purple: { text: "text-purple-600", bg: "bg-purple-100" },
  gray: { text: "text-gray-600", bg: "bg-gray-100" },
};

export const MetricCard = ({
  title,
  value,
  prefix = "",
  suffix = "",
  //   trend,
  icon: Icon,
  color = "blue",
}: MetricCardProps) => {
  const { text: textColor, bg: bgColor } = colorMap[color];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${textColor} mt-1`}>
            {prefix}
            {typeof value === "number" ? value.toLocaleString() : value}
            {suffix}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`w-6 h-6 ${textColor}`} />
        </div>
      </div>
      {/* {trend !== undefined && (
                <div className="flex items-center mt-3">
                    {trend > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
                        {Math.abs(trend).toFixed(1)}% vs last period
                    </span>
                </div>
            )} */}
    </div>
  );
};

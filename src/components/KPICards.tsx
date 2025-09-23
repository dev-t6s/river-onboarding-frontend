import { DollarSign, TrendingUp, Target, MousePointer } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";

interface KPICardsProps {
  kpis: {
    totalSpend: number;
    totalRevenue: number;
    totalRoas: number;
    totalCtr: number;
  };
  currency: string;
}

export const KPICards = ({ kpis, currency }: KPICardsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 text-black">
    <MetricCard
      title="Total Spend"
      value={Math.round(kpis.totalSpend).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
      prefix={currency === "INR" ? "₹" : "$"}
      icon={DollarSign}
      color="blue"
      trend={12.5}
    />
    <MetricCard
      title="Revenue Generated"
      value={kpis.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
      prefix={currency === "INR" ? "₹" : "$"}
      icon={TrendingUp}
      color="green"
      trend={18.2}
    />
    <MetricCard
      title="ROAS"
      value={kpis.totalRoas.toFixed(2)}
      suffix="x"
      icon={Target}
      color={kpis.totalRoas > 1 ? "red" : "purple"}
      trend={-2.1}
    />
    <MetricCard
      title="CTR"
      value={kpis.totalCtr.toFixed(2)}
      suffix="%"
      icon={MousePointer}
      color="yellow"
      trend={5.8}
    />
  </div>
);

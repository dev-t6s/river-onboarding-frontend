/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import {
  RefreshCw,
  Target,
  DollarSign,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { InsightCard } from "@/components/InsightCard";
import { CampaignCard } from "@/components/CampaignCard";

interface RetargetingAnalysisProps {
  retargetingAnalysis: any[];
  retentionMetrics: any[];
  selectedMetric: string;
  setSelectedMetric: (metric: string) => void;
  timeRange: string;
  setTimeRange: (range: string) => void;
  selectedAudience: string;
  setSelectedAudience: (audience: string) => void;
  totalSpend: number;
}

export const RetargetingAnalysis = ({
  retargetingAnalysis,
  retentionMetrics,
  selectedMetric,
  setSelectedMetric,
  timeRange,
  setTimeRange,
  selectedAudience,
  setSelectedAudience,
  totalSpend,
}: RetargetingAnalysisProps) => {
  const totalRevenue = retargetingAnalysis.reduce(
    (sum, item) => sum + item.revenue,
    0
  );
  const overallROAS = totalRevenue / totalSpend;

  const retargetingData = retargetingAnalysis.find(
    (r) => r.type === "Retargeting"
  );
  const prospectingData = retargetingAnalysis.find(
    (r) => r.type === "Prospecting"
  );

  const retargetingPercentage =
    ((retargetingData?.spend || 0) / totalSpend) * 100;

  const bestPerformer = retargetingAnalysis.reduce((best, current) =>
    current.roas > best.roas ? current : best
  );

  const filteredData = useMemo(() => {
    let data = [...retargetingAnalysis];
    if (selectedAudience !== "all") {
      data = data.filter((item) =>
        item.type.toLowerCase().includes(selectedAudience.toLowerCase())
      );
    }
    return data;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAudience]);

  return (
    <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <RefreshCw className="w-5 h-5 text-indigo-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">
            Remarketing & Retention Analysis
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <InsightCard
          icon={Target}
          title="Best Performer"
          insight={`${bestPerformer.type} campaigns delivering highest returns`}
          actionable="Scale this campaign type for maximum efficiency"
          color="green"
          value={`${bestPerformer.roas.toFixed(1)}x`}
          trend={`${bestPerformer.type} ROAS`}
        />

        <InsightCard
          icon={RefreshCw}
          title="Retargeting Efficiency"
          insight={`${retargetingData?.roas.toFixed(
            1
          )}x ROAS vs ${prospectingData?.roas.toFixed(1)}x for prospecting`}
          actionable="Increase retargeting budget allocation"
          color="blue"
          value={`${(
            (retargetingData?.roas || 0) / (prospectingData?.roas || 1)
          ).toFixed(1)}x`}
          trend="better than prospecting"
        />

        <InsightCard
          icon={DollarSign}
          title="Budget Allocation"
          insight={`${retargetingPercentage.toFixed(
            1
          )}% of spend on retargeting audiences`}
          actionable="Optimize budget distribution for better ROI"
          color="orange"
          value={`${retargetingPercentage.toFixed(1)}%`}
          trend="retargeting allocation"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        <div className="xl:col-span-2">
          <div className="bg-white text-black rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
                Campaign Performance Comparison
              </h3>
              <div className="text-sm text-gray-600">
                Total ROI: {overallROAS.toFixed(2)}x
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={filteredData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(value: number) => {
                    if (value >= 1000000) {
                      return `${(value / 1000000).toFixed(0)}M`;
                    }
                    if (value >= 1000) {
                      return `${(value / 1000).toFixed(0)}K`;
                    }
                    return value.toLocaleString();
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, (dataMax: number) => Math.max(5, dataMax * 1.2)]}
                />
                <Tooltip
                  formatter={(value, name, props) => [
                    name === "Spend"
                      ? `₹${Number(value).toFixed(0)}`
                      : name === "Revenue"
                      ? `₹${Number(value).toFixed(0)}`
                      : `${Number(value).toFixed(2)}x`,
                    name,
                  ]}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    padding: "8px 12px",
                  }}
                  itemStyle={{
                    color: "#333",
                    fontSize: "16px",
                    fontWeight: 500,
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="spend"
                  fill="#6366f1"
                  name="Spend"
                />
                <Bar
                  yAxisId="left"
                  dataKey="revenue"
                  fill="#10b981"
                  name="Revenue"
                />
                <Bar
                  yAxisId="right"
                  dataKey="roas"
                  fill="#f59e0b"
                  name="ROAS"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-8 flex items-center">
            <Target className="w-5 h-5 mr-2 text-indigo-600" />
            Campaign Types
          </h3>
          <div className="space-y-3">
            {retargetingAnalysis.map((campaign, index) => (
              <CampaignCard
                key={index}
                campaign={campaign}
                index={index}
                isSelected={selectedAudience === campaign.type.toLowerCase()}
                onClick={() =>
                  setSelectedAudience(
                    selectedAudience === campaign.type.toLowerCase()
                      ? "all"
                      : campaign.type.toLowerCase()
                  )
                }
                overallROAS={overallROAS}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

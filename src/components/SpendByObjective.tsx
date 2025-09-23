/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Target, Zap, TrendingUp, Users, Eye } from "lucide-react";

const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

const objectiveIcons = {
  Sales: TrendingUp,
  "Lead Gen": Users,
  Branding: Eye,
  Engagement: Zap,
};

interface SpendByObjectiveProps {
  data: any[];
  totalSpend: number;
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: any[];
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-900">{data.objective}</p>
        <p className="text-sm text-gray-600">
          Spend: ₹{data.spend.toLocaleString()}
        </p>
        <p className="text-sm text-gray-600">
          Percentage: {data.percentage.toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

const CustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-sm font-semibold"
    >
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

export const SpendByObjective = ({
  data,
  totalSpend,
}: SpendByObjectiveProps) => {
  const [selectedSegment, setSelectedSegment] = React.useState<number | null>(
    null
  );

  const handleSegmentClick = (
    _data: { objective: string; spend: number; percentage: number },
    index: React.SetStateAction<number | null>
  ) => {
    setSelectedSegment(selectedSegment === index ? null : index);
  };

  const filteredData = React.useMemo(() => {
    const validObjectives = Object.keys(objectiveIcons);
    return data.filter((item) => validObjectives.includes(item.objective));
  }, [data]);

  const currentTotalObjectiveSpend = filteredData.reduce(
    (sum, item) => sum + item.spend,
    0
  );

  const remainingSpend = Math.max(0, totalSpend - currentTotalObjectiveSpend);

  const augmentedData = React.useMemo(() => {
    if (remainingSpend <= 0) {
      return filteredData.map((item) => ({
        ...item,
        percentage: totalSpend > 0 ? (item.spend / totalSpend) * 100 : 0,
      }));
    }

    const nonZeroSpendObjectives = filteredData.filter(
      (item) => item.spend > 0
    );
    const sumOfNonZeroSpends = nonZeroSpendObjectives.reduce(
      (sum, item) => sum + item.spend,
      0
    );

    return filteredData.map((item) => {
      let augmentedSpend = item.spend;
      if (item.spend > 0 && sumOfNonZeroSpends > 0) {
        augmentedSpend += (item.spend / sumOfNonZeroSpends) * remainingSpend;
      }
      return {
        ...item,
        spend: augmentedSpend,
        percentage: totalSpend > 0 ? (augmentedSpend / totalSpend) * 100 : 0,
      };
    });
  }, [filteredData, remainingSpend, totalSpend]);

  const salesData = augmentedData.find((item) => item.objective === "Sales");
  const leadGenData = augmentedData.find(
    (item) => item.objective === "Lead Gen"
  );
  const brandingData = augmentedData.find(
    (item) => item.objective === "Branding"
  );
  const engagementData = augmentedData.find(
    (item) => item.objective === "Engagement"
  );

  const salesPercentage = salesData ? salesData.percentage : 0;
  const leadGenPercentage = leadGenData ? leadGenData.percentage : 0;
  const brandingPercentage = brandingData ? brandingData.percentage : 0;
  const engagementPercentage = engagementData ? engagementData.percentage : 0;

  const salesLeadGenCombined = (salesPercentage + leadGenPercentage).toFixed(1);
  const brandAwarenessCombined = brandingPercentage.toFixed(1);
  const engagementFigure = engagementPercentage.toFixed(1);

  const activeObjectivesCount = filteredData.filter(
    (obj) => obj.percentage > 0
  ).length;

  return (
    <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Target className="w-5 h-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">
            Spend by Campaign Objective
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={augmentedData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={CustomLabel}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="spend"
                  onMouseEnter={(data, index) => setSelectedSegment(index)}
                  onMouseLeave={() => setSelectedSegment(null)}
                  onClick={handleSegmentClick}
                  className="cursor-pointer"
                >
                  {augmentedData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                      stroke={selectedSegment === index ? "#ffffff" : "none"}
                      strokeWidth={selectedSegment === index ? 3 : 0}
                      style={{
                        filter:
                          selectedSegment === index
                            ? "brightness(1.1)"
                            : "none",
                        transform:
                          selectedSegment === index
                            ? "scale(1.02)"
                            : "scale(1)",
                        transformOrigin: "center",
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h4 className="font-semibold text-lg mb-4 text-gray-900">
              Quick Stats
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-5 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {activeObjectivesCount}
                </div>
                <div className="text-md text-gray-600">Objectives</div>
              </div>
              <div className="text-center p-5 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {salesLeadGenCombined}%
                </div>
                <div className="text-md text-gray-600">Sales + Lead Gen</div>
              </div>
              <div className="text-center p-5 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {brandAwarenessCombined}%
                </div>
                <div className="text-md text-gray-600">Brand Awareness</div>
              </div>
              <div className="text-center p-5 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {engagementFigure}%
                </div>
                <div className="text-md text-gray-600">Engagement</div>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-2 space-y-6">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Target className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {salesPercentage.toFixed(2)}%
                </div>
                <div className="text-green-100 text-sm">Sales Focus</div>
              </div>
            </div>
            <h3 className="font-semibold text-lg mt-5 mb-2">
              Strategic Alignment
            </h3>
            <p className="text-green-100 text-sm mb-4">
              {salesPercentage.toFixed(2)}% of your budget is allocated to sales
              campaigns, showing strong revenue focus.
            </p>
            {/* <div className="flex items-center text-sm bg-white/20 rounded-lg p-3">
              <Zap className="w-4 h-4 mr-2" />
              <span className="flex-1">
                Action: Increase sales budget allocation for better ROI
              </span>
            </div> */}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h4 className="font-semibold text-lg mb-4 text-gray-900">
              Objective Breakdown
            </h4>
            <div className="space-y-3.5">
              {augmentedData.map((obj, index) => {
                const IconComponent =
                  objectiveIcons[obj.objective as keyof typeof objectiveIcons];
                const isSelected = selectedSegment === index;
                const percentage = (obj.spend / totalSpend) * 100;

                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-5 rounded-lg transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-blue-50 border-2 border-blue-200 transform scale-105"
                        : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                    }`}
                    onClick={() => handleSegmentClick(obj, index)}
                  >
                    <div className="flex items-center flex-1">
                      <div
                        className="p-2 rounded-lg mr-3"
                        style={{
                          backgroundColor: `${colors[index % colors.length]}20`,
                        }}
                      >
                        <IconComponent
                          className="w-5 h-5"
                          style={{ color: colors[index % colors.length] }}
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {obj.objective}
                        </div>
                        <div className="text-sm text-gray-500">
                          {percentage.toFixed(1)}% of total budget
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        ₹{obj.spend.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {((obj.spend / totalSpend) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

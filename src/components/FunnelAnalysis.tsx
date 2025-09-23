/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useMemo } from "react";
import { ShoppingCart, AlertCircle, Target, Users } from "lucide-react";
import { InsightCard } from "@/components/InsightCard";
import { FunnelStage } from "@/components/FunnelStage";
import { TotalMetrics } from "@/types/meta-ads";

interface FunnelAnalysisProps {
  metrics: TotalMetrics;
  viewMode: string;
  setViewMode: (mode: string) => void;
  timeRange: string;
  setTimeRange: (range: string) => void;
}

export const FunnelAnalysis = ({
  metrics,
  viewMode,
  setViewMode,
  timeRange,
  setTimeRange,
}: FunnelAnalysisProps) => {
  const stageColors = ["#00FFFF", "#DA70D6", "#FFD700", "#FA5F55", "#50C878"];

  // const totalImpressions = data!.reduce(
  //   (sum, item) => sum + item.impressions,
  //   0
  // );
  // const totalClicks = data!.reduce((sum, item) => sum + item.clicks, 0);
  // const totalAddToCart = data!.reduce((sum, item) => sum + item.addToCart, 0);
  // const totalCheckouts = data!.reduce(
  //   (sum, item) => sum + item.checkoutInit,
  //   0
  // );
  // const totalPurchases = data!.reduce((sum, item) => sum + item.purchases, 0);

  const funnelData: any[] = useMemo(
    () => [
      {
        name: "Impressions" as const,
        value: metrics.total_impressions,
        fill: "#3B82F6",
      },
      { name: "Clicks" as const, value: metrics.total_clicks, fill: "#10B981" },
      { name: "Add to Cart" as const, value: metrics.total_addtocart, fill: "#F59E0B" },
      { name: "Checkout" as const, value: metrics.total_checkout, fill: "#EF4444" },
      { name: "Purchases" as const, value: metrics.total_purchases, fill: "#8B5CF6" },
    ],
    [
      metrics
    ]
  );

  const conversionRates = useMemo(() => {
    const rates = [];
    for (let i = 1; i < funnelData.length; i++) {
      const current = funnelData[i];
      const previous = funnelData[i - 1];
      const rate = (current.value / previous.value) * 100;
      const dropOff = 100 - rate;

      rates.push({
        from: previous.name,
        to: current.name,
        conversionRate: rate,
        dropOffRate: dropOff,
        lost: previous.value - current.value,
        fromValue: previous.value,
        toValue: current.value,
      });
    }
    return rates;
  }, [funnelData]);

  const biggestDropOff = conversionRates.reduce((max, current) =>
    current.dropOffRate > max.dropOffRate ? current : max
  );

  const lostTerm = biggestDropOff.from === "Impressions" ? "views" : "users";
  const recoveryTrend =
    biggestDropOff.from === "Impressions"
      ? "potential clicks"
      : "potential recoveries";

  const overallConversion = (funnelData[4].value / funnelData[1].value) * 100;

  const funnelVizData = funnelData.map((stage, index) => {
    const maxWidth = 100;
    const ratio = stage.value / funnelData[0].value;
    const width = Math.max(ratio * maxWidth, 10);

    return {
      ...stage,
      width,
      ratio,
      color: stageColors[index],
      conversionFromPrevious:
        index > 0 ? (stage.value / funnelData[index - 1].value) * 100 : 100,
    };
  });

  return (
    <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <ShoppingCart className="w-5 h-5 text-orange-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">
            Funnel Drop-off Analysis
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Conversion Funnel
              </h3>
              <div className="text-sm text-gray-600">
                Total: {funnelData[0].value.toLocaleString()} →{" "}
                {funnelData[4].value.toLocaleString()}
              </div>
            </div>

            <div className="space-y-2">
              {funnelVizData.map((stage, index) => (
                <FunnelStage
                  key={index}
                  stage={stage}
                  index={index}
                  funnelVizData={funnelVizData}
                  conversionRates={conversionRates}
                />
              ))}
            </div>

            <div className="mt-7 pt-8 border-t border-gray-200 mb-[0.8rem]">
              <div className="grid grid-cols-3 gap-5 text-center">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {(
                      (funnelData[1].value / funnelData[0].value) *
                      100
                    ).toFixed(2)}
                    %
                  </div>
                  <div className="text-md text-gray-600">
                    Click-through Rate
                  </div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {biggestDropOff.dropOffRate.toFixed(1)}%
                  </div>
                  <div className="text-md text-gray-600">Biggest Drop-off</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {overallConversion.toFixed(2)}%
                  </div>
                  <div className="text-md text-gray-600">
                    Overall Conversion
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <InsightCard
            icon={AlertCircle}
            title="Critical Drop-off"
            insight={`${biggestDropOff.dropOffRate.toFixed(1)}% drop from ${
              biggestDropOff.from
            } to ${biggestDropOff.to}`}
            actionable="Optimize this stage immediately for maximum impact"
            color="red"
            value={`-${biggestDropOff.lost.toLocaleString()}`}
            trend="users lost"
          />

          <InsightCard
            icon={Target}
            title="Conversion Performance"
            insight={`${overallConversion.toFixed(
              2
            )}% overall conversion rate from clicks to purchases`}
            actionable="Focus on checkout optimization for better CVR"
            color="green"
            value={`${overallConversion.toFixed(2)}%`}
            trend="conversion rate"
          />

          <InsightCard
            icon={Users}
            title="Recovery Opportunity"
            insight={`${biggestDropOff.lost.toLocaleString()} ${lostTerm} lost at ${
              biggestDropOff.to
            } stage - highest recovery potential`}
            actionable={`A 10% improvement could recover ${Math.floor(
              biggestDropOff.lost * 0.1
            ).toLocaleString()}+ additional conversions`}
            color="purple"
            value={`${Math.floor(biggestDropOff.lost * 0.1).toLocaleString()}+`}
            trend={recoveryTrend}
          />
        </div>
      </div>
    </div>
  );
};

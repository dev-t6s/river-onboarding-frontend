/* eslint-disable @typescript-eslint/no-explicit-any */
import { Zap } from "lucide-react";
import React from "react";

interface AiInsightsProps {
  campaignSummary: any[];
}

const AiInsights: React.FC<AiInsightsProps> = ({ campaignSummary }) => {
  return (
    <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
      <div className="flex items-center mb-4">
        <Zap className="w-5 h-5 text-blue-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-900">
          AI-Powered Insights
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 border border-blue-100">
          <h3 className="font-medium text-gray-900 mb-2">🚀 Top Performer</h3>
          <p className="text-sm text-gray-600">
            {campaignSummary.sort((a, b) => b.roas - a.roas)[0]?.campaignName}{" "}
            has the highest ROAS at{" "}
            {campaignSummary
              .sort((a, b) => b.roas - a.roas)[0]
              ?.roas.toFixed(2)}
            x. Consider increasing budget allocation.
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-blue-100">
          <h3 className="font-medium text-gray-900 mb-2">
            ⚠️ Optimization Opportunity
          </h3>
          <p className="text-sm text-gray-600">
            {campaignSummary.filter((c) => c.roas < 1).length} campaigns have
            ROAS below 1.0. Review targeting and creative assets.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AiInsights;

import React from "react";
import { RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";

export const CreativeFreshness = ({
  fatigueIndex,
}: {
  fatigueIndex: number;
}) => {
  const getFatigueLevel = () => {
    if (fatigueIndex <= 25) return (
      {
        "level":"Low",
        "color":"text-green-600",
        "bgColor": "bg-green-600",
        "recomendations": ["Continue scaling top creatives","Maintain rotation to keep freshness","Plan next batch of creatives for testing"],
        "footer":"Your audience is seeing a healthy mix of creatives, ensuring stable performance and lower ad fatigue"
      }
    );
    if (fatigueIndex > 25 && fatigueIndex <= 50) return (
      {
        "level":"Moderate",
        "color":"text-orange-600",
        "bgColor": "bg-orange-600",
        "recomendations": ["Refresh fatigued creatives this week","Test 2-3 new variations with fresh hooks","Monitor frequency on top creatives"],
        "footer":"Some of your spend is going to fatigued creatives. Refresh and test new angles to maintain performance"
      }
    );
    return (
      {
        "level":"High",
        "color":"text-red-600",
        "bgColor": "bg-red-600",
        "recomendations": ["Pause heavily fatigued creatives","Launch new creatives immediately","Reduce budget on fatigued ads to avoid wastage"],
        "footer":"Most of your spend is on fatigued creatives, which may hurt performance and increase costs. Act now to refresh your ads"
      }
    );
  };

  const fatigueLevel = getFatigueLevel();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
      <h3 className="text-lg font-semibold flex items-center mb-4">
        <RefreshCw className="h-5 w-5 mr-2 text-orange-500" />
        Creative Freshness
      </h3>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm mb-1 font-medium">Fatigue Index</div>
          <div
            className={`text-2xl font-bold ${fatigueLevel.color}`}
          >
            {fatigueIndex.toFixed(1)}%
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${fatigueLevel.color}`}
        >
          {fatigueLevel.level} Fatigue
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className={`h-2 rounded-full ${fatigueLevel.bgColor}`}
          style={{ width: `${fatigueIndex.toFixed(1)}%` }}
        ></div>
      </div>
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Recommendations</h4>
        {fatigueLevel.recomendations.map((item, index) => (
          <div key={index} className="flex items-center">
            {fatigueLevel.level === "High" ? (
              <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
            ) : fatigueLevel.level === "Moderate" ? (
              <RefreshCw className="h-4 w-4 text-blue-500 mr-2" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            )}
            <span
              className={`text-sm ${
                fatigueLevel.level === "High" ? "font-semibold" : ""
              }`}
            >
              {fatigueLevel.recomendations[index]}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-gray-500">
        {fatigueLevel.footer}
      </div>
    </div>
  );
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Circle,
  Image as ImageIcon,
  RefreshCw,
  Rocket,
  Star,
  TrendingUp,
} from "lucide-react";
import { CreativeKPIs } from "@/types/meta-ads";

export const KPICards = ({
  kpis,
  topCreative,
}: {
  kpis?: CreativeKPIs;
  topCreative?: any;
}) => {
  if (!kpis) return null;

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getFatigueState = (index: number) => {
    if (index < 25) return ({"color": "text-green-600", "msg": "Your account is healthy; most spend is on effective creatives"});
    if (index >= 25 && index <= 50) return ({"color": "text-orange-600", "msg": "Some creatives are tiring; plan refreshes soon"});
    return ({"color": "text-red-600", "msg": "Most spend is on tired creatives; refresh or pause to avoid wasted spend"});
  };

  const creativeFatigueLevel = getFatigueState(kpis.creativeFatiguePercent)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
        {" "}
        <div>
          {" "}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">
              Creative Score
            </h3>
            <Star className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="mt-3 flex items-center">
            {" "}
            <span
              className={`text-3xl font-bold ${getScoreColor(
                kpis.creativeScore
              )}`}
            >
              {(kpis.creativeScore).toFixed(1)}
            </span>
            <span className="text-gray-500 ml-1">/10</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">vs. last period</div>{" "}
      </div>

      {/* Top Creative ROAS */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
        {" "}
        <div>
          {" "}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">
              Top Creative ROAS
            </h3>
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </div>
          <div className="mt-5 flex items-center">
            <div className="relative">
              {topCreative?.thumbnailUrl ? (
                <img
                  src={topCreative.thumbnailUrl}
                  alt="Top creative"
                  className="h-12 w-12 rounded-lg object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                  <ImageIcon className="h-5 w-5 text-gray-400" />
                </div>
              )}
              <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                {kpis.topCreative.roas.toFixed(1)}x
              </div>
            </div>
            <div className="ml-4">
              <div className="text-lg font-semibold">
                {kpis.topCreative.ctr.toFixed(1)}% CTR
              </div>
              <div className="text-sm text-gray-500">
                {kpis.topCreative.cvr.toFixed(1)}% CVR
              </div>
            </div>
            <button className="ml-auto bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full flex items-center">
              <Rocket className="h-3 w-3 mr-1" />
              Scale
            </button>
          </div>
        </div>
      </div>

      {/* Creative Fatigue Index */}
      <div 
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between relative group cursor-pointer"
      >
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">
              Creative Fatigue
            </h3>
            <RefreshCw className="h-5 w-5 text-orange-500" />
          </div>
          <div className="mt-3">
            <div className="flex items-center">
              <span
                className={`text-2xl font-bold ${creativeFatigueLevel.color}`}
              >
                {kpis.creativeFatiguePercent.toFixed(1)}%
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  kpis.creativeFatiguePercent <= 25
                    ? "bg-green-600"
                    : kpis.creativeFatiguePercent <= 50
                    ? "bg-orange-600"
                    : "bg-red-600"
                }`}
                style={{ width: `${Math.min(kpis.creativeFatiguePercent, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className={`mt-2 text-xs ${creativeFatigueLevel.color}`}>
          {creativeFatigueLevel.msg}
        </div>

        {/* Tooltip */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-3 bg-white border border-gray-200 shadow-lg text-gray-700 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 w-[75%] text-justify italic">
          Your Creative Fatigue is {kpis.creativeFatiguePercent.toFixed(1)}%, meaning that {kpis.creativeFatiguePercent.toFixed(1)}% of your ad spend is currently going to creatives that are overexposed or dropping in effectiveness. Consider refreshing these ads to maintain performance.
        </div>
      </div>






      {/* Active Creatives */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
        {" "}
        <div>
          {" "}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">
              Active Creatives
            </h3>
            <Circle className="h-5 w-5 text-purple-500" />
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-5xl text-purple-500 font-bold">
              {kpis.activeCreatives}
            </span>
            <div className="ml-auto text-right">
              <div className="text-sm text-gray-500">
                <span className="text-green-600 font-medium">
                  +{kpis.newCreatives}
                </span>{" "}
                over last 7 days
              </div>
              <div className="text-xs text-gray-400 mt-1">
                View creative library →
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

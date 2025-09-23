import React from "react";
import { Text, Hash, TrendingUp, TrendingDown, Trophy, Target, BarChart3, Zap } from "lucide-react";
import { CreativeAnalyticsData } from "@/types/meta-ads";

interface HeadlineAnalysis {
  headline: string;
  count: number;
  avgRoas: number;
  avgCtr: number;
  avgCvr: number;
}

export const TextCopyAnalysis = ({ data, creativeAnalyticsData }: { data: HeadlineAnalysis[], creativeAnalyticsData: CreativeAnalyticsData }) => {
  const topHeadlines = [...data]
    .sort((a, b) => b.avgRoas - a.avgRoas)
    .slice(0, 5);

  const wordCountAnalysis = [...creativeAnalyticsData.text.table.top_10_body_word_count];

  const ctaAnalysis = [...creativeAnalyticsData.text.table.top_10_cta];

  const wordCloud = [...creativeAnalyticsData.text.table.word_cloud];

  const maxRoas = Math.max(...wordCountAnalysis.map(d => d.roas));
  const maxRoas2 = Math.max(...ctaAnalysis.map(d => d.roas));

  const getRoasColor = (roas: number) => {
    if (roas >= 4.0) return "text-emerald-600";
    if (roas >= 3.5) return "text-green-600";
    if (roas >= 3.0) return "text-yellow-600";
    return "text-red-600";
  };

  const getRoasBgColor = (roas: number) => {
    if (roas >= 4.0) return "bg-emerald-50 border-emerald-200";
    if (roas >= 3.5) return "bg-green-50 border-green-200";
    if (roas >= 3.0) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold flex items-center text-gray-900">
          <div className="bg-blue-100 p-2 rounded-lg mr-3">
            <Text className="h-5 w-5 text-blue-600" />
          </div>
          Text & Copy Analysis
        </h3>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <BarChart3 className="h-4 w-4" />
          <span>Textual Performance Insights</span>
        </div>
      </div>

      {/* Top Performing Headlines */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
          <h4 className="text-lg font-semibold text-gray-900">Top Performing Headlines</h4>
        </div>
        <div className="space-y-3">
          {topHeadlines.map((headline, index) => (
            <div key={index} className={`relative p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${getRoasBgColor(headline.avgRoas)}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white mr-3 ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-amber-600' : 'bg-gray-500'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{headline.headline}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600 ml-9">
                    <span className="bg-gray-100 px-2 py-1 rounded-full">
                      {headline.count} variations
                    </span>
                    <span className="ml-3">CTR: {headline.avgCtr.toFixed(1)}%</span>
                    <span className="ml-3">CVR: {headline.avgCvr.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-bold ${getRoasColor(headline.avgRoas)}`}>
                    {headline.avgRoas.toFixed(1)}x
                  </div>
                  <div className="text-xs text-gray-500">ROAS</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Headline Length Impact */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <Hash className="h-5 w-5 mr-2 text-blue-500" />
            <h4 className="text-lg font-semibold text-gray-900">Headline Length Impact</h4>
          </div>
          <div className="space-y-4">
            {wordCountAnalysis.map((item, index) => (
              <div key={index} className="group hover:bg-gray-50 p-3 rounded-lg transition-colors duration-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-gray-700">{item.body_word_count_bucket} words</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-lg font-bold ${getRoasColor(item.roas)}`}>
                      {item.roas.toFixed(1)}x
                    </span>
                    {item.roas >= 3.5 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="mt-2 ml-5">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(item.roas / maxRoas) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Effectiveness */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <Target className="h-5 w-5 mr-2 text-green-500" />
            <h4 className="text-lg font-semibold text-gray-900">CTA Effectiveness</h4>
          </div>
          <div className="space-y-4">
            {ctaAnalysis.map((item, index) => (
              <div key={index} className="group hover:bg-gray-50 p-3 rounded-lg transition-colors duration-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-gray-700">{item.callToAction}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-lg font-bold ${getRoasColor(item.roas)}`}>
                      {item.roas.toFixed(1)}x
                    </span>
                    {item.roas >= 3.5 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="mt-2 ml-5">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(item.roas / maxRoas2) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Word Cloud */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center mb-4">
          <div className="p-1.5 bg-purple-50 rounded-lg mr-3">
            <Zap className="h-4 w-4 text-purple-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">High-Impact Keywords</h4>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {wordCloud.map((item, index) => {
            const colors = [
              "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200",
              "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200",
              "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200",
              "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200",
              "bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200",
              "bg-teal-100 text-teal-700 border-teal-200 hover:bg-teal-200",
              "bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200",
              "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200"
            ];
            
            return (
              <div
                key={index}
                className={`group relative inline-flex items-center px-3 py-2 text-sm rounded-full font-medium border transition-all duration-200 hover:scale-105 cursor-pointer ${
                  colors[index % colors.length]
                }`}
              >
                <span className="mr-1">{item.word}</span>
                <span className="text-xs opacity-70 bg-white bg-opacity-50 px-1.5 py-0.5 rounded-full">
                  {item.score.toFixed(0)}
                </span>
                
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  Score: {item.score.toFixed(1)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

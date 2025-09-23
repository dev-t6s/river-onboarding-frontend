/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo } from "react";
import {
  Users,
  Star,
  Smartphone,
  MapPin,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { InsightCard } from "@/components/InsightCard";
import {
  TableAudienceSegment,
} from "@/types/types";

const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

interface AudienceAnalysisProps {
  audienceAnalysis: any[];
  locationPerformance: Record<string, any>;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  selectedSegment: any;
  setSelectedSegment: (filter: any) => void;
  sortBy: string;
  sortOrder: string;
  setSortBy: (field: string) => void;
  setSortOrder: (order: string) => void;
}

export const AudienceAnalysis = ({
  audienceAnalysis,
  locationPerformance,
  selectedFilter,
  setSelectedFilter,
  selectedSegment,
  setSelectedSegment,
  sortBy,
  sortOrder,
  setSortBy,
  setSortOrder,
}: AudienceAnalysisProps) => {  
  
  // console.log("1. audienceAnalysis", audienceAnalysis)
  // console.log("2. deviceAnalysis", deviceAnalysis);
  // console.log("3. locationPerformance", locationPerformance);
  // console.log("4. selectedFilter", selectedFilter);
  // console.log("5. selectedSegment", selectedSegment);
  // console.log("6. sortBy", sortBy);
  // console.log("7. sortOrder", sortOrder);

  const knownAudience = audienceAnalysis.filter(
    (item) => item.ageGroup !== "Unknown" && item.gender !== "unknown"
  );
  const topPerformer = knownAudience.reduce((prev, current) =>
    prev.roas > current.roas ? prev : current
  );

  const topPerformerByCTR = knownAudience.reduce((prev, current) => 
    prev.ctr > current.ctr ? prev : current
  )

  const sortedData = useMemo(() => {
    const aggregatedTableMetrics: Record<
      string,
      Omit<TableAudienceSegment, "roas" | "ctr" | "cvr" | "performanceScore">
    > = {};

    audienceAnalysis.forEach((item) => {
      const key = `${item.ageGroup}-${item.gender}-${item.device}`;

      if (!aggregatedTableMetrics[key]) {
        aggregatedTableMetrics[key] = {
          ageGroup: item.ageGroup,
          gender: item.gender,
          cities: [],
          spend: 0,
          revenue: 0,
          impressions: 0,
          clicks: 0,
          purchases: 0,
        };
      }

      aggregatedTableMetrics[key].spend += item.spend || 0;
      aggregatedTableMetrics[key].revenue += item.revenue || 0;
      aggregatedTableMetrics[key].impressions += item.impressions || 0;
      aggregatedTableMetrics[key].clicks += item.clicks || 0;
      aggregatedTableMetrics[key].purchases += item.purchases || 0;

      if (
        item.city &&
        item.city !== "Unknown" &&
        !aggregatedTableMetrics[key].cities.includes(item.city)
      ) {
        aggregatedTableMetrics[key].cities.push(item.city);
      }
    });

    const finalAggregatedData: TableAudienceSegment[] = Object.values(
      aggregatedTableMetrics
    ).map((aggItem) => {
      const roas = aggItem.spend > 0 ? aggItem.revenue / aggItem.spend : 0;
      const ctr =
        aggItem.impressions > 0
          ? (aggItem.clicks / aggItem.impressions) * 100
          : 0;
      const cvr =
        aggItem.clicks > 0 ? (aggItem.purchases / aggItem.clicks) * 100 : 0;
      const performanceScore = roas * 0.5 + ctr * 0.3 + cvr * 0.3;

      return {
        ...aggItem,
        roas,
        ctr,
        cvr,
        performanceScore,
      };
    });

    let filteredData = finalAggregatedData;

    if (selectedFilter !== "all") {
      filteredData = filteredData.filter(
        (item) =>
          item.ageGroup === selectedFilter || item.gender === selectedFilter
      );
    }

    filteredData = filteredData.filter(
      (item) =>
        item.ageGroup !== "Unknown" && item.gender.toLowerCase() !== "unknown"
    );

    return filteredData.sort((a, b) => {
      const aVal = a[sortBy as keyof TableAudienceSegment];
      const bVal = b[sortBy as keyof TableAudienceSegment];

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "desc" ? bVal - aVal : aVal - bVal;
      }
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "desc"
          ? bVal.localeCompare(aVal)
          : aVal.localeCompare(bVal);
      }
      return 0;
    });
  }, [audienceAnalysis, selectedFilter, sortBy, sortOrder]);

  const topSortedPerformer = sortedData.reduce((prev, current) =>
    prev.roas > current.roas ? prev : current
  );

  type AggregatedMetrics = {
    ageGroup: string;
    gender: string;
    spend: number;
    revenue: number;
    impressions: number;
    clicks: number;
    purchases: number;
  };

  const aggregatedByAgeGender: Record<string, AggregatedMetrics> = {};

  const filteredAudienceAnalysis = audienceAnalysis.filter(
    (item) => item.gender.toLowerCase() !== "unknown"
  );

  filteredAudienceAnalysis.forEach((item) => {
    const key = `${item.ageGroup}-${item.gender}`;

    if (!aggregatedByAgeGender[key]) {
      aggregatedByAgeGender[key] = {
        ageGroup: item.ageGroup,
        gender: item.gender,
        spend: 0,
        revenue: 0,
        impressions: 0,
        clicks: 0,
        purchases: 0,
      };
    }

    aggregatedByAgeGender[key].spend += item.spend;
    aggregatedByAgeGender[key].revenue += item.revenue;
    aggregatedByAgeGender[key].impressions += item.impressions;
    aggregatedByAgeGender[key].clicks += item.clicks;
    aggregatedByAgeGender[key].purchases += item.purchases;
  });

  const geographicInsights = useMemo(() => {
    const citiesWithRoas = Object.entries(locationPerformance)
      .filter(([city]) => city !== "Unknown")
      .map(([city, data]) => ({ city, roas: data.roas, spend: data.spend }));

    citiesWithRoas.sort((a, b) => b.roas - a.roas);

    const totalCities = citiesWithRoas.length;
    const top5PercentCount = Math.ceil(totalCities * 0.05);

    const topCities = citiesWithRoas.slice(0, top5PercentCount);
    const restCities = citiesWithRoas.slice(top5PercentCount);

    const totalSpendTopCities = topCities.reduce(
      (sum, city) => sum + city.spend,
      0
    );
    const totalRevenueTopCities = topCities.reduce(
      (sum, city) => sum + city.roas * city.spend,
      0
    );

    const avgRoasTopCities =
      totalSpendTopCities > 0 ? totalRevenueTopCities / totalSpendTopCities : 0;

    const totalSpendRestCities = restCities.reduce(
      (sum, city) => sum + city.spend,
      0
    );
    const totalRevenueRestCities = restCities.reduce(
      (sum, city) => sum + city.roas * city.spend,
      0
    );

    const avgRoasRestCities =
      totalSpendRestCities > 0
        ? totalRevenueRestCities / totalSpendRestCities
        : 0;

    return {
      top5PercentRoas: avgRoasTopCities,
      rest95PercentRoas: avgRoasRestCities,
      totalKnownCities: totalCities,
    };
  }, [locationPerformance]);

  return (
    <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Users className="w-5 h-5 text-purple-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">
            Audience & Targeting Analysis
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <InsightCard
          icon={Star}
          title="Top Performing Segment"
          insight={`${topPerformer.ageGroup} ${topPerformer.gender} segment`}
          actionable="Create dedicated campaigns for this high-performing segment"
          color="green"
          value={`${topPerformer.roas.toFixed(1)}x ROAS`}
          trend="Best performer"
        />

        <InsightCard
          icon={Smartphone}
          title="Highest Affinity"
          insight={`${topPerformerByCTR.ageGroup} ${topPerformer.gender} segment`}
          actionable="Optimize mobile-first creative and landing pages"
          color="blue"
          value={`${parseFloat(topPerformerByCTR.ctr).toFixed(1)}%`}
          trend={'Highest CTR'}
        />

        <InsightCard
          icon={MapPin}
          title="Geographic Insights"
          insight={`Top 5% cities: ${geographicInsights.top5PercentRoas.toFixed(
            1
          )}x ROAS, Rest 95% cities: ${geographicInsights.rest95PercentRoas.toFixed(
            1
          )}x ROAS`}
          actionable="Prioritize budget for high-return cities and strategically adjust targeting in low-return areas."
          color="orange"
          value={`${geographicInsights.totalKnownCities} Locations`}
          trend="Multi-market presence"
        />
      </div>
      
      <div className="bg-white text-black rounded-xl p-6 shadow-sm border mb-8 border-gray-100">
        <h3 className="text-lg text-black font-semibold mb-12 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-purple-600" />
          Region Wise Spend Distribution
        </h3>
        <ResponsiveContainer width="100%" height={550} className="pr-8">
          <BarChart
            data={Object.values(locationPerformance)
              .sort((a: any, b: any) => b.spend - a.spend)
              .slice(0, 10)
              .map((item: any) => ({
                location: item.location,
                spend: item.spend,
                roas: item.roas
              }))}
            margin={{ top: 5, right: 5, left: 30, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="category" 
              dataKey="location"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              type="number" 
              tickFormatter={(value: number) => value === 0 ? '₹0' : `₹${(value / 1000).toFixed(0)}K`}
              label={{ value: 'Spend (₹)', angle: -90, position: 'left', }}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === 'spend') return [`₹${Number(value).toLocaleString()}`, 'Spend'];
                if (name === 'roas') return [`${value.toFixed(2)}x`, 'ROAS'];
                return [`₹${(value / 1000).toFixed(1)}K`, name];
              }}
              labelFormatter={(label: string) => `Region: ${label}`}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "8px 12px",
              }}
            />
            <Bar 
              dataKey="spend" 
              fill="#8b5cf6" 
              name="Spend"
              radius={[4, 4, 0, 0]}
              label={{ 
                position: 'top', 
                formatter: (value: number) => value === 0 ? '₹0' : `₹${(value / 1000).toFixed(1)}K`,
                fill: '#6b7280',
                fontSize: 12
              }}
            >
              {Object.values(locationPerformance)
                .sort((a: any, b: any) => b.spend - a.spend)
                .slice(0, 15)
                .map((entry: any, index: number) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors[index % colors.length]} 
                  />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="appearance-none bg-white border border-gray-300 text-black rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Segments</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="18-24">18-24 Age Group</SelectItem>
                    <SelectItem value="25-34">25-34 Age Group</SelectItem>
                    <SelectItem value="35-44">35-44 Age Group</SelectItem>
                    <SelectItem value="45-54">45-54 Age Group</SelectItem>
                    <SelectItem value="55-64">55-64 Age Group</SelectItem>
                    <SelectItem value="65+">65+ Age Group</SelectItem>
                </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <Select 
                value={`${sortBy}-${sortOrder}`} 
                onValueChange={(value) => {
                    const [field, order] = value.split("-");
                    setSortBy(field);
                    setSortOrder(order);
                }}
            >
                <SelectTrigger className="appearance-none bg-white border border-gray-300 text-black rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="roas-desc">ROAS (High to Low)</SelectItem>
                    <SelectItem value="roas-asc">ROAS (Low to High)</SelectItem>
                    <SelectItem value="spend-desc">Spend (High to Low)</SelectItem>
                    <SelectItem value="spend-asc">Spend (Low to High)</SelectItem>
                    <SelectItem value="ctr-desc">CTR (High to Low)</SelectItem>
                    <SelectItem value="cvr-desc">CVR (High to Low)</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </div>

        <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border">
          Showing {sortedData.length} segments
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div
          className="overflow-x-auto"
          style={{ maxHeight: "calc(100vh - 250px)" }}
        >
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-50 to-blue-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Segment
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Spend
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  ROAS
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  CTR
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  CVR
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedData.map((audience, index) => {
                const isTopPerformer =
                  audience.roas >= Math.floor(Number(topSortedPerformer.roas));

                return (
                  <tr
                    key={index}
                    className={`hover:bg-gray-50 transition-colors duration-150 ${
                      selectedSegment === index
                        ? "bg-purple-50 border-purple-200"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedSegment(
                        selectedSegment === index ? null : index
                      )
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg mr-3">
                          <Users className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {audience.ageGroup} {audience.gender}
                          </div>
                          <div className="text-xs text-gray-500">
                            Demographic segment
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        ₹{audience.spend.toFixed(0)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        ₹{audience.revenue.toFixed(0)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span
                          className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                            audience.roas >= 3
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : audience.roas >= 2
                              ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                              : audience.roas >= 1
                              ? "bg-orange-100 text-orange-800 border border-orange-200"
                              : "bg-red-100 text-red-800 border border-red-200"
                          }`}
                        >
                          {audience.roas.toFixed(2)}x
                        </span>
                        {isTopPerformer && (
                          <Star className="w-4 h-4 text-yellow-500 ml-2" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {audience.ctr.toFixed(2)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {audience.cvr.toFixed(2)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${
                              audience.performanceScore > 10
                                ? "bg-green-500"
                                : audience.performanceScore > 5
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{
                              width: `${Math.min(
                                audience.performanceScore * 10,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">
                          {audience.performanceScore.toFixed(1)}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

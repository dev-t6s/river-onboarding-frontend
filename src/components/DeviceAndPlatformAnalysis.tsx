/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  DeviceAnalysisType,
  TableDeviceSegment,
} from "@/types/types";
import { useFacebook } from "@/context/FacebookContext";
import { MetaAdsClient } from "@/utils/meta-ads-client";
import { PlacementDeviceType, PlacementSpentSalesType, PlatformSpendSalesType } from "@/types/meta-ads";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Smartphone,
  MonitorSmartphone,
  Monitor,
  TrendingUp,
  FileChartPie,
  Presentation,
  PackageOpen,
} from "lucide-react";

interface AudienceAnalysisProps {
  audienceAnalysis: any[];
  deviceAnalysis: DeviceAnalysisType[];
  selectedFilter: string;
  sortBy: string;
  sortOrder: string;
}

interface platformSpendSalesStateType {
  platform: string;
  spend: number;
  sales: number;
  roas: number;
  impressions: number;
  clicks: number;
}

interface placementSpendSalesStateType {
  platform: string;
  placement: string;
  spend: number;
  sales: number;
}

interface placementDeviceType {
  platform: string;
  device: string;
  spend: number;
  sales: number;
}

export const DeviceAndPlatformAnalysis = ({
	audienceAnalysis,
	deviceAnalysis,
	selectedFilter,
	sortBy,
	sortOrder,
}: AudienceAnalysisProps) => {
	const { accessToken, adAccountID } = useFacebook();
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [platformSpendSalesGraph, setPlatformSpendSalesGraph] = useState<platformSpendSalesStateType[]>([]);
	const [placementSpendSalesGraph, setPlacementSpendSalesGraph] = useState<placementSpendSalesStateType[]>([]);
	const [placementDeviceGraph, setPlacementDeviceGraph] = useState<placementDeviceType[]>([]);
	const [isBreakdownModalOpen, setIsBreakdownModalOpen] = useState(false);

	const fetchData = async () => {
		if (!accessToken || !adAccountID) {
			setLoading(false);
			return;
		}
		try {
			setLoading(true);
			setError(null);
			const accountId = adAccountID.includes("_")
				? adAccountID.split("_")[1]
				: adAccountID;
			const client = new MetaAdsClient(accessToken);
			const [platformSpendSalesData, placementSpendSalesData, placementDeviceData] = await Promise.all([
				client.getPlatformSpendSalesData(accountId) as Promise<PlatformSpendSalesType>,
				client.getPlacementSpendSalesData(accountId) as Promise<PlacementSpentSalesType>,
				client.getPlacementDeviceData(accountId) as Promise<PlacementDeviceType>,
			]);

			const filteredPlatformSpendSalesData = platformSpendSalesData.platformData.filter(
				item => item.platform.toLowerCase()!='unknown'
			);
			const filteredPlacementSpendSalesData = placementSpendSalesData.placementData.filter(
				item => item.platform.toLowerCase() !== 'unknown' && 
								item.placement.toLowerCase() !== 'unknown'
			);
			const filteredPlacementDeviceData = placementDeviceData.placementData.filter(
				item => item.platform.toLowerCase() !== 'unknown' && 
								item.device.toLowerCase() !== 'unknown'
			);

			setPlacementDeviceGraph(filteredPlacementDeviceData.map((item) => ({
				platform: item.platform,
				device: item.device,
				sales: item.sales,
				spend: item.spend,
			})))
			setPlacementSpendSalesGraph(filteredPlacementSpendSalesData.map((item) => ({
				placement: item.placement,
				platform: item.platform,
				sales: item.sales,
				spend: item.spend,
			})))
			setPlatformSpendSalesGraph(filteredPlatformSpendSalesData)
		} catch (err: unknown) {
			console.error("Error fetching data:", err);
			setError(err instanceof Error ? err.message : "Failed to load data");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const fetchDataWrapper = async () => {
			await fetchData();
		};
		fetchDataWrapper();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);	
	
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
	
	const sortedDeviceData = useMemo(() => {
    const aggregatedTableMetrics: Record<
      string,
      Omit<TableDeviceSegment, "roas" | "ctr" | "cvr" | "performanceScore">
    > = {};

    deviceAnalysis.forEach((item) => {
      const key = item.device;

      if (!aggregatedTableMetrics[key]) {
        aggregatedTableMetrics[key] = {
          device: item.device,
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
    });

    const finalAggregatedData: TableDeviceSegment[] = Object.values(
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
        (item) => item.device === selectedFilter
      );
    }

    filteredData = filteredData.filter((item) => item.device !== "unknown");

    return filteredData.sort((a, b) => {
      const aVal = a[sortBy as keyof TableDeviceSegment];
      const bVal = b[sortBy as keyof TableDeviceSegment];

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
  }, [deviceAnalysis, selectedFilter, sortBy, sortOrder]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    // Get device icon based on label (device type)
    const getDeviceIcon = (deviceType: string) => {
      switch (deviceType) {
        case 'desktop':
          return <Monitor className="w-4 h-4 mr-2 text-blue-500" />;
        case 'mobile_app':
        case 'mobile_web':
          return <Smartphone className="w-4 h-4 mr-2 text-green-500" />;
        default:
          return <Monitor className="w-4 h-4 mr-2 text-gray-500" />;
      }
    };

    return (
      <div className="bg-white border border-gray-200 rounded-md shadow-lg p-4">
        <div className="flex items-center mb-2 font-semibold">
          {getDeviceIcon(label)}
          <span>Device: {label === 'mobile_app' ? 'Mobile App' : 
                        label === 'mobile_web' ? 'Mobile Web' : 
                        label.charAt(0).toUpperCase() + label.slice(1)}</span>
        </div>
        {payload.map((entry: any, index: number) => (
          <div key={`tooltip-${index}`} className="flex justify-between gap-4 items-center py-1">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600">{entry.name}:</span>
            </div>
            <span className="text-sm font-medium">
              {entry.name === 'ROAS' 
                ? `${entry.value.toFixed(2)}x`
                : `₹${Number(entry.value/1000).toFixed(1)}K`}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const PlatformTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white border border-gray-200 rounded-md shadow-lg p-4">
        <div className="font-semibold mb-2">Platform: {label}</div>
        {payload.map((entry: any, index: number) => (
          <div key={`tooltip-${index}`} className="flex justify-between gap-4 items-center py-1">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600">{entry.name}:</span>
            </div>
            <span className="text-sm font-medium">
              {entry.name === 'ROAS' 
                ? `${entry.value.toFixed(2)}x`
                : `₹${Number(entry.value/1000).toFixed(1)}K`}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const PlacementTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white border border-gray-200 rounded-md shadow-lg p-4">
        <div className="font-semibold mb-2">Placement: {label}</div>
        {payload.map((entry: any, index: number) => (
          <div key={`tooltip-${index}`} className="flex justify-between items-center py-1">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600">{entry.name}:</span>
            </div>
            <span className="text-sm font-medium">
              {`₹${Number(entry.value/1000).toFixed(1)}K`}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const PlatformDeviceTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const [platform, device] = label.split(' - ');
    
    // Get device icon based on device type
    const getDeviceIcon = (deviceType: string) => {
      switch (deviceType.toLowerCase()) {
        case 'desktop':
          return <Monitor className="w-7 h-auto mr-4 text-blue-500" />;
        case 'mobile app':
        case 'mobile web':
          return <Smartphone className="w-7 h-auto mr-4 text-green-500" />;
        default:
          return <MonitorSmartphone className="w-7 h-auto mr-4 text-purple-500" />;
      }
    };

    return (
      <div className="bg-white text-neutral-800 border border-gray-200 rounded-lg shadow-lg p-4">
        <div className="flex items-center mb-3">
          {getDeviceIcon(device)}
          <div>
            <h4 className="font-semibold text-gray-900 text-md">{platform}</h4>
            <p className="text-xs text-gray-600">{device}</p>
          </div>
        </div>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div key={`tooltip-item-${index}`} className="flex justify-between items-center gap-4">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {entry.name}:
                </span>
              </div>
              <span className="text-sm font-semibold">
                ₹{Number(entry.value/1000).toFixed(1)}K
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

	return(
		<div>
			<div className="bg-white text-black rounded-xl p-6 shadow-sm border mb-8 border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-lg text-black font-semibold mb-4 flex items-center">
            <FileChartPie className="w-5 h-5 mr-2 text-purple-600" />
            Device and Platform Analysis
          </h3>
          <div>
            <button 
              className="inline-flex items-center shadow-sm px-3 py-1.5 cursor-pointer text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 hover:border-purple-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
              onClick={() => setIsBreakdownModalOpen(true)}
            >
              <TrendingUp className="w-3 h-3 mr-1.5" />
              Detailed Breakdown
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-4 mb-4">
          {/* Device analysis */}
          <div className="bg-white text-black rounded-xl p-6 shadow-sm border border-gray-100 w-full">
            <h3 className="text-lg text-black font-semibold mb-8 flex items-center">
              <MonitorSmartphone className="w-5 h-5 mr-2 text-purple-600" />
              Device Performance Overview
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={sortedDeviceData}
                layout="horizontal" // Remove this for vertical bars
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="device" 
                  tickFormatter={(value) => {
                    // Format device names nicely
                    if (value === 'mobile_app') return 'Mobile App';
                    if (value === 'mobile_web') return 'Mobile Web';
                    return value.charAt(0).toUpperCase() + value.slice(1);
                  }}
                />
                <YAxis 
                  yAxisId="left" 
                  orientation="left" 
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  tickFormatter={(value) => `${value.toFixed(1)}x`}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    padding: 0,
                  }}
                />
                <Legend />
                
                {/* Spend Bars */}
                <Bar
                  yAxisId="left"
                  dataKey="spend" 
                  name="Spend" 
                  fill="#8884d8" 
                  radius={[4, 4, 0, 0]}
                />
                
                {/* Revenue Bars */}
                <Bar
                  yAxisId="left"
                  dataKey="revenue" 
                  name="Revenue" 
                  fill="#82ca9d" 
                  radius={[4, 4, 0, 0]}
                />
                
                {/* ROAS Line - Using Line type for better visibility of small values */}
                <Bar
                  yAxisId="right"
                  dataKey="roas" 
                  name="ROAS" 
                  fill="#ffc658" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Platform analysis */}
          { !loading && !error && platformSpendSalesGraph.length > 0 && (
            <div className="bg-white text-black rounded-xl p-6 shadow-sm border border-gray-100 w-full">
              <h3 className="text-lg text-black font-semibold mb-8 flex items-center">
                <Presentation className="w-5 h-5 mr-2 text-purple-600" />
                Platform Performance Overview
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={platformSpendSalesGraph}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="platform" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    yAxisId="left" 
                    orientation="left" 
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    tickFormatter={(value) => `${value.toFixed(1)}x`}
                  />
                  <Tooltip
                    content={<PlatformTooltip />}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      padding: 0,
                    }}
                  />
                  <Legend />
                  <Bar 
                    yAxisId="left"
                    dataKey="spend" 
                    name="Spend" 
                    fill="#8884d8" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    yAxisId="left"
                    dataKey="sales" 
                    name="Revenue" 
                    fill="#82ca9d" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    yAxisId="right"
                    dataKey="roas" 
                    name="ROAS" 
                    fill="#ffc658" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

        </div>

        {/* Format spending */}
        {
          !loading && !error && placementSpendSalesGraph.length > 0 && (
            <div className="bg-white text-black rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-lg text-black font-semibold mb-8 flex items-center">
                  <PackageOpen className="w-5 h-5 mr-2 text-purple-600" />
                  Format Spending Overview (Spend vs Sales)
                </h3>
              </div>
              
              <ResponsiveContainer width="100%" height={800}>
                <BarChart
                  data={[...placementSpendSalesGraph]
                    .sort((a, b) => b.spend - a.spend)
                    .slice(0,10)
                    .map(item => ({
                      ...item,
                      // Create a combined label for platform-placement
                      platformPlacement: `${item.platform} - ${item.placement}`,
                      spend: item.spend,
                      sales: item.sales
                    }))}
                  layout="vertical"
                  margin={{ top: 10, right: 40, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="platformPlacement" 
                    width={150}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    content={<PlacementTooltip />}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      padding: 0,
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="spend" 
                    name="Spend" 
                    fill="#8884d8" 
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar 
                    dataKey="sales" 
                    name="Sales" 
                    fill="#82ca9d" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )
        }

      </div>
			{isBreakdownModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-9 shadow-lg w-full max-w-6xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center">
                <MonitorSmartphone className="w-8 h-8 mr-3 text-purple-600" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Platform-Device Performance</h3>
                  <p className="text-sm text-gray-500">Detailed breakdown by platform and device type</p>
                </div>
              </div>
              <button 
                onClick={() => setIsBreakdownModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="h-[80vh] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...placementDeviceGraph]
                    .sort((a, b) => b.spend - a.spend)
                    .map(item => ({
                      ...item,
                      platformDevice: `${item.platform} - ${item.device.replace('_', ' ')}`,
                      spend: item.spend,
                      sales: item.sales
                    }))}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3" 
                    stroke="#e5e7eb"  // Using a light gray color
                    strokeWidth={1}   // Slightly thicker lines
                    horizontal={true} 
                    vertical={true}
                  />
                  <XAxis 
                    type="number" 
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                    tick={{ 
                      fill: '#4b5563',  // Darker gray for better visibility
                      fontSize: 12,
                      fontWeight: 500 
                    }}
                    axisLine={{ 
                      stroke: '#9ca3af',  // Medium gray axis line
                      strokeWidth: 1.5 
                    }}
                    tickLine={{ 
                      stroke: '#9ca3af',   // Matching tick lines
                      strokeWidth: 1.5 
                    }}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="platformDevice" 
                    width={200}
                    tick={{ 
                      fill: '#4b5563',    // Darker gray for better visibility
                      fontSize: 12,
                      fontWeight: 500 
                    }}
                    axisLine={{ 
                      stroke: '#9ca3af',  // Medium gray axis line
                      strokeWidth: 1.5 
                    }}
                    tickLine={{ 
                      stroke: '#9ca3af',   // Matching tick lines
                      strokeWidth: 1.5 
                    }}
                  />
                  <Tooltip
                    content={<PlatformDeviceTooltip />}
                    cursor={{ 
                      fill: '#f3f4f6', 
                      stroke: '#d1d5db',
                      strokeWidth: 1
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ 
                      paddingTop: '20px',
                      fontSize: '14px',
                      color: '#4b5563'  // Darker gray for better visibility
                    }}
                    formatter={(value) => (
                      <span className="text-sm font-medium text-gray-700 capitalize">{value}</span>
                    )}
                  />
                  <Bar 
                    dataKey="spend" 
                    name="Spend" 
                    fill="#8b5cf6" 
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar 
                    dataKey="sales" 
                    name="Sales" 
                    fill="#10b981" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsBreakdownModalOpen(false)}
                className="px-4 py-2 bg-purple-600 text-white cursor-pointer rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
		</div>	
	)
}
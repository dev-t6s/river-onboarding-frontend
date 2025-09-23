"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  MousePointer,
  Target,
  Zap,
  Calendar,
  Filter,
  Loader2,
  AlertCircle,
  Building2,
} from "lucide-react";
import { MetaAdsClient } from "@/utils/meta-ads-client";
import { useFacebook } from "@/context/FacebookContext";
import {
  AdAccount,
  CampaignDataItem,
  CampaignSummary,
  ConsolidatedData,
  DailyData,
  MetricCardProps,
} from "@/types/dashboard-types";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const LoadingSpinner = ({ size = 24, className = "" }) => (
  <Loader2 className={`animate-spin ${className}`} size={size} />
);

const MetricCardSkeleton = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
    </div>
    <div className="mt-3">
      <div className="h-4 bg-gray-200 rounded w-32"></div>
    </div>
  </div>
);

const ChartSkeleton = ({ height = 300 }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
    <div
      className={`bg-gray-200 rounded`}
      style={{ height: `${height}px` }}
    ></div>
  </div>
);

const TableSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse">
    <div className="p-6 border-b border-gray-200">
      <div className="h-6 bg-gray-200 rounded w-64"></div>
    </div>
    <div className="p-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 mb-4">
          <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
          <div className="h-4 bg-gray-200 rounded flex-1"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      ))}
    </div>
  </div>
);

const AICardSkeleton = () => (
  <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 animate-pulse">
    <div className="flex items-center mb-4">
      <div className="w-5 h-5 bg-gray-300 rounded-full mr-2"></div>
      <div className="h-6 bg-gray-300 rounded w-48"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white rounded-lg p-4 border border-blue-100">
        <div className="h-5 bg-gray-200 rounded w-32 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mt-2"></div>
      </div>
      <div className="bg-white rounded-lg p-4 border border-blue-100">
        <div className="h-5 bg-gray-200 rounded w-40 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mt-2"></div>
      </div>
    </div>
  </div>
);

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-red-900 mb-2">
      Error Loading Data
    </h3>
    <p className="text-red-700 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);

const MetaAdsDashboard = () => {
  const [data, setData] = useState<ConsolidatedData | null>(null);
  const [adAccountInfo, setAdAccountInfo] = useState<AdAccount | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>("roas");
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
  const { accessToken, adAccountID } = useFacebook();

  const fetchData = async () => {
    if (!accessToken || !adAccountID) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const client = new MetaAdsClient(accessToken);
      const accountId = adAccountID.includes("_")
        ? adAccountID.split("_")[1]
        : adAccountID;

      const [accounts, campaignData] = await Promise.all([
        client.getAdAccounts(),
        client.getConsolidatedData(accountId),
      ]);

      const currentAccount = accounts.find(
        (acc: AdAccount) => acc.id === accountId
      );

      setAdAccountInfo(
        currentAccount || {
          name: "Unknown Account",
          currency: "USD",
          id: accountId,
        }
      );

      setData(campaignData);
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

  const processedData = useMemo(() => {
    if (!data) return { dailyData: [], campaignSummary: [] };

    const campaignData = data.campaignData as CampaignDataItem[];

    const dailyData = campaignData.reduce(
      (acc: DailyData[], item: CampaignDataItem) => {
        const existing = acc.find((d) => d.date === item.date);
        if (existing) {
          existing.spend += item.spend;
          existing.purchaseValue += item.purchaseValue;
          existing.impressions += item.impressions;
          existing.clicks += item.clicks;
        } else {
          acc.push({
            date: item.date,
            spend: item.spend,
            purchaseValue: item.purchaseValue,
            impressions: item.impressions,
            clicks: item.clicks,
            roas: 0,
            ctr: 0,
          });
        }
        return acc;
      },
      []
    );

    dailyData.forEach((d) => {
      d.roas = d.spend > 0 ? d.purchaseValue / d.spend : 0;
      d.ctr = d.impressions > 0 ? (d.clicks / d.impressions) * 100 : 0;
    });

    const campaignSummary = campaignData.reduce(
      (acc: CampaignSummary[], item: CampaignDataItem) => {
        const existing = acc.find((c) => c.campaignId === item.campaignId);
        if (existing) {
          existing.spend += item.spend;
          existing.purchaseValue += item.purchaseValue;
          existing.impressions += item.impressions;
          existing.clicks += item.clicks;
        } else {
          acc.push({
            campaignId: item.campaignId,
            campaignName: item.campaignName,
            spend: item.spend,
            purchaseValue: item.purchaseValue,
            impressions: item.impressions,
            clicks: item.clicks,
            roas: 0,
            ctr: 0,
            cpm: 0,
            cpc: 0,
          });
        }
        return acc;
      },
      []
    );

    campaignSummary.forEach((c) => {
      c.roas = c.spend > 0 ? c.purchaseValue / c.spend : 0;
      c.ctr = c.impressions > 0 ? (c.clicks / c.impressions) * 100 : 0;
      c.cpm = c.impressions > 0 ? (c.spend / c.impressions) * 1000 : 0;
      c.cpc = c.clicks > 0 ? c.spend / c.clicks : 0;
    });

    return { dailyData, campaignSummary };
  }, [data]);

  const kpis = useMemo(() => {
    if (!processedData.campaignSummary.length) {
      return {
        totalSpend: 0,
        totalRevenue: 0,
        totalRoas: 0,
        totalCtr: 0,
        totalImpressions: 0,
        totalClicks: 0,
        avgCpm: 0,
        avgCpc: 0,
      };
    }

    const totalSpend = processedData.campaignSummary.reduce(
      (sum, c) => sum + c.spend,
      0
    );
    const totalRevenue = processedData.campaignSummary.reduce(
      (sum, c) => sum + c.purchaseValue,
      0
    );
    const totalImpressions = processedData.campaignSummary.reduce(
      (sum, c) => sum + c.impressions,
      0
    );
    const totalClicks = processedData.campaignSummary.reduce(
      (sum, c) => sum + c.clicks,
      0
    );

    return {
      totalSpend,
      totalRevenue,
      totalRoas: totalSpend > 0 ? totalRevenue / totalSpend : 0,
      totalCtr:
        totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
      totalImpressions,
      totalClicks,
      avgCpm: totalImpressions > 0 ? (totalSpend / totalImpressions) * 1000 : 0,
      avgCpc: totalClicks > 0 ? totalSpend / totalClicks : 0,
    };
  }, [processedData]);

  const calculateLines = (itemCount: number) => Math.ceil(itemCount / 8);
  const calculateInnerRadius = (itemCount: number) => {
    const lines = calculateLines(itemCount);
    return Math.max(30, 110 - lines * 20);
  };
  const calculateOuterRadius = (itemCount: number) => {
    const innerRadius = calculateInnerRadius(itemCount);
    return Math.max(60, innerRadius * 2);
  };

  const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    prefix = "",
    suffix = "",
    trend,
    icon: Icon,
    color = "blue",
  }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600 mt-1`}>
            {prefix}
            {typeof value === "number" ? value.toLocaleString() : value}
            {suffix}
          </p>
        </div>
        <div className={`p-3 bg-${color}-100 rounded-lg`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
      {trend && (
        <div className="flex items-center mt-3">
          {trend > 0 ? (
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
          )}
          <span
            className={`text-sm ${
              trend > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {Math.abs(trend).toFixed(1)}% vs last period
          </span>
        </div>
      )}
    </div>
  );

  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <ErrorMessage message={error} onRetry={fetchData} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex-1 sm:flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  River Meta Ads Analytics
                </h1>
                {loading && (
                  <LoadingSpinner size={20} className="text-blue-600" />
                )}
              </div>
              <div className="flex items-center mt-1 hidden sm:flex">
                <p className="text-gray-600">
                  Performance insights and campaign optimization
                </p>
              </div>
            </div>
            <div className="flex mt-3 sm:mt-0 items-center space-x-4">
              {data && (
                <>
                  {adAccountInfo && (
                    <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">
                        {adAccountInfo.name}
                      </span>
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                        {adAccountInfo.currency}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg hidden sm:flex">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {data.summary.dateRange}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 hidden sm:flex">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-black"
                      value={selectedCampaign}
                      onChange={(e) => setSelectedCampaign(e.target.value)}
                      disabled={loading}
                    >
                      <option value="all">All Campaigns</option>
                      {processedData.campaignSummary.map((c) => (
                        <option key={c.campaignId} value={c.campaignId}>
                          {c.campaignName}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <>
            <AICardSkeleton />
          </>
        ) : (
          <>
            <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center mb-4">
                <Zap className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">
                  AI-Powered Insights
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <h3 className="font-medium text-gray-900 mb-2">
                    🚀 Top Performer
                  </h3>
                  <p className="text-sm text-gray-600">
                    {
                      processedData.campaignSummary.sort(
                        (a, b) => b.roas - a.roas
                      )[0]?.campaignName
                    }{" "}
                    has the highest ROAS at{" "}
                    {processedData.campaignSummary
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
                    {
                      processedData.campaignSummary.filter((c) => c.roas < 1)
                        .length
                    }{" "}
                    campaigns have ROAS below 1.0. Review targeting and creative
                    assets.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 text-black">
          {loading ? (
            <>
              <MetricCardSkeleton />
              <MetricCardSkeleton />
              <MetricCardSkeleton />
              <MetricCardSkeleton />
            </>
          ) : (
            <>
              <MetricCard
                title="Total Spend"
                value={kpis.totalSpend.toFixed(0)}
                prefix={adAccountInfo?.currency === "INR" ? "₹" : "$"}
                icon={DollarSign}
                color="blue"
                trend={12.5}
              />
              <MetricCard
                title="Revenue Generated"
                value={kpis.totalRevenue.toFixed(0)}
                prefix={adAccountInfo?.currency === "INR" ? "₹" : "$"}
                icon={TrendingUp}
                color="green"
                trend={18.2}
              />
              <MetricCard
                title="ROAS"
                value={kpis.totalRoas.toFixed(2)}
                suffix="x"
                icon={Target}
                color="red"
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
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {loading ? (
            <>
              <div className="lg:col-span-2">
                <ChartSkeleton height={300} />
              </div>
              <ChartSkeleton height={300} />
            </>
          ) : (
            <>
              <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-black">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Performance Trends
                  </h2>
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-black"
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                  >
                    <option value="roas">ROAS</option>
                    <option value="spend">Spend</option>
                    <option value="purchaseValue">Revenue</option>
                    <option value="ctr">CTR</option>
                  </select>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={processedData.dailyData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-30"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(date) =>
                        new Date(date).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                        })
                      }
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      labelFormatter={(date) =>
                        new Date(date).toLocaleDateString()
                      }
                      formatter={(value, name) => [
                        typeof value === "number"
                          ? value.toLocaleString()
                          : value,
                        name === "spend"
                          ? "Spend"
                          : name === "purchaseValue"
                          ? "Revenue"
                          : (name as string).toUpperCase(),
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey={selectedMetric}
                      stroke="#3B82F6"
                      fill="url(#gradient)"
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="#3B82F6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="100%"
                          stopColor="#3B82F6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Campaign Distribution
                </h2>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={processedData.campaignSummary}
                      cx="50%"
                      cy="50%"
                      innerRadius={calculateInnerRadius(
                        processedData.campaignSummary.length
                      )}
                      outerRadius={calculateOuterRadius(
                        processedData.campaignSummary.length
                      )}
                      paddingAngle={2}
                      dataKey="spend"
                    >
                      {processedData.campaignSummary.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={colors[index % colors.length]}
                          stroke="#fff"
                          strokeWidth={1}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [
                        `${
                          adAccountInfo?.currency === "INR" ? "₹" : "$"
                        }${value.toLocaleString()}`,
                        "Spend",
                      ]}
                    />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{
                        paddingTop: "20px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {loading ? (
            <>
              <ChartSkeleton height={300} />
              <ChartSkeleton height={300} />
            </>
          ) : (
            <>
              <div className="bg-white rounded-xl p-6 shadow-sm text-black border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Reach & Frequency Analysis
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={processedData.dailyData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-30"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(date) =>
                        new Date(date).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                        })
                      }
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      labelFormatter={(date) =>
                        new Date(date).toLocaleDateString()
                      }
                      formatter={(value, name) => [
                        value.toLocaleString(),
                        name === "impressions" ? "Impressions" : "Clicks",
                      ]}
                    />
                    <Bar
                      dataKey="impressions"
                      fill="#3B82F6"
                      radius={[2, 2, 0, 0]}
                    />
                    <Bar
                      dataKey="clicks"
                      fill="#10B981"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-black">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  ROAS Optimization
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={processedData.dailyData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-30"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(date) =>
                        new Date(date).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                        })
                      }
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      labelFormatter={(date) =>
                        new Date(date).toLocaleDateString()
                      }
                      formatter={(value) => [
                        (value as number).toFixed(2) + "x",
                        "ROAS",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="roas"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>

        {loading ? (
          <TableSkeleton />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Campaign Performance Breakdown
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Spend
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ROAS
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CTR
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CPM
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CPC
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {processedData.campaignSummary.map((campaign, index) => (
                    <tr key={campaign.campaignId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full mr-3`}
                            style={{
                              backgroundColor: colors[index % colors.length],
                            }}
                          ></div>
                          <div className="text-sm font-medium text-gray-900">
                            {campaign.campaignName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {adAccountInfo?.currency === "INR" ? "₹" : "$"}
                        {campaign.spend.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {adAccountInfo?.currency === "INR" ? "₹" : "$"}
                        {campaign.purchaseValue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            campaign.roas >= 2
                              ? "bg-green-100 text-green-800"
                              : campaign.roas >= 1
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {campaign.roas.toFixed(2)}x
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {campaign.ctr.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{campaign.cpm.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{campaign.cpc.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetaAdsDashboard;

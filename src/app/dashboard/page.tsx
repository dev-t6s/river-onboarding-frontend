/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Building2,
  Calendar,
  Database,
  Home,
  Lightbulb,
  TriangleAlert,
} from "lucide-react";
import { KPICards } from "@/components/KPICards";
import { SpendByObjective } from "@/components/SpendByObjective";
import { AudienceAnalysis } from "@/components/AudienceAnalysis";
import { FunnelAnalysis } from "@/components/FunnelAnalysis";
import { RetargetingAnalysis } from "@/components/RetargetingAnalysisSmall";
import { PerformanceTrends } from "@/components/PerformanceTrends";
import { CampaignPerformanceTable } from "@/components/CampaignPerformanceTable";
import AiInsights from "@/components/AiInsights";
import { useFacebook } from "@/context/FacebookContext";
import { MetaAdsClient } from "@/utils/meta-ads-client";
import { AdAccount, ConsolidatedData, TotalMetrics } from "@/types/meta-ads";
import {
  AudienceAnalysisType,
  CampaignSummary,
  DailyData,
  RetentionMetrics,
  SpendByObjectiveType,
  ProcessedData,
  DeviceAnalysisType,
  AdvancedData,
  LocationAnalysisType,
} from "@/types/types";
import { CampaignDataItem } from "@/types/dashboard-types";
import {
  LoadingSpinner,
  TableSkeleton,
  AICardSkeleton,
  KPICardsSkeleton,
  PerformanceTrendsSkeleton,
  SpendByObjectiveSkeleton,
  AudienceAnalysisSkeleton,
  FunnelAnalysisSkeleton,
  RetargetingAnalysisSkeleton,
} from "@/components/loaders";
import { useRouter } from "next/navigation";
import { DeviceAndPlatformAnalysis } from "@/components/DeviceAndPlatformAnalysis";

const DashboardV2 = () => {
  const router = useRouter();
  const [adAccountInfo, setAdAccountInfo] = useState<AdAccount | null>(null);
  const [selectedMetric, setSelectedMetric] = useState("roas");
  const [selectedMetric2, setSelectedMetric2] = useState("roas");
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedAudience, setSelectedAudience] = useState("all");
  const [viewMode, setViewMode] = useState("absolute"); // 'absolute' or 'percentage'
  const [timeRange, setTimeRange] = useState("7d");
  const [sortBy, setSortBy] = useState("roas");
  const [sortOrder, setSortOrder] = useState("desc");
  const [dataX, setDataX] = useState<AdvancedData | null>(null);
  const [dataY, setDataY] = useState<ConsolidatedData | null>(null);
  const [metricsData, setMetricsData] = useState<TotalMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken, adAccountID } = useFacebook();

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
      const [accounts, dailyData, completeData, totalMetrics] = await Promise.all([
        client.getAdAccounts(),
        client.getConsolidatedData(accountId) as Promise<ConsolidatedData>,
        client.getAdvancedData(accountId) as unknown as Promise<AdvancedData>,
        client.getTotalMetricsData(accountId) as Promise<TotalMetrics>
      ]);
      const currentAccount = accounts.find(
        (acc: AdAccount) => acc.id === accountId
      );
      // console.log("accounts", accounts)
      // console.log("dailyData", dailyData)
      // console.log("completeData",completeData)
      // console.log("accountId",accountId)
      // console.log("accessToken", accessToken);
      // console.log("total metrics", totalMetrics)
      
      setAdAccountInfo(currentAccount ?? null);
      setDataY(dailyData);
      setDataX(completeData);
      setMetricsData(totalMetrics)
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

  const processedData: ProcessedData = useMemo(() => {
    if (!dataX && !dataY)
      return {
        dailyData: [],
        campaignSummary: [],
        spendByObjective: [],
        audienceAnalysis: [],
        retargetingAnalysis: [],
        retentionMetrics: [],
        deviceAnalysis: [],
        locationAnalysis: [],
      };

    const campaignObjectiveMap = new Map<string, string>();
    dataX!.data.forEach((item: { campaignId: string; objective: string }) => {
      if (item.campaignId && item.objective) {
        campaignObjectiveMap.set(item.campaignId, item.objective);
      }
    });

    const campaignTargetingMap = new Map<string, boolean>();
    dataX!.data.forEach(
      (item: { campaignId: string; isRetargeting: boolean }) => {
        if (item.campaignId) {
          campaignTargetingMap.set(item.campaignId, item.isRetargeting);
        }
      }
    );

    const dailyData = dataY?.campaignData.reduce(
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

    dailyData!.forEach((d) => {
      d.roas = d.spend > 0 ? d.purchaseValue / d.spend : 0;
      d.ctr = d.impressions > 0 ? (d.clicks / d.impressions) * 100 : 0;
    });

    const campaignSummaryMap: Record<string, CampaignSummary> = {};
    dataY?.campaignData!.forEach((item) => {
      if (!campaignSummaryMap[item.campaignId]) {
        campaignSummaryMap[item.campaignId] = {
          campaignId: item.campaignId,
          campaignName: item.campaignName,
          objective: campaignObjectiveMap.get(item.campaignId) || "Unknown",
          spend: 0,
          purchaseValue: 0,
          impressions: 0,
          clicks: 0,
          roas: 0,
          ctr: 0,
          cpm: 0,
          cpc: 0,
          isRetargeting: campaignTargetingMap.get(item.campaignId) || false,
        };
      }

      const campaign = campaignSummaryMap[item.campaignId];
      campaign.spend += item.spend;
      campaign.purchaseValue += item.purchaseValue;
      campaign.impressions += item.impressions;
      campaign.clicks += item.clicks;
    });
    const campaignSummary: CampaignSummary[] = Object.values(
      campaignSummaryMap
    ).map((campaign) => ({
      ...campaign,
      roas: campaign.spend > 0 ? campaign.purchaseValue / campaign.spend : 0,
      ctr:
        campaign.impressions > 0
          ? (campaign.clicks / campaign.impressions) * 100
          : 0,
      cpm:
        campaign.impressions > 0
          ? (campaign.spend / campaign.impressions) * 1000
          : 0,
      cpc: campaign.clicks > 0 ? campaign.spend / campaign.clicks : 0,
    }));

    const initialSpend: Record<string, number> = {
      Sales: 0,
      Branding: 0,
      "Lead Gen": 0,
      Engagement: 0,
    };

    const objectiveMapping: Record<string, string> = {
      CONVERSIONS: "Sales",
      REACH: "Branding",
      LEAD_GENERATION: "Lead Gen",
      ENGAGEMENT: "Engagement",
    };

    const aggregatedSpendRaw: Record<string, number> = { ...initialSpend };

    dataY?.campaignData.forEach((item: CampaignDataItem) => {
      const campaignObjective = campaignObjectiveMap.get(item.campaignId);
      const objective = campaignObjective
        ? objectiveMapping[campaignObjective] || campaignObjective
        : "Unknown";
      aggregatedSpendRaw[objective] =
        (aggregatedSpendRaw[objective] || 0) + item.spend;
    });

    const totalSpendFromDataY = dataY?.campaignData.reduce(
      (sum, item) => sum + item.spend,
      0
    );

    const spendByObjective: SpendByObjectiveType[] = Object.entries(
      aggregatedSpendRaw
    ).map(([objective, spend]) => ({
      objective,
      spend,
      percentage:
        totalSpendFromDataY === 0 ? 0 : (spend / totalSpendFromDataY!) * 100,
    }));

    const audienceMetrics: Record<
      string,
      Omit<AudienceAnalysisType, "roas" | "ctr" | "cvr">
    > = {};

    const deviceMetrics: Record<
      string,
      Omit<DeviceAnalysisType, "roas" | "ctr" | "cvr">
    > = {};

    const locationMetrics: Record<
      string,
      Omit<LocationAnalysisType, "roas" | "ctr" | "cvr">
    > = {};

    if (dataX && dataX.demographicData) {
      for (const [campaignId, campaignData] of Object.entries(
        dataX.demographicData
      )) {
        const campaignLocations: Record<string, any> = {};
        if (campaignData.locations) {
          for (const [locationKey, locationMetrics] of Object.entries(
            campaignData.locations
          )) {
            campaignLocations[locationKey] = locationMetrics;
          }
        }

        if (campaignData.demographics) {
          for (const [demographicKey, metrics] of Object.entries(
            campaignData.demographics
          )) {
            const [ageGroup, gender] = demographicKey.split("|");

            let associatedLocation = "N/A";
            const availableLocations = Object.keys(campaignLocations);
            if (availableLocations.length === 1) {
              associatedLocation = availableLocations[0];
            } else if (availableLocations.length > 1) {
              associatedLocation = "Multiple Locations";
            }

            const key = `${ageGroup}-${gender}-${associatedLocation}-N/A`;

            if (!audienceMetrics[key]) {
              audienceMetrics[key] = {
                ageGroup: ageGroup,
                gender: gender,
                city: associatedLocation,
                device: "N/A",
                audienceType: campaignData.isRetargetingCampaign
                  ? "Retargeting"
                  : "Prospecting",
                spend: 0,
                revenue: 0,
                impressions: 0,
                clicks: 0,
                purchases: 0,
              };
            }
            audienceMetrics[key].spend += metrics.spend || 0;
            audienceMetrics[key].revenue += metrics.purchaseValue || 0;
            audienceMetrics[key].impressions += metrics.impressions || 0;
            audienceMetrics[key].clicks += metrics.clicks || 0;
            audienceMetrics[key].purchases += metrics.purchases || 0;
          }
        }

        if (campaignData.devices) {
          for (const [deviceKey, metrics] of Object.entries(
            campaignData.devices
          )) {
            const key = deviceKey;

            if (!deviceMetrics[key]) {
              deviceMetrics[key] = {
                device: deviceKey,
                spend: 0,
                revenue: 0,
                impressions: 0,
                clicks: 0,
                purchases: 0,
              };
            }
            deviceMetrics[key].spend += metrics.spend || 0;
            deviceMetrics[key].revenue += metrics.purchaseValue || 0;
            deviceMetrics[key].impressions += metrics.impressions || 0;
            deviceMetrics[key].clicks += metrics.clicks || 0;
            deviceMetrics[key].purchases += metrics.purchases || 0;
          }
        }

        if (campaignData.locations) {
          for (const [locationKey, metrics] of Object.entries(
            campaignData.locations
          )) {
            const key = locationKey;

            if (!locationMetrics[key]) {
              locationMetrics[key] = {
                location: locationKey,
                spend: 0,
                revenue: 0,
                impressions: 0,
                clicks: 0,
                purchases: 0,
              };
            }
            locationMetrics[key].spend += metrics.spend || 0;
            locationMetrics[key].revenue += metrics.purchaseValue || 0;
            locationMetrics[key].impressions += metrics.impressions || 0;
            locationMetrics[key].clicks += metrics.clicks || 0;
            locationMetrics[key].purchases += metrics.purchases || 0;
          }
        }
      }
    }

    const audienceAnalysis: AudienceAnalysisType[] = Object.values(
      audienceMetrics
    )
      .map((audience) => ({
        ...audience,
        roas: audience.spend > 0 ? audience.revenue / audience.spend : 0,
        ctr:
          audience.impressions > 0
            ? (audience.clicks / audience.impressions) * 100
            : 0,
        cvr:
          audience.clicks > 0
            ? (audience.purchases / audience.clicks) * 100
            : 0,
      }))
      .sort((a, b) => b.roas - a.roas);

    const deviceAnalysis: DeviceAnalysisType[] = Object.values(deviceMetrics)
      .map((device) => ({
        ...device,
        roas: device.spend > 0 ? device.revenue / device.spend : 0,
        ctr:
          device.impressions > 0
            ? (device.clicks / device.impressions) * 100
            : 0,
        cvr: device.clicks > 0 ? (device.purchases / device.clicks) * 100 : 0,
      }))
      .sort((a, b) => b.roas - a.roas);

    const locationAnalysis: LocationAnalysisType[] = Object.values(
      locationMetrics
    )
      .map((location) => ({
        ...location,
        roas: location.spend > 0 ? location.revenue / location.spend : 0,
        ctr:
          location.impressions > 0
            ? (location.clicks / location.impressions) * 100
            : 0,
        cvr:
          location.clicks > 0
            ? (location.purchases / location.clicks) * 100
            : 0,
      }))
      .sort((a, b) => b.roas - a.roas);

    const retargetingCampaigns = campaignSummary.filter(
      (item: { isRetargeting: any }) => item.isRetargeting
    );
    const prospectingCampaigns = campaignSummary.filter(
      (item: { isRetargeting: any }) => !item.isRetargeting
    );

    const retargetingMetrics = {
      spend: retargetingCampaigns.reduce(
        (sum: any, item: { spend: any }) => sum + item.spend,
        0
      ),
      revenue: retargetingCampaigns.reduce(
        (sum: any, item: { purchaseValue: any }) => sum + item.purchaseValue,
        0
      ),
      roas: 0,
    };
    retargetingMetrics.roas =
      retargetingMetrics.spend > 0
        ? retargetingMetrics.revenue / retargetingMetrics.spend
        : 0;

    const prospectingMetrics = {
      spend: prospectingCampaigns.reduce(
        (sum: any, item: { spend: any }) => sum + item.spend,
        0
      ),
      revenue: prospectingCampaigns.reduce(
        (sum: any, item: { purchaseValue: any }) => sum + item.purchaseValue,
        0
      ),
      roas: 0,
    };
    prospectingMetrics.roas =
      prospectingMetrics.spend > 0
        ? prospectingMetrics.revenue / prospectingMetrics.spend
        : 0;

    const retargetingAnalysis = [
      { type: "Retargeting", ...retargetingMetrics },
      { type: "Prospecting", ...prospectingMetrics },
    ];

    const retentionMetrics: RetentionMetrics[] = [
      { period: "Week 1", retentionRate: 85, users: 8500 },
      { period: "Week 2", retentionRate: 65, users: 6500 },
      { period: "Week 3", retentionRate: 45, users: 4500 },
      { period: "Week 4", retentionRate: 32, users: 3200 },
      { period: "Month 2", retentionRate: 25, users: 2500 },
      { period: "Month 3", retentionRate: 18, users: 1800 },
    ];

    return {
      dailyData,
      campaignSummary,
      spendByObjective,
      audienceAnalysis,
      deviceAnalysis,
      locationAnalysis,
      retargetingAnalysis,
      retentionMetrics,
    };
  }, [dataX, dataY]);

  const kpis = useMemo(() => {
    if (!dataY) {
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

    const totalSpend = dataY.campaignData!.reduce((sum, c) => sum + c.spend, 0);
    const totalRevenue = dataY.campaignData!.reduce(
      (sum, c) => sum + c.purchaseValue,
      0
    );
    const totalImpressions = dataY.campaignData!.reduce(
      (sum, c) => sum + c.impressions,
      0
    );
    const totalClicks = dataY.campaignData!.reduce(
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
  }, [dataY]);

  const totalSpend = kpis.totalSpend;
  // const locationPerformance: Record<
  //   string,
  //   { spend: number; revenue: number; roas: number }
  // > = {};

  // if (dataX && dataY) {
  //   totalSpend = kpis.totalSpend;

  //   const locationSpendMap: Record<string, number> = {};
  //   const campaignLocationData: Record<string, Record<string, number>> = {};
  //   let totalTrackedSpendX = 0;

  //   if (dataX.demographicData) {
  //     for (const [campaignId, campaignData] of Object.entries(
  //       dataX.demographicData
  //     )) {
  //       if (campaignData.locations) {
  //         campaignLocationData[campaignId] = {};

  //         for (const [location, metrics] of Object.entries(
  //           campaignData.locations
  //         )) {
  //           if (metrics.spend !== undefined) {
  //             locationSpendMap[location] =
  //               (locationSpendMap[location] || 0) + metrics.spend;
  //             totalTrackedSpendX += metrics.spend;

  //             campaignLocationData[campaignId][location] = metrics.spend;
  //           }
  //         }
  //       }
  //     }
  //   }

  //   const unattributedSpend = { spend: 0, revenue: 0 };

  //   dataY.campaignData.forEach((campaignYItem) => {
  //     const campaignId = campaignYItem.campaignId;
  //     const campaignSpendY = campaignYItem.spend || 0;
  //     const campaignRevenueY = campaignYItem.purchaseValue || 0;

  //     if (campaignLocationData[campaignId]) {
  //       const campaignLocations = campaignLocationData[campaignId];
  //       const totalCampaignSpendX = Object.values(campaignLocations).reduce(
  //         (sum, s) => sum + s,
  //         0
  //       );

  //       if (totalCampaignSpendX > 0) {
  //         for (const [location, locationSpendX] of Object.entries(
  //           campaignLocations
  //         )) {
  //           const proportion = locationSpendX / totalCampaignSpendX;
  //           const allocatedSpend = campaignSpendY * proportion;
  //           const allocatedRevenue = campaignRevenueY * proportion;

  //           if (!locationPerformance[location]) {
  //             locationPerformance[location] = { spend: 0, revenue: 0, roas: 0 };
  //           }
  //           locationPerformance[location].spend += allocatedSpend;
  //           locationPerformance[location].revenue += allocatedRevenue;
  //         }
  //         return;
  //       }
  //     }

  //     unattributedSpend.spend += campaignSpendY;
  //     unattributedSpend.revenue += campaignRevenueY;
  //   });

  //   if (unattributedSpend.spend > 0) {
  //     locationPerformance["Unknown"] = {
  //       spend: unattributedSpend.spend,
  //       revenue: unattributedSpend.revenue,
  //       roas:
  //         unattributedSpend.spend > 0
  //           ? unattributedSpend.revenue / unattributedSpend.spend
  //           : 0,
  //     };
  //   }

  //   for (const location in locationPerformance) {
  //     const { spend, revenue } = locationPerformance[location];
  //     locationPerformance[location].roas = spend > 0 ? revenue / spend : 0;
  //   }
  // }

  if (!loading && !adAccountInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
        <div className="bg-white rounded-lg shadow-xl p-8 sm:p-10 max-w-md w-full text-center border border-red-200 animate-fade-in">
          <div className="flex justify-center mb-6">
            <TriangleAlert size={72} className="text-red-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            Ad Account Not Found
          </h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            It looks like we couldn&apos;t load your ad account information.
            This might be due to an invalid account ID or a connection issue.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-md mb-6 text-sm font-medium">
              <p className="font-semibold mb-2">Error Details:</p>
              <p className="break-words">{error}</p>
            </div>
          )}

          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-semibold rounded-md shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 transform hover:scale-105"
          >
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </button>
        </div>
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
              {dataY && (
                <>
                  {adAccountInfo && (
                    <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
                      <Building2 className="w-4 h-4 text-blue-600" />

                      <span className="text-sm font-medium text-blue-700">
                        {adAccountInfo!.name}
                      </span>
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                        {adAccountInfo!.currency}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg hidden sm:flex">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {dataY.summary.dateRange}
                    </span>
                  </div>
                  {/* <div className="flex items-center space-x-2 hidden sm:flex">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-black"
                  value={selectedCampaign}
                  onChange={(e) => setSelectedCampaign(e.target.value)}
                  disabled={loading}
                >
                  <option value="all">All Campaigns</option>
                  {processedData.campaignSummary.map((c, index) => (
                    <option key={index} value={c.campaignId}>
                      {c.campaignName}
                    </option>
                  ))}
                </select>
              </div> */}
                  <button
                    onClick={() => router.push("/creative-dashboard")}
                    className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm flex items-center space-x-1 hover:bg-green-200"
                  >
                    <Lightbulb size={16} />
                    <span>Creative Analysis</span>
                  </button>
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
          <AiInsights campaignSummary={processedData.campaignSummary} />
        )}

        {loading ? (
          <>
            <KPICardsSkeleton />
          </>
        ) : (
          <KPICards kpis={kpis} currency={adAccountInfo!.currency} />
        )}

        {loading ? (
          <>
            <SpendByObjectiveSkeleton />
          </>
        ) : (
          <SpendByObjective
            data={processedData.spendByObjective}
            totalSpend={totalSpend}
          />
        )}

        {loading ? (
          <>
            <AudienceAnalysisSkeleton />
          </>
        ) : (
          <AudienceAnalysis
            audienceAnalysis={processedData.audienceAnalysis}
            locationPerformance={processedData.locationAnalysis}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            selectedSegment={selectedSegment}
            setSelectedSegment={setSelectedSegment}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
        )}

        {loading ? (
          <>
            <AudienceAnalysisSkeleton />
          </>
        ) : (
          <DeviceAndPlatformAnalysis
            audienceAnalysis={processedData.audienceAnalysis}
            deviceAnalysis={processedData.deviceAnalysis}
            selectedFilter={selectedFilter}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
        )}

        {
          loading ? (
            <FunnelAnalysisSkeleton />
          ) : (
            <FunnelAnalysis
              metrics={metricsData || {
                total_impressions: 0,
                total_clicks: 0,
                total_addtocart: 0,
                total_checkout: 0,
                total_purchases: 0
              }}
              viewMode={viewMode}
              setViewMode={setViewMode}
              timeRange={timeRange}
              setTimeRange={setTimeRange}
            />
          )
        }

        {loading ? (
          <>
            <RetargetingAnalysisSkeleton />
          </>
        ) : (
          <RetargetingAnalysis
            retargetingAnalysis={processedData.retargetingAnalysis}
            retentionMetrics={processedData.retentionMetrics}
            selectedMetric={selectedMetric2}
            setSelectedMetric={setSelectedMetric2}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            selectedAudience={selectedAudience}
            setSelectedAudience={setSelectedAudience}
            totalSpend={totalSpend}
          />
        )}

        {loading ? (
          <>
            <PerformanceTrendsSkeleton />
          </>
        ) : (
          <PerformanceTrends
            dailyData={processedData.dailyData!}
            campaignSummary={processedData.campaignSummary}
            selectedMetric={selectedMetric}
            setSelectedMetric={setSelectedMetric}
          />
        )}

        {loading ? (
          <TableSkeleton />
        ) : (
          <CampaignPerformanceTable
            campaignSummary={processedData.campaignSummary}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardV2;

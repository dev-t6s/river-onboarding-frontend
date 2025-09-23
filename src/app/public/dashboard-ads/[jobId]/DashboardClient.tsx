/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  ChartPie,
  ChevronRight,
  Home,
} from "lucide-react";
import { KPICards } from "@/components/KPICards";
import { SpendByObjective } from "@/components/SpendByObjective";
import { AudienceAnalysis } from "@/components/AudienceAnalysis";
import { FunnelAnalysis } from "@/components/FunnelAnalysis";
import { RetargetingAnalysis } from "@/components/RetargetingAnalysisSmall";
import { PerformanceTrends } from "@/components/PerformanceTrends";
import { CampaignPerformanceTable } from "@/components/CampaignPerformanceTable";
import AiInsights from "@/components/AiInsights";
import {
  AdvancedData,
  CampaignDataItem,
  AudienceAnalysisType,
  CampaignSummary,
  DailyData,
  RetentionMetrics,
  SpendByObjectiveType,
  ProcessedData,
  DeviceAnalysisType,
  LocationAnalysisType,
} from "@/types/types";
import { PlacementDeviceType, PlacementSpentSalesType, PlatformSpendSalesType } from "@/types/meta-ads";
import { AdAccount, ConsolidatedData, TotalMetrics } from "@/types/meta-ads";
import { useRouter } from "next/navigation";
import { DeviceAndPlatformAnalysis } from "@/components-public/DeviceAndPlatformAnalysis";

interface DevicePropsType {
  deviceD1data: PlatformSpendSalesType;
  deviceD2data: PlacementSpentSalesType;
  deviceD3data: PlacementDeviceType;
}

interface DashboardClientProps {
  initialData: {
    accountId: string;
    auditResults: {
      getAdAccounts_result: AdAccount[];
      getAdvancedData_result: AdvancedData;
      getTotalMetrics_result: TotalMetrics;
      getCampaignData_result: CampaignDataItem[];
      getAdsetData_result: any[];
      getAdsData_result: any[];
      getPlatformSpendSalesData_result: PlatformSpendSalesType;
      getPlacementSpendSales_result: PlacementSpentSalesType;
      getPlacementDeviceData_result: PlacementDeviceType;
    };
  };
  jobId: string;
  updatedAt: string;
}

const DashboardClient = ({ initialData, jobId, updatedAt }: DashboardClientProps) => {
  const router = useRouter();
  const [adAccountInfo, setAdAccountInfo] = useState<AdAccount | null>(null);
  const [selectedMetric, setSelectedMetric] = useState("roas");
  const [selectedMetric2, setSelectedMetric2] = useState("roas");
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedAudience, setSelectedAudience] = useState("all");
  const [viewMode, setViewMode] = useState("absolute");
  const [timeRange, setTimeRange] = useState("7d");
  const [sortBy, setSortBy] = useState("roas");
  const [sortOrder, setSortOrder] = useState("desc");
  const [dataX, setDataX] = useState<AdvancedData | null>(initialData.auditResults.getAdvancedData_result);
  const [dataY, setDataY] = useState<ConsolidatedData | null>(null);
  const [metricsData, setMetricsData] = useState<TotalMetrics | null>(initialData.auditResults.getTotalMetrics_result);
  const [deviceData, setDeviceData] = useState<DevicePropsType>({
    deviceD1data: initialData.auditResults.getPlatformSpendSalesData_result,
    deviceD2data: initialData.auditResults.getPlacementSpendSales_result,
    deviceD3data: initialData.auditResults.getPlacementDeviceData_result,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const today = new Date(updatedAt);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await router.push(`/public/creative-dashboard/${jobId}`);
    } catch (error) {
      console.error('Navigation error:', error);
      setIsLoading(false);
    }
  };

  // Initialize data from server props
  useEffect(() => {
    const initializeData = () => {
      const today = new Date(updatedAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);

      const formatDate = (date: Date) => date.toISOString().split("T")[0];

      setDataY({
        summary: {
          campaignRecords: initialData.auditResults.getCampaignData_result.length,
          adsetRecords: initialData.auditResults.getAdsetData_result.length,
          adRecords: initialData.auditResults.getAdsData_result.length,
          dateRange: `${formatDate(thirtyDaysAgo)} to ${formatDate(today)}`,
        },
        campaignData: initialData.auditResults.getCampaignData_result,
        adsetData: initialData.auditResults.getAdsetData_result,
        adsData: initialData.auditResults.getAdsData_result,
      });

      const accountId = initialData.accountId.includes("_")
        ? initialData.accountId.split("_")[1]
        : initialData.accountId;

      const currentAccount = initialData.auditResults.getAdAccounts_result.find(
        (acc: AdAccount) => acc.id === accountId
      );
      setAdAccountInfo(currentAccount ?? null);
    };

    initializeData();
  }, [initialData]);

  const processedData: ProcessedData = useMemo(() => {
    if (!dataX || !dataY) {
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
    }

    // Campaign objective mapping
    const campaignObjectiveMap = new Map<string, string>();
    dataX.data.forEach((item: { campaignId: string; objective: string }) => {
      if (item.campaignId && item.objective) {
        campaignObjectiveMap.set(item.campaignId, item.objective);
      }
    });

    // Campaign targeting mapping
    const campaignTargetingMap = new Map<string, boolean>();
    dataX.data.forEach(
      (item: { campaignId: string; isRetargeting: boolean }) => {
        if (item.campaignId) {
          campaignTargetingMap.set(item.campaignId, item.isRetargeting);
        }
      }
    );

    // Process daily data
    const dailyData = dataY.campaignData.reduce(
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

    // Process campaign summary
    const campaignSummaryMap: Record<string, CampaignSummary> = {};
    dataY.campaignData.forEach((item) => {
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

    const campaignSummary: CampaignSummary[] = Object.values(campaignSummaryMap)
      .map((campaign) => ({
        ...campaign,
        roas: campaign.spend > 0 ? campaign.purchaseValue / campaign.spend : 0,
        ctr: campaign.impressions > 0 ? (campaign.clicks / campaign.impressions) * 100 : 0,
        cpm: campaign.impressions > 0 ? (campaign.spend / campaign.impressions) * 1000 : 0,
        cpc: campaign.clicks > 0 ? campaign.spend / campaign.clicks : 0,
      }));

    // Process spend by objective
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

    dataY.campaignData.forEach((item: CampaignDataItem) => {
      const campaignObjective = campaignObjectiveMap.get(item.campaignId);
      const objective = campaignObjective
        ? objectiveMapping[campaignObjective] || campaignObjective
        : "Unknown";
      aggregatedSpendRaw[objective] =
        (aggregatedSpendRaw[objective] || 0) + item.spend;
    });

    const totalSpendFromDataY = dataY.campaignData.reduce(
      (sum, item) => sum + item.spend,
      0
    );

    const spendByObjective: SpendByObjectiveType[] = Object.entries(
      aggregatedSpendRaw
    ).map(([objective, spend]) => ({
      objective,
      spend,
      percentage:
        totalSpendFromDataY === 0 ? 0 : (spend / totalSpendFromDataY) * 100,
    }));

    // Process audience, device, and location analysis
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

    if (dataX.demographicData) {
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
        ctr: audience.impressions > 0 ? (audience.clicks / audience.impressions) * 100 : 0,
        cvr: audience.clicks > 0 ? (audience.purchases / audience.clicks) * 100 : 0,
      }))
      .sort((a, b) => b.roas - a.roas);

    const deviceAnalysis: DeviceAnalysisType[] = Object.values(deviceMetrics)
      .map((device) => ({
        ...device,
        roas: device.spend > 0 ? device.revenue / device.spend : 0,
        ctr: device.impressions > 0 ? (device.clicks / device.impressions) * 100 : 0,
        cvr: device.clicks > 0 ? (device.purchases / device.clicks) * 100 : 0,
      }))
      .sort((a, b) => b.roas - a.roas);

    const locationAnalysis: LocationAnalysisType[] = Object.values(
      locationMetrics
    )
      .map((location) => ({
        ...location,
        roas: location.spend > 0 ? location.revenue / location.spend : 0,
        ctr: location.impressions > 0 ? (location.clicks / location.impressions) * 100 : 0,
        cvr: location.clicks > 0 ? (location.purchases / location.clicks) * 100 : 0,
      }))
      .sort((a, b) => b.roas - a.roas);

    // Process retargeting analysis
    const retargetingCampaigns = campaignSummary.filter(
      (item) => item.isRetargeting
    );
    const prospectingCampaigns = campaignSummary.filter(
      (item) => !item.isRetargeting
    );

    const retargetingMetrics = {
      spend: retargetingCampaigns.reduce((sum, item) => sum + item.spend, 0),
      revenue: retargetingCampaigns.reduce((sum, item) => sum + item.purchaseValue, 0),
      roas: 0,
    };
    retargetingMetrics.roas =
      retargetingMetrics.spend > 0
        ? retargetingMetrics.revenue / retargetingMetrics.spend
        : 0;

    const prospectingMetrics = {
      spend: prospectingCampaigns.reduce((sum, item) => sum + item.spend, 0),
      revenue: prospectingCampaigns.reduce((sum, item) => sum + item.purchaseValue, 0),
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

    // Mock retention metrics
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

    const totalSpend = dataY.campaignData.reduce((sum, c) => sum + c.spend, 0);
    const totalRevenue = dataY.campaignData.reduce(
      (sum, c) => sum + c.purchaseValue,
      0
    );
    const totalImpressions = dataY.campaignData.reduce(
      (sum, c) => sum + c.impressions,
      0
    );
    const totalClicks = dataY.campaignData.reduce(
      (sum, c) => sum + c.clicks,
      0
    );

    return {
      totalSpend,
      totalRevenue,
      totalRoas: totalSpend > 0 ? totalRevenue / totalSpend : 0,
      totalCtr: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
      totalImpressions,
      totalClicks,
      avgCpm: totalImpressions > 0 ? (totalSpend / totalImpressions) * 1000 : 0,
      avgCpc: totalClicks > 0 ? totalSpend / totalClicks : 0,
    };
  }, [dataY]);

  const totalSpend = kpis.totalSpend;

  if (!adAccountInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
        <div className="bg-white rounded-lg shadow-xl p-8 sm:p-10 max-w-md w-full text-center border border-blue-200 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            Loading Ad Account
          </h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            We&apos;re fetching your ad account information...
          </p>
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-5 py-4 rounded-md mb-6 text-sm font-medium">
            <p className="font-semibold mb-2">Please wait</p>
            <p>This may take a few moments to complete.</p>
          </div>
          <div className="flex justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
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
                  <button
                    onClick={handleClick}
                    disabled={isLoading}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all duration-200 cursor-pointer shadow-sm  ${
                      isLoading
                        ? 'bg-blue-200 text-blue-600 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading Dashboard...</span>
                      </>
                    ) : (
                      <>
                        <ChartPie size={16} className="text-white" /> {/* Changed to a more dashboard-appropriate icon */}
                        <span>View Creatives Dashboard</span>
                        <ChevronRight size={14} className="opacity-80" />
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="rounded-xl mb-5 text-black">
          <div className="max-w-7xl mx-auto px-1">  
            {/* Main Header */}
            <div className="">
              <div className="flex flex-col gap-2 items-start justify-between sm:flex-row sm:items-center sm:gap-0">
                {/* Left side - Account */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-2xl font-bold space-x-3">
                    {adAccountInfo.name}
                  </div>
                </div>
                
                {/* Right side - Time Range */}
                <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-sm border border-white/50">
                  <div className="flex items-center space-x-2">
                    <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md">
                      <Calendar className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {formatDate(thirtyDaysAgo)} to {formatDate(today)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AiInsights campaignSummary={processedData.campaignSummary} />
        <KPICards kpis={kpis} currency={adAccountInfo.currency} />
        <SpendByObjective
          data={processedData.spendByObjective}
          totalSpend={totalSpend}
        />
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
        {deviceData && (
          <DeviceAndPlatformAnalysis
            audienceAnalysis={processedData.audienceAnalysis}
            deviceAnalysis={processedData.deviceAnalysis}
            selectedFilter={selectedFilter}
            sortBy={sortBy}
            sortOrder={sortOrder}
            platformSpendSalesData={deviceData.deviceD1data}
            placementSpendSalesData={deviceData.deviceD2data}
            placementDeviceData={deviceData.deviceD3data}
          />
        )}
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
        <PerformanceTrends
          dailyData={processedData.dailyData!}
          campaignSummary={processedData.campaignSummary}
          selectedMetric={selectedMetric}
          setSelectedMetric={setSelectedMetric}
        />
        <CampaignPerformanceTable
          campaignSummary={processedData.campaignSummary}
        />
      </div>
    </div>
  );
};

export default DashboardClient;
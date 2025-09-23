/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AdAccount,
  CampaignData,
  AdsetData,
  AdData,
  ConsolidatedData,
  ApiResponse,
  ApiDataResponse,
  CreativeData,
  TotalMetrics,
  PlatformSpendSalesType,
  PlacementSpentSalesType,
  PlacementDeviceType,
} from "../types/meta-ads";

export class MetaAdsClient {
  private accessToken: string;
  private baseUrl: string;

  constructor(accessToken: string, baseUrl: string = "/api/meta-ads") {
    this.accessToken = accessToken;
    this.baseUrl = baseUrl;
  }

  private async fetchWithAuth<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error: ApiResponse<unknown> = await response.json();
      throw new Error(error.message || "Request failed");
    }

    return response.json();
  }

  async getAdAccounts(): Promise<AdAccount[]> {
    const response = await this.fetchWithAuth<ApiResponse<AdAccount[]>>(
      `${this.baseUrl}/accounts`
    );
    return response.data || [];
  }

  async getCampaignData(
    adAccountId: string,
    campaignId?: string
  ): Promise<CampaignData[]> {
    const params = new URLSearchParams({ ad_account_id: adAccountId });
    if (campaignId) params.append("campaign_id", campaignId);

    const response = await this.fetchWithAuth<ApiDataResponse<CampaignData[]>>(
      `${this.baseUrl}/campaigns?${params}`
    );
    return response.data || [];
  }

  async getAdvancedData(
    adAccountId: string,
    campaignId?: string
  ): Promise<{
    data: CampaignData[];
    demographicData: any;
  }> {
    const params = new URLSearchParams({ ad_account_id: adAccountId });
    if (campaignId) params.append("campaign_id", campaignId);

    const response = await this.fetchWithAuth<ApiDataResponse<{
      data: CampaignData[];
      demographicData: any[];
    }>>(
      `${this.baseUrl}/advanced-data?${params}`
    );

    return response.data || { data: [], demographicData: {} };
  }

  async getTotalMetricsData(
    adAccountId: string,
    campaignId?: string
  ): Promise<TotalMetrics> {
    const params = new URLSearchParams({ ad_account_id: adAccountId });
    if (campaignId) params.append("campaign_id", campaignId);

    const response = await this.fetchWithAuth<ApiDataResponse<TotalMetrics>>(
      `${this.baseUrl}/total-metrics?${params}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to fetch total metrics");
    }

    // Provide default values in case any fields are missing
    const defaultMetrics: TotalMetrics = {
      total_impressions: 0,
      total_clicks: 0,
      total_addtocart: 0,
      total_checkout: 0,
      total_purchases: 0
    };

    return {
      ...defaultMetrics,
      ...response.data
    };
  }

  async getPlatformSpendSalesData(
    adAccountId: string,
    campaignId?: string
  ): Promise<PlatformSpendSalesType> {
    const params = new URLSearchParams({ ad_account_id: adAccountId });
    if (campaignId) params.append("campaign_id", campaignId);

    const response = await this.fetchWithAuth<ApiDataResponse<TotalMetrics>>(
      `${this.baseUrl}/platform-spend-sales?${params}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to fetch platform spend vs sales data");
    }

    // Provide default values in case any fields are missing
    const defaultData: PlatformSpendSalesType = {
      platformData: [],
      dateRange: ''
    };

    return {
      ...defaultData,
      ...response.data
    };
  }

  async getPlacementSpendSalesData(
    adAccountId: string,
    campaignId?: string
  ): Promise<PlacementSpentSalesType> {
    const params = new URLSearchParams({ ad_account_id: adAccountId });
    if (campaignId) params.append("campaign_id", campaignId);

    const response = await this.fetchWithAuth<ApiDataResponse<TotalMetrics>>(
      `${this.baseUrl}/placement-spend-sales?${params}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to fetch placement spend vs sales data");
    }

    // Provide default values in case any fields are missing
    const defaultData: PlacementSpentSalesType = {
      placementData: [],
      dateRange: ''
    };

    return {
      ...defaultData,
      ...response.data
    };
  }

  async getPlacementDeviceData(
    adAccountId: string,
    campaignId?: string
  ): Promise<PlacementDeviceType> {
    const params = new URLSearchParams({ ad_account_id: adAccountId });
    if (campaignId) params.append("campaign_id", campaignId);

    const response = await this.fetchWithAuth<ApiDataResponse<TotalMetrics>>(
      `${this.baseUrl}/placement-device?${params}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to fetch placement device spend vs sales data");
    }

    // Provide default values in case any fields are missing
    const defaultData: PlacementDeviceType = {
      placementData: [],
      dateRange: ''
    };

    return {
      ...defaultData,
      ...response.data
    };
  }

  async getCreativeData(
    adAccountId: string,
    campaignId?: string
  ): Promise<CreativeData> {
    const params = new URLSearchParams({ ad_account_id: adAccountId });
    if (campaignId) params.append("campaign_id", campaignId);

    const response = await this.fetchWithAuth<ApiDataResponse<CreativeData>>(
      `${this.baseUrl}/creative-data?${params}`
    );

    return response.data || {
      creatives: [],
      audienceInteractions: [],
      summary: {
        totalCreatives: 0,
        dateRange: "",
        overallScore: undefined,
        fatigueIndex: undefined
      }
    };
  }

  async getAdsetData(
    adAccountId: string,
    campaignId?: string
  ): Promise<AdsetData[]> {
    const params = new URLSearchParams({ ad_account_id: adAccountId });
    if (campaignId) params.append("campaign_id", campaignId);

    const response = await this.fetchWithAuth<ApiDataResponse<AdsetData[]>>(
      `${this.baseUrl}/adsets?${params}`
    );
    return response.data || [];
  }

  async getAdsData(
    adAccountId: string,
    campaignId?: string
  ): Promise<AdData[]> {
    const params = new URLSearchParams({ ad_account_id: adAccountId });
    if (campaignId) params.append("campaign_id", campaignId);

    const response = await this.fetchWithAuth<ApiDataResponse<AdData[]>>(
      `${this.baseUrl}/ads?${params}`
    );
    return response.data || [];
  }

  async getAllData(
    adAccountId: string,
    campaignId?: string
  ): Promise<ConsolidatedData> {
    const params = new URLSearchParams({ ad_account_id: adAccountId });
    if (campaignId) params.append("campaign_id", campaignId);

    const response = await this.fetchWithAuth<ApiResponse<ConsolidatedData>>(
      `${this.baseUrl}/all-data?${params}`
    );
    return response.data!;
  }

  async getConsolidatedData(
    adAccountId: string,
    campaignId?: string
  ): Promise<ConsolidatedData> {
    try {
      return await this.getAllData(adAccountId, campaignId);
    } catch (error) {
      console.warn(
        "Consolidated endpoint failed, falling back to individual calls:",
        error
      );

      const [campaignData, adsetData, adsData] = await Promise.all([
        this.getCampaignData(adAccountId, campaignId),
        this.getAdsetData(adAccountId, campaignId),
        this.getAdsData(adAccountId, campaignId),
      ]);

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);

      return {
        summary: {
          campaignRecords: campaignData.length,
          adsetRecords: adsetData.length,
          adRecords: adsData.length,
          dateRange: `${startDate.toISOString().split("T")[0]} to ${endDate.toISOString().split("T")[0]
            }`,
        },
        campaignData,
        adsetData,
        adsData,
      };
    }
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as bizSdk from "facebook-nodejs-business-sdk";
import {
  AdAccount,
  TimeRange,
  ActionValue,
  CampaignData,
  AdsetData,
  AdData,
  ConsolidatedData,
  InsightParams,
  Action,
  AdvancedData,
  CreativeData,
  CreativePerformance,
  AudienceCreativeInteraction,
  SanitizedCreativeObject,
  TotalMetrics,
  PlatformSpendSalesType,
  PlacementSpentSalesType,
  PlacementDeviceType,
} from "../types/meta-ads";
import Cursor from "facebook-nodejs-business-sdk/src/cursor";

export class MetaAdsService {
  private accessToken: string;
  private adAccountId: string | null;
  private api: bizSdk.FacebookAdsApi;

  constructor(accessToken: string, adAccountId: string | null = null) {
    this.accessToken = accessToken;
    this.adAccountId = adAccountId;

    const api = bizSdk.FacebookAdsApi.init(accessToken);
    this.api = api;
  }

  async getAdAccounts(): Promise<AdAccount[]> {
    try {
      const user = new bizSdk.User("me");
      const accounts = await user.getAdAccounts([
        "account_id",
        "name",
        "account_status",
        "currency",
      ]);

      return accounts.map((account: Record<string, any>) => ({
        id: account.account_id,
        name: account.name,
        status: account.account_status,
        currency: account.currency,
      }));
    } catch (error) {
      throw new Error(
        `Failed to fetch ad accounts: ${(error as Error).message}`
      );
    }
  }

  async fetchAllData(
    campaignId: string | null = null
  ): Promise<ConsolidatedData> {
    if (!this.adAccountId) {
      throw new Error("Ad Account ID is required");
    }

    const account = new bizSdk.AdAccount(`act_${this.adAccountId}`);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);

    const timeRange: TimeRange = {
      since: startDate.toISOString().split("T")[0],
      until: endDate.toISOString().split("T")[0],
    };

    try {
      const [campaignData, adsetData, adsData] = await Promise.all([
        this.getCampaignData(account, timeRange, campaignId),
        this.getAdsetData(account, timeRange, campaignId),
        this.getAdsData(account, timeRange, campaignId),
      ]);

      return {
        summary: {
          campaignRecords: campaignData.length,
          adsetRecords: adsetData.length,
          adRecords: adsData.length,
          dateRange: `${timeRange.since} to ${timeRange.until}`,
        },
        campaignData,
        adsetData,
        adsData,
      };
    } catch (error) {
      throw new Error(`Failed to fetch ads data: ${(error as Error).message}`);
    }
  }

  async getCampaignData(
    account: bizSdk.AdAccount,
    timeRange: TimeRange,
    campaignId: string | null = null
  ): Promise<CampaignData[]> {
    const fields = [
      "campaign_id",
      "campaign_name",
      "date_start",
      "spend",
      "impressions",
      "clicks",
      "cpm",
      "cpc",
      "ctr",
      "frequency",
      "reach",
      "actions",
      "action_values",
    ];

    const params: InsightParams = {
      time_range: timeRange,
      level: "campaign",
      time_increment: 1,
      limit: 1000,
    };

    if (campaignId) {
      params.filtering = [
        {
          field: "campaign.id",
          operator: "IN",
          value: [campaignId],
        },
      ];
    }

    const insights = await account.getInsights(fields, params);

    return insights.map((insight: any) => {
      const data = insight._data;
      const spend = parseFloat(data.spend || "0");
      const purchaseValue = this.extractPurchaseValue(data.action_values || []);
      const roas = spend > 0 ? purchaseValue / spend : 0;

      return {
        date: data.date_start,
        campaignId: data.campaign_id,
        campaignName: data.campaign_name,
        spend,
        purchaseValue,
        roas,
        impressions: parseInt(data.impressions || "0"),
        clicks: parseInt(data.clicks || "0"),
        cpm: parseFloat(data.cpm || "0"),
        cpc: parseFloat(data.cpc || "0"),
        ctr: parseFloat(data.ctr || "0"),
        frequency: parseFloat(data.frequency || "0"),
        reach: parseInt(data.reach || "0"),
      };
    });
  }

  async getAdsetData(
    account: bizSdk.AdAccount,
    timeRange: TimeRange,
    campaignId: string | null = null
  ): Promise<AdsetData[]> {
    const fields = [
      "campaign_id",
      "campaign_name",
      "adset_id",
      "adset_name",
      "date_start",
      "spend",
      "impressions",
      "clicks",
      "cpm",
      "cpc",
      "ctr",
      "frequency",
      "reach",
      "actions",
      "action_values",
    ];

    const params: InsightParams = {
      time_range: timeRange,
      level: "adset",
      time_increment: 1,
    };

    if (campaignId) {
      params.filtering = [
        {
          field: "campaign.id",
          operator: "IN",
          value: [campaignId],
        },
      ];
    }

    const insights = await account.getInsights(fields, params);

    return insights.map((insight: any) => {
      const data = insight._data;
      const spend = parseFloat(data.spend || "0");
      const purchaseValue = this.extractPurchaseValue(data.action_values || []);
      const roas = spend > 0 ? purchaseValue / spend : 0;

      return {
        date: data.date_start,
        campaignId: data.campaign_id,
        campaignName: data.campaign_name,
        adsetId: data.adset_id,
        adsetName: data.adset_name,
        spend,
        purchaseValue,
        roas,
        impressions: parseInt(data.impressions || "0"),
        clicks: parseInt(data.clicks || "0"),
        cpm: parseFloat(data.cpm || "0"),
        cpc: parseFloat(data.cpc || "0"),
        ctr: parseFloat(data.ctr || "0"),
        frequency: parseFloat(data.frequency || "0"),
        reach: parseInt(data.reach || "0"),
      };
    });
  }

  async getAdsData(
    account: bizSdk.AdAccount,
    timeRange: TimeRange,
    campaignId: string | null = null
  ): Promise<AdData[]> {
    const fields = [
      "campaign_id",
      "campaign_name",
      "adset_id",
      "adset_name",
      "ad_id",
      "ad_name",
      "date_start",
      "spend",
      "impressions",
      "clicks",
      "cpm",
      "cpc",
      "ctr",
      "frequency",
      "reach",
      "actions",
      "action_values",
    ];

    const params: InsightParams = {
      time_range: timeRange,
      level: "ad",
      time_increment: 1,
    };

    if (campaignId) {
      params.filtering = [
        {
          field: "campaign.id",
          operator: "IN",
          value: [campaignId],
        },
      ];
    }

    const insights = await account.getInsights(fields, params);

    return insights.map((insight: any) => {
      const data = insight._data;
      const spend = parseFloat(data.spend || "0");
      const purchaseValue = this.extractPurchaseValue(data.action_values || []);
      const roas = spend > 0 ? purchaseValue / spend : 0;

      return {
        date: data.date_start,
        campaignId: data.campaign_id,
        campaignName: data.campaign_name,
        adsetId: data.adset_id,
        adsetName: data.adset_name,
        adId: data.ad_id,
        adName: data.ad_name,
        spend,
        purchaseValue,
        roas,
        impressions: parseInt(data.impressions || "0"),
        clicks: parseInt(data.clicks || "0"),
        cpm: parseFloat(data.cpm || "0"),
        cpc: parseFloat(data.cpc || "0"),
        ctr: parseFloat(data.ctr || "0"),
        frequency: parseFloat(data.frequency || "0"),
        reach: parseInt(data.reach || "0"),
      };
    });
  }

  async getAdSetAudienceClassification(
    account: bizSdk.AdAccount,
    campaignId: string | null = null
  ): Promise<Map<string, { isRetargeting: boolean; isProspecting: boolean }>> {
    const adSetClassifications = new Map<
      string,
      { isRetargeting: boolean; isProspecting: boolean }
    >();

    const adSetParams: {
      level: string;
      filtering: any[];
      limit: number;
    } = {
      level: "adset",
      limit: 1000,
      filtering: campaignId
        ? [{ field: "campaign.id", operator: "IN", value: [campaignId] }]
        : [],
    };

    const fieldsToRequest = [
      "id",
      "campaign_id",
      "targeting{custom_audiences,interests,behaviors,geo_locations,age_min,age_max,genders,flexible_spec}",
    ];

    const adSetsCursor = await account.getAdSets(fieldsToRequest, adSetParams);

    for await (const adSet of adSetsCursor) {
      const data = adSet._data;
      const targeting = data.targeting;
      let isRetargeting = false;
      let isProspecting = false;

      const customAudiences = targeting?.custom_audiences;

      const hasAnyCustomAudiences =
        customAudiences && customAudiences.length > 0;

      const hasLookalikeAudiences =
        hasAnyCustomAudiences &&
        customAudiences.some((ca: any) => ca.subtype === "LOOKALIKE");

      const hasTrueRetargetingCustomAudiences =
        hasAnyCustomAudiences &&
        customAudiences.some((ca: any) => ca.subtype !== "LOOKALIKE");

      const hasInterests =
        targeting?.interests && targeting.interests.length > 0;
      const hasBehaviors =
        targeting?.behaviors && targeting.behaviors.length > 0;

      const hasFlexibleSpecTargeting =
        targeting?.flexible_spec &&
        targeting.flexible_spec.some(
          (spec: any) =>
            (spec.interests && spec.interests.length > 0) ||
            (spec.behaviors && spec.behaviors.length > 0) ||
            false
        );

      const hasBroadDemographicTargeting =
        (targeting?.age_min !== undefined && targeting.age_max !== undefined) ||
        (targeting?.genders && targeting.genders.length > 0) ||
        (targeting?.geo_locations &&
          Object.keys(targeting.geo_locations).length > 0 &&
          (targeting.geo_locations.countries?.length > 0 ||
            targeting.geo_locations.regions?.length > 0 ||
            targeting.geo_locations.cities?.length > 0 ||
            targeting.geo_locations.zips?.length > 0));

      if (hasTrueRetargetingCustomAudiences) {
        isRetargeting = true;
      } else if (
        hasLookalikeAudiences ||
        hasInterests ||
        hasBehaviors ||
        hasFlexibleSpecTargeting ||
        hasBroadDemographicTargeting
      ) {
        isProspecting = true;
      }

      if (!isRetargeting && !isProspecting) {
        console.warn(
          `AdSet ID: ${data.id} is neither Retargeting nor Prospecting. Full Targeting:`,
          JSON.stringify(targeting, null, 2)
        );
      }

      adSetClassifications.set(data.id, { isRetargeting, isProspecting });
    }
    return adSetClassifications;
  }

  async getB1Data(
    account: bizSdk.AdAccount,
    timeRange: TimeRange,
    campaignId: string | null = null
  ): Promise<Cursor> {
    const fields = [
      "campaign_id",
      "campaign_name",
      "date_start",
      "spend",
      "impressions",
      "clicks",
      "cpm",
      "cpc",
      "ctr",
      "frequency",
      "reach",
      "actions",
      "action_values",
      "objective",
      "adset_id",
      "adset_name",
    ];

    const params: InsightParams = {
      time_range: timeRange,
      level: "adset",
      limit: 1000,
      breakdowns: ["age", "gender"],
      action_breakdowns: ["action_type"],
    };

    if (campaignId) {
      params.filtering = [
        {
          field: "campaign.id",
          operator: "IN",
          value: [campaignId],
        },
      ];
    }

    const insights = await account.getInsights(fields, params);

    return insights;
  }

  async getB2Data(
    account: bizSdk.AdAccount,
    timeRange: TimeRange,
    campaignId: string | null = null
  ): Promise<Cursor> {
    const fields = [
      "campaign_id",
      "campaign_name",
      "date_start",
      "spend",
      "impressions",
      "clicks",
      "cpm",
      "cpc",
      "ctr",
      "frequency",
      "reach",
      "actions",
      "action_values",
      "objective",
    ];

    // Removing publisher_platformer, Add back if required
    const params: InsightParams = {
      time_range: timeRange,
      level: "campaign",
      limit: 1000,
      breakdowns: ["device_platform"],
      action_breakdowns: ["action_type"],
    };

    if (campaignId) {
      params.filtering = [
        {
          field: "campaign.id",
          operator: "IN",
          value: [campaignId],
        },
      ];
    }

    const insights = await account.getInsights(fields, params);

    return insights;
  }

  async getB3Data(
    account: bizSdk.AdAccount,
    timeRange: TimeRange,
    campaignId: string | null = null
  ): Promise<Cursor> {
    const fields = [
      "campaign_id",
      "campaign_name",
      "date_start",
      "spend",
      "impressions",
      "clicks",
      "cpm",
      "cpc",
      "ctr",
      "frequency",
      "reach",
      "actions",
      "action_values",
      "objective",
    ];

    const params: InsightParams = {
      time_range: timeRange,
      level: "campaign",
      limit: 1000,
      breakdowns: ["region"],
      action_breakdowns: ["action_type"],
    };

    if (campaignId) {
      params.filtering = [
        {
          field: "campaign.id",
          operator: "IN",
          value: [campaignId],
        },
      ];
    }

    const insights = await account.getInsights(fields, params);

    return insights;
  }

  async getAdvancedData(
    account: bizSdk.AdAccount,
    timeRange: TimeRange,
    campaignId: string | null = null
  ): Promise<any> {
    const B1InsightsCursor = await this.getB1Data(
      account,
      timeRange,
      campaignId
    );
    const B2InsightsCursor = await this.getB2Data(
      account,
      timeRange,
      campaignId
    );
    const B3InsightsCursor = await this.getB3Data(
      account,
      timeRange,
      campaignId
    );
    const targetingClassificationData =
      await this.getAdSetAudienceClassification(account, campaignId);

    const campaignGroups = new Map<
      string,
      {
        demographics: Map<string, any>;
        devices: Map<string, any>;
        locations: Map<string, any>;
        campaignInfo: any;
        isRetargetingCampaign?: boolean;
        isProspectingCampaign?: boolean;
      }
    >();

    const createSegmentLabel = (ageGroup: string, gender: string): string => {
      if (ageGroup === "Unknown" && gender === "Unknown") return "Unknown";
      if (ageGroup === "Unknown") return gender;
      if (gender === "Unknown") return ageGroup;
      if (gender === "unknown" || gender === "all") return ageGroup + " mixed";
      return `${ageGroup} ${gender}`;
    };

    const safeParseFloat = (value: any): number => {
      const parsed = parseFloat(value || "0");
      return isNaN(parsed) ? 0 : parsed;
    };

    const safeParseInt = (value: any): number => {
      const parsed = parseInt(value || "0");
      return isNaN(parsed) ? 0 : parsed;
    };

    B1InsightsCursor.forEach((insight: any) => {
      const data = insight._data;
      const campaignId = data.campaign_id;
      const adSetId = data.adset_id;

      if (!campaignGroups.has(campaignId)) {
        campaignGroups.set(campaignId, {
          demographics: new Map(),
          devices: new Map(),
          locations: new Map(),
          campaignInfo: {
            campaignName: data.campaign_name,
            objective: this.getObjectiveLabel(data.objective) || "Unknown",
            date: data.date_start || new Date().toISOString().split("T")[0],
          },
          isRetargetingCampaign: false,
          isProspectingCampaign: false,
        });
      }

      const ageGroup = data.age || "Unknown";
      const gender = data.gender || "Unknown";
      const segmentKey = `${ageGroup}|${gender}`;

      const group = campaignGroups.get(campaignId)!;

      const classification = targetingClassificationData.get(adSetId);
      if (classification) {
        if (classification.isRetargeting) {
          group.isRetargetingCampaign = true;
        }
        if (!group.isRetargetingCampaign && classification.isProspecting) {
          group.isProspectingCampaign = true;
        }
      }

      group.demographics.set(segmentKey, {
        ageGroup,
        gender,
        segment: createSegmentLabel(ageGroup, gender),
        spend: safeParseFloat(data.spend),
        purchaseValue: this.extractPurchaseValue(data.action_values || []),
        impressions: safeParseInt(data.impressions),
        clicks: safeParseInt(data.clicks),
        reach: safeParseInt(data.reach),
        addToCart:
          this.getActionCount(data.actions || [], "add_to_cart") ||
          this.getActionCount(
            data.actions || [],
            "offsite_conversion.fb_pixel_add_to_cart"
          ),
        checkoutInit:
          this.getActionCount(data.actions || [], "initiate_checkout") ||
          this.getActionCount(
            data.actions || [],
            "offsite_conversion.fb_pixel_initiate_checkout"
          ),
        purchases:
          this.getActionCount(data.actions || [], "purchase") ||
          this.getActionCount(
            data.actions || [],
            "offsite_conversion.fb_pixel_purchase"
          ),
      });
    });

    B2InsightsCursor.forEach((insight: any) => {
      const data = insight._data;
      const campaignId = data.campaign_id;

      if (!campaignGroups.has(campaignId)) {
        campaignGroups.set(campaignId, {
          demographics: new Map(),
          devices: new Map(),
          locations: new Map(),
          campaignInfo: {
            campaignName: data.campaign_name,
            objective: this.getObjectiveLabel(data.objective) || "Unknown",
            date: data.date_start || new Date().toISOString().split("T")[0],
          },
        });
      }

      const device = data.device_platform || "Unknown";
      const publisher = data.publisher_platform || "Unknown";

      const group = campaignGroups.get(campaignId)!;

      group.devices.set(device, {
        device: this.getDeviceLabel(device),
        publisher,
        audienceType: this.mapPublisherPlatformToAudienceType(publisher),
        spend: safeParseFloat(data.spend),
        purchaseValue: this.extractPurchaseValue(data.action_values || []),
        impressions: safeParseInt(data.impressions),
        clicks: safeParseInt(data.clicks),
        reach: safeParseInt(data.reach),
        addToCart:
          this.getActionCount(data.actions || [], "add_to_cart") ||
          this.getActionCount(
            data.actions || [],
            "offsite_conversion.fb_pixel_add_to_cart"
          ),
        checkoutInit:
          this.getActionCount(data.actions || [], "initiate_checkout") ||
          this.getActionCount(
            data.actions || [],
            "offsite_conversion.fb_pixel_initiate_checkout"
          ),
        purchases:
          this.getActionCount(data.actions || [], "purchase") ||
          this.getActionCount(
            data.actions || [],
            "offsite_conversion.fb_pixel_purchase"
          ),
      });
    });

    B3InsightsCursor.forEach((insight: any) => {
      const data = insight._data;
      const campaignId = data.campaign_id;

      if (!campaignGroups.has(campaignId)) {
        campaignGroups.set(campaignId, {
          demographics: new Map(),
          devices: new Map(),
          locations: new Map(),
          campaignInfo: {
            campaignName: data.campaign_name,
            objective: this.getObjectiveLabel(data.objective) || "Unknown",
            date: data.date_start || new Date().toISOString().split("T")[0],
          },
        });
      }

      const location = data.region || "Unknown";

      const group = campaignGroups.get(campaignId)!;

      group.locations.set(location, {
        location,
        spend: safeParseFloat(data.spend),
        purchaseValue: this.extractPurchaseValue(data.action_values || []),
        impressions: safeParseInt(data.impressions),
        clicks: safeParseInt(data.clicks),
        reach: safeParseInt(data.reach),
        addToCart:
          this.getActionCount(data.actions || [], "add_to_cart") ||
          this.getActionCount(
            data.actions || [],
            "offsite_conversion.fb_pixel_add_to_cart"
          ),
        checkoutInit:
          this.getActionCount(data.actions || [], "initiate_checkout") ||
          this.getActionCount(
            data.actions || [],
            "offsite_conversion.fb_pixel_initiate_checkout"
          ),
        purchases:
          this.getActionCount(data.actions || [], "purchase") ||
          this.getActionCount(
            data.actions || [],
            "offsite_conversion.fb_pixel_purchase"
          ),
      });
    });

    const finalData: AdvancedData[] = [];

    campaignGroups.forEach((group, campaignId) => {
      const {
        demographics,
        devices,
        locations,
        campaignInfo,
        isRetargetingCampaign,
        isProspectingCampaign,
      } = group;

      demographics.forEach((demoData, _demoKey) => {
        devices.forEach((deviceData, _deviceKey) => {
          locations.forEach((locationData, _locationKey) => {
            if (
              demoData.segment === "Unknown" &&
              deviceData.device === "Unknown" &&
              locationData.location === "Unknown"
            ) {
              return;
            }

            const totalSpend =
              demoData.spend + deviceData.spend + locationData.spend;
            const totalImpressions =
              demoData.impressions +
              deviceData.impressions +
              locationData.impressions;
            const totalClicks =
              demoData.clicks + deviceData.clicks + locationData.clicks;
            const totalPurchaseValue =
              demoData.purchaseValue +
              deviceData.purchaseValue +
              locationData.purchaseValue;
            const totalPurchases =
              demoData.purchases +
              deviceData.purchases +
              locationData.purchases;
            const weight = 1 / 3;
            const allocatedSpend = totalSpend * weight;
            const allocatedImpressions = Math.round(totalImpressions * weight);
            const allocatedClicks = Math.round(totalClicks * weight);
            const allocatedPurchaseValue = totalPurchaseValue * weight;
            const allocatedPurchases = Math.round(totalPurchases * weight);

            const ctr =
              allocatedImpressions > 0
                ? (allocatedClicks / allocatedImpressions) * 100
                : 0;
            const cvr =
              allocatedClicks > 0
                ? (allocatedPurchases / allocatedClicks) * 100
                : 0;
            const roas =
              allocatedSpend > 0 ? allocatedPurchaseValue / allocatedSpend : 0;
            const cpm =
              allocatedImpressions > 0
                ? (allocatedSpend * 1000) / allocatedImpressions
                : 0;
            const cpc =
              allocatedClicks > 0 ? allocatedSpend / allocatedClicks : 0;

            const performanceScore = roas * 0.4 + ctr * 0.3 + cvr * 0.3;

            finalData.push({
              date: campaignInfo.date,
              campaignId: campaignId,
              campaignName: campaignInfo.campaignName,
              objective: campaignInfo.objective,
              spend: allocatedSpend,
              purchaseValue: allocatedPurchaseValue,
              impressions: allocatedImpressions,
              clicks: allocatedClicks,
              cpm: cpm,
              cpc: cpc,
              ctr: ctr,
              frequency: 0,
              reach: Math.max(
                demoData.reach,
                deviceData.reach,
                locationData.reach
              ),
              addToCart: Math.round(
                (demoData.addToCart +
                  deviceData.addToCart +
                  locationData.addToCart) *
                weight
              ),
              checkoutInit: Math.round(
                (demoData.checkoutInit +
                  deviceData.checkoutInit +
                  locationData.checkoutInit) *
                weight
              ),
              purchases: allocatedPurchases,
              audienceType: deviceData.audienceType,
              isRetargeting: isRetargetingCampaign!,
              ageGroup: demoData.ageGroup,
              gender: demoData.gender,
              device: deviceData.device,
              location: locationData.location,
              roas: Math.round(roas),
              segment: demoData.segment,
              cvr: cvr,
              performanceScore: performanceScore,
            });
          });
        });
      });
    });

    finalData.sort((a, b) => {
      if (b.performanceScore !== a.performanceScore) {
        return b.performanceScore - a.performanceScore;
      }
      return b.spend - a.spend;
    });

    const serializableCampaignGroups: Record<string, any> = {};
    campaignGroups.forEach((group, campaignId) => {
      serializableCampaignGroups[campaignId] = {
        demographics: Object.fromEntries(group.demographics),
        devices: Object.fromEntries(group.devices),
        locations: Object.fromEntries(group.locations),
        campaignInfo: group.campaignInfo,
        isRetargetingCampaign: group.isRetargetingCampaign,
        isProspectingCampaign: group.isProspectingCampaign,
      };
    });

    return { data: finalData, demographicData: serializableCampaignGroups };
  }

  async getCreativeData(
    account: bizSdk.AdAccount,
    timeRange: TimeRange,
    campaignId: string | null = null
  ): Promise<CreativeData> {
    const baseFields = [
      "campaign_id",
      "campaign_name",
      "ad_id",
      "ad_name",
      "adset_id",
      "adset_name",
      "date_start",
      "spend",
      "impressions",
      "clicks",
      "cpm",
      "cpc",
      "ctr",
      "frequency",
      "reach",
      "actions",
      "action_values",
      "objective",
      "video_avg_time_watched_actions",
      "video_p25_watched_actions",
      "video_p50_watched_actions",
      "video_p75_watched_actions",
      "video_p95_watched_actions",
      "video_p100_watched_actions",
      "video_play_actions",
      "video_play_curve_actions",
      "inline_link_clicks",
      "inline_post_engagement",
      "unique_clicks",
      "cost_per_inline_link_click",
      "cost_per_inline_post_engagement",
      "cost_per_unique_action_type",
      "cost_per_unique_click",
      "cost_per_unique_inline_link_click"
    ];

    const commonParams: InsightParams = {
      time_range: timeRange,
      level: "ad",
      limit: 100,
      action_breakdowns: ["action_type"],
    };

    if (campaignId) {
      commonParams.filtering = [
        {
          field: "campaign.id",
          operator: "IN",
          value: [campaignId],
        },
      ];
    }

    const insights = await account.getInsights(baseFields, commonParams);

    const creativeFields = [
      "account_id",
      "id",
      "name",
      "object_story_spec",
      "thumbnail_url",
      "image_url",
      "image_hash",
      "body",
      "title",
      "link_url",
      "call_to_action_type",
      "object_type",
      "status",
      "effective_object_story_id"
    ];

    const creatives = await account.getAdCreatives(creativeFields, {
      limit: 100,
      level: "creative"
    });

    const creativePerformance: CreativePerformance[] = insights.map((insight: any, index: number) => {
      const data = insight._data;
      const spend = parseFloat(data.spend || "0");
      const purchaseValue = this.extractPurchaseValue(data.action_values || []);
      const roas = spend > 0 ? purchaseValue / spend : 0;
      const ctr = parseFloat(data.ctr || "0");
      const purchases = this.getActionCount(data.actions || [], "purchase");
      const cvr = data.clicks > 0 ? (purchases / data.clicks) * 100 : 0;

      // Find matching creative object
      const creative = creatives[index % creatives.length]?._data;

      // Calculate video completion rate from available data
      const videoCompletionRate = data.video_p100_watched_actions
        ? (parseInt(data.video_p100_watched_actions) /
          (parseInt(data.video_play_actions) || 1) * 100)
        : 0;

      return {
        creativeId: creative?.id,
        creativeName: creative?.name || data.ad_name,
        campaignId: data.campaign_id,
        campaignName: data.campaign_name,
        adsetId: data.adset_id,
        adsetName: data.adset_name,
        adId: data.ad_id,
        adName: data.ad_name,
        date: data.date_start,
        spend,
        purchaseValue,
        roas,
        impressions: parseInt(data.impressions || "0"),
        clicks: parseInt(data.clicks || "0"),
        cpm: parseFloat(data.cpm || "0"),
        cpc: parseFloat(data.cpc || "0"),
        ctr,
        cvr,
        frequency: parseFloat(data.frequency || "0"),
        reach: parseInt(data.reach || "0"),
        objective: this.getObjectiveLabel(data.objective) || "Unknown",
        thumbnailUrl: creative?.thumbnail_url,
        mediaType: creative ? this.determineMediaType(creative) : "unknown",
        headline: creative?.title || data.ad_name,
        body: creative?.body || "",
        linkCaption: "", // Not available directly
        linkDescription: "", // Not available directly
        hasFace: false, // Would need computer vision analysis
        hasText: !!creative?.body, // Simple text detection
        hasLogo: false, // Would need computer vision analysis
        hasProduct: false, // Would need computer vision analysis
        videoDuration: 0, // Not available in standard insights
        videoCompletionRate,
        videoRetentionGraph: this.parseVideoRetention(data.video_play_curve_actions),
        daysSinceCreation: 0, // Would need to compare with created_time
        performanceChange: 0, // Would need historical comparison
        callToAction: creative?.call_to_action_type || "Unknown",
        creativeObject: creative,
        content_angle: creative.content_angle,
        messaging_angle: creative.messaging_angle,
        permalink: '',
        status: '',
      };
    });

    // Process audience interactions from all breakdowns
    const audienceInteractions: AudienceCreativeInteraction[] = [];
    const audienceMap = new Map<string, AudienceCreativeInteraction>();

    // // Process age/gender breakdown
    // ageGenderInsights.forEach((insight: any) => {
    //   const data = insight._data;
    //   const key = `${data.age || "unknown"}|${data.gender || "unknown"}|unknown|unknown`;

    //   if (!audienceMap.has(key)) {
    //     audienceMap.set(key, {
    //       ageGroup: data.age || "unknown",
    //       gender: data.gender || "unknown",
    //       device: "unknown",
    //       location: "unknown",
    //       roas: 0,
    //       ctr: 0,
    //       cvr: 0,
    //       spend: 0,
    //       impressions: 0,
    //       clicks: 0,
    //       purchases: 0,
    //     });
    //   }

    //   const audience = audienceMap.get(key)!;
    //   const spend = parseFloat(data.spend || "0");
    //   const purchaseValue = this.extractPurchaseValue(data.action_values || []);
    //   const purchases = this.getActionCount(data.actions || [], "purchase");

    //   audience.spend += spend;
    //   audience.roas += spend > 0 ? purchaseValue / spend : 0;
    //   audience.impressions += parseInt(data.impressions || "0");
    //   audience.clicks += parseInt(data.clicks || "0");
    //   audience.purchases += purchases;
    // });

    // // Process device breakdown
    // deviceInsights.forEach((insight: any) => {
    //   const data = insight._data;
    //   const key = `unknown|unknown|${data.device_platform || "unknown"}|unknown`;

    //   if (!audienceMap.has(key)) {
    //     audienceMap.set(key, {
    //       ageGroup: "unknown",
    //       gender: "unknown",
    //       device: data.device_platform || "unknown",
    //       location: "unknown",
    //       roas: 0,
    //       ctr: 0,
    //       cvr: 0,
    //       spend: 0,
    //       impressions: 0,
    //       clicks: 0,
    //       purchases: 0,
    //     });
    //   }

    //   const audience = audienceMap.get(key)!;
    //   const spend = parseFloat(data.spend || "0");
    //   const purchaseValue = this.extractPurchaseValue(data.action_values || []);
    //   const purchases = this.getActionCount(data.actions || [], "purchase");

    //   audience.spend += spend;
    //   audience.roas += spend > 0 ? purchaseValue / spend : 0;
    //   audience.impressions += parseInt(data.impressions || "0");
    //   audience.clicks += parseInt(data.clicks || "0");
    //   audience.purchases += purchases;
    // });

    // // Process region breakdown
    // regionInsights.forEach((insight: any) => {
    //   const data = insight._data;
    //   const key = `unknown|unknown|unknown|${data.region || "unknown"}`;

    //   if (!audienceMap.has(key)) {
    //     audienceMap.set(key, {
    //       ageGroup: "unknown",
    //       gender: "unknown",
    //       device: "unknown",
    //       location: data.region || "unknown",
    //       roas: 0,
    //       ctr: 0,
    //       cvr: 0,
    //       spend: 0,
    //       impressions: 0,
    //       clicks: 0,
    //       purchases: 0,
    //     });
    //   }

    //   const audience = audienceMap.get(key)!;
    //   const spend = parseFloat(data.spend || "0");
    //   const purchaseValue = this.extractPurchaseValue(data.action_values || []);
    //   const purchases = this.getActionCount(data.actions || [], "purchase");

    //   audience.spend += spend;
    //   audience.roas += spend > 0 ? purchaseValue / spend : 0;
    //   audience.impressions += parseInt(data.impressions || "0");
    //   audience.clicks += parseInt(data.clicks || "0");
    //   audience.purchases += purchases;
    // });

    // Calculate averages and prepare final audience interactions
    audienceMap.forEach((audience) => {
      audience.ctr = audience.impressions > 0
        ? (audience.clicks / audience.impressions) * 100
        : 0;
      audience.cvr = audience.clicks > 0
        ? (audience.purchases / audience.clicks) * 100
        : 0;
      audience.roas = audience.spend > 0
        ? (audience.roas * audience.spend) / audience.spend
        : 0; // Weighted average

      // Only include segments with meaningful data
      if (audience.spend > 0) {
        audienceInteractions.push(audience);
      }
    });

    return {
      creatives: creativePerformance,
      audienceInteractions,
      summary: {
        totalCreatives: creativePerformance.length,
        dateRange: `${timeRange.since} to ${timeRange.until}`,
      },
    };
  }

  async getTotalMetrics(
    timeRange: TimeRange,
    campaignId: string | null = null
  ): Promise<TotalMetrics> {
    if (!this.adAccountId) {
      throw new Error("Ad Account ID is required");
    }

    const account = new bizSdk.AdAccount(`act_${this.adAccountId}`);
    const fields = [
      "impressions",
      "clicks",
      "actions",
      "action_values",
    ];

    const params: InsightParams = {
      time_range: timeRange,
      level: "campaign",
      limit: 1000,
    };

    if (campaignId) {
      params.filtering = [
        {
          field: "campaign.id",
          operator: "IN",
          value: [campaignId],
        },
      ];
    }

    try {
      const insights = await account.getInsights(fields, params);
      let totalImpressions = 0;
      let totalClicks = 0;
      let totalAddToCart = 0;
      let totalCheckout = 0;
      let totalPurchases = 0;

      insights.forEach((insight: any) => {
        const data = insight._data;
        totalImpressions += parseInt(data.impressions || "0");
        totalClicks += parseInt(data.clicks || "0");
        
        const actions = data.actions || [];
        totalAddToCart += this.getActionCount(actions, "add_to_cart") + 
                          this.getActionCount(actions, "offsite_conversion.fb_pixel_add_to_cart");
        totalCheckout += this.getActionCount(actions, "initiate_checkout") + 
                        this.getActionCount(actions, "offsite_conversion.fb_pixel_initiate_checkout");
        totalPurchases += this.getActionCount(actions, "purchase") + 
                          this.getActionCount(actions, "offsite_conversion.fb_pixel_purchase");
      });

      return {
        total_impressions: totalImpressions,
        total_clicks: totalClicks,
        total_addtocart: totalAddToCart,
        total_checkout: totalCheckout,
        total_purchases: totalPurchases,
      };
    } catch (error) {
      throw new Error(`Failed to fetch total metrics: ${(error as Error).message}`);
    }
  }

  async getPlatformSpendSalesData(
    timeRange: TimeRange,
    campaignId: string | null = null
  ): Promise<PlatformSpendSalesType> {
    if (!this.adAccountId) {
      throw new Error("Ad Account ID is required");
    }

    const account = new bizSdk.AdAccount(`act_${this.adAccountId}`);
    
    const fields = [
      "spend",
      "impressions",
      "clicks",
      "actions",
      "action_values",
    ];

    const params: InsightParams = {
      time_range: timeRange,
      level: "campaign",
      breakdowns: ["publisher_platform"],
      time_increment: "all_days",
      limit: 1000,
    };

    if (campaignId) {
      params.filtering = [
        {
          field: "campaign.id",
          operator: "IN",
          value: [campaignId],
        },
      ];
    }

    try {
      const insights = await account.getInsights(fields, params);
      const platformMap = new Map<string, {
        spend: number;
        sales: number;
        impressions: number;
        clicks: number;
      }>();

      // Process insights to aggregate by platform
      insights.forEach((insight: any) => {
        const data = insight._data;
        // Skip if publisher_platform is null or undefined
        if (!data.publisher_platform) {
          return;
        }
        
        const platform = data.publisher_platform;
        const spend = parseFloat(data.spend || "0");
        const sales = this.extractPurchaseValue(data.action_values || []);
        const impressions = parseInt(data.impressions || "0");
        const clicks = parseInt(data.clicks || "0");

        if (!platformMap.has(platform)) {
          platformMap.set(platform, {
            spend: 0,
            sales: 0,
            impressions: 0,
            clicks: 0,
          });
        }

        const platformData = platformMap.get(platform)!;
        platformData.spend += spend;
        platformData.sales += sales;
        platformData.impressions += impressions;
        platformData.clicks += clicks;
      });

      // Convert to array and calculate ROAS
      const platformData = Array.from(platformMap.entries())
        .map(([platform, data]) => ({
          platform: this._formatPlatformName(platform),
          spend: data.spend,
          sales: data.sales,
          roas: data.spend > 0 ? data.sales / data.spend : 0,
          impressions: data.impressions,
          clicks: data.clicks,
        }))
        .sort((a, b) => b.spend - a.spend); // Sort by spend descending

      return {
        platformData,
        dateRange: `${timeRange.since} to ${timeRange.until}`,
      };

    } catch (error) {
      throw new Error(`Failed to fetch platform spend data: ${(error as Error).message}`);
    }
  }

  async getPlacementSpendSales(
    timeRange: TimeRange,
    campaignId: string | null = null
  ): Promise<PlacementSpentSalesType> {
    if (!this.adAccountId) {
      throw new Error("Ad Account ID is required");
    }

    const account = new bizSdk.AdAccount(`act_${this.adAccountId}`);
    
    const fields = [
      "spend",
      "impressions",
      "clicks",
      "actions",
      "action_values",
    ];

    const params: InsightParams = {
      time_range: timeRange,
      level: "campaign",
      breakdowns: ["publisher_platform", "platform_position"],
      time_increment: "all_days",
      limit: 1000,
    };

    if (campaignId) {
      params.filtering = [
        {
          field: "campaign.id",
          operator: "IN",
          value: [campaignId],
        },
      ];
    }

    try {
      const insights = await account.getInsights(fields, params);
      const placementMap = new Map<string, {
        spend: number;
        sales: number;
        impressions: number;
        clicks: number;
      }>();

      // Process insights to aggregate by platform and placement
      insights.forEach((insight: any) => {
        const data = insight._data;
        const platform = data.publisher_platform || 'unknown';
        const placement = data.platform_position || 'unknown';
        const key = `${platform}|${placement}`;
        
        const spend = parseFloat(data.spend || "0");
        const sales = this.extractPurchaseValue(data.action_values || []);
        const impressions = parseInt(data.impressions || "0");
        const clicks = parseInt(data.clicks || "0");

        if (!placementMap.has(key)) {
          placementMap.set(key, {
            spend: 0,
            sales: 0,
            impressions: 0,
            clicks: 0,
          });
        }

        const placementData = placementMap.get(key)!;
        placementData.spend += spend;
        placementData.sales += sales;
        placementData.impressions += impressions;
        placementData.clicks += clicks;
      });

      // Convert to array and format platform/placement names
      const placementData = Array.from(placementMap.entries())
        .map(([key, data]) => {
          const [platform, placement] = key.split('|');
          return {
            platform: this._formatPlatformName(platform),
            placement: this._formatPlacementName(placement),
            spend: data.spend,
            sales: data.sales,
            roas: data.spend > 0 ? data.sales / data.spend : 0,
            impressions: data.impressions,
            clicks: data.clicks,
          };
        })
        .sort((a, b) => b.spend - a.spend); // Sort by spend descending

      return {
        placementData,
        dateRange: `${timeRange.since} to ${timeRange.until}`,
      };

    } catch (error) {
      throw new Error(`Failed to fetch placement spend data: ${(error as Error).message}`);
    }
  }


  async getPlacementDeviceData(
    timeRange: TimeRange,
    campaignId: string | null = null
  ): Promise<PlacementDeviceType> {
    if (!this.adAccountId) {
      throw new Error("Ad Account ID is required");
    }

    const account = new bizSdk.AdAccount(`act_${this.adAccountId}`);
    
    const fields = [
      "spend",
      "impressions",
      "clicks",
      "actions",
      "action_values",
    ];

    const params: InsightParams = {
      time_range: timeRange,
      level: "campaign",
      breakdowns: ["publisher_platform", "impression_device"],
      time_increment: "all_days",
      limit: 1000,
    };

    if (campaignId) {
      params.filtering = [
        {
          field: "campaign.id",
          operator: "IN",
          value: [campaignId],
        },
      ];
    }

    try {
      const insights = await account.getInsights(fields, params);
      const placementDeviceMap = new Map<string, {
        spend: number;
        sales: number;
        impressions: number;
        clicks: number;
      }>();

      // Process insights to aggregate by platform and device
      insights.forEach((insight: any) => {
        const data = insight._data;
        const platform = data.publisher_platform || 'unknown';
        const device = data.impression_device || 'unknown';
        const key = `${platform}|${device}`;
        
        const spend = parseFloat(data.spend || "0");
        const sales = this.extractPurchaseValue(data.action_values || []);
        const impressions = parseInt(data.impressions || "0");
        const clicks = parseInt(data.clicks || "0");

        if (!placementDeviceMap.has(key)) {
          placementDeviceMap.set(key, {
            spend: 0,
            sales: 0,
            impressions: 0,
            clicks: 0,
          });
        }

        const placementDeviceData = placementDeviceMap.get(key)!;
        placementDeviceData.spend += spend;
        placementDeviceData.sales += sales;
        placementDeviceData.impressions += impressions;
        placementDeviceData.clicks += clicks;
      });

      // Convert to array and format platform/device names
      const placementDeviceData = Array.from(placementDeviceMap.entries())
        .map(([key, data]) => {
          const [platform, device] = key.split('|');
          return {
            platform: this._formatPlatformName(platform),
            device: this._formatDeviceName(device),
            spend: data.spend,
            sales: data.sales,
            roas: data.spend > 0 ? data.sales / data.spend : 0,
            impressions: data.impressions,
            clicks: data.clicks,
          };
        })
        .sort((a, b) => b.spend - a.spend); // Sort by spend descending

      return {
        placementData: placementDeviceData,
        dateRange: `${timeRange.since} to ${timeRange.until}`,
      };

    } catch (error) {
      throw new Error(`Failed to fetch placement/device data: ${(error as Error).message}`);
    }
  }

  private _formatDeviceName(device: string): string {
    const deviceNames: Record<string, string> = {
      'android_smartphone': 'Android Phone',
      'android_tablet': 'Android Tablet',
      'ipad': 'iPad',
      'iphone': 'iPhone',
      'desktop': 'Desktop',
      'feature_phone': 'Feature Phone',
      'unknown': 'Unknown Device',
    };

    // Return the mapped name if it exists
    if (deviceNames[device]) {
      return deviceNames[device];
    }

    // Otherwise, format the device name by:
    // 1. Replacing underscores with spaces
    // 2. Capitalizing each word
    return device.replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private _formatPlacementName(placement: string): string {
    const placementNames: Record<string, string> = {
      'feed': 'Feed',
      'right_hand_column': 'Right Column',
      'marketplace': 'Marketplace',
      'video_feeds': 'Video Feeds',
      'search': 'Search',
      'instream_video': 'In-Stream Video',
      'instagram_profile': 'Instagram Profile',
      'instagram_explore': 'Instagram Explore',
      'instagram_stories': 'Instagram Stories',
      'instagram_reels': 'Instagram Reels',
      'messenger_inbox': 'Messenger Inbox',
      'messenger_stories': 'Messenger Stories',
      'messenger_Sponsored_messages': 'Messenger Sponsored Messages',
      'audience_network_instream_video': 'Audience Network In-Stream Video',
      'audience_network_rewarded_video': 'Audience Network Rewarded Video',
      'audience_network_banner': 'Audience Network Banner',
      'audience_network_interstitial': 'Audience Network Interstitial',
      'audience_network_native': 'Audience Network Native',
      'whatsapp_status': 'WhatsApp Status',
    };

    // Return the mapped name if it exists
    if (placementNames[placement]) {
      return placementNames[placement];
    }

    // Otherwise, format the placement name by:
    // 1. Replacing underscores with spaces
    // 2. Capitalizing each word
    return placement.replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private _formatPlatformName(platform: string): string {
    const platformNames: Record<string, string> = {
      'facebook': 'Facebook',
      'instagram': 'Instagram',
      'messenger': 'Messenger',
      'audience_network': 'Audience Network',
      'whatsapp': 'WhatsApp',
      'meta_quest': 'Meta Quest',
    };

    // Return the mapped name if it exists
    if (platformNames[platform]) {
      return platformNames[platform];
    }

    // Otherwise, format the platform name by:
    // 1. Replacing underscores with spaces
    // 2. Capitalizing each word
    return platform.replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private objectiveLabels: { [key: string]: string } = {
    OUTCOME_AWARENESS: "Branding",
    OUTCOME_TRAFFIC: "Engagement",
    OUTCOME_ENGAGEMENT: "Engagement",
    OUTCOME_LEADS: "Lead Gen",
    OUTCOME_APP_PROMOTION: "Sales",
    OUTCOME_SALES: "Sales",
  };

  private getObjectiveLabel(objectiveApiValue: string): string {
    return this.objectiveLabels[objectiveApiValue] || objectiveApiValue;
  }

  private getActionCount(actionsArray: Action[], actionType: string): number {
    const action = actionsArray.find(
      (a: Action) => a.action_type === actionType
    );
    return action ? parseInt(action.value || "0") : 0;
  }

  private mapPublisherPlatformToAudienceType(platform: string): string {
    switch (platform) {
      case "facebook":
        return "Facebook Audience";
      case "instagram":
        return "Instagram Audience";
      case "audience_network":
        return "Audience Network";
      case "messenger":
        return "Messenger Audience";
      default:
        return "Other";
    }
  }

  private getDeviceLabel(device: string): string {
    switch (device) {
      case "desktop":
        return "desktop";
      case "mobile_app":
        return "mobile";
      case "mobile_web":
        return "mobile";
      default:
        return "Other";
    }
  }

  private extractPurchaseValue(actionValues: ActionValue[]): number {
    for (const actionValue of actionValues) {
      if (actionValue.action_type === "purchase") {
        return parseFloat(actionValue.value || "0");
      }
    }
    return 0;
  }

  private determineMediaType(creative: any): "unknown" | "image" | "video" | "carousel" {
    if (!creative) return "unknown";

    if (creative.object_story_spec?.video_data) {
      return "video";
    }
    if (creative.object_story_spec?.link_data) {
      return creative.object_story_spec.link_data.child_attachments
        ? "carousel"
        : "image";
    }
    if (creative.image_url || creative.image_hash) {
      return "image";
    }
    if (creative.video_id) {
      return "video";
    }

    return "unknown";
  }

  private parseVideoRetention(curveData: any): number[] {
    if (!curveData) return [];

    if (Array.isArray(curveData) && curveData.every(item => typeof item === 'number')) {
      return curveData;
    }

    if (typeof curveData === 'string') {
      return curveData.split(',').map(point => {
        const [seconds, percentage] = point.split(':');
        return parseFloat(percentage);
      });
    }

    if (curveData.action_type === 'video_view' && Array.isArray(curveData.value)) {
      return curveData.value;
    }

    if (curveData[0].action_type === 'video_view' && Array.isArray(curveData[0].value)) {
      return curveData[0].value;
    }

    // console.warn('Unknown video retention format:', curveData);
    return [];
  }

  // private sanitizeCreativeObject(creative: any): SanitizedCreativeObject {
  //   const sanitized: SanitizedCreativeObject = {
  //     id: creative.id,
  //     name: creative.name,
  //     status: creative.status,
  //     created_time: creative.created_time,
  //     updated_time: creative.updated_time,
  //     thumbnail_url: creative.thumbnail_url,
  //     media_type: this.determineMediaType(creative),
  //     call_to_action: creative.call_to_action_type,
  //     object_type: creative.object_type,
  //   };

  //   // Handle object_story_spec if present
  //   if (creative.object_story_spec) {
  //     sanitized.object_story_spec = {
  //       page_id: creative.object_story_spec.page_id,
  //     };

  //     if (creative.object_story_spec.link_data) {
  //       sanitized.object_story_spec.link_data = {
  //         link: creative.object_story_spec.link_data.link,
  //         message: creative.object_story_spec.link_data.message,
  //         caption: creative.object_story_spec.link_data.caption,
  //         description: creative.object_story_spec.link_data.description,
  //       };

  //       if (creative.object_story_spec.link_data.child_attachments) {
  //         sanitized.object_story_spec.link_data.child_attachments =
  //           creative.object_story_spec.link_data.child_attachments.map((child: any) => ({
  //             link: child.link,
  //             name: child.name,
  //             description: child.description,
  //             picture: child.picture,
  //           }));
  //       }
  //     }

  //     if (creative.object_story_spec.video_data) {
  //       sanitized.object_story_spec.video_data = {
  //         video_id: creative.object_story_spec.video_data.video_id,
  //         title: creative.object_story_spec.video_data.title,
  //         message: creative.object_story_spec.video_data.message,
  //       };
  //     }
  //   }

  //   // Add direct creative fields
  //   const optionalFields = [
  //     'image_url', 'image_hash', 'body', 'title', 'link_url',
  //     'effective_object_story_id', 'product_set_id', 'instagram_actor_id',
  //     'instagram_permalink_url', 'video_id', 'asset_feed_spec', 'url_tags',
  //     'interactive_components_spec'
  //   ];

  //   for (const field of optionalFields) {
  //     if (creative[field] !== undefined) {
  //       (sanitized as any)[field] = creative[field];
  //     }
  //   }

  //   // Special handling for video retention data
  //   if (creative.video_retention_data) {
  //     sanitized.video_retention_data = this.sanitizeVideoRetentionData(
  //       creative.video_retention_data
  //     );
  //   }

  //   return sanitized;
  // }

  // private sanitizeVideoRetentionData(data: any): any {
  //   if (!data) return null;

  //   return {
  //     retention_curve: data.retention_curve?.map((point: any) => ({
  //       time_point: point.time_point,
  //       percentage: point.percentage,
  //     })),
  //     quartile_retention: {
  //       q1: data.quartile_retention?.q1,
  //       q2: data.quartile_retention?.q2,
  //       q3: data.quartile_retention?.q3,
  //     },
  //     average_retention: data.average_retention,
  //   };
  // }
}

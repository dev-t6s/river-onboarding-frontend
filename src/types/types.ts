export interface CampaignData {
    campaignId: string;
    campaignName: string;
    objective: string;
    date: string;
    spend: number;
    purchaseValue: number;
    impressions: number;
    clicks: number;
    addToCart: number;
    checkoutInit: number;
    purchases: number;
    audienceType: string;
    isRetargeting: boolean;
    ageGroup: string;
    gender: string;
    device: string;
    city: string;
}

export interface DailyData {
    date: string;
    spend: number;
    purchaseValue: number;
    impressions: number;
    clicks: number;
    roas: number;
    ctr: number;
}

export interface CampaignSummary {
    campaignId: string;
    campaignName: string;
    objective: string;
    spend: number;
    purchaseValue: number;
    impressions: number;
    clicks: number;
    roas: number;
    ctr: number;
    cpm: number;
    cpc: number;
    isRetargeting: boolean;
}

export interface SpendByObjectiveType {
    objective: string;
    spend: number;
    percentage: number;
}

export interface AudienceAnalysisType {
    ageGroup: string;
    gender: string;
    city: string;
    device: string;
    audienceType: string;
    spend: number;
    revenue: number;
    impressions: number;
    clicks: number;
    purchases: number;
    roas: number;
    ctr: number;
    cvr: number;
}

export interface FunnelData {
    name: string;
    value: number;
    fill: string;
}

export interface RetargetingAnalysisType {
    type: string;
    spend: number;
    revenue: number;
    roas: number;
}

export interface RetentionMetrics {
    period: string;
    retentionRate: number;
    users: number;
}

export interface KPIs {
    totalSpend: number;
    totalRevenue: number;
    totalRoas: number;
    totalCtr: number;
    totalImpressions: number;
    totalClicks: number;
    avgCpm: number;
    avgCpc: number;
}

export interface ProcessedData {
    dailyData?: DailyData[];
    campaignSummary: CampaignSummary[];
    spendByObjective: SpendByObjectiveType[];
    audienceAnalysis: AudienceAnalysisType[];
    deviceAnalysis: DeviceAnalysisType[];
    locationAnalysis: LocationAnalysisType[];
    retargetingAnalysis: RetargetingAnalysisType[];
    retentionMetrics: RetentionMetrics[];
}

export interface TableAudienceSegment {
    ageGroup: string;
    gender: string;
    cities: string[];
    spend: number;
    revenue: number;
    impressions: number;
    clicks: number;
    purchases: number;
    roas: number;
    ctr: number;
    cvr: number;
    performanceScore: number;
}

export interface TableDeviceSegment {
    device: string;
    spend: number;
    revenue: number;
    impressions: number;
    clicks: number;
    purchases: number;
    roas: number;
    ctr: number;
    cvr: number;
    performanceScore: number;
}

export interface DeviceAnalysisType {
    device: string;
    spend: number;
    revenue: number;
    impressions: number;
    clicks: number;
    purchases: number;
    roas: number;
    ctr: number;
    cvr: number;
}

export interface LocationAnalysisType {
    location: string;
    spend: number;
    revenue: number;
    impressions: number;
    clicks: number;
    purchases: number;
    roas: number;
    ctr: number;
    cvr: number;
}

export interface AdvancedData {
    data: Array<{
        campaignId: string;
        objective: string;
        isRetargeting: boolean;
        spend: number;
        purchaseValue: number;
        impressions: number;
        clicks: number;
    }>;
    demographicData: {
        [campaignId: string]: CampaignDemographicData;
    };
}

export interface CampaignDataItem {
    campaignId: string;
    campaignName: string;
    date: string;
    spend: number;
    purchaseValue: number;
    impressions: number;
    clicks: number;
    roas: number;
    cpm: number;
    cpc: number;
    ctr: number;
    frequency: number;
    reach: number;
}

export interface DemographicMetrics {
    spend: number;
    purchaseValue: number;
    impressions: number;
    clicks: number;
    purchases: number;
}

export interface LocationData {
    [location: string]: DemographicMetrics;
}

export interface DemographicData {
    [key: string]: {
        spend: number;
        purchaseValue: number;
        impressions: number;
        clicks: number;
        purchases: number;
    };
}

export interface DeviceData {
    [device: string]: DemographicMetrics;
}

export interface CampaignDemographicData {
    campaignId: string;
    isRetargetingCampaign: boolean;
    demographics?: DemographicData;
    locations?: LocationData;
    devices?: DeviceData;
}

export interface DateRange {
  since: string; // Format: YYYY-MM-DD
  until: string; // Format: YYYY-MM-DD
}
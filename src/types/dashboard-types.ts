import { AdData, AdsetData, CampaignData } from "./meta-ads";

export interface AdAccount {
  id: string;
  name: string;
  currency: string;
}

export interface CampaignSummary {
  campaignId: string;
  campaignName: string;
  spend: number;
  purchaseValue: number;
  impressions: number;
  clicks: number;
  roas: number;
  ctr: number;
  cpm: number;
  cpc: number;
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

export interface ConsolidatedData {
  summary: {
    campaignRecords: number;
    adsetRecords: number;
    adRecords: number;
    dateRange: string;
  };
  campaignData: CampaignData[];
  adsetData: AdsetData[];
  adsData: AdData[];
}

export interface MetricCardProps {
  title: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
  trend?: number;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
}

export interface CampaignDataItem {
  date: string;
  spend: number;
  purchaseValue: number;
  impressions: number;
  clicks: number;
  campaignId: string;
  campaignName: string;
}

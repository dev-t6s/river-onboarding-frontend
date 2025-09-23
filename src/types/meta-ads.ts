/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AdAccount {
  id: string;
  name: string;
  status: number;
  currency: string;
}

export interface TimeRange {
  since: string;
  until: string;
}

export interface ActionValue {
  action_type: string;
  value: string;
}

export interface CampaignData {
  date: string;
  campaignId: string;
  campaignName: string;
  spend: number;
  purchaseValue: number;
  roas: number;
  impressions: number;
  clicks: number;
  cpm: number;
  cpc: number;
  ctr: number;
  frequency: number;
  reach: number;
}

export interface AdsetData extends CampaignData {
  adsetId: string;
  adsetName: string;
}

export interface AdData extends AdsetData {
  adId: string;
  adName: string;
}

export interface DataSummary {
  campaignRecords: number;
  adsetRecords: number;
  adRecords: number;
  dateRange: string;
}

export interface ConsolidatedData {
  summary: DataSummary;
  campaignData: CampaignData[];
  adsetData: AdsetData[];
  adsData: AdData[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiDataResponse<T> extends ApiResponse<T> {
  summary?: {
    records: number;
    dateRange: string;
  };
}

export interface Action {
  action_type: string;
  value: string;
}

export interface ActionValue {
  action_type: string;
  value: string;
}

export interface InsightParams {
  time_range?: TimeRange;
  level?: "campaign" | "adset" | "ad";
  time_increment?: any;
  limit?: number;
  breakdowns?: string[];
  attribution_window?: string;
  action_breakdowns?: string[];
  filtering?: Array<{
    field: string;
    operator: string;
    value: string[];
  }>;
}

export interface AdvancedData {
  date: string;
  campaignId: string;
  campaignName: string;
  objective: string;
  spend: number;
  purchaseValue: number;
  roas: number;
  impressions: number;
  clicks: number;
  addToCart: number;
  checkoutInit: number;
  purchases: number;
  cpm: number;
  cpc: number;
  ctr: number;
  frequency: number;
  reach: number;
  audienceType: string;
  isRetargeting: boolean;
  ageGroup: string;
  gender: string;
  device: string;
  location: string;
  segment: string;
  cvr: number;
  performanceScore: number;
}

export interface CreativePerformance {
  creativeId: string;
  creativeName: string;
  campaignId: string;
  campaignName: string;
  adsetId: string;
  adsetName: string;
  adId: string;
  adName: string;
  date: string;
  spend: number;
  purchaseValue: number;
  roas: number;
  impressions: number;
  clicks: number;
  cpm: number;
  cpc: number;
  ctr: number;
  cvr: number;
  frequency: number;
  reach: number;
  objective: string;
  thumbnailUrl?: string;
  mediaType: 'image' | 'video' | 'carousel' | 'unknown';
  headline: string;
  body: string;
  linkCaption: string;
  linkDescription: string;
  hasFace: boolean;
  hasText: boolean;
  hasLogo: boolean;
  hasProduct: boolean;
  videoDuration?: number;
  videoCompletionRate?: number;
  videoRetentionGraph?: number[];
  daysSinceCreation: number;
  performanceChange: number;
  callToAction: string;
  creativeObject?: CreativeObject;
  content_angle: string;
  messaging_angle: string;
  permalink: string;
  status: string;
}

export interface CreativeModalPerformance {
  creativeId: string;
  creativeName: string;
  campaignId: string;
  campaignName: string;
  adsetId: string;
  adsetName: string;
  adId: string;
  adName: string;
  date: string;
  spend: number;
  purchaseValue: number;
  roas: number;
  impressions: number;
  clicks: number;
  cpm: number;
  cpc: number;
  ctr: number;
  cvr: number;
  frequency: number;
  reach: number;
  objective: string;
  thumbnailUrl?: string;
  mediaType: 'image' | 'video' | 'carousel' | 'unknown';
  headline: string;
  body: string;
  linkCaption: string;
  linkDescription: string;
  hasFace: boolean;
  hasText: boolean;
  hasLogo: boolean;
  hasProduct: boolean;
  videoDuration?: number;
  videoCompletionRate?: number;
  videoRetentionGraph?: number[];
  daysSinceCreation: number;
  performanceChange: number;
  callToAction: string;
  creativeObject?: CreativeObject;
  content_angle: string;
  messaging_angle: string;
  permalink: string;
  status: string;
}

export interface CreativeObject {
  id: string;
  name: string;
  status: string;
  created_time?: string;
  updated_time?: string;
  thumbnail_url?: string;
  media_type: 'image' | 'video' | 'carousel' | 'unknown';
  call_to_action?: string;
  object_type?: string;
  // Add other relevant fields from the creative object
}

export interface AudienceCreativeInteraction {
  ageGroup: string;
  gender: string;
  device: string;
  location: string;
  roas: number;
  ctr: number;
  cvr: number;
  spend: number;
  impressions: number;
  clicks: number;
  purchases: number;
}

export interface AudiencePerformanceSummary {
  ageGroup?: string;
  gender?: string;
  device?: string;
  location?: string;
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalPurchases: number;
  avgRoas: number;
  avgCtr: number;
  avgCvr: number;
}

export interface VideoPerformanceData {
  creativeId: string;
  duration?: number | undefined; // Allow undefined
  completionRate?: number | undefined; // Allow undefined
  dropOffPoints?: number[] | undefined; // Allow undefined
}


export interface ThumbnailPerformance {
  thumbnailUrl: string;
  ctr: number;
  impressions: number;
}

export interface VideoRetentionPoint {
  timePoint: number; // in seconds
  percentage: number; // 0-100
}

export interface TextElementPerformance {
  elementType: 'headline' | 'body' | 'caption' | 'description' | 'cta';
  text: string;
  count: number;
  avgRoas: number;
  avgCtr: number;
  avgCvr: number;
}

export interface WordCloudItem {
  text: string;
  value: number;
  color?: string;
}

export interface TextLengthAnalysis {
  lengthRange: string;
  count: number;
  avgRoas: number;
  avgCtr: number;
}

export interface CreativeRecommendation {
  id: string;
  type: 'refresh' | 'scale' | 'optimize' | 'pause';
  priority: 'high' | 'medium' | 'low';
  creativeId: string | null;
  message: string;
  expectedImpact: string;
  suggestedActions: string[];
}

export interface CreativeData {
  creatives: CreativeModalPerformance[];
  audienceInteractions: AudienceCreativeInteraction[];
  summary: {
    totalCreatives: number;
    dateRange: string;
    overallScore?: number;
    fatigueIndex?: number;
  };
  videoPerformance?: VideoPerformanceData[];
  textAnalysis?: TextElementPerformance[];
  recommendations?: CreativeRecommendation[];
}

export interface RawCreativeInsight {
  [key: string]: any;
}

export interface CreativeCardItem {
  id: string;
  thumbnailUrl: string;
  mediaType: 'image' | 'video' | 'carousel';
  headline: string;
  roas: number;
  ctr: number;
  cvr: number;
  spend: number;
  impressions: number;
  performanceChange: number;
  isSelected?: boolean;
  isComparing?: boolean;
}

export interface CreativeComparison {
  creativeA: CreativePerformance;
  creativeB: CreativePerformance;
  winningCreative?: 'A' | 'B' | null;
  confidence?: number;
  metricComparisons: {
    roas: { a: number; b: number; difference: number };
    ctr: { a: number; b: number; difference: number };
    cvr: { a: number; b: number; difference: number };
    spend: { a: number; b: number; difference: number };
  };
}

export interface CreativeFatigueAnalysis {
  creativeId: string;
  daysActive: number;
  performanceChange: number;
  impressionFrequency: number;
  fatigueScore: number;
  recommendation: 'refresh' | 'maintain' | 'scale';
}

export interface CreativeKPIs {
  creativeScore: number;
  creativeFatiguePercent: number;
  topCreative: {
    creativeId: string;
    thumbnailUrl?: string;
    roas: number;
    ctr: number;
    cvr: number;
  };
  fatigueIndex: number;
  activeCreatives: number;
  newCreatives: number;
  avgRoas: number;
  avgCtr: number;
  avgCvr: number;
}

export interface SanitizedCreativeObject {
  id: string;
  name: string;
  status: string;
  created_time?: string;
  updated_time?: string;
  thumbnail_url?: string;
  media_type: 'image' | 'video' | 'carousel' | 'unknown';
  call_to_action?: string;
  object_type?: string;
  object_story_spec?: {
    page_id?: string;
    link_data?: {
      link?: string;
      message?: string;
      caption?: string;
      description?: string;
      child_attachments?: Array<{
        link?: string;
        name?: string;
        description?: string;
        picture?: string;
      }>;
    };
    video_data?: {
      video_id?: string;
      title?: string;
      message?: string;
    };
  };
  image_url?: string;
  image_hash?: string;
  body?: string;
  title?: string;
  link_url?: string;
  effective_object_story_id?: string;
  product_set_id?: string;
  instagram_actor_id?: string;
  instagram_permalink_url?: string;
  video_id?: string;
  asset_feed_spec?: any;
  url_tags?: string;
  interactive_components_spec?: any;
}

export type TotalMetrics = {
  total_impressions: number;
  total_clicks: number;
  total_addtocart: number;
  total_checkout: number;
  total_purchases: number;
};

export type PlatformSpendSalesType = {
  platformData: {
    platform: string;
    spend: number;
    sales: number;
    roas: number;
    impressions: number;
    clicks: number;
  }[];
  dateRange: string;
}

export type PlacementSpentSalesType =  {
  placementData: Array<{
    platform: string;
    placement: string;
    spend: number;
    sales: number;
    roas: number;
    impressions: number;
    clicks: number;
  }>;
  dateRange: string;
}

export type PlacementDeviceType =  {
  placementData: Array<{
    platform: string;
    device: string;
    spend: number;
    sales: number;
    roas: number;
    impressions: number;
    clicks: number;
  }>;
  dateRange: string;
}

interface DemographicFormat {
  age_group: string;
  gender: string;
  total_spend: number;
  total_purchase_value: number;
  impressions: number;
  clicks: number;
  avg_roas: number;
  avg_cpc: number;
  avg_ctr: number;
  avg_cvr: number;
  avg_cpm: number;
  avg_frequency: number;
  reach: number;
  is_fatigued: boolean;
}

interface LocationFormat {
  location: string;
  impressions: number;
  clicks: number;
  avg_ctr: number;
  avg_frequency: number;
  reach: number;
  is_fatigued: boolean;
}

interface MediaFormat {
  mediaType: string;
  n_ads: number;
  total_spend: number;
  total_purchase_value: number;
  impressions: number;
  clicks: number;
  avg_roas: number;
  avg_cpc: number;
  avg_ctr: number;
  avg_cvr: number;
  avg_cpm: number;
  avg_frequency: number;
  reach: number;
  is_fatigued: boolean;
}

interface ContentAngle {
  content_angle: string;
  n_ads: number;
  total_spend: number;
  total_purchase_value: number;
  impressions: number;
  clicks: number;
  avg_roas: number;
  avg_cpc: number;
  avg_ctr: number;
  avg_cvr: number;
  avg_cpm: number;
  avg_frequency: number;
  reach: number;
  is_fatigued: boolean;
}

interface MessagingAngle {
  messaging_angle: string;
  n_ads: number;
  total_spend: number;
  total_purchase_value: number;
  impressions: number;
  clicks: number;
  avg_roas: number;
  avg_cpc: number;
  avg_ctr: number;
  avg_cvr: number;
  avg_cpm: number;
  avg_frequency: number;
  reach: number;
  is_fatigued: boolean;
}

export interface VideoFormat {
  ad_name: string;
  video_duration: number;
  avg_watch_time: number;
  video_completion_rate: number;
  thumbstop_ratio: number;
  roas: number;
  ctr: number;
  cvr: number;
  cpc: number;
  frequency: number;
  is_fatigued: boolean;
  impressions: number;
  clicks: number;
  reach: number;
  content_angle: string;
  messaging_angle: string;
}

export interface CompletionRateHistItem {
  bucket_position: string;
  avg_completion_rate: number;
}

export interface DropOffItem {
  duration: number;
  avg_drop_off_rate: number;
}

export interface VideoItem {
  thumbnailUrl: string;
  permalink: string;
  ctr: number;
  roas: number;
  ad_name: string;
}

export interface VideoAnalyticsData {
  completion_rate_hist: CompletionRateHistItem[];
  avg_drop_off: DropOffItem[];
  top_3_videos: VideoItem[];
}

export interface BodyItem {
  body: string;
  roas: number;
}

export interface HeadlineItem {
  headline: string;
  roas: number;
}

export interface BodyWordCountItem {
  body_word_count_bucket: string;
  roas: number;
}

export interface CTAItem {
  callToAction: string;
  roas: number;
}

export interface WordCloudItem {
  word: string;
  score: number;
}

export interface TableData {
  top_10_body: BodyItem[];
  top_10_headline: HeadlineItem[];
  top_10_body_word_count: BodyWordCountItem[];
  top_10_cta: CTAItem[];
  word_cloud: WordCloudItem[];
}

export interface OverallActionItem {
  action: string;
  headline: string;
  priority: string;
  observation: string;
  recommendation: string[];
}

export interface AiInsightCreative {
  headline: string;
  priority: string;
  observation: string;
  reason: string;
  recommendation: string;
}

export interface CreativeAnalyticsData {
  demographic: {
    table: DemographicFormat[];
    insights: AiInsightCreative[];
  };
  location: {
    table: LocationFormat[];
    insights: AiInsightCreative[];
  };
  media_format: {
    table: MediaFormat[];
    insights: AiInsightCreative[];
  };
  content_angle: {
    table: ContentAngle[];
    insights: AiInsightCreative[];
  };
  messaging_angle: {
    table: MessagingAngle[];
    insights: AiInsightCreative[];
  };
  video_creatives: {
    table: VideoFormat[];
    insights: AiInsightCreative[];
  };
  text: {
    table: TableData;
    insights: AiInsightCreative[];
  }
  video_aggregate: {
    table: VideoAnalyticsData;
    insights: AiInsightCreative[];
  }
  overall_insights: OverallActionItem[];
}

export interface CreativeIntelligenceProps {
  creativeAnalyticsData: CreativeAnalyticsData;
  adsSetData: [AdSetCreativeData];
}

export interface CreativeIntelligenceModalProps {
  creativeAnalyticsData: CreativeAnalyticsData;
  adsSetData: [AdSetCreativeData];
  creatives: CreativeModalPerformance[];
}

export interface AdSetCreativeData {
  date: string;
  campaignId: string;
  campaignName: string;
  adsetId: string;
  adsetName: string;
  spend: number;
  purchaseValue: number;
  roas: number;
  impressions: number;
  clicks: number;
  cpm: number;
  cpc: number;
  ctr: number;
  frequency: number;
  reach: number;
  _id: string;
}
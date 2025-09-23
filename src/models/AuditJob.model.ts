/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for Media Item
interface IMediaItem {
  type: string;
  permalink_url: string;
  video_id: string;
  is_reel: boolean;
  source: string;
}

// Interface for Creative Object
interface ICreativeObject {
  id: string;
  name: string;
  object_story_spec: any; // Using any for mixed type
  thumbnail_url: string;
  body: string;
  title: string;
  call_to_action_type: string;
  object_type: string;
  status: string;
  effective_object_story_id: string;
  instagram_permalink_url: string;
}

// Interface for Creative Performance
interface ICreativePerformance extends Document {
  creativeId: string;
  creativeName: string;
  campaignId: string;
  campaignName: string;
  adsetId: string;
  adsetName: string;
  adId: string;
  adName: string;
  date: Date;
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
  thumbnailUrl: string;
  mediaType: string;
  headline: string;
  body: string;
  linkCaption: string;
  linkDescription: string;
  hasFace: boolean;
  hasText: boolean;
  hasLogo: boolean;
  hasProduct: boolean;
  videoDuration: number;
  videoCompletionRate: number | null;
  videoRetentionGraph: number[];
  daysSinceCreation: number;
  performanceChange: number;
  callToAction: string;
  creativeObject: ICreativeObject;
  mediaItems: IMediaItem[];
  permalink: string;
}

// Interface for Account
interface IAccount {
  id: string;
  name: string;
  status: number;
  currency: string;
}

// Interface for Summary
interface ISummary {
  campaignRecords: number;
  adsetRecords: number;
  adRecords: number;
  dateRange: string;
}

// Interface for Campaign Data
interface ICampaignData {
  date: Date;
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

// Interface for AdSet Data
interface IAdSetData {
  date: Date;
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
}

// Interface for Ads Data
interface IAdsData {
  date: Date;
  campaignId: string;
  campaignName: string;
  adsetId: string;
  adsetName: string;
  adId: string;
  adName: string;
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

// Interface for Fetch All Performance
interface IFetchAllPerformance {
  summary: ISummary;
  campaignData: ICampaignData[];
  adsetData: IAdSetData[];
  adsData: IAdsData[];
}

// Interface for Campaign Performance
interface ICampaignPerformance {
  date: Date;
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

// Interface for AdSet Performance
interface IAdSetPerformance {
  date: Date;
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
}

// Interface for Ad Performance
interface IAdPerformance {
  date: Date;
  campaignId: string;
  campaignName: string;
  adsetId: string;
  adsetName: string;
  adId: string;
  adName: string;
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

// Interface for Demographic
interface IDemographic {
  ageGroup: string;
  gender: string;
  segment: string;
  spend: number;
  purchaseValue: number;
  impressions: number;
  clicks: number;
  reach: number;
  addToCart: number;
  checkoutInit: number;
  purchases: number;
}

// Interface for Device
interface IDevice {
  device: string;
  publisher: string;
  audienceType: string;
  spend: number;
  purchaseValue: number;
  impressions: number;
  clicks: number;
  reach: number;
  addToCart: number;
  checkoutInit: number;
  purchases: number;
}

// Interface for Location
interface ILocation {
  location: string;
  spend: number;
  purchaseValue: number;
  impressions: number;
  clicks: number;
  reach: number;
  addToCart: number;
  checkoutInit: number;
  purchases: number;
}

// Interface for Campaign Info
interface ICampaignInfo {
  campaignName: string;
  objective: string;
  date: string;
}

// Interface for Demographic Data
interface IDemographicData {
  demographics: Map<string, IDemographic>;
  devices: Map<string, IDevice>;
  locations: Map<string, ILocation>;
  campaignInfo: ICampaignInfo;
  isRetargetingCampaign: boolean;
  isProspectingCampaign: boolean;
}

// Interface for Data Item
interface IDataItem {
  date: string;
  campaignId: string;
  campaignName: string;
  objective: string;
  spend: number;
  purchaseValue: number;
  impressions: number;
  clicks: number;
  cpm: number;
  cpc: number;
  ctr: number;
  frequency: number;
  reach: number;
  addToCart: number;
  checkoutInit: number;
  purchases: number;
  audienceType: string;
  isRetargeting: boolean;
  ageGroup: string;
  gender: string;
  device: string;
  location: string;
  roas: number;
  segment: string;
  cvr: number;
  performanceScore: number;
}

// Interface for Advanced Data
interface IAdvancedData {
  data: IDataItem[];
  demographicData: Map<string, IDemographicData>;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for Platform Data
interface IPlatformData {
  platform: string;
  spend: number;
  sales: number;
  roas: number;
  impressions: number;
  clicks: number;
}

// Interface for Placement Data
interface IPlacementData {
  platform: string;
  placement: string;
  spend: number;
  sales: number;
  roas: number;
  impressions: number;
  clicks: number;
}

// Interface for Placement Device Data
interface IPlacementDeviceData {
  platform: string;
  device: string;
  spend: number;
  sales: number;
  roas: number;
  impressions: number;
  clicks: number;
}

// Interface for Total Metrics
interface ITotalMetrics {
  total_impressions: number;
  total_clicks: number;
  total_addtocart: number;
  total_checkout: number;
  total_purchases: number;
}

// Interface for Audit Results
interface IAuditResults {
  getPlatformSpendSalesData_result?: {
    platformData?: IPlatformData[];
    dateRange?: string;
  };
  getPlacementSpendSales_result?: {
    placementData?: IPlacementData[];
    dateRange?: string;
  };
  getPlacementDeviceData_result?: {
    placementData?: IPlacementDeviceData[];
    dateRange?: string;
  };
  getTotalMetrics_result?: ITotalMetrics;
  getAdvancedData_result?: IAdvancedData;
  getAdsData_result?: IAdPerformance[];
  getAdsetData_result?: IAdSetPerformance[];
  getCampaignData_result?: ICampaignPerformance[];
  fetchAllData_result?: IFetchAllPerformance;
  getAdAccounts_result?: IAccount[];
  getCreativeData_result?: {
    creatives?: ICreativePerformance[];
  };
}

// Interface for Error Info
interface IErrorInfo {
  message?: string;
  stack?: string;
  code?: string;
}

// Interface for Metadata
interface IMetadata {
  userAgent?: string;
  ip?: string;
  source?: string;
}

// Main AuditJob interface
interface IAuditJob extends Document {
  jobId: string;
  accountId: string;
  userId?: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: Date;
  processingStartedAt?: Date | null;
  processingCompletedAt?: Date | null;
  processingDuration?: number | null;
  auditResults: IAuditResults;
  errorInfo?: IErrorInfo;
  metadata?: IMetadata;
  dashboardUrl?: string;
  
  // Instance methods
  markAsProcessing: () => Promise<IAuditJob>;
  markAsCompleted: (
    platformData: IPlatformData[],
    placementData: IPlacementData[],
    placementDeviceData: IPlacementDeviceData[],
    totalMetricsData: ITotalMetrics,
    advancedData: IAdvancedData,
    adsPerformanceData: IAdPerformance[],
    adsSetData: IAdSetPerformance[],
    campaignData: ICampaignPerformance[],
    fetchAllData: IFetchAllPerformance,
    allAccounts: IAccount[],
    creativeData: ICreativePerformance[]
  ) => Promise<IAuditJob>;
  markAsFailed: (error: Error) => Promise<IAuditJob>;
}

// Static methods
interface AuditJobModel extends Model<IAuditJob> {
  findByAccountId: (accountId: string) => Promise<IAuditJob[]>;
  findByUserId: (userId: string) => Promise<IAuditJob[]>;
  getJobStats: () => Promise<{ _id: string; count: number }[]>;
}

// Create schemas
const mediaItemSchema = new Schema<IMediaItem>({
  type: { type: String, default: '' },
  permalink_url: { type: String, default: '' },
  video_id: { type: String, default: '' },
  is_reel: { type: Boolean, default: false },
  source: { type: String, default: '' }
}, { _id: false });

const creativeObjectSchema = new Schema<ICreativeObject>({
  id: { type: String, default: '' },
  name: { type: String, default: '' },
  object_story_spec: { type: Schema.Types.Mixed, default: {} },
  thumbnail_url: { type: String, default: '' },
  body: { type: String, default: '' },
  title: { type: String, default: '' },
  call_to_action_type: { type: String, default: '' },
  object_type: { type: String, default: '' },
  status: { type: String, default: '' },
  effective_object_story_id: { type: String, default: '' },
  instagram_permalink_url: { type: String, default: '' }
}, { _id: false });

const creativePerformanceSchema = new Schema<ICreativePerformance>({
  creativeId: { type: String, required: true, index: true },
  creativeName: { type: String, default: '' },
  campaignId: { type: String, default: '' },
  campaignName: { type: String, default: '' },
  adsetId: { type: String, default: '' },
  adsetName: { type: String, default: '' },
  adId: { type: String, default: '' },
  adName: { type: String, default: '' },
  date: { type: Date, required: true, index: true },
  spend: { type: Number, default: 0 },
  purchaseValue: { type: Number, default: 0 },
  roas: { type: Number, default: 0 },
  impressions: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  cpm: { type: Number, default: 0 },
  cpc: { type: Number, default: 0 },
  ctr: { type: Number, default: 0 },
  cvr: { type: Number, default: 0 },
  frequency: { type: Number, default: 0 },
  reach: { type: Number, default: 0 },
  objective: { type: String, default: '' },
  thumbnailUrl: { type: String, default: '' },
  mediaType: { type: String, default: '' },
  headline: { type: String, default: '' },
  body: { type: String, default: '' },
  linkCaption: { type: String, default: '' },
  linkDescription: { type: String, default: '' },
  hasFace: { type: Boolean, default: false },
  hasText: { type: Boolean, default: false },
  hasLogo: { type: Boolean, default: false },
  hasProduct: { type: Boolean, default: false },
  videoDuration: { type: Number, default: 0 },
  videoCompletionRate: { 
    type: Number,
    default: null,
    set: function(v: number) {
      return typeof v === 'number' && isNaN(v) ? null : v;
    }
  },
  videoRetentionGraph: { type: [Number], default: [] },
  daysSinceCreation: { type: Number, default: 0 },
  performanceChange: { type: Number, default: 0 },
  callToAction: { type: String, default: '' },
  creativeObject: { type: creativeObjectSchema, default: {} },
  mediaItems: { type: [mediaItemSchema], default: [] },
  permalink: { type: String, default: '' },
});

const AccountSchema = new Schema<IAccount>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  status: { type: Number, required: true },
  currency: { type: String, required: true }
});

const summarySchema = new Schema<ISummary>({
  campaignRecords: { type: Number, required: true },
  adsetRecords: { type: Number, required: true },
  adRecords: { type: Number, required: true },
  dateRange: { type: String, required: true }
});

const campaignDataSchema = new Schema<ICampaignData>({
  date: { type: Date, required: true },
  campaignId: { type: String, required: true },
  campaignName: { type: String, required: true },
  spend: { type: Number, required: true },
  purchaseValue: { type: Number, required: true },
  roas: { type: Number, required: true },
  impressions: { type: Number, required: true },
  clicks: { type: Number, required: true },
  cpm: { type: Number, required: true },
  cpc: { type: Number, required: true },
  ctr: { type: Number, required: true },
  frequency: { type: Number, required: true },
  reach: { type: Number, required: true }
});

const adsetDataSchema = new Schema<IAdSetData>({
  date: { type: Date, required: true },
  campaignId: { type: String, required: true },
  campaignName: { type: String, required: true },
  adsetId: { type: String, required: true },
  adsetName: { type: String, required: true },
  spend: { type: Number, required: true },
  purchaseValue: { type: Number, required: true },
  roas: { type: Number, required: true },
  impressions: { type: Number, required: true },
  clicks: { type: Number, required: true },
  cpm: { type: Number, required: true },
  cpc: { type: Number, required: true },
  ctr: { type: Number, required: true },
  frequency: { type: Number, required: true },
  reach: { type: Number, required: true }
});

const adsDataSchema = new Schema<IAdsData>({
  date: { type: Date, required: true },
  campaignId: { type: String, required: true },
  campaignName: { type: String, required: true },
  adsetId: { type: String, required: true },
  adsetName: { type: String, required: true },
  adId: { type: String, required: true },
  adName: { type: String, required: true },
  spend: { type: Number, required: true },
  purchaseValue: { type: Number, required: true },
  roas: { type: Number, required: true },
  impressions: { type: Number, required: true },
  clicks: { type: Number, required: true },
  cpm: { type: Number, required: true },
  cpc: { type: Number, required: true },
  ctr: { type: Number, required: true },
  frequency: { type: Number, required: true },
  reach: { type: Number, required: true }
});

const fetchAllPerformanceSchema = new Schema<IFetchAllPerformance>({
  summary: { type: summarySchema, required: true },
  campaignData: { type: [campaignDataSchema], required: true },
  adsetData: { type: [adsetDataSchema], required: true },
  adsData: { type: [adsDataSchema], required: true },
});

const campaignPerformanceSchema = new Schema<ICampaignPerformance>({
  date: { type: Date, required: true },
  campaignId: { type: String, required: true },
  campaignName: { type: String, required: true, trim: true },
  spend: {
    type: Number,
    required: true,
    min: 0,
    set: (v: number) => parseFloat(v.toFixed(2))
  },
  purchaseValue: { type: Number, required: true, default: 0, min: 0 },
  roas: { type: Number, required: true, default: 0, min: 0 },
  impressions: { type: Number, required: true, min: 0 },
  clicks: { type: Number, required: true, min: 0 },
  cpm: {
    type: Number,
    required: true,
    min: 0,
    set: (v: number) => parseFloat(v.toFixed(6))
  },
  cpc: {
    type: Number,
    required: true,
    min: 0,
    set: (v: number) => parseFloat(v.toFixed(6))
  },
  ctr: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    set: (v: number) => parseFloat(v.toFixed(6))
  },
  frequency: {
    type: Number,
    required: true,
    min: 0,
    set: (v: number) => parseFloat(v.toFixed(6))
  },
  reach: { type: Number, required: true, min: 0 }
});

const adSetPerformanceSchema = new Schema<IAdSetPerformance>({
  date: { type: Date, required: true },
  campaignId: { type: String, required: true },
  campaignName: { type: String, required: true, trim: true },
  adsetId: { type: String, required: true, unique: false },
  adsetName: { type: String, required: true, trim: true },
  spend: {
    type: Number,
    required: true,
    min: 0,
    set: (v: number) => parseFloat(v.toFixed(2))
  },
  purchaseValue: { type: Number, required: true, default: 0, min: 0 },
  roas: { type: Number, required: true, default: 0, min: 0 },
  impressions: { type: Number, required: true, min: 0 },
  clicks: { type: Number, required: true, min: 0 },
  cpm: {
    type: Number,
    required: true,
    min: 0,
    set: (v: number) => parseFloat(v.toFixed(6))
  },
  cpc: {
    type: Number,
    required: true,
    min: 0,
    set: (v: number) => parseFloat(v.toFixed(6))
  },
  ctr: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    set: (v: number) => parseFloat(v.toFixed(6))
  },
  frequency: {
    type: Number,
    required: true,
    min: 0,
    set: (v: number) => parseFloat(v.toFixed(6))
  },
  reach: { type: Number, required: true, min: 0 }
});

const adPerformanceSchema = new Schema<IAdPerformance>({
  date: { type: Date, required: true },
  campaignId: { type: String, required: true },
  campaignName: { type: String, required: true },
  adsetId: { type: String, required: true },
  adsetName: { type: String, required: true },
  adId: { type: String, required: true },
  adName: { type: String, required: true },
  spend: { type: Number, required: true, min: 0 },
  purchaseValue: { type: Number, required: true, default: 0, min: 0 },
  roas: { type: Number, required: true, default: 0 },
  impressions: { type: Number, required: true, min: 0 },
  clicks: { type: Number, required: true, min: 0 },
  cpm: { type: Number, required: true, min: 0 },
  cpc: { type: Number, required: true, min: 0 },
  ctr: { type: Number, required: true, min: 0, max: 100 },
  frequency: { type: Number, required: true, min: 0 },
  reach: { type: Number, required: true, min: 0 }
});

const demographicSchema = new Schema<IDemographic>({
  ageGroup: { type: String, required: true },
  gender: { type: String, required: true },
  segment: { type: String, required: true },
  spend: { type: Number, required: true, default: 0 },
  purchaseValue: { type: Number, required: true, default: 0 },
  impressions: { type: Number, required: true, default: 0 },
  clicks: { type: Number, required: true, default: 0 },
  reach: { type: Number, required: true, default: 0 },
  addToCart: { type: Number, required: true, default: 0 },
  checkoutInit: { type: Number, required: true, default: 0 },
  purchases: { type: Number, required: true, default: 0 }
});

const deviceSchema = new Schema<IDevice>({
  device: { type: String, required: true },
  publisher: { type: String, required: true },
  audienceType: { type: String, required: true },
  spend: { type: Number, required: true, default: 0 },
  purchaseValue: { type: Number, required: true, default: 0 },
  impressions: { type: Number, required: true, default: 0 },
  clicks: { type: Number, required: true, default: 0 },
  reach: { type: Number, required: true, default: 0 },
  addToCart: { type: Number, required: true, default: 0 },
  checkoutInit: { type: Number, required: true, default: 0 },
  purchases: { type: Number, required: true, default: 0 }
});

const locationSchema = new Schema<ILocation>({
  location: { type: String, required: true },
  spend: { type: Number, required: true, default: 0 },
  purchaseValue: { type: Number, required: true, default: 0 },
  impressions: { type: Number, required: true, default: 0 },
  clicks: { type: Number, required: true, default: 0 },
  reach: { type: Number, required: true, default: 0 },
  addToCart: { type: Number, required: true, default: 0 },
  checkoutInit: { type: Number, required: true, default: 0 },
  purchases: { type: Number, required: true, default: 0 }
});

const campaignInfoSchema = new Schema<ICampaignInfo>({
  campaignName: { type: String, required: true },
  objective: { type: String, required: true },
  date: { type: String, required: true }
});

const demographicDataSchema = new Schema<IDemographicData>({
  demographics: { type: Map, of: demographicSchema },
  devices: { type: Map, of: deviceSchema },
  locations: { type: Map, of: locationSchema },
  campaignInfo: { type: campaignInfoSchema, required: true },
  isRetargetingCampaign: { type: Boolean, required: true },
  isProspectingCampaign: { type: Boolean, required: true }
});

const dataItemSchema = new Schema<IDataItem>({
  date: { type: String, required: true },
  campaignId: { type: String, required: true },
  campaignName: { type: String, required: true },
  objective: { type: String, required: true },
  spend: { type: Number, required: true },
  purchaseValue: { type: Number, required: true },
  impressions: { type: Number, required: true },
  clicks: { type: Number, required: true },
  cpm: { type: Number, required: true },
  cpc: { type: Number, required: true },
  ctr: { type: Number, required: true },
  frequency: { type: Number, required: true },
  reach: { type: Number, required: true },
  addToCart: { type: Number, required: true },
  checkoutInit: { type: Number, required: true },
  purchases: { type: Number, required: true },
  audienceType: { type: String, required: true },
  isRetargeting: { type: Boolean, required: true },
  ageGroup: { type: String, required: true },
  gender: { type: String, required: true },
  device: { type: String, required: true },
  location: { type: String, required: true },
  roas: { type: Number, required: true },
  segment: { type: String, required: true },
  cvr: { type: Number, required: true },
  performanceScore: { type: Number, required: true }
});

const advancedDataSchema = new Schema<IAdvancedData>({
  data: { type: [dataItemSchema], required: true },
  demographicData: { type: Map, of: demographicDataSchema },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const platformDataSchema = new Schema<IPlatformData>({
  platform: { type: String, required: true },
  spend: { type: Number, required: true, default: 0 },
  sales: { type: Number, required: true, default: 0 },
  roas: { type: Number, required: true, default: 0 },
  impressions: { type: Number, required: true, default: 0 },
  clicks: { type: Number, required: true, default: 0 },
});

const placementDataSchema = new Schema<IPlacementData>({
  platform: { type: String, required: true },
  placement: { type: String, required: true },
  spend: { type: Number, required: true, default: 0 },
  sales: { type: Number, required: true, default: 0 },
  roas: { type: Number, required: true, default: 0 },
  impressions: { type: Number, required: true, default: 0 },
  clicks: { type: Number, required: true, default: 0 },
});

const placementDeviceDataSchema = new Schema<IPlacementDeviceData>({
  platform: { type: String, required: true },
  device: { type: String, required: true },
  spend: { type: Number, required: true, default: 0 },
  sales: { type: Number, required: true, default: 0 },
  roas: { type: Number, required: true, default: 0 },
  impressions: { type: Number, required: true, default: 0 },
  clicks: { type: Number, required: true, default: 0 },
});

const totalMetricsSchema = new Schema<ITotalMetrics>({
  total_impressions: { type: Number, required: true, default: 0 },
  total_clicks: { type: Number, required: true, default: 0 },
  total_addtocart: { type: Number, required: true, default: 0 },
  total_checkout: { type: Number, required: true, default: 0 },
  total_purchases: { type: Number, required: true, default: 0 },
});

// Main AuditJob Schema
const auditJobSchema = new Schema<IAuditJob, AuditJobModel>({
  jobId: { type: String, required: true, unique: true, index: true },
  accountId: { type: String, required: true, index: true },
  userId: { type: String, default: null, index: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
    index: true
  },
  requestedAt: { type: Date, required: true },
  processingStartedAt: { type: Date, default: null },
  processingCompletedAt: { type: Date, default: null },
  processingDuration: { type: Number, default: null },
  auditResults: {
    getPlatformSpendSalesData_result: {
      platformData: { type: [platformDataSchema], default: null },
      dateRange: { type: String, default: null }
    },
    getPlacementSpendSales_result: {
      placementData: { type: [placementDataSchema], default: null },
      dateRange: { type: String, default: null }
    },
    getPlacementDeviceData_result: {
      placementData: { type: [placementDeviceDataSchema], default: null },
      dateRange: { type: String, default: null }
    },
    getTotalMetrics_result: { type: totalMetricsSchema, default: null },
    getAdvancedData_result: { type: advancedDataSchema, default: null },
    getAdsData_result: { type: [adPerformanceSchema], default: null },
    getAdsetData_result: { type: [adSetPerformanceSchema], default: null },
    getCampaignData_result: { type: [campaignPerformanceSchema], default: null },
    fetchAllData_result: { type: fetchAllPerformanceSchema, default: null },
    getAdAccounts_result: { type: [AccountSchema], default: null },
    getCreativeData_result: {
      creatives: { type: [creativePerformanceSchema], default: null }
    }
  },
  errorInfo: {
    message: String,
    stack: String,
    code: String
  },
  metadata: {
    userAgent: String,
    ip: String,
    source: String
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes
auditJobSchema.index({ accountId: 1, createdAt: -1 });
auditJobSchema.index({ userId: 1, createdAt: -1 });
auditJobSchema.index({ status: 1, createdAt: -1 });

// Virtuals
auditJobSchema.virtual('dashboardUrl').get(function(this: IAuditJob) {
  return `/dashboard/${this.accountId}`;
});

// Instance methods
auditJobSchema.methods.markAsProcessing = function(this: IAuditJob) {
  this.status = 'processing';
  this.processingStartedAt = new Date();
  return this.save();
};

auditJobSchema.methods.markAsCompleted = function(
  this: IAuditJob,
  platformData: IPlatformData[],
  placementData: IPlacementData[],
  placementDeviceData: IPlacementDeviceData[],
  totalMetricsData: ITotalMetrics,
  advancedData: IAdvancedData,
  adsPerformanceData: IAdPerformance[],
  adsSetData: IAdSetPerformance[],
  campaignData: ICampaignPerformance[],
  fetchAllData: IFetchAllPerformance,
  allAccounts: IAccount[],
  creativeData: ICreativePerformance[]
) {
  this.status = 'completed';
  this.processingCompletedAt = new Date();
  this.auditResults.getPlatformSpendSalesData_result = { platformData, dateRange: '' };
  this.auditResults.getPlacementSpendSales_result = { placementData, dateRange: '' };
  this.auditResults.getPlacementDeviceData_result = { placementData: placementDeviceData, dateRange: '' };
  this.auditResults.getTotalMetrics_result = totalMetricsData;
  this.auditResults.getAdvancedData_result = advancedData;
  this.auditResults.getAdsData_result = adsPerformanceData;
  this.auditResults.getAdsetData_result = adsSetData;
  this.auditResults.getCampaignData_result = campaignData;
  this.auditResults.fetchAllData_result = fetchAllData;
  this.auditResults.getAdAccounts_result = allAccounts;
  this.auditResults.getCreativeData_result = { creatives: creativeData };
  
  if (this.processingStartedAt) {
    this.processingDuration = Math.round(
      (this.processingCompletedAt.getTime() - this.processingStartedAt.getTime()) / 1000
    );
  }
  
  return this.save();
};

auditJobSchema.methods.markAsFailed = function(this: IAuditJob, error: Error) {
  this.status = 'failed';
  this.processingCompletedAt = new Date();
  this.errorInfo = {
    message: error.message,
    stack: error.stack,
    code: (error as any).code || 'UNKNOWN_ERROR'
  };
  
  if (this.processingStartedAt) {
    this.processingDuration = Math.round(
      (this.processingCompletedAt.getTime() - this.processingStartedAt.getTime()) / 1000
    );
  }
  
  return this.save();
};

// Static methods
auditJobSchema.statics.findByAccountId = function(accountId: string) {
  return this.find({ accountId }).sort({ createdAt: -1 });
};

auditJobSchema.statics.findByUserId = function(userId: string) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

auditJobSchema.statics.getJobStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

// Create and export the model
const AuditJob = mongoose.models.AuditJob as AuditJobModel || 
  mongoose.model<IAuditJob, AuditJobModel>('AuditJob', auditJobSchema);

export default AuditJob;
import { Loader2 } from "lucide-react";
import React from "react";

export const LoadingSpinner = ({ size = 24, className = "" }) => (
  <Loader2 className={`animate-spin ${className}`} size={size} />
);

export const MetricCardSkeleton = () => (
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

export const ChartSkeleton = ({ height = 300 }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
    <div
      className={`bg-gray-200 rounded`}
      style={{ height: `${height}px` }}
    ></div>
  </div>
);

export const TableSkeleton = () => (
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

export const AICardSkeleton = () => (
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

export const KPICardsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 text-black">
    <MetricCardSkeleton />
    <MetricCardSkeleton />
    <MetricCardSkeleton />
    <MetricCardSkeleton />
  </div>
);

export const PerformanceTrendsSkeleton = () => (
  <>
    <div className="lg:col-span-2">
      <ChartSkeleton height={300} />
    </div>
    <ChartSkeleton height={300} />
  </>
);

export const InsightCardSkeleton = () => (
  <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl p-6 relative overflow-hidden animate-pulse">
    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-white/20 rounded-lg">
          <div className="w-6 h-6 bg-gray-400 rounded"></div>
        </div>
        <div className="text-right">
          <div className="h-8 bg-gray-400 rounded w-20 mb-1"></div>
          <div className="h-3 bg-gray-400 rounded w-16"></div>
        </div>
      </div>
      <div className="h-5 bg-gray-400 rounded w-48 mb-2"></div>
      <div className="h-4 bg-gray-400 rounded w-full mb-4"></div>
      <div className="flex items-center bg-white/20 rounded-lg p-3">
        <div className="w-4 h-4 bg-gray-400 rounded-full mr-2"></div>
        <div className="h-4 bg-gray-400 rounded flex-1"></div>
      </div>
    </div>
  </div>
);

export const AudienceAnalysisSkeleton = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <InsightCardSkeleton />
      <InsightCardSkeleton />
      <InsightCardSkeleton />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartSkeleton height={300} />
      <ChartSkeleton height={300} />
    </div>
    <TableSkeleton />
  </div>
);

export const CampaignCardSkeleton = () => (
  <div className="bg-white rounded-lg p-4 border-2 border-gray-200 animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center">
        <div className="p-2 rounded-lg mr-3 bg-gray-200">
          <div className="w-5 h-5 bg-gray-300"></div>
        </div>
        <div>
          <div className="h-5 bg-gray-200 rounded w-32 mb-1"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
    </div>
    <div className="grid grid-cols-2 gap-3 text-sm">
      <div>
        <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
        <div className="h-5 bg-gray-200 rounded w-24"></div>
      </div>
      <div>
        <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
        <div className="h-5 bg-gray-200 rounded w-24"></div>
      </div>
      <div>
        <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
        <div className="h-5 bg-gray-200 rounded w-24"></div>
      </div>
      <div>
        <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
        <div className="h-5 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  </div>
);

export const FunnelStageSkeleton = () => (
  <div className="relative mb-6 animate-pulse">
    <div className="flex items-center">
      <div className="flex-1 flex items-center">
        <div className="p-3 rounded-xl mr-4 bg-gray-200">
          <div className="w-6 h-6 bg-gray-300"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="text-right min-w-32">
        <div className="h-5 bg-gray-200 rounded w-24 mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-4 bg-gray-200 rounded w-28 mt-1"></div>
      </div>
    </div>
    <div className="flex justify-center my-4">
      <div className="flex items-center text-gray-500">
        <div className="w-5 h-5 bg-gray-200 rounded-full mr-2"></div>
        <div className="h-4 bg-gray-200 rounded w-40"></div>
      </div>
    </div>
  </div>
);

export const FunnelAnalysisSkeleton = () => (
  <div className="space-y-8">
    <div className="flex items-center justify-between mb-6">
      <div className="h-6 bg-gray-200 rounded w-48"></div>
      <div className="flex gap-3">
        <div className="h-10 bg-gray-200 rounded-lg w-28"></div>
        <div className="h-10 bg-gray-200 rounded-lg w-28"></div>
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <InsightCardSkeleton />
      <InsightCardSkeleton />
      <InsightCardSkeleton />
    </div>
    <div className="relative flex flex-col items-center">
      <FunnelStageSkeleton />
      <FunnelStageSkeleton />
      <FunnelStageSkeleton />
      <FunnelStageSkeleton />
      <FunnelStageSkeleton />
    </div>
  </div>
);

export const RetargetingAnalysisSkeleton = () => (
  <div className="space-y-8">
    <div className="flex items-center justify-between mb-6">
      <div className="h-6 bg-gray-200 rounded w-64"></div>
      <div className="flex gap-3">
        <div className="h-10 bg-gray-200 rounded-lg w-28"></div>
        <div className="h-10 bg-gray-200 rounded-lg w-28"></div>
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <InsightCardSkeleton />
      <InsightCardSkeleton />
      <InsightCardSkeleton />
      <InsightCardSkeleton />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartSkeleton height={300} />
      <ChartSkeleton height={300} />
    </div>
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="h-6 bg-gray-200 rounded w-48 mb-8"></div>
      <div className="space-y-3">
        <CampaignCardSkeleton />
        <CampaignCardSkeleton />
        <CampaignCardSkeleton />
        <CampaignCardSkeleton />
      </div>
    </div>
  </div>
);

export const RetargetingAnalysisSmallSkeleton = () => (
  <div className="space-y-8">
    <div className="flex items-center justify-between mb-6">
      <div className="h-6 bg-gray-200 rounded w-64"></div>
      <div className="flex gap-3">
        <div className="h-10 bg-gray-200 rounded-lg w-28"></div>
        <div className="h-10 bg-gray-200 rounded-lg w-28"></div>
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <InsightCardSkeleton />
      <InsightCardSkeleton />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartSkeleton height={300} />
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="h-6 bg-gray-200 rounded w-48 mb-8"></div>
        <div className="space-y-3">
          <CampaignCardSkeleton />
          <CampaignCardSkeleton />
          <CampaignCardSkeleton />
        </div>
      </div>
    </div>
  </div>
);

export const SpendByObjectiveSkeleton = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
    <div className="flex items-center justify-between mb-6">
      <div className="h-6 bg-gray-200 rounded w-48"></div>
      <div className="h-8 bg-gray-200 rounded w-24"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ChartSkeleton height={250} />
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
          >
            <div className="flex items-center flex-1">
              <div className="p-2 rounded-lg mr-3 bg-gray-200">
                <div className="w-5 h-5 bg-gray-300"></div>
              </div>
              <div>
                <div className="h-5 bg-gray-200 rounded w-32 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
            <div className="text-right">
              <div className="h-5 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-16 mt-1"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const CreativeGallerySkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="h-6 w-1/4 bg-gray-200 rounded animate-pulse"></div>
        <div className="flex space-x-2">
          <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <div className="w-full h-40 bg-gray-200 animate-pulse"></div>
            <div className="p-3">
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="flex space-x-2">
                <div className="h-3 w-1/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-1/4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="mt-3 flex justify-between">
                <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-1/4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

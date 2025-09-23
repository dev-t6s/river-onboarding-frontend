/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import {
  Brain,
  Calendar,
  ChartColumnBig,
  ChevronRight,
  Home,
  LayoutGrid,
  Rocket,
  Scale,
  Sliders,
  TriangleAlert,
  Zap,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { KPICards } from "@/components/CreativeKPICards";
import { CreativeGallery } from "@/components/CreativeGallery";
import { FaceDetectionInsights } from "@/components/FaceDetectionInsights";
import { TextCopyAnalysis } from "@/components/TextCopyAnalysis";
import { CreativeFreshness } from "@/components/CreativeFreshness";
import { ABTestingTool } from "@/components/ABTestingTool";
import { CreativeRecommendations } from "@/components/CreativeRecommendations";
import {
  AdAccount,
  AdSetCreativeData,
  CreativeAnalyticsData,
  CreativeData,
  CreativeRecommendation,
  VideoPerformanceData,
} from "@/types/meta-ads";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import CreativeIntelligence from "@/components/CreativeIntelligence";
import VideoPerformance from "@/components/VideoPerformance";

interface CreativeDashboardClientProps {
  initialData: {
    adAccountInfo: AdAccount | null;
    creativeData: CreativeData;
    jobId: string;
    creativeAnalyticsData: CreativeAnalyticsData;
    adsSetData: [AdSetCreativeData]
  };
  updatedAt: string;
}

const CreativeDashboardClient: React.FC<CreativeDashboardClientProps> = ({
  initialData,
  updatedAt
}) => {
  const router = useRouter();
  const { adAccountInfo, creativeData, creativeAnalyticsData, adsSetData, jobId} = initialData;
  
  // Client-side state (no loading state needed for initial data)
  const [sortBy, setSortBy] = useState("roas");
  const [selectedCreative, setSelectedCreative] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [creativesToCompare, setCreativesToCompare] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("gallery");
  const [isLoading, setIsLoading] = useState(false);

  const today = new Date(updatedAt);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await router.push(`/public/dashboard-ads/${jobId}`);
    } catch (error) {
      console.error('Navigation error:', error);
      setIsLoading(false);
    }
  };

  const processedData = useMemo(() => {
    if (!creativeData) return null;

    let total_sum = 0;
    let fatigued_sum = 0;

    const creativeScores = creativeData.creatives.map(
      (creative: {
        roas: number;
        ctr: number;
        cvr: number;
        creativeId: string;
        spend: number;
        frequency: number;
      }) => {
        total_sum += creative.spend;
        const isFatigued = creative.frequency > 3.5;
        if (isFatigued) {
          fatigued_sum += creative.spend;
        }

        // Calculate scores (same logic as before)
        const roasScore = creative.roas >= 5 ? 3.3 : creative.roas >= 3 ? 2.2 : 1.1;
        const ctrScore = creative.ctr >= 2 ? 3.3 : creative.ctr >= 1 ? 2.2 : 1.1;
        const cvrScore = creative.cvr >= 3 ? 3.3 : creative.cvr >= 1.5 ? 2.2 : 1.1;

        return {
          creativeId: creative.creativeId,
          score: roasScore + ctrScore + cvrScore,
          isFatigued,
        };
      }
    );

    const creativeFatiguePercent = (fatigued_sum / total_sum) * 100;
    const averageScore = creativeScores.reduce((sum, item) => sum + item.score, 0) / creativeScores.length;
    
    const totalRoas = creativeData.creatives.reduce((sum, c) => sum + c.roas, 0);
    const totalCtr = creativeData.creatives.reduce((sum, c) => sum + c.ctr, 0);
    const totalCvr = creativeData.creatives.reduce((sum, c) => sum + c.cvr, 0);

    const topCreative = [...creativeData.creatives].sort((a, b) => b.roas - a.roas)[0];

    const fatiguedCreatives = creativeData.creatives.filter(
      (creative: { frequency: number }) => creative.frequency > 3.5
    );
    const fatigueIndex = (fatiguedCreatives.length / creativeData.creatives.length) * 100;

    const faceDetectionData = {
      withFaces: creativeData.creatives.filter((c: { hasFace: any }) => c.hasFace),
      withoutFaces: creativeData.creatives.filter((c: { hasFace: any }) => !c.hasFace),
    };

    const headlines = creativeData.creatives.reduce((acc: { [x: string]: any }, creative: { headline: string | number; roas: any; ctr: any; cvr: any }) => {
      if (!acc[creative.headline]) {
        acc[creative.headline] = { count: 0, totalRoas: 0, totalCtr: 0, totalCvr: 0 };
      }
      acc[creative.headline].count++;
      acc[creative.headline].totalRoas += creative.roas;
      acc[creative.headline].totalCtr += creative.ctr;
      acc[creative.headline].totalCvr += creative.cvr;
      return acc;
    }, {} as Record<string, { count: number; totalRoas: number; totalCtr: number; totalCvr: number }>);

    const headlineAnalysis = Object.entries(headlines).map(([headline, data]) => ({
      headline,
      count: data.count,
      avgRoas: data.totalRoas / data.count,
      avgCtr: data.totalCtr / data.count,
      avgCvr: data.totalCvr / data.count,
    }));

    const videoPerformance: VideoPerformanceData[] = (creativeData?.creatives || [])
      .filter((c: { mediaType: string }) => c.mediaType === "video")
      .map((video) => ({
        creativeId: video.creativeId,
        duration: video.videoDuration ?? 0,
        completionRate: video.videoCompletionRate ?? 0,
        dropOffPoints: video.videoRetentionGraph ?? [],
      }));

    const recommendations: CreativeRecommendation[] = [
      ...fatiguedCreatives.map((creative, index) => ({
        id: `refresh-${index}-${creative.creativeId}`,
        type: "refresh" as const,
        priority: "high" as const,
        creativeId: creative.creativeId,
        message: `Refresh creative due to ${Math.abs(creative.performanceChange)}% performance drop`,
        expectedImpact: "High",
        suggestedActions: ["Create 2-3 new variants", "Test different visuals", "Update ad copy"],
      })),
      {
        id: `scale-${topCreative.creativeId}`,
        type: "scale" as const,
        priority: "high" as const,
        creativeId: topCreative.creativeId,
        message: "Scale top performing creative",
        expectedImpact: "Very High",
        suggestedActions: ["Increase budget by 20-30%", "Expand to similar audiences", "Duplicate to new ad sets"],
      },
    ];

    return {
      kpis: {
        creativeScore: averageScore,
        creativeFatiguePercent: creativeFatiguePercent,
        topCreative,
        fatigueIndex,
        activeCreatives: creativeData.creatives.length,
        newCreatives: creativeData.creatives.filter((c: { daysSinceCreation: number; status: string }) => 
          c.daysSinceCreation <= 7 && c.status.toUpperCase() !== 'UNKNOWN'
        ).length,
        avgRoas: totalRoas,
        avgCtr: totalCtr,
        avgCvr: totalCvr,
      },
      creatives: creativeData.creatives,
      faceDetectionData,
      headlineAnalysis,
      videoPerformance,
      recommendations,
      audienceInteractions: creativeData.audienceInteractions,
    };
  }, [creativeData]);

  const creativeA = processedData?.creatives.find(
    (c: { creativeId: string }) => c.creativeId === creativesToCompare[0]
  );
  const creativeB = processedData?.creatives.find(
    (c: { creativeId: string }) => c.creativeId === creativesToCompare[1]
  );

  if (!adAccountInfo) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-black">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex-1 sm:flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  Creative Performance Dashboard
                </h1>
              </div>
              <div className="flex items-center mt-1 hidden sm:flex">
                <p className="text-gray-600">
                  AI-powered creative analysis and optimization
                </p>
              </div>
            </div>
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
                  <ChartColumnBig size={16} className="text-white" /> {/* Changed to a more dashboard-appropriate icon */}
                  <span>View Ads Dashboard</span>
                  <ChevronRight size={14} className="opacity-80" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="rounded-xl mb-5">
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


        <KPICards
          kpis={processedData?.kpis}
          topCreative={processedData?.kpis.topCreative}
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex flex-col gap-2 justify-between items-center mb-4 sm:items-start lg:items-start xl:flex-row xl:gap-0 xl:items-center xl:justify-between xl:mt-0">
                <TabsList className="scale-75 sm:scale-100">
                  <TabsTrigger value="gallery">
                    <LayoutGrid className="w-4 h-4 mr-2" />
                    Creative Gallery
                  </TabsTrigger>
                  <TabsTrigger value="intelligence">
                    <Brain className="w-4 h-4 mr-2" />
                    Creative Intelligence
                  </TabsTrigger>
                  <TabsTrigger value="elements">
                    <Sliders className="w-4 h-4 mr-2" />
                    Element Analysis
                  </TabsTrigger>
                </TabsList>
                <div className="flex space-x-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="roas">Sort by ROAS</SelectItem>
                      <SelectItem value="ctr">Sort by CTR</SelectItem>
                      <SelectItem value="cvr">Sort by CVR</SelectItem>
                      <SelectItem value="spend">Sort by Spend</SelectItem>
                    </SelectContent>
                  </Select>
                  <button
                    onClick={() => setCompareMode(!compareMode)}
                    className={`px-3 py-2 rounded-lg text-sm flex items-center space-x-1 ${
                      compareMode
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    <Scale size={16} />
                    <span>Compare</span>
                  </button>
                </div>
              </div>

              <TabsContent value="gallery">
                <CreativeGallery
                  creatives={processedData?.creatives || []}
                  sortBy={sortBy}
                  selectedCreative={selectedCreative}
                  onSelectCreative={setSelectedCreative}
                  compareMode={compareMode}
                  creativesToCompare={creativesToCompare}
                  onToggleCompare={(id) =>
                    setCreativesToCompare((prev) =>
                      prev.includes(id)
                        ? prev.filter((i) => i !== id)
                        : [...prev, id]
                    )
                  }
                />
              </TabsContent>

              <TabsContent value="intelligence">
                <CreativeIntelligence
                  creativeAnalyticsData={creativeAnalyticsData}
                  adsSetData={adsSetData}
                  creatives={creativeData.creatives || []}
                />
              </TabsContent>

              <TabsContent value="elements">
                <div className="space-y-6">
                  <TextCopyAnalysis
                    data={processedData?.headlineAnalysis || []}
                    creativeAnalyticsData={creativeAnalyticsData}
                  />
                  {/* <VideoPerformance
                    data={processedData?.videoPerformance || []}
                  /> */}
                  <VideoPerformance
                    data={creativeAnalyticsData.video_aggregate || []}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-500" />
              AI Insights
            </h3>

            {compareMode && creativesToCompare.length === 2 && (
              <div className="mt-6">
                <ABTestingTool
                  creativeA={creativeA!}
                  creativeB={creativeB!}
                />
              </div>
            )}

            <FaceDetectionInsights
              data={processedData?.faceDetectionData}
            />
            <CreativeFreshness
              fatigueIndex={processedData?.kpis.creativeFatiguePercent || 0}
            />

            <div className="mt-6">
              <h3 className="text-lg font-semibold flex items-center mb-4">
                <Rocket className="w-5 h-5 mr-2 text-green-500" />
                Optimization Recommendations
              </h3>
              <CreativeRecommendations
                recommendations={creativeAnalyticsData.overall_insights || []}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeDashboardClient;
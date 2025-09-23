/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  AlertCircle,
  BarChart2,
  Brain,
  Calendar,
  Film,
  Home,
  Image,
  LayoutGrid,
  List,
  RefreshCw,
  Rocket,
  Scale,
  Sliders,
  Smile,
  Text,
  TrendingUp,
  TriangleAlert,
  Users,
  Zap,
} from "lucide-react";
import { KPICards } from "@/components/CreativeKPICards";
import { CreativeGallery } from "@/components/CreativeGallery";
import { FaceDetectionInsights } from "@/components/FaceDetectionInsights";
import { TextCopyAnalysis } from "@/components/TextCopyAnalysis";
import { CreativeFreshness } from "@/components/CreativeFreshness";
import { ABTestingTool } from "@/components/ABTestingTool";
import { AudienceCreativeAnalysis } from "@/components/AudienceCreativeAnalysis";
import { CreativeRecommendations } from "@/components/CreativeRecommendations";
import { MetaAdsClient } from "@/utils/meta-ads-client";
import {
  AdAccount,
  CreativeData,
  CreativeRecommendation,
  VideoPerformanceData,
} from "@/types/meta-ads";
import {
  LoadingSpinner,
  KPICardsSkeleton,
  CreativeGallerySkeleton,
} from "@/components/loaders";
import { useRouter } from "next/navigation";
import { useFacebook } from "@/context/FacebookContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import CreativeIntelligence from "@/components/CreativeIntelligence";

const CreativeDashboard = () => {
  const router = useRouter();
  const [adAccountInfo, setAdAccountInfo] = useState<AdAccount | null>(null);
  const [sortBy, setSortBy] = useState("roas");
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedCreative, setSelectedCreative] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [creativesToCompare, setCreativesToCompare] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("gallery");
  const { accessToken, adAccountID } = useFacebook();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [creativeData, setCreativeData] = useState<CreativeData | null>(null);

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

      const [accounts, creativeData] = await Promise.all([
        client.getAdAccounts(),
        client.getCreativeData(accountId) as Promise<CreativeData>,
      ]);

      const currentAccount = accounts.find(
        (acc: AdAccount) => acc.id === accountId
      );

      setAdAccountInfo(currentAccount ?? null);
      setCreativeData(creativeData);
    } catch (err: unknown) {
      console.error("Error fetching creative data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load creative data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, adAccountID]);

  const processedData = useMemo(() => {
    if (!creativeData) return null;

    let total_sum = 0;
    let fatigued_sum = 0;

    const creativeScores = creativeData.creatives.map(
      (creative: {
        roas: number;
        ctr: number;
        cvr: number;
        creativeId: any;
        spend: number;       // Added: Spend per creative
        frequency: number;   // Added: Frequency per creative
      }) => {
        // Track total spend across all creatives
        total_sum += creative.spend;

        // Check if creative is fatigued (frequency > 3.5)
        const isFatigued = creative.frequency > 3.5;
        if (isFatigued) {
          fatigued_sum += creative.spend; // Track spend on fatigued creatives
        }

        // Calculate ROAS Score
        let roasScore;
        if (creative.roas >= 5) {
          roasScore = 3.3;
        } else if (creative.roas >= 3) {
          roasScore = 2.2;
        } else {
          roasScore = 1.1;
        }

        // Calculate CTR Score
        let ctrScore;
        if (creative.ctr >= 2) {
          ctrScore = 3.3;
        } else if (creative.ctr >= 1) {
          ctrScore = 2.2;
        } else {
          ctrScore = 1.1;
        }

        // Calculate CVR Score
        let cvrScore;
        if (creative.cvr >= 3) {
          cvrScore = 3.3;
        } else if (creative.cvr >= 1.5) {
          cvrScore = 2.2;
        } else {
          cvrScore = 1.1;
        }

        return {
          creativeId: creative.creativeId,
          score: roasScore + ctrScore + cvrScore,
          isFatigued, // Optional: Flag fatigued creatives in output
        };
      }
    );

    // Calculate Creative Fatigue %
    const creativeFatiguePercent = (fatigued_sum / total_sum) * 100;

    // console.log("Total Spend:", total_sum);
    // console.log("Fatigued Spend:", fatigued_sum);
    // console.log("Creative Fatigue %:", creativeFatiguePercent.toFixed(2) + "%");

    const averageScore =
      creativeScores.reduce(
        (sum: any, item: { score: any }) => sum + item.score,
        0
      ) / creativeScores.length;
    // console.log("averageScore",averageScore)
    const totalRoas = creativeData.creatives.reduce(
      (sum, c) => sum + c.roas,
      0
    );
    const totalCtr = creativeData.creatives.reduce((sum, c) => sum + c.ctr, 0);
    const totalCvr = creativeData.creatives.reduce((sum, c) => sum + c.cvr, 0);

    const topCreative = [...creativeData.creatives].sort(
      (a, b) => b.roas - a.roas
    )[0];

    const fatiguedCreatives = creativeData.creatives.filter(
      (creative: { performanceChange: number }) =>
        creative.performanceChange < -20
    );
    const fatigueIndex =
      (fatiguedCreatives.length / creativeData.creatives.length) * 100;

    const faceDetectionData = {
      withFaces: creativeData.creatives.filter(
        (c: { hasFace: any }) => c.hasFace
      ),
      withoutFaces: creativeData.creatives.filter(
        (c: { hasFace: any }) => !c.hasFace
      ),
    };

    const headlines = creativeData.creatives.reduce(
      (
        acc: { [x: string]: any },
        creative: { headline: string | number; roas: any; ctr: any; cvr: any }
      ) => {
        if (!acc[creative.headline]) {
          acc[creative.headline] = {
            count: 0,
            totalRoas: 0,
            totalCtr: 0,
            totalCvr: 0,
          };
        }
        acc[creative.headline].count++;
        acc[creative.headline].totalRoas += creative.roas;
        acc[creative.headline].totalCtr += creative.ctr;
        acc[creative.headline].totalCvr += creative.cvr;
        return acc;
      },
      {} as Record<
        string,
        { count: number; totalRoas: number; totalCtr: number; totalCvr: number }
      >
    );

    const headlineAnalysis = Object.entries(headlines).map(
      ([headline, data]) => ({
        headline,
        count: data.count,
        avgRoas: data.totalRoas / data.count,
        avgCtr: data.totalCtr / data.count,
        avgCvr: data.totalCvr / data.count,
      })
    );

    const videoPerformance: VideoPerformanceData[] = (
      creativeData?.creatives || []
    )
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
        message: `Refresh creative due to ${Math.abs(
          creative.performanceChange
        )}% performance drop`,
        expectedImpact: "High",
        suggestedActions: [
          "Create 2-3 new variants",
          "Test different visuals",
          "Update ad copy",
        ],
      })),
      {
        id: `scale-${topCreative.creativeId}`,
        type: "scale" as const,
        priority: "high" as const,
        creativeId: topCreative.creativeId,
        message: "Scale top performing creative",
        expectedImpact: "Very High",
        suggestedActions: [
          "Increase budget by 20-30%",
          "Expand to similar audiences",
          "Duplicate to new ad sets",
        ],
      },
      ...(faceDetectionData.withFaces.length > 0
        ? [
            {
              id: "face-detection-optimization",
              type: "optimize" as const,
              priority: "medium" as const,
              creativeId: null,
              message: `Creatives with faces perform ${(
                faceDetectionData.withFaces.reduce(
                  (sum, c) => sum + c.roas,
                  0
                ) /
                  faceDetectionData.withFaces.length /
                  (faceDetectionData.withoutFaces.reduce(
                    (sum, c) => sum + c.roas,
                    0
                  ) /
                    faceDetectionData.withoutFaces.length) -
                1
              ).toFixed(2)}x better`,
              expectedImpact: "Medium",
              suggestedActions: [
                "Add human elements to all creatives",
                "Test different facial expressions",
                "Prioritize face-focused thumbnails",
              ],
            },
          ]
        : []),
    ];

    return {
      kpis: {
        creativeScore: averageScore,
        creativeFatiguePercent: creativeFatiguePercent,
        topCreative,
        fatigueIndex,
        activeCreatives: creativeData.creatives.length,
        newCreatives: creativeData.creatives.filter(
          (c: { daysSinceCreation: number }) => c.daysSinceCreation <= 7
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-black">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex-1 sm:flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  Creative Performance Dashboard
                </h1>
                {loading && (
                  <LoadingSpinner size={20} className="text-blue-600" />
                )}
              </div>
              <div className="flex items-center mt-1 hidden sm:flex">
                <p className="text-gray-600">
                  AI-powered creative analysis and optimization
                </p>
              </div>
            </div>
            <div className="flex mt-3 sm:mt-0 items-center space-x-4">
              {creativeData && (
                <>
                  {adAccountInfo && (
                    <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
                      <span className="text-sm font-medium text-blue-700">
                        {adAccountInfo!.name}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg hidden sm:flex">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {creativeData.summary.dateRange}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <KPICardsSkeleton />
        ) : (
          <KPICards
            kpis={processedData?.kpis}
            topCreative={processedData?.kpis.topCreative}
          />
        )}

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-between items-center mb-4">
                <TabsList>
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
                  {/* <TabsTrigger value="audience">
                    <Users className="w-4 h-4 mr-2" />
                    Audience Interaction
                  </TabsTrigger> */}
                </TabsList>
                <div className="flex space-x-2">
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    disabled={loading}
                  >
                    <option value="roas">Sort by ROAS</option>
                    <option value="ctr">Sort by CTR</option>
                    <option value="cvr">Sort by CVR</option>
                    <option value="spend">Sort by Spend</option>
                  </select>
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
                {loading ? (
                  <CreativeGallerySkeleton />
                ) : (
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
                )}
              </TabsContent>

              {/* <TabsContent value="intelligence">
                {loading ? (
                  <CreativeGallerySkeleton />
                ) : (
                  <CreativeIntelligence/>
                )}
              </TabsContent> */}

              {/* <TabsContent value="elements">
                <div className="space-y-6">
                  {loading ? (
                    <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
                  ) : (
                    <TextCopyAnalysis
                      data={processedData?.headlineAnalysis || []}
                    />
                  )}
                  {loading ? (
                    <CreativeGallerySkeleton />
                  ) : (
                    <VideoPerformance
                      data={processedData?.videoPerformance || []}
                    />
                  )}
                </div>
              </TabsContent> */}

              {/* <TabsContent value="audience">
                {loading ? (
                  <CreativeGallerySkeleton />
                ) : (
                  <AudienceCreativeAnalysis
                    data={processedData?.audienceInteractions || []}
                  />
                )}
              </TabsContent> */}
            </Tabs>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-500" />
              AI Insights
            </h3>

            {compareMode && creativesToCompare.length === 2 && (
              <div className="mt-6">
                {loading ? (
                  <CreativeGallerySkeleton />
                ) : (
                  <ABTestingTool
                    creativeA={creativeA!}
                    creativeB={creativeB!}
                  />
                )}
              </div>
            )}

            {loading ? (
              <CreativeGallerySkeleton />
            ) : (
              <>
                <FaceDetectionInsights
                  data={processedData?.faceDetectionData}
                />
                <CreativeFreshness
                  fatigueIndex={processedData?.kpis.creativeFatiguePercent || 0}
                />
              </>
            )}

            {/* <div className="mt-6">
              <h3 className="text-lg font-semibold flex items-center mb-4">
                <Rocket className="w-5 h-5 mr-2 text-green-500" />
                Optimization Recommendations
              </h3>
              {loading ? (
                <CreativeGallerySkeleton />
              ) : (
                <CreativeRecommendations
                  recommendations={processedData?.recommendations || []}
                />
              )}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeDashboard;

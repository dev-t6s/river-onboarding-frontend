/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { AiInsightCreative, CreativeIntelligenceModalProps } from "@/types/meta-ads";
import { Activity, AlertTriangle, BookMarked, Cctv, CheckCircle, DollarSign, Eye, Lightbulb, MousePointer, Star, Target, TrendingUp, Video, X } from "lucide-react";
import { useState } from "react";
import { CreativeGalleryModal } from "./CreativeGalleryModal";

export default function CreativeIntelligence({
  creativeAnalyticsData,
  adsSetData,
  creatives,
}: CreativeIntelligenceModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMediaType, setSelectedMediaType] = useState<string | null>(null);
  const [selectedContentAngle, setSelectedContentAngle] = useState<string | null>(null);
  const [selectedMessagingAngle, setSelectedMessagingAngle] = useState<string | null>(null);
  const [selectedDemographic, setSelectedDemographic] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedVideoCreative, setSelectedVideoCreative] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('roas');
  const [selectedCreative, setSelectedCreative] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [creativesToCompare, setCreativesToCompare] = useState<string[]>([]);
  const [isInsightsModalOpen, setIsInsightsModalOpen] = useState(false);
  const [currentInsights, setCurrentInsights] = useState<AiInsightCreative[]>([]);
  const [insightsTitle, setInsightsTitle] = useState("");

  const handleMediaTypeRowClick = (item: any) => {
    setSelectedMediaType(item.mediaType);
    setSelectedContentAngle(null);
    setSelectedMessagingAngle(null);
    setIsModalOpen(true);
  };

  const handleContentAngleRowClick = (item: any) => {
    setSelectedContentAngle(item.content_angle);
    setSelectedMediaType(null);
    setSelectedMessagingAngle(null);
    setIsModalOpen(true);
  };

  const handleMessagingAngleRowClick = (item: any) => {
    setSelectedMessagingAngle(item.messaging_angle);
    setSelectedMediaType(null);
    setSelectedContentAngle(null);
    setIsModalOpen(true);
  };

  const handleDemographicRowClick = (item: any) => {
    setSelectedDemographic(`${item.age_group} | ${item.gender}`);
    setSelectedMediaType(null);
    setSelectedContentAngle(null);
    setSelectedMessagingAngle(null);
    setIsModalOpen(true);
  };

  const handleLocationRowClick = (item: any) => {
    setSelectedLocation(item.location);
    setSelectedMediaType(null);
    setSelectedContentAngle(null);
    setSelectedMessagingAngle(null);
    setIsModalOpen(true);
  };

  const handleVideoCreativeRowClick = (item: any) => {
    setSelectedVideoCreative(item.ad_name);
    setSelectedMediaType(null);
    setSelectedContentAngle(null);
    setSelectedMessagingAngle(null);
    setIsModalOpen(true);
  };

  const highestRoasTable1 = Math.max(...adsSetData.map((item) => item.roas));
  const highestRoasTable2 = Math.max(
    ...creativeAnalyticsData.media_format.table.map((item) =>
      Number(item.avg_roas)
    )
  );
  const highestRoasTable3 = Math.max(
    ...creativeAnalyticsData.content_angle.table.map((item) =>
      Number(item.avg_roas)
    )
  );
  const highestRoasTable4 = Math.max(
    ...creativeAnalyticsData.messaging_angle.table.map((item) =>
      Number(item.avg_roas)
    )
  );
  const highestRoasTable5 = Math.max(
    ...creativeAnalyticsData.demographic.table.map((item) =>
      Number(item.avg_roas)
    )
  );
  const highestRoasTable6 = Math.max(
    ...creativeAnalyticsData.location.table.map((item) =>
      Number(item.avg_frequency)
    )
  );
  const highestRoasTable7 = Math.max(
    ...creativeAnalyticsData.video_creatives.table.map((item) =>
      Number(item.roas)
    )
  );

  const handleInsightsClick = (type: 'mediaFormat' | 'contentAngle' | 'messagingAngle' | 'demographic' | 'location' | 'videoCreatives') => {
    let data;
    switch(type) {
      case 'mediaFormat':
        setInsightsTitle("Media Format Performance Insights");
        data = creativeAnalyticsData.media_format.insights;
        break;
      case 'contentAngle':
        setInsightsTitle("Content Angle Performance Insights");
        data = creativeAnalyticsData.content_angle.insights;
        break;
      case 'messagingAngle':
        setInsightsTitle("Messaging Angle Performance Insights");
        data = creativeAnalyticsData.messaging_angle.insights;
        break;
      case 'demographic':
        setInsightsTitle("Demographic Performance Insights");
        data = creativeAnalyticsData.demographic.insights;
        break;
      case 'location':
        setInsightsTitle("Location Performance Insights");
        data = creativeAnalyticsData.location.insights;
        break;
      case 'videoCreatives':
        setInsightsTitle("Video Creatives Performance Insights");
        data = creativeAnalyticsData.video_creatives.insights;
        break;
    }
    setCurrentInsights(data);
    setIsInsightsModalOpen(true);
  };

  const getPriorityConfig = (priority: any) => {
    switch (priority) {
      case "HIGH":
        return {
          bg: "bg-gradient-to-r from-red-50 to-red-100",
          border: "border-red-200",
          badge: "bg-red-500 text-white",
          icon: <AlertTriangle className="w-4 h-4" />,
          iconColor: "text-red-500"
        };
      case "MEDIUM":
        return {
          bg: "bg-gradient-to-r from-yellow-50 to-yellow-100",
          border: "border-yellow-200",
          badge: "bg-yellow-500 text-white",
          icon: <Eye className="w-4 h-4" />,
          iconColor: "text-yellow-500"
        };
      default:
        return {
          bg: "bg-gradient-to-r from-blue-50 to-blue-100",
          border: "border-blue-200",
          badge: "bg-blue-500 text-white",
          icon: <CheckCircle className="w-4 h-4" />,
          iconColor: "text-blue-500"
        };
    }
  };

  return (
    <div>
      <div className="mb-4 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between">
          <div className="flex items-center mb-5">
            <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">
              Ad Set Performance
            </h2>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div
            className="overflow-y-auto"
            style={{ maxHeight: "calc(6 * 64px + 56px)" }}
          >
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-blue-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Ad Set
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Spend
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    ROAS
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Impressions
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    CPM
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    CTR
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {adsSetData
                  .sort((a, b) => b.roas - a.roas)
                  .map((adSet, index) => {
                    return (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors duration-150 text-sm"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium">{adSet.campaignName}</div>
                          <div className="text-xs text-gray-500">
                            {adSet.campaignId}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium">{adSet.adsetName}</div>
                          <div className="text-xs text-gray-500">
                            {adSet.adsetId}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          ₹{adSet.spend.toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap flex items-center">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              adSet.roas >= 3
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : adSet.roas >= 2
                                ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                : adSet.roas >= 1
                                ? "bg-orange-100 text-orange-800 border border-orange-200"
                                : "bg-red-100 text-red-800 border border-red-200"
                            }`}
                          >
                            {adSet.roas.toFixed(2)}x
                          </span>
                          {adSet.roas === highestRoasTable1 && (
                            <Star className="w-4 h-4 text-yellow-500 ml-2" />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {adSet.impressions.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          ₹{adSet.cpm.toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              adSet.ctr >= 2
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : adSet.ctr >= 1
                                ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                : "bg-red-100 text-red-800 border border-red-200"
                            }`}
                          >
                            {adSet.ctr.toFixed(2)}%
                          </span>
                        </td>
                      </tr>
                    );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mb-4 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between">
          <div className="flex items-center mb-5">
            <Video className="w-5 h-5 text-purple-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">
              Media Format Performance
            </h2>
          </div>
          {creativeAnalyticsData.media_format.insights.length ? (
            <div>
              <button
                onClick={() => handleInsightsClick('mediaFormat')}
                className="inline-flex items-center px-3 py-1.5 cursor-pointer text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 hover:border-purple-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
              >
                <TrendingUp className="w-3 h-3 mr-1.5" />
                Insights
              </button>
            </div>
          ) : ''}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div
            className="overflow-x-auto"
            style={{ maxHeight: "calc(6 * 64px + 56px)" }}
          >
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-blue-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Media Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    # of Ads
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Impressions
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Avg. ROAS
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Avg. CPC
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Avg. CTR
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Avg. CVR
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Sales
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {creativeAnalyticsData.media_format.table
                  .sort((a, b) => b.avg_roas - a.avg_roas)
                  .map((item, index) => (
                    <tr
                      key={index}
                      onClick={() => handleMediaTypeRowClick(item)}
                      className="hover:bg-gray-50 transition-colors duration-150 text-sm cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.mediaType === "image" ? (
                          <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
                            Image
                          </span>
                        ) : item.mediaType === "video" ? (
                          <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
                            Video
                          </span>
                        ) : item.mediaType === "carousel" ? (
                          <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                            Carousel
                          </span>
                        ) : (
                          <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                            {item.mediaType}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.n_ads}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.impressions.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.clicks.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex items-center">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            item.avg_roas >= 3
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : item.avg_roas >= 2
                              ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                              : item.avg_roas >= 1
                              ? "bg-orange-100 text-orange-800 border border-orange-200"
                              : "bg-red-100 text-red-800 border border-red-200"
                          }`}
                        >
                          {item.avg_roas.toFixed(2)}x
                        </span>
                        {Number(item.avg_roas) ===
                          highestRoasTable2 && (
                          <Star className="w-4 h-4 text-yellow-500 ml-2" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ₹{item.avg_cpc.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.avg_ctr}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.avg_cvr}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ₹{item.total_purchase_value.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.is_fatigued ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Fatigued
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Healthy
                          </span>
                        )}
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add new Content Angle table */}
      <div className="mb-4 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between">
          <div className="flex items-center mb-5">
            <BookMarked className="w-5 h-5 text-purple-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">
              Content Angle Performance
            </h2>
          </div>
          {creativeAnalyticsData.content_angle.insights.length ? (
            <div>
              <button
                onClick={() => handleInsightsClick('contentAngle')}
                className="inline-flex items-center px-3 py-1.5 cursor-pointer text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 hover:border-purple-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
              >
                <TrendingUp className="w-3 h-3 mr-1.5" />
                Insights
              </button>
            </div>
          ) : ''}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div
            className="overflow-x-auto"
            style={{ maxHeight: "calc(6 * 64px + 56px)" }}
          >
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-blue-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Content Angle
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    # of Ads
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Impressions
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Avg. ROAS
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Avg. CPC
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Avg. CTR
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Sales
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {creativeAnalyticsData.content_angle.table
                  .sort((a, b) => b.avg_roas - a.avg_roas)
                  .map((item, index) => {
                    if (item.content_angle.trim())
                      return (
                        <tr
                          key={index}
                          onClick={() => handleContentAngleRowClick(item)}
                          className="hover:bg-gray-50 transition-colors duration-150 text-sm cursor-pointer"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.content_angle}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.n_ads}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.impressions.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.clicks.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap flex items-center">
                            <span
                              className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                item.avg_roas >= 3
                                  ? "bg-green-100 text-green-800 border border-green-200"
                                  : item.avg_roas >= 2
                                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                  : item.avg_roas >= 1
                                  ? "bg-orange-100 text-orange-800 border border-orange-200"
                                  : "bg-red-100 text-red-800 border border-red-200"
                              }`}
                            >
                              {item.avg_roas.toFixed(2)}x
                            </span>
                            {Number(item.avg_roas) ===
                              highestRoasTable3 && (
                              <Star className="w-4 h-4 text-yellow-500 ml-2" />
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            ₹{item.avg_cpc}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.avg_ctr}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            ₹{item.total_purchase_value.toLocaleString('en-IN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.is_fatigued ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Fatigued
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Healthy
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add new Messaging Angle table */}
      <div className="mb-4 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between">
          <div className="flex items-center mb-5">
            <Cctv className="w-5 h-5 text-purple-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">
              Messaging Angle Performance
            </h2>
          </div>
          {creativeAnalyticsData.messaging_angle.insights.length ? (
            <div>
              <button
                onClick={() => handleInsightsClick('messagingAngle')}
                className="inline-flex items-center px-3 py-1.5 cursor-pointer text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 hover:border-purple-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
              >
                <TrendingUp className="w-3 h-3 mr-1.5" />
                Insights
              </button>
            </div>
          ) : ''}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div
            className="overflow-x-auto"
            style={{ maxHeight: "calc(6 * 64px + 56px)" }}
          >
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-blue-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Messaging Angle
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    # of Ads
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Impressions
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Avg. ROAS
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Avg. CPC
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Avg. CTR
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Sales
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {creativeAnalyticsData.messaging_angle.table
                  .sort((a, b) => b.avg_roas - a.avg_roas)
                  .map((item, index) => {
                    if (item.messaging_angle.trim())
                      return (
                        <tr
                          key={index}
                          onClick={() => handleMessagingAngleRowClick(item)}
                          className="hover:bg-gray-50 transition-colors duration-150 text-sm cursor-pointer"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.messaging_angle}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.n_ads}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.impressions.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.clicks.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap flex items-center">
                            <span
                              className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                item.avg_roas >= 3
                                  ? "bg-green-100 text-green-800 border border-green-200"
                                  : item.avg_roas >= 2
                                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                  : item.avg_roas >= 1
                                  ? "bg-orange-100 text-orange-800 border border-orange-200"
                                  : "bg-red-100 text-red-800 border border-red-200"
                              }`}
                            >
                              {item.avg_roas.toFixed(2)}x
                            </span>
                            {Number(item.avg_roas) ===
                              highestRoasTable4 && (
                              <Star className="w-4 h-4 text-yellow-500 ml-2" />
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            ₹{item.avg_cpc}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.avg_ctr}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            ₹{item.total_purchase_value.toLocaleString('en-IN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.is_fatigued ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Fatigued
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Healthy
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Demographic Table */}
      <div className="mb-4 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between">
          <div className="flex items-center mb-5">
            <Activity className="w-5 h-5 text-purple-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">
              Demographic Performance
            </h2>
          </div>
          {creativeAnalyticsData.demographic.insights.length ? (
            <div>
              <button
                onClick={() => handleInsightsClick('demographic')}
                className="inline-flex items-center px-3 py-1.5 cursor-pointer text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 hover:border-purple-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
              >
                <TrendingUp className="w-3 h-3 mr-1.5" />
                Insights
              </button>
            </div>
          ) : ''}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto" style={{ maxHeight: "calc(6 * 64px + 56px)" }}>
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-blue-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Age Group
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Impressions
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Avg. ROAS
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Avg. CPC
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Avg. CTR
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Avg. CVR
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {creativeAnalyticsData.demographic.table
                  .sort((a, b) => b.avg_roas - a.avg_roas)
                  .map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-150 text-sm"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.age_group}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.gender}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.impressions.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.clicks.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex items-center">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            item.avg_roas >= 3
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : item.avg_roas >= 2
                              ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                              : item.avg_roas >= 1
                              ? "bg-orange-100 text-orange-800 border border-orange-200"
                              : "bg-red-100 text-red-800 border border-red-200"
                          }`}
                        >
                          {item.avg_roas.toFixed(2)}x
                        </span>
                        {Number(item.avg_roas) === highestRoasTable5 && (
                          <Star className="w-4 h-4 text-yellow-500 ml-2" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ₹{item.avg_cpc.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.avg_ctr.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.avg_cvr.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.is_fatigued ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Fatigued
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Healthy
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Location Table */}
      <div className="mb-4 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between">
          <div className="flex items-center mb-5">
            <MousePointer className="w-5 h-5 text-purple-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">
              Location Performance
            </h2>
          </div>
          {creativeAnalyticsData.location.insights.length ? (
            <div>
            <button
              onClick={() => handleInsightsClick('location')}
              className="inline-flex items-center px-3 py-1.5 cursor-pointer text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 hover:border-purple-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
            >
              <TrendingUp className="w-3 h-3 mr-1.5" />
              Insights
            </button>
          </div>
          ) : ''}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto" style={{ maxHeight: "calc(6 * 64px + 56px)" }}>
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-blue-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Impressions
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Avg. CTR
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Avg. Frequency
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Reach
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {creativeAnalyticsData.location.table.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors duration-150 text-sm"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.impressions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.clicks.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.avg_ctr.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.avg_frequency.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.reach.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.is_fatigued ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Fatigued
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Healthy
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Video Creatives Table */}
      <div className="mb-4 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between">
          <div className="flex items-center mb-5">
            <Video className="w-5 h-5 text-purple-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">
              Video Creatives Performance
            </h2>
          </div>
          {creativeAnalyticsData.video_creatives.insights.length ? (
            <div>
              <button
                onClick={() => handleInsightsClick('videoCreatives')}
                className="inline-flex items-center px-3 py-1.5 cursor-pointer text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 hover:border-purple-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
              >
                <TrendingUp className="w-3 h-3 mr-1.5" />
                Insights
              </button>
            </div>
          ) : ''}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto" style={{ maxHeight: "calc(6 * 64px + 56px)" }}>
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-blue-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Ad Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Avg. Watch Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Completion Rate
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Thumbstop Rate
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    ROAS
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    CTR
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {creativeAnalyticsData.video_creatives.table
                  .sort((a, b) => b.roas - a.roas)
                  .map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-150 text-sm"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.ad_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.video_duration}s
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.avg_watch_time.toFixed(2)}s
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.video_completion_rate.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.thumbstop_ratio}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex items-center">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            item.roas >= 3
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : item.roas >= 2
                              ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                              : item.roas >= 1
                              ? "bg-orange-100 text-orange-800 border border-orange-200"
                              : "bg-red-100 text-red-800 border border-red-200"
                          }`}
                        >
                          {item.roas.toFixed(2)}x
                        </span>
                        {Number(item.roas) === highestRoasTable7 && (
                          <Star className="w-4 h-4 text-yellow-500 ml-2" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.ctr.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.is_fatigued ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Fatigued
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Healthy
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] flex flex-col ring-1 ring-neutral-200">
            <div className="flex justify-between items-center p-4 border-b border-b-neutral-200">
              <h3 className="text-lg font-semibold">
                {selectedMediaType && `Creatives for ${selectedMediaType}`}
                {selectedContentAngle && `Creatives with Content Angle: ${selectedContentAngle}`}
                {selectedMessagingAngle && `Creatives with Messaging Angle: ${selectedMessagingAngle}`}
                {selectedDemographic && `Creatives for Demographic: ${selectedDemographic}`}
                {selectedLocation && `Creatives for Location: ${selectedLocation}`}
                {selectedVideoCreative && `Details for Video: ${selectedVideoCreative}`}
              </h3>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedMediaType(null);
                  setSelectedContentAngle(null);
                  setSelectedMessagingAngle(null);
                  setSelectedDemographic(null);
                  setSelectedLocation(null);
                  setSelectedVideoCreative(null);
                }}
                className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-auto p-4">
              <CreativeGalleryModal
                creatives={creatives || []}
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
                filterType={
                  selectedMediaType ? "mediaType" : 
                  selectedContentAngle ? "contentAngle" : 
                  selectedMessagingAngle ? "messagingAngle" : undefined
                }
                filterValue={
                  selectedMediaType || 
                  selectedContentAngle || 
                  selectedMessagingAngle || undefined
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Insights Modal */}
      {isInsightsModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl ring-1 ring-neutral-200">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">{insightsTitle}</h3>
              </div>
              <button
                onClick={() => setIsInsightsModalOpen(false)}
                className="p-2 rounded-full hover:bg-white transition-all duration-200 cursor-pointer"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-auto p-6">
              <div className="space-y-6">
                {currentInsights.map((insight, index) => {
                  const config = getPriorityConfig(insight.priority);
                  
                  return (
                    <div key={index} className={`${config.bg} ${config.border} border-2 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300`}>
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 bg-white rounded-lg ${config.iconColor}`}>
                            {config.icon}
                          </div>
                          <h4 className="text-xl font-bold text-gray-800">{insight.headline}</h4>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full ${config.badge} shadow-sm`}>
                          {insight.priority} PRIORITY
                        </span>
                      </div>

                      

                      {/* Content Sections */}
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center space-x-2 mb-2">
                            <Eye className="w-4 h-4 text-gray-600" />
                            <h5 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Observation</h5>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{insight.observation}</p>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center space-x-2 mb-2">
                            <Target className="w-4 h-4 text-gray-600" />
                            <h5 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Reason</h5>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{insight.reason}</p>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-l-blue-500">
                          <div className="flex items-center space-x-2 mb-2">
                            <Lightbulb className="w-4 h-4 text-blue-600" />
                            <h5 className="text-sm font-bold text-blue-800 uppercase tracking-wide">Recommendation</h5>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed font-medium">{insight.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

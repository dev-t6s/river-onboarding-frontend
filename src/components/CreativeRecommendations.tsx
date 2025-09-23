/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import {
  AlertTriangle,
  Clock,
  Rocket,
  RefreshCw,
  CheckCircle,
  Zap,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Target,
} from "lucide-react";
import { Badge } from '@geist-ui/core';
import { OverallActionItem } from "@/types/meta-ads";

type PriorityLevel = "HIGH" | "MEDIUM" | "LOW";

interface CreativeRecommendationsProps {
  recommendations: OverallActionItem[];
  className?: string;
}

const priorityOrder: Record<PriorityLevel, number> = {
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

export const CreativeRecommendations = ({
  recommendations,
  className,
}: CreativeRecommendationsProps) => {
  const [expandedPriority, setExpandedPriority] =
    React.useState<PriorityLevel | null>("HIGH");

  // Group by priority and sort by priority order
  const priorityGroups = recommendations.reduce((acc: any, rec: any) => {
    if (!acc[rec.priority]) {
      acc[rec.priority] = [];
    }
    acc[rec.priority].push(rec);
    return acc;
  }, {} as Record<PriorityLevel, OverallActionItem[]>);

  const togglePriority = (priority: PriorityLevel) => {
    setExpandedPriority(expandedPriority === priority ? null : priority);
  };

  const getPriorityIcon = (priority: PriorityLevel) => {
    const icons = {
      HIGH: <AlertTriangle className="h-5 w-5 text-red-500" />,
      MEDIUM: <Clock className="h-5 w-5 text-yellow-500" />,
      LOW: <CheckCircle className="h-5 w-5 text-green-500" />,
    };
    return icons[priority];
  };

  const getActionIcon = (action: string) => {
    if (action.includes("Pause")) return <Clock className="h-4 w-4 mr-2" />;
    if (action.includes("Increase")) return <Rocket className="h-4 w-4 mr-2" />;
    if (action.includes("Refresh")) return <RefreshCw className="h-4 w-4 mr-2" />;
    return <Zap className="h-4 w-4 mr-2" />;
  };

  // const getImpactColor = (priority: PriorityLevel) => {
  //   const colors = {
  //     HIGH: "bg-red-100 text-red-800",
  //     MEDIUM: "bg-yellow-100 text-yellow-800",
  //     LOW: "bg-green-100 text-green-800",
  //   };
  //   return colors[priority];
  // };

  const getPriorityDescription = (priority: PriorityLevel) => {
    const descriptions = {
      HIGH: "Immediate action required",
      MEDIUM: "Address within 24-48 hours",
      LOW: "Consider when resources allow",
    };
    return descriptions[priority];
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Optimization Recommendations</h3>
          <p className="text-sm text-gray-500 mt-1">AI-powered insights for campaign improvement</p>
        </div>
      </div>

      <div className="space-y-4">
        {(Object.keys(priorityGroups) as PriorityLevel[])
          .sort((a, b) => priorityOrder[a] - priorityOrder[b])
          .map((priority) => {
            const items = priorityGroups[priority];
            const isExpanded = expandedPriority === priority;

            return (
              <div key={priority} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => togglePriority(priority)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    {getPriorityIcon(priority)}
                    <div className="ml-3 text-left">
                      <div className="font-medium font-mono">
                        {priority.toLowerCase().charAt(0).toUpperCase() + priority.toLowerCase().slice(1)} Priority
                        <Badge style={{ color:'#ffffff', backgroundColor:'#0072f5', marginLeft:'4px'}} scale={0.5}>{items.length}</Badge>
                      </div>
                      <div className="text-xs text-gray-500">
                        {getPriorityDescription(priority)}
                      </div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>

                {isExpanded && (
                  <div className="divide-y">
                    {items.map((rec: any, index: any) => (
                      <div key={index} className="p-4 bg-white mx-2 my-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start flex-1">
                            <div className="flex items-center mt-1">
                              {getActionIcon(rec.action)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-gray-900">{rec.headline}</h4>
                              </div>
                              
                              {/* <div className="mb-3">
                                <div className="flex items-center text-xs text-gray-500 mb-1">
                                  <Eye className="h-3 w-3 mr-1" />
                                  Current Observation
                                </div>
                                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded font-mono">
                                  {rec.observation}
                                </p>
                              </div> */}

                              {rec.recommendation.length > 0 && (
                                <div>
                                  <div className="flex items-center text-xs text-gray-500 mb-2 mt-6">
                                    <Target className="h-3 w-3 mr-1" />
                                    Recommended Actions
                                  </div>
                                  <div className="space-y-1">
                                    {rec.recommendation.map((action: any, i: number) => (
                                      <div key={i} className="flex items-start">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                                        <span className="text-sm text-gray-700">{action}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center text-xs text-gray-500">
          Recommendations are generated based on performance trends and AI analysis
        </div>
        <div className="text-xs text-gray-400">
          <TrendingUp className="h-5 w-5 mr-1" />
        </div>
      </div>
    </div>
  );
};
import React, { useState } from "react";
import { Badge } from '@geist-ui/core';
import {
  Image as ImageIcon,
  Film,
  LayoutGrid,
  List,
  Maximize2,
  Scale
} from "lucide-react";
import { CreativeModalPerformance } from "@/types/meta-ads";
import Link from "next/link";

type FilterType = "mediaType" | "contentAngle" | "messagingAngle";

export const CreativeGalleryModal = ({
  creatives,
  sortBy,
  selectedCreative,
  onSelectCreative,
  compareMode,
  creativesToCompare,
  onToggleCompare,
  filterType, // 'mediaType', 'contentAngle', or 'messagingAngle'
  filterValue // The value to filter by
}: {
  creatives: CreativeModalPerformance[];
  sortBy: string;
  selectedCreative: string | null;
  onSelectCreative: (id: string | null) => void;
  compareMode: boolean;
  creativesToCompare: string[];
  onToggleCompare: (id: string) => void;
  filterType?: FilterType;
  filterValue?: string | null;
}) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter creatives based on the filter type and value
  const filteredCreatives = filterType && filterValue
    ? creatives.filter(creative => {
        if (filterType === "mediaType") return creative.mediaType === filterValue;
        if (filterType === "contentAngle") return creative.content_angle === filterValue;
        if (filterType === "messagingAngle") return creative.messaging_angle === filterValue;
        return true;
      })
    : creatives;

  const sortedCreatives = [...filteredCreatives].sort((a, b) => {
    if (sortBy === "roas") return b.roas - a.roas;
    if (sortBy === "ctr") return b.ctr - a.ctr;
    if (sortBy === "cvr") return b.cvr - a.cvr;
    return b.spend - a.spend;
  });

  return (
    <div className="bg-white rounded-xl">
      <div className="flex justify-end items-center mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg ${
              viewMode === "grid" ? "bg-gray-100" : "text-gray-400"
            }`}
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg ${
              viewMode === "list" ? "bg-gray-100" : "text-gray-400"
            }`}
          >
            <List className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-lg text-gray-400">
            <Maximize2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {sortedCreatives.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No creatives found matching this filter
        </div>
      ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedCreatives.map((creative, index) => 
            creative.permalink ? (
              <Link
                key={`${creative.creativeId}_${index}`}
                className={`border rounded-lg overflow-hidden transition-all duration-200 ${
                  selectedCreative === creative.creativeId
                    ? "ring-2 ring-blue-500 border-blue-500"
                    : "border-gray-200 hover:border-gray-300"
                } ${
                  compareMode && creativesToCompare.includes(creative.creativeId)
                    ? "ring-2 ring-purple-500"
                    : ""
                }`}
                href={creative.permalink ? creative.permalink : ''}
                target="_blank"
              >
                <div className="relative">
                  {creative.thumbnailUrl ? (
                    <img
                      src={creative.thumbnailUrl}
                      alt="Creative thumbnail"
                      className="w-full h-40 object-cover cursor-pointer"
                      onClick={() => onSelectCreative(creative.creativeId)}
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                      {creative.mediaType === "video" ? (
                        <Film className="h-10 w-10 text-gray-400" />
                      ) : (
                        <ImageIcon className="h-10 w-10 text-gray-400" />
                      )}
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs font-bold px-2 py-1 rounded">
                    {creative.roas.toFixed(1)}x ROAS
                  </div>
                  <div className="absolute top-2 right-2 flex items-center space-x-1">
                    {
                      creative.status.toLowerCase() === 'active' ? (
                        <Badge style={{ color:'#297a3a', backgroundColor:'#ebfaeb'}} scale={0.8} paddingLeft="10px" paddingRight="10px" padding="6px">Active</Badge>
                      ) : creative.status.toLowerCase() === 'paused' ? (
                        <Badge style={{ color:'#171717', backgroundColor:'#ebebeb'}} scale={0.8} paddingLeft="10px" paddingRight="10px" padding="6px">Paused</Badge>
                      ) : (
                        <Badge style={{ color:'#cb2a2f', backgroundColor:'#ffebeb'}} scale={0.8} paddingLeft="10px" paddingRight="10px" padding="6px">Deleted</Badge>
                      )
                    }
                    {compareMode && (
                      <button
                        onClick={() => onToggleCompare(creative.creativeId)}
                        className={`ml-1 p-1 rounded-full ${
                          creativesToCompare.includes(creative.creativeId)
                            ? "bg-purple-600 text-white"
                            : "bg-white text-gray-700"
                        }`}
                      >
                        <Scale className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm line-clamp-1">
                        {creative.adName}
                      </h4>
                      <div className="flex space-x-2 mt-1">
                        <span className="text-xs text-gray-600">
                          {creative.ctr.toFixed(1)}% CTR
                        </span>
                        <span className="text-xs text-gray-600">
                          {creative.cvr.toFixed(1)}% CVR
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="mt-1 text-xs text-gray-500">
                    ID: {creative.creativeId}
                  </span>
                  <div className="mt-2 flex justify-between text-xs">
                    <span className="text-gray-500">
                      {creative.impressions.toLocaleString('en-IN')} impressions
                    </span>
                    <span className="font-medium">
                      ₹{creative.spend.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </Link>
            ) : (
              <div
                key={`${creative.creativeId}_${index}`}
                className={`border rounded-lg overflow-hidden transition-all duration-200 ${
                  selectedCreative === creative.creativeId
                    ? "ring-2 ring-blue-500 border-blue-500"
                    : "border-gray-200 hover:border-gray-300"
                } ${
                  compareMode && creativesToCompare.includes(creative.creativeId)
                    ? "ring-2 ring-purple-500"
                    : ""
                }`}
              >
                <div className="relative">
                  {creative.thumbnailUrl ? (
                    <img
                      src={creative.thumbnailUrl}
                      alt="Creative thumbnail"
                      className="w-full h-40 object-cover cursor-pointer"
                      onClick={() => onSelectCreative(creative.creativeId)}
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                      {creative.mediaType === "video" ? (
                        <Film className="h-10 w-10 text-gray-400" />
                      ) : (
                        <ImageIcon className="h-10 w-10 text-gray-400" />
                      )}
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs font-bold px-2 py-1 rounded">
                    {creative.roas.toFixed(1)}x ROAS
                  </div>
                  <div className="absolute top-2 right-2 flex items-center space-x-1">
                    {
                      creative.status.toLowerCase() === 'active' ? (
                        <Badge style={{ color:'#297a3a', backgroundColor:'#ebfaeb'}} scale={0.8} paddingLeft="10px" paddingRight="10px" padding="6px">Active</Badge>
                      ) : creative.status.toLowerCase() === 'paused' ? (
                        <Badge style={{ color:'#171717', backgroundColor:'#ebebeb'}} scale={0.8} paddingLeft="10px" paddingRight="10px" padding="6px">Paused</Badge>
                      ) : (
                        <Badge style={{ color:'#cb2a2f', backgroundColor:'#ffebeb'}} scale={0.8} paddingLeft="10px" paddingRight="10px" padding="6px">Deleted</Badge>
                      )
                    }
                    {compareMode && (
                      <button
                        onClick={() => onToggleCompare(creative.creativeId)}
                        className={`ml-1 p-1 rounded-full ${
                          creativesToCompare.includes(creative.creativeId)
                            ? "bg-purple-600 text-white"
                            : "bg-white text-gray-700"
                        }`}
                      >
                        <Scale className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm line-clamp-1">
                        {creative.adName}
                      </h4>
                      <div className="flex space-x-2 mt-1">
                        <span className="text-xs text-gray-600">
                          {creative.ctr.toFixed(1)}% CTR
                        </span>
                        <span className="text-xs text-gray-600">
                          {creative.cvr.toFixed(1)}% CVR
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="mt-1 text-xs text-gray-500">
                    ID:  &nbsp;&nbsp;N/A
                  </span>
                  <div className="mt-2 flex justify-between text-xs">
                    <span className="text-gray-500">
                      {creative.impressions.toLocaleString('en-IN')} impressions
                    </span>
                    <span className="font-medium">
                      ₹{creative.spend.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {sortedCreatives.map((creative, index) => (
            creative.permalink ? (
              <Link
                key={`${creative.creativeId}_${index}`}
                className={`border rounded-lg p-3 flex items-start transition-all duration-200 ${
                  selectedCreative === creative.creativeId
                    ? "ring-2 ring-blue-500 border-blue-500"
                    : "border-gray-200 hover:border-gray-300"
                } ${
                  compareMode && creativesToCompare.includes(creative.creativeId)
                    ? "ring-2 ring-purple-500"
                    : ""
                }`}
                href={creative.permalink ? creative.permalink : ''}
                target="_blank"
              >
                <div className="relative mr-3">
                  {creative.thumbnailUrl ? (
                    <img
                      src={creative.thumbnailUrl}
                      alt="Creative thumbnail"
                      className="w-20 h-20 object-cover rounded cursor-pointer"
                      onClick={() => onSelectCreative(creative.creativeId)}
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
                      {creative.mediaType === "video" ? (
                        <Film className="h-6 w-6 text-gray-400" />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                  )}
                  {compareMode && (
                    <button
                      onClick={() => onToggleCompare(creative.creativeId)}
                      className={`absolute -top-2 -right-2 p-1 rounded-full ${
                        creativesToCompare.includes(creative.creativeId)
                          ? "bg-purple-600 text-white"
                          : "bg-white text-gray-700"
                      }`}
                    >
                      <Scale className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{creative.headline}</h4>
                    <div>
                      {
                        creative.status.toLowerCase() === 'active' ? (
                          <Badge style={{ color:'#297a3a', backgroundColor:'#ebfaeb'}} scale={0.8} paddingLeft="10px" paddingRight="10px" padding="6px">Active</Badge>
                        ) : creative.status.toLowerCase() === 'paused' ? (
                          <Badge style={{ color:'#171717', backgroundColor:'#ebebeb'}} scale={0.8} paddingLeft="10px" paddingRight="10px" padding="6px">Paused</Badge>
                        ) : (
                          <Badge style={{ color:'#cb2a2f', backgroundColor:'#ffebeb'}} scale={0.8} paddingLeft="10px" paddingRight="10px" padding="6px">Deleted</Badge>
                        )
                      }
                    </div>
                  </div>
                  <div className="flex space-x-4 mt-1 text-sm">
                    <span className="font-bold text-blue-600">
                      {creative.roas.toFixed(1)}x ROAS
                    </span>
                    <span>{creative.ctr.toFixed(1)}% CTR</span>
                    <span>{creative.cvr.toFixed(1)}% CVR</span>
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <span>
                      {creative.impressions.toLocaleString()} impressions
                    </span>
                    <span className="font-medium">
                      ₹{creative.spend.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </Link>
            ) : (
              <div
                key={`${creative.creativeId}_${index}`}
                className={`border rounded-lg p-3 flex items-start transition-all duration-200 ${
                  selectedCreative === creative.creativeId
                    ? "ring-2 ring-blue-500 border-blue-500"
                    : "border-gray-200 hover:border-gray-300"
                } ${
                  compareMode && creativesToCompare.includes(creative.creativeId)
                    ? "ring-2 ring-purple-500"
                    : ""
                }`}
              >
                <div className="relative mr-3">
                  {creative.thumbnailUrl ? (
                    <img
                      src={creative.thumbnailUrl}
                      alt="Creative thumbnail"
                      className="w-20 h-20 object-cover rounded cursor-pointer"
                      onClick={() => onSelectCreative(creative.creativeId)}
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
                      {creative.mediaType === "video" ? (
                        <Film className="h-6 w-6 text-gray-400" />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                  )}
                  {compareMode && (
                    <button
                      onClick={() => onToggleCompare(creative.creativeId)}
                      className={`absolute -top-2 -right-2 p-1 rounded-full ${
                        creativesToCompare.includes(creative.creativeId)
                          ? "bg-purple-600 text-white"
                          : "bg-white text-gray-700"
                      }`}
                    >
                      <Scale className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{creative.headline}</h4>
                    <div>
                      {
                        creative.status.toLowerCase() === 'active' ? (
                          <Badge style={{ color:'#297a3a', backgroundColor:'#ebfaeb'}} scale={0.8} paddingLeft="10px" paddingRight="10px" padding="6px">Active</Badge>
                        ) : creative.status.toLowerCase() === 'paused' ? (
                          <Badge style={{ color:'#171717', backgroundColor:'#ebebeb'}} scale={0.8} paddingLeft="10px" paddingRight="10px" padding="6px">Paused</Badge>
                        ) : (
                          <Badge style={{ color:'#cb2a2f', backgroundColor:'#ffebeb'}} scale={0.8} paddingLeft="10px" paddingRight="10px" padding="6px">Deleted</Badge>
                        )
                      }
                    </div>
                  </div>
                  <div className="flex space-x-4 mt-1 text-sm">
                    <span className="font-bold text-blue-600">
                      {creative.roas.toFixed(1)}x ROAS
                    </span>
                    <span>{creative.ctr.toFixed(1)}% CTR</span>
                    <span>{creative.cvr.toFixed(1)}% CVR</span>
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <span>
                      {creative.impressions.toLocaleString()} impressions
                    </span>
                    <span className="font-medium">
                      ₹{creative.spend.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {sortedCreatives.length > 0 && (
        <div className="mt-6 text-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View all {sortedCreatives.length} creatives →
          </button>
        </div>
      )}
    </div>
  );
};
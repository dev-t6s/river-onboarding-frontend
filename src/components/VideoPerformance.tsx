import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Play, TrendingDown, Eye, Target, Clock, Award } from 'lucide-react';
import { VideoAnalyticsData } from '@/types/meta-ads';
import Link from 'next/link';

export default function VideoPerformance({ data }: 
  {data: {table: VideoAnalyticsData}}
) {

  const avgCompletionRate = (data.table.completion_rate_hist.reduce((acc, curr) => acc + curr.avg_completion_rate, 0) / data.table.completion_rate_hist.length).toFixed(1);
  const peakDropOff = Math.max(...data.table.avg_drop_off.map(item => item.avg_drop_off_rate)).toFixed(1);
  const topRoas = Math.max(...data.table.top_3_videos.map(video => video.roas)).toFixed(1);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-lg mr-3">
            <Play className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Video Performance</h2>
            <p className="text-sm text-gray-500">Campaign analytics overview</p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-sm text-gray-500">Avg Completion</div>
            <div className="text-lg font-bold text-green-600">{avgCompletionRate}%</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Peak Drop-off</div>
            <div className="text-lg font-bold text-red-600">{peakDropOff}%</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Top ROAS</div>
            <div className="text-lg font-bold text-blue-600">{topRoas}x</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Completion Rate Chart */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Clock className="h-4 w-4 text-gray-600 mr-2" />
            <h3 className="text-sm font-semibold text-gray-900">Completion Rate by Duration</h3>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.table.completion_rate_hist}
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="bucket_position" 
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  axisLine={{ stroke: '#d1d5db' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  axisLine={{ stroke: '#d1d5db' }}
                />
                {/* <Tooltip content={<CustomTooltip suffix="s" />} /> */}
                <Bar 
                  dataKey="avg_completion_rate" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Drop-off Rate Chart */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <TrendingDown className="h-4 w-4 text-gray-600 mr-2" />
            <h3 className="text-sm font-semibold text-gray-900">Drop-off Rate Over Time</h3>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data.table.avg_drop_off}
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="duration" 
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  axisLine={{ stroke: '#d1d5db' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  axisLine={{ stroke: '#d1d5db' }}
                />
                {/* <Tooltip content={<CustomTooltip suffix="s" />} /> */}
                <Line 
                  type="monotone" 
                  dataKey="avg_drop_off_rate" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', r: 3 }} 
                  activeDot={{ r: 4, fill: '#dc2626' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Videos Section */}
      <div>
        <div className="flex items-center mb-4">
          <Award className="h-4 w-4 text-gray-600 mr-2" />
          <h3 className="text-sm font-semibold text-gray-900">Top Performing Videos</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.table.top_3_videos.map((video, index) => (
            <Link
              key={index}
              className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              href={video.permalink} 
              target="_blank"
            >
              {/* Ranking */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-xs font-medium text-gray-900">{video.ad_name}</span>
                </div>
              </div>

              {/* Thumbnail */}
              <div className="relative mb-3 overflow-hidden rounded-md group ring-1 ring-neutral-300">
                <img
                  src={video.thumbnailUrl}
                  alt="thumbnail"
                  className="w-full h-40 object-cover cursor-pointer"
                />
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Eye className="h-3 w-3 text-blue-500 mr-1" />
                    <span className="text-xs text-gray-500">CTR</span>
                  </div>
                  <div className="text-sm font-bold text-blue-600">
                    {(video.ctr).toFixed(1)}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Target className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-gray-500">ROAS</span>
                  </div>
                  <div className="text-sm font-bold text-green-600">
                    {video.roas}x
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

interface PerformanceTrendsProps {
    dailyData: any[];
    campaignSummary: any[];
    selectedMetric: string;
    setSelectedMetric: (metric: string) => void;
}

export const PerformanceTrends = ({
    dailyData,
    campaignSummary,
    selectedMetric,
    setSelectedMetric
}: PerformanceTrendsProps) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-black">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Performance Trends</h2>
                    <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                        <SelectTrigger className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-black">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="roas">ROAS</SelectItem>
                            <SelectItem value="spend">Spend</SelectItem>
                            <SelectItem value="purchaseValue">Revenue</SelectItem>
                            <SelectItem value="ctr">CTR</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={dailyData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12 }}
                            tickFormatter={(date) =>
                                new Date(date).toLocaleDateString("en-IN", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                            labelFormatter={(date) => new Date(date).toLocaleDateString()}
                            formatter={(value, name) => [
                                typeof value === "number" ? value.toLocaleString() : value,
                                name === "spend"
                                    ? "Spend"
                                    : name === "purchaseValue"
                                        ? "Revenue"
                                        : (name as string).toUpperCase(),
                            ]}
                        />
                        <Area
                            type="monotone"
                            dataKey={selectedMetric}
                            stroke="#3B82F6"
                            fill="url(#gradient)"
                            strokeWidth={2}
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Spend Distribution</h2>
                </div>
                <div className="flex space-x-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                        {campaignSummary.length} Campaigns
                    </span>
                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium">
                        ₹{(Number(campaignSummary.reduce((sum, item) => sum + item.spend, 0))/1000).toFixed(1)}K Total
                    </span>
                </div>
                
                <div className="relative">
                    <ResponsiveContainer width="100%" height={320}>
                        <PieChart>
                            <Pie
                                data={campaignSummary}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={110}
                                paddingAngle={2}
                                dataKey="spend"
                                nameKey="campaignName"
                                animationBegin={0}
                                animationDuration={1000}
                                animationEasing="ease-out"
                            >
                                {campaignSummary.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={colors[index % colors.length]}
                                        stroke="#fff"
                                        strokeWidth={2}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value, name, props) => [
                                    `₹${(Number(value)/1000).toFixed(1)}K`,
                                    props.payload.campaign || name,
                                ]}
                                contentStyle={{
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)'
                                }}
                            />
                            <text
                                x="50%"
                                y="50%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-xl font-bold fill-gray-700"
                            >
                                ₹{(Number(campaignSummary.reduce((sum, item) => sum + item.spend, 0))/1000).toFixed(1)}K
                            </text>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import { RefreshCw, Target, DollarSign, UserCheck, Clock, Zap, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { InsightCard } from "@/components/InsightCard";
import { CampaignCard } from "@/components/CampaignCard";

interface RetargetingAnalysisProps {
    retargetingAnalysis: any[];
    retentionMetrics: any[];
    selectedMetric: string;
    setSelectedMetric: (metric: string) => void;
    timeRange: string;
    setTimeRange: (range: string) => void;
    selectedAudience: string;
    setSelectedAudience: (audience: string) => void;
    totalSpend: number;
}

export const RetargetingAnalysis = ({
    retargetingAnalysis,
    retentionMetrics,
    selectedMetric,
    setSelectedMetric,
    timeRange,
    setTimeRange,
    selectedAudience,
    setSelectedAudience,
    totalSpend,
}: RetargetingAnalysisProps) => {
    const totalRevenue = retargetingAnalysis.reduce((sum, item) => sum + item.revenue, 0);
    const overallROAS = totalRevenue / totalSpend;

    const retargetingData = retargetingAnalysis.find(r => r.type === 'Retargeting');
    const prospectingData = retargetingAnalysis.find(r => r.type === 'Prospecting');
    const retargetingPercentage = ((retargetingData?.spend || 0) / totalSpend * 100);

    const bestPerformer = retargetingAnalysis.reduce((best, current) =>
        current.roas > best.roas ? current : best
    );

    const filteredData = useMemo(() => {
        let data = [...retargetingAnalysis];
        if (selectedAudience !== 'all') {
            data = data.filter(item => item.type.toLowerCase().includes(selectedAudience.toLowerCase()));
        }
        return data;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAudience]);

    return (
        <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <RefreshCw className="w-5 h-5 text-indigo-600 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-900">Remarketing & Retention Analysis</h2>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={selectedMetric}
                        onChange={(e) => setSelectedMetric(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="roas">ROAS</option>
                        <option value="revenue">Revenue</option>
                        <option value="conversions">Conversions</option>
                        <option value="cpa">CPA</option>
                    </select>

                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                <InsightCard
                    icon={Target}
                    title="Best Performer"
                    insight={`${bestPerformer.type} campaigns delivering highest returns`}
                    actionable="Scale this campaign type for maximum efficiency"
                    color="green"
                    value={`${bestPerformer.roas.toFixed(1)}x`}
                    trend="ROAS"
                />

                <InsightCard
                    icon={RefreshCw}
                    title="Retargeting Efficiency"
                    insight={`${retargetingData?.roas.toFixed(1)}x ROAS vs ${prospectingData?.roas.toFixed(1)}x for prospecting`}
                    actionable="Increase retargeting budget allocation"
                    color="blue"
                    value={`${((retargetingData?.roas || 0) / (prospectingData?.roas || 1)).toFixed(1)}x`}
                    trend="better than prospecting"
                />

                <InsightCard
                    icon={DollarSign}
                    title="Budget Allocation"
                    insight={`${retargetingPercentage.toFixed(1)}% of spend on retargeting audiences`}
                    actionable="Optimize budget distribution for better ROI"
                    color="orange"
                    value={`${retargetingPercentage.toFixed(1)}%`}
                    trend="retargeting allocation"
                />

                <InsightCard
                    icon={UserCheck}
                    title="Retention Rate"
                    insight={`${retentionMetrics[4]?.retentionRate}% users retained after 2 months`}
                    actionable="Implement retention campaigns for improvement"
                    color="purple"
                    value={`${retentionMetrics[4]?.retentionRate}%`}
                    trend="2-month retention"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
                <div className="xl:col-span-2">
                    <div className="bg-white text-black rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
                                Campaign Performance Comparison
                            </h3>
                            <div className="text-sm text-gray-600">
                                Total ROI: {overallROAS.toFixed(2)}x
                            </div>
                        </div>

                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="type" />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip
                                    formatter={(value, name) => [
                                        name === 'spend' || name === 'revenue' ? `₹${value.toLocaleString()}` :
                                            name === 'roas' ? `${(value as number).toFixed(2)}x` : Number(value).toLocaleString(),
                                        name === 'spend' ? 'Spend' :
                                            name === 'revenue' ? 'Revenue' :
                                                name === 'roas' ? 'ROAS' : 'Conversions'
                                    ]}
                                />
                                <Legend />
                                <Bar yAxisId="left" dataKey="spend" fill="#6366f1" name="Spend" />
                                <Bar yAxisId="left" dataKey="revenue" fill="#10b981" name="Revenue" />
                                <Bar yAxisId="right" dataKey="roas" fill="#f59e0b" name="ROAS" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-8 flex items-center">
                        <Target className="w-5 h-5 mr-2 text-indigo-600" />
                        Campaign Types
                    </h3>
                    <div className="space-y-3">
                        {retargetingAnalysis.map((campaign, index) => (
                            <CampaignCard
                                key={campaign.type}
                                campaign={campaign}
                                index={index}
                                isSelected={selectedAudience === campaign.type.toLowerCase()}
                                onClick={() => setSelectedAudience(
                                    selectedAudience === campaign.type.toLowerCase() ? 'all' : campaign.type.toLowerCase()
                                )}
                                overallROAS={overallROAS}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white text-black rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-indigo-600" />
                    User Retention Curve
                </h3>

                <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={retentionMetrics}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip
                            formatter={(value, name) => [
                                name === 'retentionRate' ? `${value}%` : value.toLocaleString(),
                                name === 'retentionRate' ? 'Retention Rate' : 'Active Users'
                            ]}
                        />
                        <Area
                            type="monotone"
                            dataKey="retentionRate"
                            stroke="#8b5cf6"
                            fill="url(#retentionGradient)"
                            strokeWidth={3}
                        />
                        <defs>
                            <linearGradient id="retentionGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h4 className="font-semibold text-lg text-black mb-4 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2 text-indigo-600" />
                        Budget Optimization
                    </h4>

                    <div className="mb-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                                <div>
                                    <span className="text-sm font-medium text-gray-700">Retargeting</span>
                                    <div className="text-xs text-green-600">Higher ROAS potential</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-green-600">+₹25K</div>
                                    <div className="text-xs text-gray-500">→ ₹75K (16.7%)</div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                                <div>
                                    <span className="text-sm font-medium text-gray-700">Prospecting</span>
                                    <div className="text-xs text-red-600">Lower efficiency</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-red-600">-₹15K</div>
                                    <div className="text-xs text-gray-500">→ ₹335K (55.8%)</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-700 mb-3">Expected Results</div>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <div className="text-lg font-bold text-indigo-600">+12%</div>
                                <div className="text-xs text-gray-600">Overall ROAS</div>
                            </div>
                            <div>
                                <div className="text-lg font-bold text-green-600">+₹18K</div>
                                <div className="text-xs text-gray-600">Additional Revenue</div>
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-indigo-200">
                            <div className="text-center">
                                <div className="text-sm font-medium text-gray-700">ROI on Budget Shift</div>
                                <div className="text-xl font-bold text-purple-600">180%</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                    <h4 className="font-semibold text-lg mb-7 flex items-center">
                        <Zap className="w-5 h-5 mr-2" />
                        Optimization Strategies
                    </h4>
                    <div className="space-y-4">
                        <div className="flex items-start bg-white/20 rounded-lg p-3">
                            <div className="p-1 bg-green-500 rounded-full mr-3 mt-3.5">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <div>
                                <div className="font-medium text-md">Dynamic Product Ads</div>
                                <div className="text-sm opacity-90">Set up for cart abandoners - potential 25% uplift</div>
                            </div>
                        </div>

                        <div className="flex items-start bg-white/20 rounded-lg p-3">
                            <div className="p-1 bg-blue-500 rounded-full mr-3 mt-3.5">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <div>
                                <div className="font-medium text-md">Purchaser Exclusions</div>
                                <div className="text-sm opacity-90">Exclude past buyers from prospecting to reduce waste</div>
                            </div>
                        </div>

                        <div className="flex items-start bg-white/20 rounded-lg p-3">
                            <div className="p-1 bg-orange-500 rounded-full mr-3 mt-3.5">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <div>
                                <div className="font-medium text-md">Cross-sell Campaigns</div>
                                <div className="text-sm opacity-90">Target existing customers with complementary products</div>
                            </div>
                        </div>

                        <div className="flex items-start bg-white/20 rounded-lg p-3">
                            <div className="p-1 bg-purple-500 rounded-full mr-3 mt-3.5">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <div>
                                <div className="font-medium text-md">Lookalike Scaling</div>
                                <div className="text-sm opacity-90">Create 1-2% lookalikes from high-value customers</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
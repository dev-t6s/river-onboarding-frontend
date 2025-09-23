import { Eye, RefreshCw, Users, Repeat } from "lucide-react";

type CampaignType = "Retargeting" | "Prospecting" | "Lookalike" | "Cross-sell";

interface Campaign {
  type: CampaignType;
  spend: number;
  revenue: number;
  roas: number;
  audienceSize: number;
}

interface CampaignCardProps {
  campaign: Campaign;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  overallROAS: number;
}

const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

const campaignTypeIcons = {
  Retargeting: RefreshCw,
  Prospecting: Eye,
  Lookalike: Users,
  "Cross-sell": Repeat,
};

export const CampaignCard = ({
  campaign,
  index,
  isSelected,
  onClick,
  overallROAS,
}: CampaignCardProps) => {
  const Icon = campaignTypeIcons[campaign.type] || Eye;
  const efficiency =
    campaign.roas > overallROAS ? "high" : campaign.roas > 2 ? "medium" : "low";

  return (
    <div
      className={`bg-white rounded-lg p-4 border-2 transition-all duration-200 cursor-pointer ${
        isSelected
          ? "border-indigo-500 shadow-lg transform scale-105"
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div
            className={`p-2 rounded-lg mr-3`}
            style={{ backgroundColor: `${colors[index]}20` }}
          >
            <Icon className="w-5 h-5" style={{ color: colors[index] }} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{campaign.type}</h4>
            <p className="text-sm text-gray-600">
              {campaign.audienceSize} audience
            </p>
          </div>
        </div>
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            efficiency === "high"
              ? "bg-green-100 text-green-700"
              : efficiency === "medium"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {efficiency.toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm text-black">
        <div>
          <div className="text-gray-600">Spend</div>
          <div className="font-semibold">₹{campaign.spend.toFixed(0)}</div>
        </div>
        <div>
          <div className="text-gray-600">Revenue</div>
          <div className="font-semibold">₹{campaign.revenue.toFixed(0)}</div>
        </div>
        <div>
          <div className="text-gray-600">ROAS</div>
          <div className="font-semibold">{campaign.roas.toFixed(1)}x</div>
        </div>
      </div>
    </div>
  );
};

import { Eye, CreditCard, CheckCircle, ArrowDown, MousePointer, ShoppingCart } from "lucide-react";

type StageName = 'Impressions' | 'Clicks' | 'Add to Cart' | 'Checkout' | 'Purchases';

interface Stage {
    name: StageName;
    value: number;
    width: number;
    color: string;
    ratio: number;
    conversionFromPrevious: number;
}

interface ConversionRate {
    lost: number;
    dropOffRate: number;
}

interface FunnelStageProps {
    stage: Stage;
    index: number;
    funnelVizData: Stage[];
    conversionRates: ConversionRate[];
}

const stageIcons = {
    'Impressions': Eye,
    'Clicks': MousePointer,
    'Add to Cart': ShoppingCart,
    'Checkout': CreditCard,
    'Purchases': CheckCircle
};

export const FunnelStage = ({
    stage,
    index,
    funnelVizData,
    conversionRates,
}: FunnelStageProps) => {
    const Icon = stageIcons[stage.name];

    return (
        <div
            className={`relative mb-6 cursor-pointer transition-all duration-300`}
        >
            <div className="flex items-center">
                <div className="flex-1 flex items-center">
                    <div className={`p-3 rounded-xl mr-4 bg-gray-100`}>
                        <Icon className={`w-6 h-6 text-gray-600`} />
                    </div>

                    <div className="flex-1 relative">
                        <div className="bg-gray-200 rounded-full h-8 relative overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500`}
                                style={{
                                    width: `${stage.width}%`,
                                    backgroundColor: stage.color,
                                    background: stage.color
                                }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse opacity-0 hover:opacity-100 transition-opacity"></div>
                            </div>
                        </div>

                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <span className="text-sm font-bold text-black drop-shadow-lg">
                                {stage.value.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="text-right min-w-32">
                    <div className="font-semibold text-gray-900">{stage.name}</div>
                    <div className="text-sm text-gray-600">
                        {stage.ratio >= 0.01 ? `${(stage.ratio * 100).toFixed(1)}%` : '<0.1%'} of total
                    </div>
                    {index > 0 && (
                        <div className={`text-xs font-medium ${stage.conversionFromPrevious >= 50 ? 'text-green-600' : stage.conversionFromPrevious >= 20 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {stage.conversionFromPrevious.toFixed(1)}% conversion
                        </div>
                    )}
                </div>
            </div>

            {index < funnelVizData.length - 1 && (
                <div className="flex justify-center my-4">
                    <div className="flex items-center text-gray-500">
                        <ArrowDown className="w-5 h-5" />
                        <span className="ml-2 text-sm">
                            -{conversionRates[index]?.lost.toLocaleString()} users ({conversionRates[index]?.dropOffRate.toFixed(1)}% drop-off)
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};
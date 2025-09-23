import React from "react";
import { Smile, Frown, Meh } from "lucide-react";

interface FaceDetectionData {
  withFaces: {
    roas: number;
    ctr: number;
    cvr: number;
    spend: number;
  }[];
  withoutFaces: {
    roas: number;
    ctr: number;
    cvr: number;
    spend: number;
  }[];
}

export const FaceDetectionInsights = ({
  data,
}: {
  data?: FaceDetectionData;
}) => {
  if (!data || data.withFaces.length === 0) return null;

  const withFacesAvg = {
    roas:
      data.withFaces.reduce((sum, item) => sum + item.roas, 0) /
      data.withFaces.length,
    ctr:
      data.withFaces.reduce((sum, item) => sum + item.ctr, 0) /
      data.withFaces.length,
    cvr:
      data.withFaces.reduce((sum, item) => sum + item.cvr, 0) /
      data.withFaces.length,
    spend: data.withFaces.reduce((sum, item) => sum + item.spend, 0),
  };

  const withoutFacesAvg = {
    roas:
      data.withoutFaces.reduce((sum, item) => sum + item.roas, 0) /
      data.withoutFaces.length,
    ctr:
      data.withoutFaces.reduce((sum, item) => sum + item.ctr, 0) /
      data.withoutFaces.length,
    cvr:
      data.withoutFaces.reduce((sum, item) => sum + item.cvr, 0) /
      data.withoutFaces.length,
    spend: data.withoutFaces.reduce((sum, item) => sum + item.spend, 0),
  };

  const roasDifference = withFacesAvg.roas / withoutFacesAvg.roas - 1;
  const ctrDifference = withFacesAvg.ctr / withoutFacesAvg.ctr - 1;

  const getEmotionIcon = () => {
    const positiveEmotions = ["happy", "surprised"];
    const negativeEmotions = ["angry", "sad"];
    // This would come from actual data in a real implementation
    const sampleEmotion = "happy";

    if (positiveEmotions.includes(sampleEmotion))
      return <Smile className="h-5 w-5 text-green-500" />;
    if (negativeEmotions.includes(sampleEmotion))
      return <Frown className="h-5 w-5 text-red-500" />;
    return <Meh className="h-5 w-5 text-yellow-500" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold flex items-center mb-4">
        <Smile className="h-5 w-5 mr-2 text-blue-500" />
        Face Detection Impact
      </h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium">Creatives with faces</div>
          <div className="text-sm font-medium">
            {data.withFaces.length} (
            {Math.round(
              (data.withFaces.length /
                (data.withFaces.length + data.withoutFaces.length)) *
                100
            )}
            %)
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium">Avg. ROAS with faces</div>
          <div className="text-sm font-bold text-green-600">
            {withFacesAvg.roas.toFixed(1)}x ({(roasDifference * 100).toFixed(0)}
            % higher)
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium">Avg. CTR with faces</div>
          <div className="text-sm font-bold text-green-600">
            {withFacesAvg.ctr.toFixed(1)}% ({(ctrDifference * 100).toFixed(0)}%
            higher)
          </div>
        </div>
        <div className="pt-4 mt-4 border-t border-gray-100">
          <div className="flex items-center">
            {getEmotionIcon()}
            <div className="ml-2 text-sm">
              <span className="font-medium">Dominant emotion:</span>{" "}
              <span className="text-gray-600">Happy</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 text-xs text-gray-500">
        Creatives with human faces perform better on average
      </div>
    </div>
  );
};

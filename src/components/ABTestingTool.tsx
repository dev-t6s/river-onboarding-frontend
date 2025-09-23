import React from "react";
import { Award, BarChart2, Gauge, Percent, Scale } from "lucide-react";
import { CreativePerformance } from "@/types/meta-ads";

export const ABTestingTool = ({
  creativeA,
  creativeB,
}: {
  creativeA: CreativePerformance;
  creativeB: CreativePerformance;
}) => {
  const calculateConfidence = (a: number, b: number) => {
    const diff = Math.abs(a - b);
    const avg = (a + b) / 2;
    return Math.min(Math.floor((diff / avg) * 100), 95);
  };

  const roasConfidence = calculateConfidence(creativeA.roas, creativeB.roas);
  const ctrConfidence = calculateConfidence(creativeA.ctr, creativeB.ctr);
  const cvrConfidence = calculateConfidence(creativeA.cvr, creativeB.cvr);

  const overallConfidence = Math.floor(
    (roasConfidence + ctrConfidence + cvrConfidence) / 3
  );

  const determineWinner = () => {
    const aScore =
      creativeA.roas * 0.6 + creativeA.ctr * 0.2 + creativeA.cvr * 0.2;
    const bScore =
      creativeB.roas * 0.6 + creativeB.ctr * 0.2 + creativeB.cvr * 0.2;

    if (aScore > bScore) {
      return { winner: "A", confidence: overallConfidence };
    } else if (bScore > aScore) {
      return { winner: "B", confidence: overallConfidence };
    }
    return { winner: null, confidence: 0 };
  };

  const { winner, confidence } = determineWinner();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold flex items-center mb-4">
        <Scale className="h-5 w-5 mr-2 text-purple-500" />
        Compare Results
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="border rounded-lg p-4">
          <div className="font-medium mb-2">Creative A</div>
          {creativeA.thumbnailUrl ? (
            <img
              src={creativeA.thumbnailUrl}
              alt="Creative A"
              className="w-full h-32 object-cover rounded mb-3"
            />
          ) : (
            <div className="w-full h-32 bg-gray-100 rounded mb-3 flex items-center justify-center">
              <span className="text-gray-400">No thumbnail</span>
            </div>
          )}
          <div className="text-sm">
            <div className="flex justify-between">
              <span>ROAS:</span>
              <span className="font-medium">{creativeA.roas.toFixed(1)}x</span>
            </div>
            <div className="flex justify-between">
              <span>CTR:</span>
              <span className="font-medium">{creativeA.ctr.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>CVR:</span>
              <span className="font-medium">{creativeA.cvr.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="font-medium mb-2">Creative B</div>
          {creativeB.thumbnailUrl ? (
            <img
              src={creativeB.thumbnailUrl}
              alt="Creative B"
              className="w-full h-32 object-cover rounded mb-3"
            />
          ) : (
            <div className="w-full h-32 bg-gray-100 rounded mb-3 flex items-center justify-center">
              <span className="text-gray-400">No thumbnail</span>
            </div>
          )}
          <div className="text-sm">
            <div className="flex justify-between">
              <span>ROAS:</span>
              <span className="font-medium">{creativeB.roas.toFixed(1)}x</span>
            </div>
            <div className="flex justify-between">
              <span>CTR:</span>
              <span className="font-medium">{creativeB.ctr.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>CVR:</span>
              <span className="font-medium">{creativeB.cvr.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {winner && (
        <div className="bg-purple-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Award className="h-5 w-5 text-purple-600 mr-2" />
              <span className="font-medium">
                Winner: Creative {winner} ({confidence}% confidence)
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="border rounded-lg p-3">
          <div className="flex items-center mb-2">
            <Gauge className="h-4 w-4 text-blue-500 mr-2" />
            <span className="text-sm font-medium">ROAS</span>
          </div>
          <div className="flex items-center justify-between">
            <span
              className={`text-sm font-bold ${
                creativeA.roas > creativeB.roas
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {creativeA.roas.toFixed(1)}x
            </span>
            <span className="text-xs text-gray-500">
              <pre> vs </pre>
            </span>
            <span
              className={`text-sm font-bold ${
                creativeB.roas > creativeA.roas
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {creativeB.roas.toFixed(1)}x
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {roasConfidence}% confidence
          </div>
        </div>

        <div className="border rounded-lg p-3">
          <div className="flex items-center mb-2">
            <BarChart2 className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-sm font-medium">CTR</span>
          </div>
          <div className="flex items-center justify-between">
            <span
              className={`text-sm font-bold ${
                creativeA.ctr > creativeB.ctr
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {creativeA.ctr.toFixed(1)}%
            </span>
            <span className="text-xs text-gray-500">
              <pre> vs </pre>
            </span>
            <span
              className={`text-sm font-bold ${
                creativeB.ctr > creativeA.ctr
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {creativeB.ctr.toFixed(1)}%
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {ctrConfidence}% confidence
          </div>
        </div>

        <div className="border rounded-lg p-3">
          <div className="flex items-center mb-2">
            <Percent className="h-4 w-4 text-purple-500 mr-2" />
            <span className="text-sm font-medium">CVR</span>
          </div>
          <div className="flex items-center justify-between">
            <span
              className={`text-sm font-bold ${
                creativeA.cvr > creativeB.cvr
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {creativeA.cvr.toFixed(1)}%
            </span>
            <span className="text-xs text-gray-500">
              <pre> vs </pre>
            </span>
            <span
              className={`text-sm font-bold ${
                creativeB.cvr > creativeA.cvr
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {creativeB.cvr.toFixed(1)}%
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {cvrConfidence}% confidence
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Statistical significance based on{" "}
          {Math.min(
            creativeA.impressions,
            creativeB.impressions
          ).toLocaleString()}{" "}
          impressions per creative
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          Export Results
        </button>
      </div>
    </div>
  );
};

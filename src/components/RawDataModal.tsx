/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { X, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";

const ReactJson = dynamic(() => import("react-json-view"), {
  ssr: false,
  loading: () => <Loader2 className="animate-spin text-blue-500" size={32} />,
});

interface RawDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: {
    dataY: any;
    dataX: any;
  };
}

const RawDataModal: React.FC<RawDataModalProps> = ({
  isOpen,
  onClose,
  title,
  data,
}) => {
  const [isDataYExpanded, setIsDataYExpanded] = useState(false);
  const [isDataXExpanded, setIsDataXExpanded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsDataYExpanded(false);
      setIsDataXExpanded(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-4 flex-grow overflow-auto bg-gray-50 text-sm leading-relaxed">
          {data ? (
            <>
              {data.dataY && (
                <div className="mb-6">
                  <div
                    className="flex items-center cursor-pointer mb-2"
                    onClick={() => setIsDataYExpanded(!isDataYExpanded)}
                  >
                    {isDataYExpanded ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                    <h3 className="font-semibold text-lg ml-2 text-gray-700">
                      Consolidated Data
                    </h3>
                  </div>
                  {isDataYExpanded && (
                    <div className="bg-white p-3 rounded-md border border-gray-200">
                      <ReactJson
                        src={data.dataY}
                        name="consolidatedAdsData"
                        collapsed={2}
                        enableClipboard={true}
                        theme="rjv-default"
                        style={{ fontFamily: "monospace", fontSize: "1rem" }}
                      />
                    </div>
                  )}
                </div>
              )}

              {data.dataX && (
                <div>
                  <div
                    className="flex items-center cursor-pointer mb-2"
                    onClick={() => setIsDataXExpanded(!isDataXExpanded)}
                  >
                    {isDataXExpanded ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                    <h3 className="font-semibold text-lg ml-2 text-gray-700">
                      Advanced Data
                    </h3>
                  </div>
                  {isDataXExpanded ? (
                    <div className="bg-white p-3 rounded-md border border-gray-200">
                      <ReactJson
                        src={data.dataX}
                        name="advancedAdsData"
                        collapsed={2}
                        enableClipboard={true}
                        theme="rjv-default"
                        style={{ fontFamily: "monospace", fontSize: "1rem" }}
                      />
                    </div>
                  ) : (
                    <p className="text-gray-600 italic ml-6">
                      Click to expand. Advanced Data can be very large and may
                      affect performance if fully expanded.
                    </p>
                  )}
                </div>
              )}

              {!data.dataY && !data.dataX && (
                <p className="text-gray-600">No raw data available.</p>
              )}
            </>
          ) : (
            <p className="text-gray-600">No raw data available.</p>
          )}
        </div>
        <div className="p-4 border-t border-gray-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RawDataModal;

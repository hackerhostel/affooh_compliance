import React, { useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

const RiskLevelCell = ({ data }) => {
  const [impact, setImpact] = useState(data.impact || 1);
  const [likelihood, setLikelihood] = useState(data.likelihood || 1); // you can add controls for this if needed

  const updateImpact = (delta) => {
    const newImpact = Math.min(120, Math.max(1, impact + delta));
    setImpact(newImpact);
    data.impact = newImpact;
    data.riskLevel = newImpact * likelihood;
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Controls Row */}
      <div className="flex space-x-2">
        <div className="flex items-center space-x-2">
          {/* Increase Impact */}
          <button
            onClick={() => updateImpact(1)}
            className="w-16 h-6 bg-gray-200 text-xs rounded hover:bg-gray-300"
          >
            <div className="flex items-center justify-center space-x-2">
              <span>1</span> <ChevronUpIcon className="w-4 h-4" />
            </div>
          </button>

          {/* Decrease Impact */}
          <button
            onClick={() => updateImpact(-1)}
            className="w-16 h-6 bg-gray-200 text-xs rounded hover:bg-gray-300"
          >
            <div className="flex items-center justify-center space-x-2">
              <span>1</span> <ChevronDownIcon className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      {/* Risk Score */}
      <div className="bg-primary-pink text-white rounded px-16 py-1 text-sm font-semibold">
        {impact * likelihood}
      </div>
    </div>
  );
};

export default RiskLevelCell;

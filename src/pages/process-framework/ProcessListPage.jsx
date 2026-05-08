import React, { useEffect } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { PROCESS_FRAMEWORK_TYPES } from "../../utils/processFrameworkApi.js";

const typeMeta = {
  POLICY: { classification: "Public" },
  DOCUMENT: { classification: "Public" },
  PROCESS: { classification: "Confidential" },
  STANDARD: { classification: "Restricted" },
  TEMPLATE: { classification: "Restricted" },
};

const ProcessFrameworkListPage = ({ selectedType, onTypeChange }) => {
  useEffect(() => {
    if (!selectedType) {
      onTypeChange?.("POLICY");
    }
  }, [selectedType]);

  const getColorClass = (classification) => {
    switch (classification) {
      case "Public":
        return "text-green-600";
      case "Confidential":
        return "text-yellow-500";
      case "Restricted":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="h-[calc(100vh-250px)] overflow-y-auto flex flex-col gap-3 pl-5 pr-3 mt-6">
      {PROCESS_FRAMEWORK_TYPES.map((item) => {
        const classification = typeMeta[item.value]?.classification;
        return (
          <div
            key={item.value}
            onClick={() => onTypeChange?.(item.value)}
            className={`relative flex justify-between items-center p-3 border rounded-md w-64 gap-2 hover:bg-gray-100 cursor-pointer ${
              selectedType === item.value
                ? "border-primary-pink border-2"
                : "border-gray-200"
            }`}
          >
            <div className="flex flex-col">
              <div className="font-medium text-gray-900">{item.label}</div>
              <div className={`text-sm font-semibold ${getColorClass(classification)}`}>
                {classification}
              </div>
            </div>
            <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
          </div>
        );
      })}
    </div>
  );
};

export default ProcessFrameworkListPage;

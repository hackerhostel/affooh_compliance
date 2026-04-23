import React, { useState } from "react";
import RiskManagementOverview from "./RiskManagementOverview.jsx";
import RiskManagementHistory from "./RiskManagementHistory.jsx";

const RiskManagementContentPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="bg-dashboard-bgc min-h-screen">
      <div className="flex flex-col gap-6">
        {/* Header Row: Title and Tabs */}
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-2xl font-bold text-gray-800 text-left">Risk Management</h4>
          <div className="flex bg-gray-200 p-1 rounded-xl shadow-inner">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-8 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === "overview"
                ? "bg-black text-white shadow-md"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-8 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === "history"
                ? "bg-black text-white shadow-md"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              History
            </button>
          </div>
        </div>

        {activeTab === "overview" && <RiskManagementOverview hideTitle={true} />}
        {activeTab === "history" && <RiskManagementHistory />}
      </div>
    </div>
  );
};

export default RiskManagementContentPage;

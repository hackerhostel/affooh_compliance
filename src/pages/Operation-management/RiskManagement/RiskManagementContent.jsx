import React, { useState } from "react";
import RiskManagementOverview from "./RiskManagementOverview.jsx";
import RiskManagementHistory from "./RiskManagementHistory.jsx";
import UpdateRiskManagement from "./UpdateRiskManagement.jsx";

const RiskManagementContentPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // NEW STATES
  const [showUpdate, setShowUpdate] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState(null);

  // This function will be called from child component
  const handleOpenUpdate = (rowData) => {
    setSelectedRisk(rowData);
    setShowUpdate(true);
  };

  const handleCloseUpdate = () => {
    setShowUpdate(false);
    setSelectedRisk(null);
  };

  return (
    <div className="bg-dashboard-bgc min-h-screen">
      <div className="flex flex-col gap-6">
        
        {/* If update page open → hide tabs */}
        {!showUpdate && (
          <div className="flex justify-end mb-6">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-2 rounded-2xl ${
                  activeTab === "overview"
                    ? "bg-black text-white"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                Overview
              </button>

              <button
                onClick={() => setActiveTab("history")}
                className={`px-6 py-2 rounded-2xl ${
                  activeTab === "history"
                    ? "bg-black text-white"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                History
              </button>
            </div>
          </div>
        )}

        {/* SHOW UPDATE PAGE */}
        {showUpdate && (
          <UpdateRiskManagement 
            data={selectedRisk}
            onClose={handleCloseUpdate}
          />
        )}

        {/* SHOW NORMAL TABS */}
        {!showUpdate && activeTab === "overview" && (
          <RiskManagementOverview openUpdatePage={handleOpenUpdate} />
        )}

        {!showUpdate && activeTab === "history" && (
          <RiskManagementHistory />
        )}

      </div>
    </div>
  );
};

export default RiskManagementContentPage;

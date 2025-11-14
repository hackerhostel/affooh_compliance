import React, { useState } from "react";
import NonConformanceOverview from "./NonConformanceOverview.jsx";
import NonConformanceHistory from "./NonConformanceHistory.jsx";
import NonConformanceUpdate from "./NonConformanceUpdate.jsx";

const NonConformanceContentPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRow, setSelectedRow] = useState(null); 

  const handleRowClick = (row) => {
    setSelectedRow(row); 
  };

  const handleBack = () => {
    setSelectedRow(null); 
  };

  return (
    <div className="bg-dashboard-bgc min-h-screen">
      <div className="flex flex-col gap-6">
        <div style={{ flex: 1 }} className="rounded-lg">
          {/* Tabs */}
          <div className="flex justify-end mb-6">
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setActiveTab("overview");
                  setSelectedRow(null); 
                }}
                className={`px-6 py-2 rounded-2xl ${
                  activeTab === "overview"
                    ? "bg-black text-white"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => {
                  setActiveTab("history");
                  setSelectedRow(null);
                }}
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

          {/* Render Logic */}
          {activeTab === "overview" && !selectedRow && (
            <NonConformanceOverview onRowClick={handleRowClick} />
          )}

          {activeTab === "overview" && selectedRow && (
            <NonConformanceUpdate row={selectedRow} onBack={handleBack} />
          )}

          {activeTab === "history" && <NonConformanceHistory />}
        </div>
      </div>
    </div>
  );
};

export default NonConformanceContentPage;

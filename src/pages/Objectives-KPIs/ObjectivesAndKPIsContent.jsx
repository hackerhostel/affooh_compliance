import React, { useState } from "react";
import ObjectivesAndKPIsHistory from "./ObjectivesAndKPIsHistory";
import ObjectivesAndKPIsOverview from "./ObjectivesAndKPIsOverview";
import ObjectiveDetailView from "./ObjectiveDetailView";

const ObjectivesAndKPIsContentPage = ({ selectedDocument }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [viewingObjectiveId, setViewingObjectiveId] = useState(null);

  // If we are viewing a specific objective, show the detail view
  if (viewingObjectiveId) {
    return (
      <div className="bg-dashboard-bgc min-h-screen">
        <ObjectiveDetailView
          objectiveId={viewingObjectiveId}
          onBack={() => setViewingObjectiveId(null)}
        />
      </div>
    );
  }

  return (
    <div className=" bg-dashboard-bgc min-h-screen">
      <div className="flex flex-col gap-6">
        {/* Tabs */}
        <div style={{ flex: 1 }} className="rounded-lg">
          <div className="flex justify-end mb-6">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-2 rounded-2xl ${activeTab === "overview"
                  ? "bg-black text-white"
                  : "bg-gray-200 text-black hover:bg-gray-300"
                  }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-6 py-2 rounded-2xl ${activeTab === "history"
                  ? "bg-black text-white"
                  : "bg-gray-200 text-black hover:bg-gray-300"
                  }`}
              >
                History
              </button>
            </div>
          </div>

          {activeTab === "overview" && (
            <ObjectivesAndKPIsOverview
              selectedDocument={selectedDocument}
              onView={(id) => setViewingObjectiveId(id)}
            />
          )}
          {activeTab === "history" && <ObjectivesAndKPIsHistory selectedDocument={selectedDocument} />}
        </div>
      </div>
    </div>
  );
};

export default ObjectivesAndKPIsContentPage;

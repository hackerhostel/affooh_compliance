import React, { useState } from "react";
import ServiceProviderHistory from "./ServiceProviderHistory";
import ServiceProviderList from "./ServiceProviderList";
import ServiceProviderCriteria from "./ServiceProviderCriteria";

const ServiceProviderContentPage = () => {
  // Left sidebar removed; state related to it has been removed
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className=" bg-dashboard-bgc min-h-screen">
      <div className="flex flex-col gap-6">
        {/* Tabs */}
        <div style={{ flex: 1 }} className="rounded-lg">
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
              <button
                onClick={() => setActiveTab("Approved List")}
                className={`px-6 py-2 rounded-2xl ${
                  activeTab === "Approved List"
                    ? "bg-black text-white"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                Approved List
              </button>
              <button
                onClick={() => setActiveTab("Criteria")}
                className={`px-6 py-2 rounded-2xl ${
                  activeTab === "Criteria"
                    ? "bg-black text-white"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                Criteria
              </button>
            </div>
          </div>

          {activeTab === "overview" && <ServiceProviderOverview />}
          {activeTab === "Approved List" && <ServiceProviderList />}
          {activeTab === "Criteria" && <ServiceProviderCriteria />}
          {activeTab === "history" && <ServiceProviderHistory />}
        </div>
      </div> 
    </div>
  );
};

export default ServiceProviderContentPage;

import React, { useState } from "react";
import SupplierHistory from "./SupplierHistory";
import SupplierOverview from "./SupplierOverview";
import SupplierCriteria from "./SupplierCriteria";
import SupplierProviderList from "./ServiceProviderList";

const SupplierContentPage = () => {
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
                onClick={() => setActiveTab("Approve List")}
                className={`px-6 py-2 rounded-2xl ${
                  activeTab === "Approve List"
                    ? "bg-black text-white"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                Approve List
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
              <button
                onClick={() => setActiveTab("History")}
                className={`px-6 py-2 rounded-2xl ${
                  activeTab === "History"
                    ? "bg-black text-white"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                History
              </button>
            </div>
          </div>

          {activeTab === "overview" && <SupplierOverview />}
          {activeTab === "Approve List" && <SupplierProviderList />}
          {activeTab === "Criteria" && <SupplierCriteria />}
          {activeTab === "history" && <SupplierHistory />}
        </div>
      </div> 
    </div>
  );
};

export default SupplierContentPage;

import React, { useState } from "react";
import ServiceProviderHistory from "./ServiceProviderHistory";
import ServiceProviderOverview from "./ServiceProviderOverview";
import ServiceProviderDetail from "./ServiceProviderDetail";
import ServiceProviderCriteria from "./ServiceProviderCriteria";

const ServiceProviderContentPage = () => {
  // Left sidebar removed; state related to it has been removed
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedServiceProviderId, setSelectedServiceProviderId] = useState(null);

  const handleSelectServiceProvider = (id) => {
    setSelectedServiceProviderId(id);
    setActiveTab("detail");
  };

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
                    ? "bg-primary-pink text-white"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                Approved List
              </button>
              <button
                onClick={() => setActiveTab("criteria")}
                className={`px-6 py-2 rounded-2xl ${
                  activeTab === "criteria"
                    ? "bg-primary-pink text-white"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                Criteria
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-6 py-2 rounded-2xl ${
                  activeTab === "history"
                    ? "bg-primary-pink text-white"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                History
              </button>
            </div>
          </div>

          {activeTab === "overview" && (
            <ServiceProviderOverview onSelectServiceProvider={handleSelectServiceProvider} />
          )}
          {activeTab === "criteria" && <ServiceProviderCriteria />}
          {activeTab === "history" && <ServiceProviderHistory />}
          {activeTab === "detail" && (
            <ServiceProviderDetail
              serviceProviderId={selectedServiceProviderId}
              onBack={() => setActiveTab("overview")}
            />
          )}
        </div>
      </div> 
    </div>
  );
};

export default ServiceProviderContentPage;

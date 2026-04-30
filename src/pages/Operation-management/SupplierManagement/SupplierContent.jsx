import React, { useState } from "react";
import SupplierHistory from "./SupplierHistory";
import SupplierOverview from "./SupplierOverview";
import SupplierCriteria from "./SupplierCriteria";
import SupplierDetail from "./SupplierDetail";

const SupplierContentPage = () => {
  // Left sidebar removed; state related to it has been removed
  const [activeTab, setActiveTab] = useState("approved");
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);

  return (
    <div className=" bg-dashboard-bgc min-h-screen">
      <div className="flex flex-col gap-6">
        {/* Tabs */}
        <div style={{ flex: 1 }} className="rounded-lg">
          {/* Don't show tabs if viewing details */}
          {!selectedSupplierId && (
            <div className="flex justify-end mb-6">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab("approved")}
                  className={`px-6 py-2 rounded-2xl ${
                    activeTab === "approved"
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
          )}

          {!selectedSupplierId ? (
            <>
              {activeTab === "approved" && <SupplierOverview onSelectSupplier={setSelectedSupplierId} />}
              {activeTab === "criteria" && <SupplierCriteria />}
              {activeTab === "history" && <SupplierHistory />}
            </>
          ) : (
            <SupplierDetail supplierId={selectedSupplierId} onBack={() => setSelectedSupplierId(null)} />
          )}
        </div>
      </div> 
    </div>
  );
};

export default SupplierContentPage;

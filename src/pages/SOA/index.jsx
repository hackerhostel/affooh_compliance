import React, { useState } from "react";
import SOAOverview from "./SOAOverview.jsx";
import SOAHistory from "./SOAHistory.jsx";

const SOALayout = () => {
    const [activeTab, setActiveTab] = useState("overview");

    return (
        <div className="bg-dashboard-bgc min-h-screen">
            <div className="flex flex-col gap-6">
                <div style={{ flex: 1 }} className="rounded-lg">
                    <div className="flex justify-end mb-6">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setActiveTab("overview")}
                                className={`px-6 py-2 rounded-2xl ${activeTab === "overview" ? "bg-black text-white" : "bg-gray-200 text-black hover:bg-gray-300"}`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab("history")}
                                className={`px-6 py-2 rounded-2xl ${activeTab === "history" ? "bg-black text-white" : "bg-gray-200 text-black hover:bg-gray-300"}`}
                            >
                                History
                            </button>
                        </div>
                    </div>
                    {activeTab === "overview" && <SOAOverview />}
                    {activeTab === "history" && <SOAHistory />}
                </div>
            </div>
        </div>
    );
};

export default SOALayout;

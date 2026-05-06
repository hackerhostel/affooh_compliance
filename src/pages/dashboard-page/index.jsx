import React, { useState } from "react";
import MainPageLayout from "../../layouts/MainPageLayout";
import DashboardListPage from "../dashboard-page/dashboardListPage";
// import WebSocketComponent from "./WebSocketComponent.jsx";
import DashboardContentPage from "./dashboardContentPage.jsx";

const DashboardLayout = () => {
  const [selectedDashboard, setSelectedDashboard] = useState("Overview");

  return (
    <MainPageLayout
      title="Dashboard"
      leftColumn={<DashboardListPage selectedDashboard={selectedDashboard} onSelect={setSelectedDashboard} />}
      rightColumn={<DashboardContentPage selectedDashboard={selectedDashboard} />}
      // rightColumn={<WebSocketComponent/>}
    />
  );
};

export default DashboardLayout;

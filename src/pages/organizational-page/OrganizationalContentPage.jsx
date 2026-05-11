import React from "react";
import ContextContent from "./context/ContextContent.jsx";
import OrgChartPage from "../org-structure/OrgChartPage.jsx";
import SWOTContent from "./SWOT/SWOTContent.jsx";
import PESTContent from "./PEST/PESTContent.jsx";
import StakeholderContextContent from "./Stakeholder-context/StakeholderContent.jsx";
import CommunicationRegisterContent from './communication-register/CommunicationRegisterContent.jsx';
import SOAOverview from "../SOA/SOAOverview.jsx";

const OrganizationalContentPage = ({ selectedDocument }) => {
  const renderContent = () => {
    if (!selectedDocument) {
      return <ContextContent />;
    }

    switch (selectedDocument.name) {
      case "Context":
        return <ContextContent />;
      case "Organization Structure":
        return <OrgChartPage />;
      case "SWOT":
        return <SWOTContent />;
      case "PEST":
        return <PESTContent />;
      case "Stakeholder Context":
        return <StakeholderContextContent />;
      case "Communication Register":
        return <CommunicationRegisterContent />;
      case "Statement of Applicability":
        return <SOAOverview />;
      default:
        return <ContextContent />;
    }
  };

  return <div className="p-6 bg-dashboard-bgc min-h-screen">{renderContent()}</div>;
};

export default OrganizationalContentPage;

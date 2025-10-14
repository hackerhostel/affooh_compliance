import React from "react";
import ContextContent from "./context/ContextContent.jsx";
import OrganizationChartContent from "./OrganizationChart/OrganizationChartContent.jsx";
import SWOTContent from "./SWOT/SWOTContent.jsx";
import PESTContent from "./PEST/PESTContent.jsx";
import StakeholderContextContent from "./Stakeholder-context/StakeholderContent.jsx"
import CommunicationRegisterContent  from './communication-register/CommunicationRegisterContent.jsx'


const OrganizationalContentPage = ({ selectedDocument }) => {
  const renderContent = () => {
    if (!selectedDocument) {
      return (
        <div className="text-gray-600 text-center mt-10">
          <ContextContent />
        </div>
      );
    }

    switch (selectedDocument.name) {
      case "Context":
        return <ContextContent />;
      case "Organization Chart":
        return <OrganizationChartContent />;
      case "SWOT":
        return <SWOTContent />;
      case "PEST":
        return <PESTContent />;
      case "Stakeholder Context":
        return <StakeholderContextContent />;
      case "Communication Register":
        return <CommunicationRegisterContent />;
      default:
        return (
          <div className="text-gray-600 text-center mt-10">
            <ContextContent />
          </div>
        );
    }
  };

  return <div className="p-6 bg-dashboard-bgc min-h-screen">{renderContent()}</div>;
};

export default OrganizationalContentPage;

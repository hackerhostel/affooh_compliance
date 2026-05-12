import React from "react";
import ContextContent from "./context/ContextContent.jsx";
import OrgStructureLayout from "../org-structure/index.jsx";
import SWOTContent from "./SWOT/SWOTContent.jsx";
import PESTContent from "./PEST/PESTContent.jsx";
import StakeholderContextContent from "./Stakeholder-context/StakeholderContent.jsx";
import CommunicationRegisterContent from './communication-register/CommunicationRegisterContent.jsx';
import SOALayout from "../SOA/index.jsx";

const OrganizationalContentPage = ({ selectedDocument }) => {
  const renderContent = () => {
    if (!selectedDocument) {
      return <ContextContent />;
    }

    switch (selectedDocument.name) {
      case "Context":
        return <ContextContent />;
      case "Organization Structure":
        return <OrgStructureLayout />;
      case "SWOT":
        return <SWOTContent />;
      case "PEST":
        return <PESTContent />;
      case "Stakeholder Context":
        return <StakeholderContextContent />;
      case "Communication Register":
        return <CommunicationRegisterContent />;
      case "Statement of Applicability":
        return <SOALayout />;
      default:
        return <ContextContent />;
    }
  };

  return <div className="p-6 bg-dashboard-bgc min-h-screen">{renderContent()}</div>;
};

export default OrganizationalContentPage;

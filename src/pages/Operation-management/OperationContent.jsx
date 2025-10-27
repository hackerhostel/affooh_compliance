import React from "react";
import RiskManagementContentPage from "./RiskManagement/RiskManagementContent";


const RoleContentPage = ({ selectedDocument }) => {
  const renderContent = () => {
    if (!selectedDocument) {
      return (
        <div className="text-gray-600 text-center mt-10">
          <RiskManagementContentPage />
        </div>
      );
    }

    switch (selectedDocument.name) {
      case "RIsk Management":
        return <RiskManagementContentPage />;
      case "RASCI":
        return <RASCIContentPage />;
      case "Skill Inventory":
        return <SkillInventoryContentPage />;
      case "Competency Matrix":
        return <CompetencyMatrixContentPage />;
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

export default RoleContentPage;

import React from "react";
import SteeringCommitteeContentPage from "./SteeringCommittee/SteeringCommitteeContent";
import RASCIContentPage from "./RASCI/RASCIContent";
import SkillInventoryContentPage from "./SkillInventory/SkillInventoryContent";
import CompetencyMatrixContentPage from "./CompetencyMatrix/CompetencyMatrixContent";


const RoleContentPage = ({ selectedDocument }) => {
  const renderContent = () => {
    if (!selectedDocument) {
      return (
        <div className="text-gray-600 text-center mt-10">
          <SteeringCommitteeContentPage />
        </div>
      );
    }

    switch (selectedDocument.name) {
      case "Steering Committee":
        return <SteeringCommitteeContentPage />;
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

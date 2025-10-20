import React from "react";
import HardwareAssetContentPage from "./Hardware-asset/HardwareAssetContent";


const AssetManagementContentPage = ({ selectedDocument }) => {
  const renderContent = () => {
    if (!selectedDocument) {
      return (
        <div className="text-gray-600 text-center mt-10">
          <HardwareAssetContentPage />
        </div>
      );
    }

    switch (selectedDocument.name) {
      case "Hardware Asset":
        return <HardwareAssetContentPage />;
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

export default AssetManagementContentPage;

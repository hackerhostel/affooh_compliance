import SteeringCommitteeContentPage from "./SteeringCommittee/SteeringCommitteeContent";
import RASCIContentPage from "./RASCI/RASCIContent";
import SkillInventoryContentPage from "./SkillInventory/SkillInventoryContent";
import CompetencyMatrixContentPage from "./CompetencyMatrix/CompetencyMatrixContent";
import UserAccessMatrixContentPage from "./UserAccessMatrix/UserAccessMatrixContent";

const RoleContentPage = ({ selectedDocument }) => {
  const renderContent = () => {
    if (!selectedDocument) {
      return <SteeringCommitteeContentPage />;
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
      case "User access Matrix":
        return <UserAccessMatrixContentPage />;
      default:
        return <SteeringCommitteeContentPage />;
    }
  };

  return <div className="p-6 bg-dashboard-bgc min-h-screen">{renderContent()}</div>;
};

export default RoleContentPage;

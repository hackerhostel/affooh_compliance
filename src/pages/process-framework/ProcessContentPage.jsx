import React from "react";
import PolicyContent  from "./Policy/PolicyContent.jsx";
import ProcessContentPage from "./process/ProcessContent.jsx";
import StandardContentPage from "./Standards/StandardContent.jsx";
import TemplateContentPage from "./Templates/TemplateContent.jsx";


const ProcessFrameworkContentPage = ({ selectedDocument }) => {
  const renderContent = () => {
    if (!selectedDocument) {
      return (
        <div className="text-gray-600 text-center mt-10">
          <PolicyContent />
        </div>
      );
    }

    switch (selectedDocument.name) {
      case "Policy":
        return <PolicyContent />;
      case "Process":
        return <ProcessContentPage />;
      case "Standards":
        return <StandardContentPage />;
      case "Templates":
        return <TemplateContentPage />;
      case "Stakeholder Context":
        return <StakeholderContextContent />;
      case "Communication Register":
        return <CommunicationRegisterContent />;
      default:
        return (
          <div className="text-gray-600 text-center mt-10">
            <PolicyContent />
          </div>
        );
    }
  };

  return <div className="p-6 bg-dashboard-bgc min-h-screen">{renderContent()}</div>;
};

export default ProcessFrameworkContentPage;

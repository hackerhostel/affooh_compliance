import React from "react";
import GapAnalysisContentPage from "./Gap-Analysis/GapAnalysisContent";
import NonConformanceContentPage from "./Non-conformance/NonConformanceContent";


const ReviewAndAuditsContentPage = ({ selectedDocument }) => {
  const renderContent = () => {
    if (!selectedDocument) {
      return (
        <div className="text-gray-600 text-center mt-10">
          <GapAnalysisContentPage selectedDocument={selectedDocument} />
        </div>
      );
    }

    if (selectedDocument.type === "ISO 27001" || selectedDocument.type === "ISO 9001") {
      return <GapAnalysisContentPage selectedDocument={selectedDocument} />;
    }

    switch (selectedDocument.name) {
      case "Non Conformance":
        return <NonConformanceContentPage />;
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

export default ReviewAndAuditsContentPage;

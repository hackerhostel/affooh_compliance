import React from "react";
import RiskManagementContentPage from "./RiskManagement/RiskManagementContent";
import IncidentManagementContentPage from "./IncidentManagement/IncidentManagementContent";
import CustomerSatisfactionContentPage from "./CustomerSatisfaction/CustomerSatisfactionContent";
import SupplierContentPage from "./SupplierManagement/SupplierContent";
import ServiceProviderContentPage from "./Service-Provider/ServiceProviderContent";


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
      case "Incident Management":
        return <IncidentManagementContentPage />;
      case "Customer Satisfaction":
        return <CustomerSatisfactionContentPage />;
      case "Supplier Management":
        return <SupplierContentPage />;
      case "Service Provider Management":
        return <ServiceProviderContentPage />;
      case "Communication Register":
        return <CommunicationRegisterContent />;
      default:
        return (
          <div className="text-gray-600 text-center mt-10">
            <RiskManagementContentPage />
          </div>
        );
    }
  };

  return <div className="p-6 bg-dashboard-bgc min-h-screen">{renderContent()}</div>;
};

export default RoleContentPage;

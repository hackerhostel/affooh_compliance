import React from "react";
import HardwareAssetContentPage from "./Hardware-asset/HardwareAssetContent";
import SoftwareAssetContentPage from "./Software-asset/SoftwareAssetContent";
import DataAssetContentPage from "./Data-asset/DataAssetContent";
import CloudAssetContentPage from "./Cloud-asset/CloudAssetContent";
import DeviceMovedContentPage from "./Device-moved/DeviceMovedContent";
import DeviceDisposedContentPage from "./Device-disposed/DeviceDisposedContent";


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
      case "Software Asset":
        return <SoftwareAssetContentPage />;
      case "Data Asset":
        return <DataAssetContentPage />;
      case "Cloud Asset":
        return <CloudAssetContentPage />;
      case "Device Moved":
        return <DeviceMovedContentPage />;
      case "Device Disposed":
        return <DeviceDisposedContentPage />;
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

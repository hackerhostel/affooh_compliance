import React, { useState } from "react";
import MainPageLayout from "../../layouts/MainPageLayout.jsx";
import AssetManagementListPage from "./AssetManagementListPage.jsx";
import AssetManagementContentPage from "./AssetManagementContentPage.jsx";

const AssetManagementLayout = () => {
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const onAddNew = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDocumentSelect = (document) => {
    setSelectedDocument(document);
  };

  return (
    <MainPageLayout
      title="Asset Management"
      leftColumn={
        <AssetManagementListPage
          selectedFolderId={selectedFolderId}
          onSelect={setSelectedFolderId}
          onDocumentSelect={handleDocumentSelect}
        />
      }
      rightColumn={<AssetManagementContentPage selectedDocument={selectedDocument} />}
      onAction={onAddNew}
    />
  );
};

export default AssetManagementLayout;

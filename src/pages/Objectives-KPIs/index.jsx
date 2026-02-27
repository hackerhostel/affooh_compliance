import React, { useState } from "react";
import MainPageLayout from "../../layouts/MainPageLayout.jsx";
import ObjectivesAndKPIsListPage from "./ObjectivesAndKPIsListPage.jsx";
import ObjectivesAndKPIsContentPage from "./ObjectivesAndKPIsContent.jsx";
import AddCollectionPopup from "./AddCollectionPopup.jsx";

const ObjectivesAndKPIsLayout = () => {
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const onAddNew = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDocumentSelect = (document) => {
    setSelectedDocument(document);
  };

  const handleAddSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <>
      <MainPageLayout
        title="Objectives And KPIs"
        leftColumn={
          <ObjectivesAndKPIsListPage
            selectedFolderId={selectedFolderId}
            onSelect={setSelectedFolderId}
            onDocumentSelect={handleDocumentSelect}
            selectedDocument={selectedDocument}
            refreshTrigger={refreshTrigger}
          />
        }
        rightColumn={<ObjectivesAndKPIsContentPage selectedDocument={selectedDocument} />}
        onAction={onAddNew}
        subText="Add New"
      />
      <AddCollectionPopup
        isOpen={isOpen}
        onClose={handleClose}
        onAddSuccess={handleAddSuccess}
      />
    </>
  );
};

export default ObjectivesAndKPIsLayout;

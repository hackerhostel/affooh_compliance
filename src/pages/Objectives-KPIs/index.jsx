import React, { useState } from "react";
import MainPageLayout from "../../layouts/MainPageLayout.jsx";
import ObjectivesAndKPIsListPage from "./ObjectivesAndKPIsListPage.jsx";
import ObjectivesAndKPIsContentPage from "./ObjectivesAndKPIsContent.jsx";

const ObjectivesAndKPIsLayout = () => {
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
      title="Objectives And KPIs"
      leftColumn={
        <ObjectivesAndKPIsListPage
          selectedFolderId={selectedFolderId}
          onSelect={setSelectedFolderId}
          onDocumentSelect={handleDocumentSelect}
        />
      }
      rightColumn={<ObjectivesAndKPIsContentPage selectedDocument={selectedDocument} />}
      onAction={onAddNew}
    />
  );
};

export default ObjectivesAndKPIsLayout;

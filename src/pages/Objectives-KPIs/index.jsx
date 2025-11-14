import React, { useState } from "react";
import MainPageLayout from "../../layouts/MainPageLayout.jsx";
import ObjectivesAndKPIsListPage from "./ObjectivesAndKPIsListPage.jsx";
import ObjectivesAndKPIsContentPage from "./ObjectivesAndKPIsContent.jsx";
import CreateNewObjective from "./CreateNewObjective.jsx";

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

    <>
    <MainPageLayout
      title="Objectives And KPIs"
      subText="Add new"
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
    <CreateNewObjective isOpen={isOpen} onClose={handleClose} />
    </>
    
  );
};

export default ObjectivesAndKPIsLayout;

import React, { useState } from "react";
import MainPageLayout from "../../layouts/MainPageLayout.jsx";
import TrainingPlansListPage from "./TrainingPlansListPage.jsx";
import TrainingPlansContentPage from "./TrainingPlansContent.jsx";

const TrainingPlansLayout = () => {
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
      title="Training Plans"
      leftColumn={
        <TrainingPlansListPage
          selectedFolderId={selectedFolderId}
          onSelect={setSelectedFolderId}
          onDocumentSelect={handleDocumentSelect}
        />
      }
      rightColumn={<TrainingPlansContentPage selectedDocument={selectedDocument} />}
      onAction={onAddNew}
    />
  );
};

export default TrainingPlansLayout;

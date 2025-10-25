import React, { useState } from "react";
import MainPageLayout from "../../layouts/MainPageLayout.jsx";
import ProcessListPage from "./ProcessListPage.jsx";
import ProcessContentPage from "./ProcessContentPage.jsx";

const ProcessFrameWorkLayout = () => {
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
      title="Process framework"
      leftColumn={
        <ProcessListPage
          selectedFolderId={selectedFolderId}
          onSelect={setSelectedFolderId}
          onDocumentSelect={handleDocumentSelect}
        />
      }
      rightColumn={<ProcessContentPage selectedDocument={selectedDocument} />}
      onAction={onAddNew}
    />
  );
};

export default ProcessFrameWorkLayout;

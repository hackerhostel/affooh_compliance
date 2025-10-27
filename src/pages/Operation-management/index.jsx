import React, { useState } from "react";
import MainPageLayout from "../../layouts/MainPageLayout.jsx";
import OperationListPage from "./OperationListPage.jsx";
import OperationContentPage from "./OperationContent.jsx";

const OperationLayout = () => {
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
      title="Roles and Responsibilities"
      leftColumn={
        <OperationListPage
          selectedFolderId={selectedFolderId}
          onSelect={setSelectedFolderId}
          onDocumentSelect={handleDocumentSelect}
        />
      }
      rightColumn={<OperationContentPage selectedDocument={selectedDocument} />}
      onAction={onAddNew}
    />
  );
};

export default OperationLayout;

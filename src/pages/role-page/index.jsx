import React, { useState } from "react";
import MainPageLayout from "../../layouts/MainPageLayout.jsx";
import RoleListPage from "./RoleListPage.jsx";
import RoleContentPage from "./RoleContentPage.jsx";

const RoleLayout = () => {
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const onAddNew = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDocumentSelect = (document) => {
    setSelectedDocument(document);
    setResetKey((prev) => prev + 1);
  };

  return (
    <MainPageLayout
      title="Roles and Responsibilities"
      leftColumn={
        <RoleListPage
          selectedFolderId={selectedFolderId}
          onSelect={setSelectedFolderId}
          onDocumentSelect={handleDocumentSelect}
        />
      }
      rightColumn={
        <RoleContentPage
          key={resetKey}
          selectedDocument={selectedDocument}
        />
      }
      onAction={onAddNew}
    />
  );
};

export default RoleLayout;

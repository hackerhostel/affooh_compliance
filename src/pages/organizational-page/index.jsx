import React, { useState } from "react";
import MainPageLayout from "../../layouts/MainPageLayout.jsx";
import OrganizationalListPage from "./OrganizationalListPage.jsx";
import OrganizationalContentPage from "./OrganizationalContentPage.jsx";

const OrganizationalLayout = () => {
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
      title={selectedDocument?.name || "Organizational Context"}
      leftColumn={
        <OrganizationalListPage
          selectedFolderId={selectedFolderId}
          onSelect={setSelectedFolderId}
          onDocumentSelect={handleDocumentSelect}
        />
      }
      rightColumn={
        <OrganizationalContentPage
          key={resetKey}
          selectedDocument={selectedDocument}
        />
      }
      onAction={onAddNew}
    />
  );
};

export default OrganizationalLayout;

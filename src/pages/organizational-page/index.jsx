import React, { useState } from "react";
import MainPageLayout from "../../layouts/MainPageLayout.jsx";
import OrganizationalListPage from "./OrganizationalListPage.jsx";
import OrganizationalContentPage from "./OrganizationalContentPage.jsx";

const OrganizationalLayout = () => {
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
      title={selectedDocument?.name || "Organizational Context"}
      leftColumn={
        <OrganizationalListPage
          selectedFolderId={selectedFolderId}
          onSelect={setSelectedFolderId}
          onDocumentSelect={handleDocumentSelect}
        />
      }
      rightColumn={<OrganizationalContentPage selectedDocument={selectedDocument} />}
      onAction={onAddNew}
    />
  );
};

export default OrganizationalLayout;

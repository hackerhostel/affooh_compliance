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
      title="Folders"
      leftColumn={
        <OrganizationalListPage
          selectedFolderId={selectedFolderId}
          onSelect={setSelectedFolderId}
          onDocumentSelect={handleDocumentSelect}
        />
      }
      rightColumn={<OrganizationalContentPage selectedDocument={selectedDocument} />}
      subText="Add New"
      onAction={onAddNew}
    />
  );
};

export default OrganizationalLayout;

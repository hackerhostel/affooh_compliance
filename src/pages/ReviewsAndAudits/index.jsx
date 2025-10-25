import React, { useState } from "react";
import MainPageLayout from "../../layouts/MainPageLayout.jsx";
import ReviewListPage from "./ReviewListPage.jsx";
import ReviewContentPage from "./ReviewContentPage.jsx";

const ReviewAndAuditsLayout = () => {
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
      title="Review and Audits"
      leftColumn={
        <ReviewListPage
          selectedFolderId={selectedFolderId}
          onSelect={setSelectedFolderId}
          onDocumentSelect={handleDocumentSelect}
        />
      }
      rightColumn={<ReviewContentPage selectedDocument={selectedDocument} />}
      onAction={onAddNew}
    />
  );
};

export default ReviewAndAuditsLayout;

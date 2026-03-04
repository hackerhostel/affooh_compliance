import React, { useState } from "react";
import MainPageLayout from "../../layouts/MainPageLayout.jsx";
import ReviewListPage from "./ReviewListPage.jsx";
import ReviewContentPage from "./ReviewContentPage.jsx";
import AddReviewAuditPopup from "./AddReviewAuditPopup.jsx";

const ReviewAndAuditsLayout = () => {
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const onAddNew = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSuccess = () => {
    setIsOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDocumentSelect = (document) => {
    setSelectedDocument(document);
  };

  return (
    <>
      <MainPageLayout
        title="Reviews and Audits"
        subText="Add New"
        leftColumn={
          <ReviewListPage
            selectedFolderId={selectedFolderId}
            onSelect={setSelectedFolderId}
            onDocumentSelect={handleDocumentSelect}
            refreshTrigger={refreshTrigger}
          />
        }
        rightColumn={<ReviewContentPage selectedDocument={selectedDocument} />}
        onAction={onAddNew}
      />
      <AddReviewAuditPopup isOpen={isOpen} onClose={handleClose} onSuccess={handleSuccess} />
    </>
  );
};

export default ReviewAndAuditsLayout;


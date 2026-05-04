import React, { useState } from "react";
import MainPageLayout from "../../layouts/MainPageLayout.jsx";
import ReviewListPage from "./ReviewListPage.jsx";
import ReviewContentPage from "./ReviewContentPage.jsx";
import AddReviewAuditPopup from "./AddReviewAuditPopup.jsx";
import ReviewDetail from "./ReviewDetail.jsx";

const ReviewAndAuditsLayout = () => {
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [editingDocument, setEditingDocument] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const onAddNew = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleSuccess = () => {
    setIsOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDocumentSelect = (document) => {
    setSelectedDocument(document);
    setEditingDocument(null);
  };

  const handleEditRequest = (document) => {
    setEditingDocument(document);
  };

  const handleEditClose = () => {
    setEditingDocument(null);
  };

  const handleEditSuccess = (updatedDoc) => {
    setEditingDocument(null);
    setSelectedDocument(updatedDoc);
    setRefreshTrigger(prev => prev + 1);
  };

  const rightColumn = editingDocument
    ? <ReviewDetail document={editingDocument} onClose={handleEditClose} onSuccess={handleEditSuccess} />
    : <ReviewContentPage selectedDocument={selectedDocument} />;

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
            onEditRequest={handleEditRequest}
            refreshTrigger={refreshTrigger}
          />
        }
        rightColumn={rightColumn}
        onAction={onAddNew}
      />
      <AddReviewAuditPopup isOpen={isOpen} onClose={handleClose} onSuccess={handleSuccess} />
    </>
  );
};

export default ReviewAndAuditsLayout;


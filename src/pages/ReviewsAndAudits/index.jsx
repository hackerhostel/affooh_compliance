import React from "react";
import { useSelector, useDispatch } from "react-redux";
import MainPageLayout from "../../layouts/MainPageLayout.jsx";
import ReviewListPage from "./ReviewListPage.jsx";
import ReviewContentPage from "./ReviewContentPage.jsx";
import CreateNewReview from "./CreateNewReview.jsx";
import ReviewUpdate from "./ReviewUpdate.jsx";
import {
  openCreate,
  closeCreate,
  selectDocument,
  startUpdate,
  closeUpdate,
  finishUpdate,
} from "../../state/slice/reviewAndAuditSlice.js";

const ReviewAndAuditsLayout = () => {
  const dispatch = useDispatch();

  const { isCreating, isUpdating, selectedDocument, documentToUpdate } = useSelector(
    (state) => state.reviewUI
  );

  return (
    <>
      <MainPageLayout
        title="Review and Audits"
        subText="Add New"
        onAction={() => dispatch(openCreate())}
        leftColumn={
          <ReviewListPage
            onDocumentSelect={(doc) => dispatch(selectDocument(doc))}
            onUpdateDocument={(doc) => dispatch(startUpdate(doc))}
          />
        }
        rightColumn={
          isUpdating ? (
            <ReviewUpdate
              document={documentToUpdate}
              onCancel={() => dispatch(closeUpdate())}
              onUpdate={(updatedDoc) => dispatch(finishUpdate(updatedDoc))}
            />
          ) : (
            <ReviewContentPage selectedDocument={selectedDocument} />
          )
        }
      />

      <CreateNewReview onClose={() => dispatch(closeCreate())} isOpen={isCreating} />
    </>
  );
};

export default ReviewAndAuditsLayout;
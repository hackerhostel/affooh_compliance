import React, { useState } from "react";
import { ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline";
import ConfirmationDialog from "../../components/ConfirmationDialog.jsx";
import { useToasts } from "react-toast-notifications";

const DocumentaryListPage = () => {
  const { addToast } = useToasts();

  // Dummy documents
  const [documents, setDocuments] = useState([
    { id: 1, name: "Project Plan Document" },
    { id: 2, name: "UI Design Specification" },
    { id: 3, name: "API Documentation" },
    { id: 4, name: "Test Plan Summary" },
    { id: 5, name: "Deployment Guide" },
  ]);

  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeleteClick = (doc) => {
    setSelectedDocument(doc);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedDocument) {
      setDocuments((prev) =>
        prev.filter((d) => d.id !== selectedDocument.id)
      );
      addToast("Document deleted successfully!", { appearance: "success" });
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="h-list-screen overflow-y-auto w-full pl-3">
      <div className="flex flex-col gap-3 laptopL:w-64 w-full">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex justify-between items-center p-3 border rounded-md w-full gap-2 hover:bg-gray-100 cursor-pointer"
          >
            <div className="col-span-2 text-left">
              <div className="font-bold">{doc.name}</div>
            </div>
            <div className="flex gap-1 ml-6">
              <TrashIcon
                onClick={() => handleDeleteClick(doc)}
                className="w-4 h-4 text-pink-700 cursor-pointer"
              />
              <ChevronRightIcon className="w-4 h-4 text-black" />
            </div>
          </div>
        ))}
      </div>

      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        message={
          selectedDocument
            ? `Do you want to delete "${selectedDocument.name}"?`
            : ""
        }
      />
    </div>
  );
};

export default DocumentaryListPage;

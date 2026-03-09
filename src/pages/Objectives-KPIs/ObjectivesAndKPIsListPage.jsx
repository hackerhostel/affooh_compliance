import React, { useState, useEffect } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import ConfirmationDialog from "../../components/ConfirmationDialog.jsx";
import { useToasts } from "react-toast-notifications";
import {
  getObjectiveCollections,
  deleteObjectiveCollection,
} from "../../utils/objectiveApi.js";

const ObjectivesAndKPIsListPage = ({ onDocumentSelect, refreshTrigger, selectedDocument }) => {
  const { addToast } = useToasts();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const getColorClass = (classification) => {
    switch (classification) {
      case "Public":
        return "text-green-600";
      case "Confidential":
        return "text-yellow-500";
      case "Restricted":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  const toggleMenuOpen = (index, event) => {
    event.stopPropagation();
    setOpenMenu(openMenu === index ? null : index);
  };

  const handleDeleteClick = (doc) => {
    setSelectedDoc(doc);
    setIsDialogOpen(true);
    setOpenMenu(null);
  };

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const data = await getObjectiveCollections();
      setDocuments(data);
      if (data.length > 0 && onDocumentSelect && !selectedDocument) {
        onDocumentSelect(data[0]);
      }
    } catch (error) {
      addToast("Failed to fetch collections", { appearance: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, [refreshTrigger]);

  const handleConfirmDelete = async () => {
    if (selectedDoc) {
      try {
        await deleteObjectiveCollection(selectedDoc.keyId || selectedDoc.id);
        setDocuments((prev) => prev.filter((d) => d.id !== selectedDoc.id));
        addToast("Document deleted successfully!", { appearance: "success" });
      } catch (error) {
        addToast("Failed to delete document", { appearance: "error" });
      }
    }
    setIsDialogOpen(false);
  };

  const handleDocumentClick = (doc) => {
    if (onDocumentSelect) {
      onDocumentSelect(doc);
    }
  };

  return (
    <div className="h-[calc(100vh-250px)] overflow-y-auto flex flex-col gap-3 pl-5 pr-3 mt-6">
      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : documents.length === 0 ? (
        <div className="text-center text-gray-600">No documents found</div>
      ) : (
        documents.map((doc, index) => (
          <div
            key={doc.id}
            onClick={() => handleDocumentClick(doc)}
            className={`relative flex justify-between items-center p-3 border rounded-md w-64 gap-2 hover:bg-gray-100 cursor-pointer ${selectedDocument?.id === doc.id ? "border-primary-pink border-2" : "border-gray-200"
              }`}
          >
            <div className="flex flex-col">
              <div className="font-medium text-gray-900">{doc.name}</div>
              <div className={`text-sm font-semibold ${getColorClass(doc.classificationName || doc.classification)}`}>
                {doc.classificationName || doc.classification}
              </div>
            </div>

            {/* Three-dot menu */}
            <div className="relative">
              <EllipsisVerticalIcon
                onClick={(e) => toggleMenuOpen(index, e)}
                className="w-5 h-5 text-gray-600 cursor-pointer"
              />
              {openMenu === index && (
                <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-md shadow-md w-28 z-10">
                  <button
                    onClick={() => handleDeleteClick(doc)}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        message={
          selectedDoc ? `Do you want to delete "${selectedDoc.name}"?` : ""
        }
      />
    </div>
  );
};

export default ObjectivesAndKPIsListPage;

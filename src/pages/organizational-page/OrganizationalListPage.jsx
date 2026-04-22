import React, { useState, useEffect } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import EditOrganizationalContextDialog from "../../components/EditOrganizationalContextDialog.jsx";
import { useToasts } from "react-toast-notifications";
import { updateOrganizationalContext } from "../../utils/complianceApi.js";

const OrganizationalListPage = ({ onDocumentSelect }) => {
  const { addToast } = useToasts();

  // Dummy document list
  const [documents, setDocuments] = useState([
    { id: 1, name: "Context", classification: "Public" },
    { id: 3, name: "SWOT", classification: "Confidential" },
    { id: 4, name: "PEST", classification: "Restricted" },
    { id: 5, name: "Stakeholder Context", classification: "Restricted" },
    { id: 6, name: "Communication Register", classification: "Restricted" },

  ]);

  // Auto-select first document on mount
  useEffect(() => {
    if (documents.length > 0) {
      const firstDoc = documents[0];
      setSelectedDoc(firstDoc);
      if (onDocumentSelect) {
        onDocumentSelect(firstDoc);
      }
    }
  }, []);

  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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

  const handleEditClick = (doc) => {
    setSelectedDoc(doc);
    setIsEditDialogOpen(true);
    setOpenMenu(null);
  };

  const handleConfirmEdit = async (updatedData) => {
    try {
      if (selectedDoc) {
        // Update local state
        setDocuments((prev) =>
          prev.map((d) =>
            d.id === selectedDoc.id
              ? { ...d, ...updatedData }
              : d
          )
        );

        // Call API if document has an ID from backend
        if (selectedDoc.contextId) {
          await updateOrganizationalContext(selectedDoc.contextId, updatedData);
        }

        addToast("Document updated successfully!", { appearance: "success" });
      }
    } catch (error) {
      addToast("Failed to update document", { appearance: "error" });
      console.error("Update error:", error);
    }
    setIsEditDialogOpen(false);
  };

  const handleDocumentClick = (doc) => {
    setSelectedDoc(doc);
    if (onDocumentSelect) {
      onDocumentSelect(doc);
    }
  };

  return (
    <div className="h-[calc(100vh-250px)] overflow-y-auto flex flex-col gap-3 pl-5 pr-3 mt-6">
      {documents.length === 0 ? (
        <div className="text-center text-gray-600">No documents found</div>
      ) : (
        documents.map((doc, index) => (
          <div
            key={doc.id}
            onClick={() => handleDocumentClick(doc)}
            className={`relative flex justify-between items-center p-3 border rounded-md w-full gap-2 hover:bg-gray-100 cursor-pointer ${selectedDoc?.id === doc.id ? "border-primary-pink border-2" : "border-gray-200"
              }`}
          >
            <div className="flex flex-col">
              <div className="font-medium text-gray-900">{doc.name}</div>
              <div className={`text-sm font-semibold ${getColorClass(doc.classification)}`}>
                {doc.classification}
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
                    onClick={() => handleEditClick(doc)}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}

      {/* Edit Dialog */}
      <EditOrganizationalContextDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onConfirm={handleConfirmEdit}
        document={selectedDoc}
      />
    </div>
  );
};

export default OrganizationalListPage;

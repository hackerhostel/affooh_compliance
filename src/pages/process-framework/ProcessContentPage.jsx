import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  PencilIcon,
  PlusCircleIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useToasts } from "react-toast-notifications";
import ConfirmationDialog from "../../components/ConfirmationDialog.jsx";
import FormInput from "../../components/FormInput.jsx";
import FormSelect from "../../components/FormSelect.jsx";
import FormTextArea from "../../components/FormTextArea.jsx";
import {
  createProcessFrameworkDocument,
  createProcessFrameworkSection,
  deleteProcessFrameworkDocument,
  deleteProcessFrameworkSection,
  getProcessFrameworkControlCategories,
  getProcessFrameworkControls,
  getProcessFrameworkDocument,
  getProcessFrameworkDocuments,
  PROCESS_FRAMEWORK_TYPES,
  updateProcessFrameworkDocument,
  updateProcessFrameworkSection,
} from "../../utils/processFrameworkApi.js";

const emptyDocumentRow = {
  title: "",
  version: "1.0",
  classification: "",
};

const emptySection = {
  sectionNumber: "",
  title: "",
  content: "",
  category: "",
  controlID: "",
};

const ProcessFrameworkContentPage = ({
  organizationID,
  currentUser,
  selectedType,
  addNewTrigger,
  refreshTrigger,
  onRefresh,
}) => {
  const { addToast } = useToasts();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNewRow, setShowNewRow] = useState(false);
  const [newRow, setNewRow] = useState(emptyDocumentRow);
  const [editingRowId, setEditingRowId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDocument, setDeleteDocument] = useState(null);
  const [activeDocument, setActiveDocument] = useState(null);
  const [activeMode, setActiveMode] = useState("view");

  const [documentDetail, setDocumentDetail] = useState(null);
  const [showNewSection, setShowNewSection] = useState(false);
  const [newSection, setNewSection] = useState(emptySection);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingDetail, setEditingDetail] = useState(null);
  const [detailValue, setDetailValue] = useState("");
  const [deleteSection, setDeleteSection] = useState(null);
  const [categories, setCategories] = useState([]);
  const [controls, setControls] = useState([]);

  const typeLabel = useMemo(
    () =>
      PROCESS_FRAMEWORK_TYPES.find((item) => item.value === selectedType)?.label ||
      "Policy",
    [selectedType]
  );

  const rowsPerPage = 5;
  const totalPages = Math.ceil(documents.length / rowsPerPage) || 1;
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const pagedRows = documents.slice(indexOfFirst, indexOfLast);

  const compareSectionNumber = (left = "", right = "") => {
    const leftParts = String(left).split(".").map((part) => Number(part) || 0);
    const rightParts = String(right).split(".").map((part) => Number(part) || 0);
    const length = Math.max(leftParts.length, rightParts.length);

    for (let index = 0; index < length; index += 1) {
      const diff = (leftParts[index] || 0) - (rightParts[index] || 0);
      if (diff !== 0) return diff;
    }

    return String(left).localeCompare(String(right));
  };

  const sortedSections = useMemo(
    () =>
      [...(documentDetail?.sections || [])].sort((left, right) =>
        compareSectionNumber(left.sectionNumber, right.sectionNumber)
      ),
    [documentDetail?.sections]
  );

  const formatUserName = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (value.name) return value.name;
    if (value.fullName) return value.fullName;
    if (value.username) return value.username;
    if (value.email) return value.email;
    const firstName = value.firstName || value.first_name;
    const lastName = value.lastName || value.last_name;
    return [firstName, lastName].filter(Boolean).join(" ");
  };

  const currentUserName = formatUserName(currentUser);

  const getOwnerName = (row) => {
    const ownerName =
      row.ownerName ||
      row.createdByName ||
      row.updatedByName ||
      formatUserName(row.owner) ||
      formatUserName(row.user) ||
      formatUserName(row.createdByUser) ||
      formatUserName(row.updatedByUser) ||
      formatUserName(row.createdBy) ||
      formatUserName(row.updatedBy);

    return ownerName || currentUserName || "-";
  };

  const fetchDocuments = async () => {
    if (!organizationID || !selectedType) {
      setDocuments([]);
      return;
    }

    try {
      setLoading(true);
      const data = await getProcessFrameworkDocuments(organizationID, selectedType);
      setDocuments(data);
    } catch (error) {
      addToast("Failed to fetch documents", { appearance: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchReferences = async () => {
    try {
      const [categoryData, controlData] = await Promise.all([
        getProcessFrameworkControlCategories(),
        getProcessFrameworkControls(),
      ]);
      setCategories(categoryData);
      setControls(controlData);
    } catch (error) {
      addToast("Failed to load references", { appearance: "error" });
    }
  };

  const fetchDocumentDetail = async (documentID) => {
    try {
      const data = await getProcessFrameworkDocument(documentID);
      setDocumentDetail(data);
    } catch (error) {
      addToast("Failed to fetch document details", { appearance: "error" });
    }
  };

  useEffect(() => {
    fetchReferences();
  }, []);

  useEffect(() => {
    setActiveDocument(null);
    setDocumentDetail(null);
    setShowNewRow(false);
    setEditingRowId(null);
    fetchDocuments();
  }, [organizationID, selectedType, refreshTrigger]);

  useEffect(() => {
    if (addNewTrigger > 0) {
      setActiveDocument(null);
      setNewRow({
        title: "",
        version: "1.0",
        classification: getClassification(selectedType),
      });
      setShowNewRow(true);
    }
  }, [addNewTrigger]);

  const categoryOptions = categories.map((category) => ({
    value: category.standardType,
    label: category.standardType,
  }));

  const classificationOptions = [
    { value: "Public", label: "Public" },
    { value: "Confidential", label: "Confidential" },
    { value: "Internal", label: "Internal" },
    { value: "Restricted", label: "Restricted" },
  ];

  const getControlOptions = (category) => [
    { value: "__none", label: "No control" },
    ...controls
      .filter((control) => !category || control.standardType === category)
      .map((control) => ({
        value: String(control.id),
        label: `${control.clauseReference} - ${control.description || control.standardType}`,
      })),
  ];

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

  const getClassification = (type) => {
    switch (type) {
      case "POLICY":
        return "Public";
      case "PROCESS":
        return "Confidential";
      default:
        return "Restricted";
    }
  };

  const getDocumentCode = (row) => {
    const prefix = {
      POLICY: "POL",
      PROCESS: "PRO",
      STANDARD: "STD",
      TEMPLATE: "TMP",
    }[row.type || selectedType];
    return `${prefix}/${String(row.id).padStart(3, "0")}`;
  };

  const handleNewRowChange = ({ target: { name, value } }) => {
    setNewRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNewDocument = async () => {
    if (!newRow.title.trim()) {
      addToast("Document name is required", { appearance: "error" });
      return;
    }
    if (!newRow.version.trim() || !(newRow.classification || getClassification(selectedType))) {
      addToast("Version and classification are required", { appearance: "error" });
      return;
    }
    if (!organizationID) {
      addToast("Organization not found", { appearance: "error" });
      return;
    }

    try {
      const created = await createProcessFrameworkDocument({
        title: newRow.title.trim(),
        type: selectedType,
        organizationID,
        version: newRow.version.trim(),
        classification: newRow.classification || getClassification(selectedType),
      });
      addToast("Document created successfully", { appearance: "success" });
      setDocuments((prev) => [
        {
          id: created?.id,
          title: newRow.title.trim(),
          type: selectedType,
          organizationID,
          version: newRow.version.trim(),
          classification: newRow.classification || getClassification(selectedType),
          createdByName: currentUserName || "-",
        },
        ...prev,
      ]);
      setNewRow(emptyDocumentRow);
      setShowNewRow(false);
    } catch (error) {
      addToast("Failed to create document", { appearance: "error" });
    }
  };

  const handleEditDocumentChange = (id, { target: { name, value } }) => {
    setDocuments((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [name]: value } : row))
    );
  };

  const handleDoneEditDocument = async () => {
    const row = documents.find((item) => item.id === editingRowId);
    if (!row?.title?.trim()) {
      addToast("Document name is required", { appearance: "error" });
      return;
    }
    if (!row.version?.trim() || !row.classification) {
      addToast("Version and classification are required", { appearance: "error" });
      return;
    }

    try {
      await updateProcessFrameworkDocument(row.id, {
        title: row.title.trim(),
        version: row.version.trim(),
        classification: row.classification,
      });
      setEditingRowId(null);
      addToast("Document updated successfully", { appearance: "success" });
    } catch (error) {
      addToast("Failed to update document", { appearance: "error" });
    }
  };

  const handleConfirmDeleteDocument = async () => {
    if (!deleteDocument) return;
    try {
      await deleteProcessFrameworkDocument(deleteDocument.id);
      addToast("Document deleted successfully", { appearance: "success" });
      setDeleteDocument(null);
      fetchDocuments();
      onRefresh?.();
    } catch (error) {
      addToast("Failed to delete document", { appearance: "error" });
    }
  };

  const openDocument = (row, mode) => {
    setActiveDocument(row);
    setActiveMode(mode);
    setShowNewRow(false);
    setShowNewSection(false);
    setNewSection(emptySection);
    setEditingRowId(null);
    setEditingSectionId(null);
    cancelDetailEdit();
    fetchDocumentDetail(row.id);
  };

  const handleSectionChange = ({ target: { name, value } }) => {
    setNewSection((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category" ? { controlID: "" } : {}),
    }));
  };

  const handleSaveNewSection = async () => {
    if (!newSection.sectionNumber.trim() || !newSection.title.trim()) {
      addToast("Number and title are required", { appearance: "error" });
      return;
    }

    try {
      await createProcessFrameworkSection({
        documentID: documentDetail.id,
        sectionNumber: newSection.sectionNumber.trim(),
        title: newSection.title.trim(),
        content: newSection.content,
        category: newSection.category || null,
        controlID:
          newSection.controlID && newSection.controlID !== "__none"
            ? Number(newSection.controlID)
            : null,
        displayOrder: documentDetail?.sections?.length || 0,
      });
      addToast("Section added successfully", { appearance: "success" });
      setNewSection(emptySection);
      setShowNewSection(false);
      fetchDocumentDetail(documentDetail.id);
    } catch (error) {
      addToast("Failed to add section", { appearance: "error" });
    }
  };

  const handleDetailSectionChange = (id, { target: { name, value } }) => {
    setDocumentDetail((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === id
          ? {
              ...section,
              [name]: value,
              ...(name === "category" ? { controlID: "" } : {}),
            }
          : section
      ),
    }));
  };

  const handleDoneEditSection = async () => {
    const section = documentDetail.sections.find((item) => item.id === editingSectionId);
    if (!section.sectionNumber?.trim() || !section.title?.trim()) {
      addToast("Number and title are required", { appearance: "error" });
      return;
    }

    try {
      await updateProcessFrameworkSection(section.id, {
        sectionNumber: section.sectionNumber,
        title: section.title,
        content: section.content,
        category: section.category || null,
        controlID:
          section.controlID && section.controlID !== "__none"
            ? Number(section.controlID)
            : null,
        displayOrder: section.displayOrder || 0,
      });
      setEditingSectionId(null);
      addToast("Section updated successfully", { appearance: "success" });
      fetchDocumentDetail(documentDetail.id);
    } catch (error) {
      addToast("Failed to update section", { appearance: "error" });
    }
  };

  const handleConfirmDeleteSection = async () => {
    if (!deleteSection) return;

    try {
      await deleteProcessFrameworkSection(deleteSection.id);
      addToast("Section deleted successfully", { appearance: "success" });
      setDeleteSection(null);
      fetchDocumentDetail(documentDetail.id);
    } catch (error) {
      addToast("Failed to delete section", { appearance: "error" });
    }
  };

  const beginDetailEdit = (scope, id, field, value) => {
    setEditingDetail({ scope, id, field });
    setDetailValue(value ?? "");
  };

  const cancelDetailEdit = () => {
    setEditingDetail(null);
    setDetailValue("");
  };

  const isDetailEditing = (scope, id, field) =>
    editingDetail?.scope === scope &&
    editingDetail?.id === id &&
    editingDetail?.field === field;

  const saveDocumentTitleDetail = async () => {
    if (!detailValue.trim()) {
      addToast("Document name is required", { appearance: "error" });
      return;
    }

    try {
      await updateProcessFrameworkDocument(documentDetail.id, {
        title: detailValue.trim(),
      });
      setDocumentDetail((prev) => ({ ...prev, title: detailValue.trim() }));
      setActiveDocument((prev) => ({ ...prev, title: detailValue.trim() }));
      cancelDetailEdit();
      addToast("Document updated successfully", { appearance: "success" });
    } catch (error) {
      addToast("Failed to update document", { appearance: "error" });
    }
  };

  const saveSectionDetailField = async (section, field) => {
    const value = field === "controlID" && detailValue === "__none" ? null : detailValue;
    if ((field === "sectionNumber" || field === "title") && !String(value).trim()) {
      addToast(`${field === "sectionNumber" ? "Number" : "Title"} is required`, {
        appearance: "error",
      });
      return;
    }

    try {
      const payload =
        field === "category"
          ? { category: value || null, controlID: null }
          : { [field]: value || null };
      await updateProcessFrameworkSection(section.id, payload);
      setDocumentDetail((prev) => ({
        ...prev,
        sections: prev.sections.map((item) =>
          item.id === section.id
            ? {
                ...item,
                [field]: value,
                ...(field === "category" ? { controlID: null } : {}),
              }
            : item
        ),
      }));
      cancelDetailEdit();
      addToast("Section updated successfully", { appearance: "success" });
    } catch (error) {
      addToast("Failed to update section", { appearance: "error" });
    }
  };

  const renderDetailActions = (onSave) => (
    <div className="inline-flex items-center gap-2 ml-2 align-middle">
      <CheckCircleIcon
        onClick={onSave}
        className="w-5 h-5 text-primary-pink cursor-pointer"
      />
      <XMarkIcon
        onClick={cancelDetailEdit}
        className="w-5 h-5 text-text-color cursor-pointer"
      />
    </div>
  );

  const renderPencil = (onClick) => (
    <PencilIcon
      onClick={onClick}
      className="w-4 h-4 text-text-color cursor-pointer hover:text-primary-pink inline-block ml-2 align-middle"
    />
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((page) => page + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((page) => page - 1);
  };

  const renderDocumentTable = () => (
    <div className="mt-6">
      <div className="flex justify-end items-center mt-4 space-x-2">
        <button className="bg-primary-pink px-8 py-3 rounded-md text-white">Archived</button>
        <button className="bg-primary-pink px-8 py-3 rounded-md text-white">Approved</button>
        <button className="bg-primary-pink px-8 py-3 rounded-md text-white">Save</button>
      </div>

      <div className="flex items-center gap-5">
        <span className="text-lg font-semibold">{typeLabel}</span>
        <div className="flex items-center gap-1">
          <PlusCircleIcon
            onClick={() => {
              setNewRow({
                title: "",
                version: "1.0",
                classification: getClassification(selectedType),
              });
              setShowNewRow(true);
            }}
            className="w-6 h-6 text-pink-500 cursor-pointer"
          />
          <button
            className="text-text-color"
            onClick={() => {
              setNewRow({
                title: "",
                version: "1.0",
                classification: getClassification(selectedType),
              });
              setShowNewRow(true);
            }}
          >
            Add New
          </button>
        </div>
      </div>

      <div className="bg-white rounded p-3 mt-2">
        <table className="table-fixed w-full border-collapse">
          <thead>
            <tr className="text-left text-secondary-grey border-b border-gray-200">
              <th className="py-3 px-4 text-center" style={{ width: "6%" }}>ID</th>
              <th className="py-3 px-4" style={{ width: "15%" }}>Code</th>
              <th className="py-3 px-4" style={{ width: "30%" }}>Document Name</th>
              <th className="py-3 px-4 text-center" style={{ width: "12%" }}>Version</th>
              <th className="py-3 px-4 text-center" style={{ width: "14%" }}>Classification</th>
              <th className="py-3 px-4" style={{ width: "13%" }}>Owner</th>
              <th className="py-3 px-4 text-center" style={{ width: "10%" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {showNewRow && (
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 text-center">-</td>
                <td className="py-3 px-4 text-secondary-grey">Auto</td>
                <td className="py-3 px-4">
                  <FormInput
                    name="title"
                    formValues={newRow}
                    onChange={handleNewRowChange}
                    showLabel={false}
                  />
                </td>
                <td className="py-3 px-4">
                  <FormInput
                    name="version"
                    formValues={{
                      version: newRow.version || "1.0",
                    }}
                    onChange={handleNewRowChange}
                    showLabel={false}
                  />
                </td>
                <td className="py-3 px-4">
                  <FormSelect
                    name="classification"
                    formValues={{
                      classification:
                        newRow.classification || getClassification(selectedType),
                    }}
                    options={classificationOptions}
                    onChange={handleNewRowChange}
                    showLabel={false}
                  />
                </td>
                <td className="py-3 px-4 text-secondary-grey">-</td>
                <td className="py-3 px-4">
                  <div className="flex gap-3 items-center justify-center">
                    <CheckCircleIcon
                      onClick={handleSaveNewDocument}
                      className="w-5 h-5 text-primary-pink cursor-pointer"
                    />
                    <XMarkIcon
                      onClick={() => {
                        setShowNewRow(false);
                        setNewRow(emptyDocumentRow);
                      }}
                      className="w-5 h-5 text-text-color cursor-pointer"
                    />
                  </div>
                </td>
              </tr>
            )}

            {loading && (
              <tr>
                <td className="py-3 px-2 text-center text-gray-500" colSpan={7}>
                  Loading...
                </td>
              </tr>
            )}

            {!loading && pagedRows.length === 0 && !showNewRow && (
              <tr>
                <td className="py-3 px-2 text-center text-gray-500" colSpan={7}>
                  No documents found
                </td>
              </tr>
            )}

            {!loading &&
              pagedRows.map((row, index) => {
                const isEditing = editingRowId === row.id;
                const classification = row.classification || getClassification(row.type);
                return (
                  <tr key={row.id} className="border-b border-gray-200">
                    <td className="py-3 px-4 text-center">
                      {String(indexOfFirst + index + 1).padStart(2, "0")}.
                    </td>
                    <td className="py-3 px-4">{getDocumentCode(row)}</td>
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <FormInput
                          name="title"
                          formValues={{ title: row.title }}
                          onChange={(event) => handleEditDocumentChange(row.id, event)}
                          showLabel={false}
                        />
                      ) : (
                        row.title
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isEditing ? (
                        <FormInput
                          name="version"
                          formValues={{ version: row.version || "1.0" }}
                          onChange={(event) => handleEditDocumentChange(row.id, event)}
                          showLabel={false}
                        />
                      ) : (
                        row.version || "1.0"
                      )}
                    </td>
                    <td className={`py-3 px-4 font-medium text-center ${getColorClass(classification)}`}>
                      {isEditing ? (
                        <FormSelect
                          name="classification"
                          formValues={{ classification }}
                          options={classificationOptions}
                          onChange={(event) => handleEditDocumentChange(row.id, event)}
                          showLabel={false}
                        />
                      ) : (
                        classification
                      )}
                    </td>
                    <td className="py-3 px-4">{getOwnerName(row)}</td>
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <div className="flex gap-3 items-center justify-center">
                          <CheckCircleIcon
                            onClick={handleDoneEditDocument}
                            className="w-5 h-5 text-primary-pink cursor-pointer"
                          />
                          <XMarkIcon
                            onClick={() => {
                              setEditingRowId(null);
                              fetchDocuments();
                            }}
                            className="w-5 h-5 text-text-color cursor-pointer"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <EyeIcon
                            onClick={() => openDocument(row, "view")}
                            className="w-5 h-5 text-text-color cursor-pointer hover:text-primary-pink"
                          />
                          <PencilIcon
                            onClick={() => openDocument(row, "edit")}
                            className="w-5 h-5 text-text-color cursor-pointer hover:text-primary-pink"
                          />
                          <TrashIcon
                            onClick={() => setDeleteDocument(row)}
                            className="w-5 h-5 text-text-color cursor-pointer hover:text-primary-pink"
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {documents.length > 0 && (
          <div className="w-full flex gap-5 items-center justify-end mt-4">
            <button
              onClick={handlePreviousPage}
              className={`p-2 rounded-full bg-gray-200 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
              }`}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className="w-4 h-4 text-secondary-grey" />
            </button>
            <span className="text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              className={`p-2 rounded-full bg-gray-200 ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-300"
              }`}
              disabled={currentPage === totalPages}
            >
              <ChevronRightIcon className="w-4 h-4 text-secondary-grey" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderSectionRow = (section, index) => {
    const isEditing = editingSectionId === section.id;
    const control = controls.find((item) => String(item.id) === String(section.controlID));

    return (
      <tr key={section.id} className="border-b border-gray-200 align-top">
        <td className="py-3 px-4 text-center">{index + 1}</td>
        <td className="py-3 px-4">
          {isEditing ? (
            <FormInput
              name="sectionNumber"
              formValues={{ sectionNumber: section.sectionNumber }}
              onChange={(event) => handleDetailSectionChange(section.id, event)}
              showLabel={false}
            />
          ) : (
            section.sectionNumber
          )}
        </td>
        <td className="py-3 px-4">
          {isEditing ? (
            <FormInput
              name="title"
              formValues={{ title: section.title }}
              onChange={(event) => handleDetailSectionChange(section.id, event)}
              showLabel={false}
            />
          ) : (
            section.title
          )}
        </td>
        <td className="py-3 px-4">
          {isEditing ? (
            <FormTextArea
              name="content"
              rows={3}
              formValues={{ content: section.content }}
              onChange={(event) => handleDetailSectionChange(section.id, event)}
              showLabel={false}
            />
          ) : (
            section.content || "-"
          )}
        </td>
        <td className="py-3 px-4">
          {isEditing ? (
            <FormSelect
              name="category"
              formValues={{ category: section.category }}
              options={categoryOptions}
              onChange={(event) => handleDetailSectionChange(section.id, event)}
              showLabel={false}
            />
          ) : (
            section.category || "-"
          )}
        </td>
        <td className="py-3 px-4">
          {isEditing ? (
            <FormSelect
              name="controlID"
              formValues={{ controlID: section.controlID || "__none" }}
              options={getControlOptions(section.category)}
              onChange={(event) => handleDetailSectionChange(section.id, event)}
              showLabel={false}
            />
          ) : control ? (
            control.clauseReference
          ) : (
            "-"
          )}
        </td>
        <td className="py-3 px-4">
          {isEditing ? (
            <div className="flex gap-3 items-center justify-center">
              <CheckCircleIcon
                onClick={handleDoneEditSection}
                className="w-5 h-5 text-primary-pink cursor-pointer"
              />
              <XMarkIcon
                onClick={() => {
                  setEditingSectionId(null);
                  fetchDocumentDetail(documentDetail.id);
                }}
                className="w-5 h-5 text-text-color cursor-pointer"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              {activeMode === "edit" && (
                <PencilIcon
                  onClick={() => setEditingSectionId(section.id)}
                  className="w-5 h-5 text-text-color cursor-pointer hover:text-primary-pink"
                />
              )}
              <TrashIcon
                onClick={() => setDeleteSection(section)}
                className="w-5 h-5 text-text-color cursor-pointer hover:text-primary-pink"
              />
            </div>
          )}
        </td>
      </tr>
    );
  };

  const renderDetailSection = (section) => {
    const isEditing = editingSectionId === section.id;

    return (
      <div key={section.id} className="border border-gray-200 rounded-md p-4 bg-gray-50">
        <div className="flex justify-end gap-3 mb-3">
          {isEditing ? (
            <>
              <CheckCircleIcon
                onClick={handleDoneEditSection}
                className="w-5 h-5 text-primary-pink cursor-pointer"
              />
              <XMarkIcon
                onClick={() => {
                  setEditingSectionId(null);
                  fetchDocumentDetail(documentDetail.id);
                }}
                className="w-5 h-5 text-text-color cursor-pointer"
              />
            </>
          ) : (
            <>
              <PencilIcon
                onClick={() => setEditingSectionId(section.id)}
                className="w-5 h-5 text-text-color cursor-pointer hover:text-primary-pink"
              />
              <TrashIcon
                onClick={() => setDeleteSection(section)}
                className="w-5 h-5 text-text-color cursor-pointer hover:text-primary-pink"
              />
            </>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FormInput
            name="sectionNumber"
            placeholder="Number"
            formValues={{ sectionNumber: section.sectionNumber || "" }}
            onChange={(event) => handleDetailSectionChange(section.id, event)}
            disabled={!isEditing}
          />
          <FormInput
            name="title"
            placeholder="Title"
            formValues={{ title: section.title || "" }}
            onChange={(event) => handleDetailSectionChange(section.id, event)}
            disabled={!isEditing}
          />
          <div className="lg:col-span-2">
            <FormTextArea
              name="content"
              placeholder="Description / Content"
              rows={4}
              formValues={{ content: section.content || "" }}
              onChange={(event) => handleDetailSectionChange(section.id, event)}
              disabled={!isEditing}
            />
          </div>
          <FormSelect
            name="category"
            placeholder="Select category"
            formValues={{ category: section.category || "" }}
            options={categoryOptions}
            onChange={(event) => handleDetailSectionChange(section.id, event)}
            disabled={!isEditing}
          />
          <FormSelect
            name="controlID"
            placeholder="Select control"
            formValues={{ controlID: section.controlID || "__none" }}
            options={getControlOptions(section.category)}
            onChange={(event) => handleDetailSectionChange(section.id, event)}
            disabled={!isEditing}
          />
        </div>
      </div>
    );
  };

  const renderDocumentDetail = () => (
    <div className="mt-6">
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => {
            setActiveDocument(null);
            setDocumentDetail(null);
            setEditingSectionId(null);
            cancelDetailEdit();
            fetchDocuments();
          }}
          className="text-text-color hover:text-primary-pink"
        >
          Back
        </button>
        <button
          onClick={() => setShowNewSection(true)}
          className="bg-primary-pink px-6 py-3 rounded-md text-white flex items-center gap-2"
        >
          Add Section
        </button>
      </div>

      <div className="flex items-center gap-5 mt-4 mb-4">
        <span className="text-lg font-semibold text-primary-pink">
          {typeLabel} - Update
        </span>
      </div>

      <div className="mb-4">
        <div className="text-base font-semibold text-gray-900 mb-3">Document Name</div>
        {isDetailEditing("document", documentDetail?.id, "title") ? (
          <div className="flex items-center gap-2 max-w-xl">
            <FormInput
              name="title"
              formValues={{ title: detailValue }}
              onChange={(event) => setDetailValue(event.target.value)}
              showLabel={false}
            />
            {renderDetailActions(saveDocumentTitleDetail)}
          </div>
        ) : (
          <div className="text-sm text-gray-700">
            {documentDetail?.title || activeDocument?.title || "Document Name"}
            {renderPencil(() =>
              beginDetailEdit(
                "document",
                documentDetail?.id,
                "title",
                documentDetail?.title || activeDocument?.title || ""
              )
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded p-6 mt-4 min-h-[520px]">
        {showNewSection && (
          <div className="border border-gray-200 rounded-md p-4 mb-4 bg-gray-50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormInput
                name="sectionNumber"
                placeholder="Number"
                formValues={newSection}
                onChange={handleSectionChange}
              />
              <FormInput
                name="title"
                placeholder="Title"
                formValues={newSection}
                onChange={handleSectionChange}
              />
              <div className="lg:col-span-2">
                <FormTextArea
                  name="content"
                  placeholder="Description / Content"
                  rows={4}
                  formValues={newSection}
                  onChange={handleSectionChange}
                />
              </div>
              <FormSelect
                name="category"
                placeholder="Select category"
                formValues={newSection}
                options={categoryOptions}
                onChange={handleSectionChange}
              />
              <FormSelect
                name="controlID"
                placeholder="Select control"
                formValues={newSection}
                options={getControlOptions(newSection.category)}
                onChange={handleSectionChange}
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowNewSection(false);
                  setNewSection(emptySection);
                }}
                className="px-5 py-2 rounded-md bg-gray-200 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewSection}
                className="px-5 py-2 rounded-md bg-primary-pink text-white"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {sortedSections.length ? (
          <div className="space-y-4">
            {sortedSections.map(renderDetailSection)}
          </div>
        ) : !showNewSection ? (
          <div className="text-center text-gray-500 py-20">
            Click Add Section to start a new section
          </div>
        ) : null}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-dashboard-bgc min-h-screen">
      {activeDocument ? renderDocumentDetail() : renderDocumentTable()}

      <ConfirmationDialog
        isOpen={Boolean(deleteDocument)}
        onClose={() => setDeleteDocument(null)}
        onConfirm={handleConfirmDeleteDocument}
        message={
          deleteDocument ? `Do you want to delete "${deleteDocument.title}"?` : ""
        }
      />
      <ConfirmationDialog
        isOpen={Boolean(deleteSection)}
        onClose={() => setDeleteSection(null)}
        onConfirm={handleConfirmDeleteSection}
        message={deleteSection ? `Do you want to delete "${deleteSection.title}"?` : ""}
      />
    </div>
  );
};

export default ProcessFrameworkContentPage;

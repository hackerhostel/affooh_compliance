import React, { useState } from "react";
import FormTextArea from "../../../components/FormTextArea.jsx";
import FormSelect from "../../../components/FormSelect.jsx";
import {
  PencilIcon,
  EllipsisVerticalIcon,
  CheckCircleIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { getSelectOptions } from "../../../utils/commonUtils.js";
import { useSelector } from "react-redux";
import { selectSelectedProject } from "../../../state/slice/projectSlice.js";
import { selectUser } from "../../../state/slice/authSlice.js";
import { useToasts } from "react-toast-notifications";
import { createRevisionHistory, createApproval } from "../../../utils/complianceApi.js";
import SaveVersionPopup from "../../../components/SaveVersionPopup.jsx";

const DOCUMENT_TYPE = "CUSTOMER_SATISFACTION";

const CustomerSatisfactionOverview = () => {
  const { addToast } = useToasts();
  const selectedProject = useSelector(selectSelectedProject);
  const currentUser = useSelector(selectUser);
  const projectId = selectedProject?.id;

  const [showSavePopup, setShowSavePopup] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const handleSaveConfirm = async ({ version, summary }) => {
    if (!projectId) { addToast("No project selected", { appearance: "error" }); return; }
    setIsSaving(true);
    try {
      await createRevisionHistory({
        projectId,
        documentType: DOCUMENT_TYPE,
        version,
        summaryOfChanges: summary,
        revisionDate: new Date().toISOString().split("T")[0],
        name: `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim(),
        status: "draft",
      });
      addToast("Document saved as draft", { appearance: "success" });
      setShowSavePopup(false);
    } catch {
      addToast("Failed to save document", { appearance: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleApprove = async () => {
    if (!projectId) { addToast("No project selected", { appearance: "error" }); return; }
    setIsApproving(true);
    try {
      await createApproval({
        projectId,
        documentType: DOCUMENT_TYPE,
        approvalDate: new Date().toISOString().split("T")[0],
        status: "approved",
        approver: {
          id: currentUser?.id,
          name: `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim(),
          position: currentUser?.position || null,
        },
      });
      addToast("Document approved successfully", { appearance: "success" });
    } catch {
      addToast("Failed to approve document", { appearance: "error" });
    } finally {
      setIsApproving(false);
    }
  };
  // Dummy select options
  const audienceOptions = getSelectOptions([
    { id: "Employees", name: "Employees" },
    { id: "Managers", name: "Managers" },
    { id: "Executives", name: "Executives" },
  ]);

  const statusOptions = getSelectOptions([
    { id: "Planned", name: "Planned" },
    { id: "In Progress", name: "In Progress" },
    { id: "Completed", name: "Completed" },
  ]);

  // Dummy data
  const [trainingRows, setTrainingRows] = useState([]);

  const [showNewRow, setShowNewRow] = useState(false);
  const [newRow, setNewRow] = useState({
    date: "",
    trainingModule: "",
    targetAudience: "",
    duration: "",
    evaluationMethodology: "",
    resourcePerson: "",
    status: "",
  });

  const [editingRowId, setEditingRowId] = useState(null);
  const [openActionRowId, setOpenActionRowId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [filters, setFilters] = useState({
    targetAudience: "",
    status: "",
  });

  const rowsPerPage = 5;
  const filteredRows = trainingRows.filter(
    (row) =>
      (filters.targetAudience === "" ||
        row.targetAudience === filters.targetAudience) &&
      (filters.status === "" || row.status === filters.status)
  );

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const pagedRows = filteredRows.slice(indexOfFirst, indexOfLast);

  // Handlers
  const handleAddNewClick = () => {
    setShowNewRow(true);
    setNewRow({
      date: "",
      trainingModule: "",
      targetAudience: "",
      duration: "",
      evaluationMethodology: "",
      resourcePerson: "",
      status: "",
    });
  };

  const handleNewChange = ({ target: { name, value } }) => {
    setNewRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNew = () => {
    if (
      !newRow.date ||
      !newRow.trainingModule ||
      !newRow.targetAudience ||
      !newRow.duration ||
      !newRow.evaluationMethodology ||
      !newRow.resourcePerson ||
      !newRow.status
    )
      return;

    const newEntry = { id: Date.now(), ...newRow };
    setTrainingRows((prev) => [...prev, newEntry]);
    setShowNewRow(false);
  };

  const handleCancelNew = () => setShowNewRow(false);

  const handleStartEdit = (id) => {
    setEditingRowId(id);
    setOpenActionRowId(null);
  };

  const handleEditChange = (id, { target: { name, value } }) => {
    setTrainingRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [name]: value } : r))
    );
  };

  const handleDoneEdit = () => setEditingRowId(null);
  const handleDeleteRow = (id) =>
    setTrainingRows((prev) => prev.filter((r) => r.id !== id));

  const toggleActionMenu = (id) =>
    setOpenActionRowId((prev) => (prev === id ? null : id));

  const handleFilterChange = ({ target: { name, value } }) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mt-5 px-4">
        <span className="text-lg font-semibold">Customer Satisfaction</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSavePopup(true)}
            className="bg-primary-pink text-white px-8 py-3 rounded-md text-sm font-medium hover:opacity-90 transition-all"
          >
            Save
          </button>
          <button
            onClick={handleApprove}
            disabled={isApproving}
            className="bg-primary-pink text-white px-8 py-3 rounded-md text-sm font-medium hover:opacity-90 transition-all disabled:opacity-60"
          >
            {isApproving ? "Approving..." : "Approve"}
          </button>
        </div>
      </div>

      {/* Title + Filters + Add New */}
      <div className=" items-center gap-5 mt-5">
        <span className="text-lg font-semibold">Customer Satisfaction</span>
        <div className="flex items-center gap-3">
          <FormSelect
            name="targetAudience"
            formValues={filters}
            options={audienceOptions}
            onChange={handleFilterChange}
            className="w-[150px]"
          />
          <FormSelect
            name="status"
            formValues={filters}
            options={statusOptions}
            onChange={handleFilterChange}
            className="w-[150px]"
          />
          <div className="flex items-center gap-1">
            <PlusCircleIcon
              onClick={handleAddNewClick}
              className="w-6 h-6 text-pink-500 cursor-pointer"
            />
            <button className="text-text-color" onClick={handleAddNewClick}>
              Add New
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded p-3 mt-2">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="text-left text-secondary-grey border-b border-gray-200">
              <th className="py-3 px-2 w-10">#</th>
              <th className="py-3 px-2">Date</th>
              <th className="py-3 px-2">Training Module</th>
              <th className="py-3 px-2">Target Audience</th>
              <th className="py-3 px-2">Duration</th>
              <th className="py-3 px-2">Evaluation Methodology</th>
              <th className="py-3 px-2">Resource Person</th>
              <th className="py-3 px-2">Status</th>
              <th className="py-3 px-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {pagedRows.map((row, index) => {
              const isEditing = editingRowId === row.id;
              return (
                <tr key={row.id} className="border-b border-gray-200">
                  <td className="py-3 px-2">{indexOfFirst + index + 1}</td>

                  {!isEditing ? (
                    <>
                      <td className="py-3 px-2">{row.date}</td>
                      <td className="py-3 px-2">{row.trainingModule}</td>
                      <td className="py-3 px-2">{row.targetAudience}</td>
                      <td className="py-3 px-2">{row.duration}</td>
                      <td className="py-3 px-2">{row.evaluationMethodology}</td>
                      <td className="py-3 px-2">{row.resourcePerson}</td>
                      <td className="py-3 px-2">{row.status}</td>
                      <td className="py-3 px-2">
                        {openActionRowId !== row.id ? (
                          <div
                            className="cursor-pointer inline-flex"
                            onClick={() => toggleActionMenu(row.id)}
                          >
                            <EllipsisVerticalIcon className="w-5 h-5 text-secondary-grey" />
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div
                              className="cursor-pointer"
                              onClick={() => handleStartEdit(row.id)}
                            >
                              <PencilIcon className="w-5 h-5 text-text-color" />
                            </div>
                            <div
                              className="cursor-pointer"
                              onClick={() => handleDeleteRow(row.id)}
                            >
                              <TrashIcon className="w-5 h-5 text-text-color" />
                            </div>
                            <div
                              className="cursor-pointer"
                              onClick={() => setOpenActionRowId(null)}
                            >
                              <XMarkIcon className="w-5 h-5 text-text-color" />
                            </div>
                          </div>
                        )}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-2">
                        <FormTextArea
                          name="date"
                          formValues={{ date: row.date }}
                          onChange={(e) => handleEditChange(row.id, e)}
                        />
                      </td>
                      <td className="py-3 px-2">
                        <FormTextArea
                          name="trainingModule"
                          formValues={{ trainingModule: row.trainingModule }}
                          onChange={(e) => handleEditChange(row.id, e)}
                        />
                      </td>
                      <td className="py-3 px-2">
                        <FormTextArea
                          name="targetAudience"
                          formValues={{ targetAudience: row.targetAudience }}
                          onChange={(e) => handleEditChange(row.id, e)}
                        />
                      </td>
                      <td className="py-3 px-2">
                        <FormTextArea
                          name="duration"
                          formValues={{ duration: row.duration }}
                          onChange={(e) => handleEditChange(row.id, e)}
                        />
                      </td>
                      <td className="py-3 px-2">
                        <FormTextArea
                          name="evaluationMethodology"
                          formValues={{
                            evaluationMethodology: row.evaluationMethodology,
                          }}
                          onChange={(e) => handleEditChange(row.id, e)}
                        />
                      </td>
                      <td className="py-3 px-2">
                        <FormTextArea
                          name="resourcePerson"
                          formValues={{ resourcePerson: row.resourcePerson }}
                          onChange={(e) => handleEditChange(row.id, e)}
                        />
                      </td>
                      <td className="py-3 px-2 w-40">
                        <FormSelect
                          name="status"
                          formValues={{ status: row.status }}
                          options={statusOptions}
                          onChange={(e) => handleEditChange(row.id, e)}
                        />
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-3 items-center">
                          <div className="cursor-pointer" onClick={handleDoneEdit}>
                            <CheckCircleIcon className="w-5 h-5 text-primary-pink" />
                          </div>
                          <div className="cursor-pointer" onClick={handleCancelNew}>
                            <XMarkIcon className="w-5 h-5 text-text-color" />
                          </div>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}

            {/* New Row - shown at bottom */}
            {showNewRow && (
              <tr className="border-b border-gray-200">
                <td className="py-3 px-2">-</td>
                <td className="py-3 px-2">
                  <FormTextArea
                    name="date"
                    formValues={{ date: newRow.date }}
                    onChange={handleNewChange}
                  />
                </td>
                <td className="py-3 px-2">
                  <FormTextArea
                    name="trainingModule"
                    formValues={{ trainingModule: newRow.trainingModule }}
                    onChange={handleNewChange}
                  />
                </td>
                <td className="py-3 px-2">
                  <FormTextArea
                    name="targetAudience"
                    formValues={{ targetAudience: newRow.targetAudience }}
                    onChange={handleNewChange}
                  />
                </td>
                <td className="py-3 px-2">
                  <FormTextArea
                    name="duration"
                    formValues={{ duration: newRow.duration }}
                    onChange={handleNewChange}
                  />
                </td>
                <td className="py-3 px-2">
                  <FormTextArea
                    name="evaluationMethodology"
                    formValues={{
                      evaluationMethodology: newRow.evaluationMethodology,
                    }}
                    onChange={handleNewChange}
                  />
                </td>
                <td className="py-3 px-2">
                  <FormTextArea
                    name="resourcePerson"
                    formValues={{ resourcePerson: newRow.resourcePerson }}
                    onChange={handleNewChange}
                  />
                </td>
                <td className="py-3 px-2 w-40">
                  <FormSelect
                    name="status"
                    formValues={{ status: newRow.status }}
                    options={statusOptions}
                    onChange={handleNewChange}
                  />
                </td>
                <td className="py-3 px-2">
                  <div className="flex gap-3 items-center">
                    <div className="cursor-pointer" onClick={handleSaveNew}>
                      <CheckCircleIcon className="w-5 h-5 text-primary-pink" />
                    </div>
                    <div className="cursor-pointer" onClick={handleCancelNew}>
                      <XMarkIcon className="w-5 h-5 text-text-color" />
                    </div>
                  </div>
                </td>
              </tr>
            )}

            {pagedRows.length === 0 && !showNewRow && (
              <tr>
                <td
                  className="py-3 px-2 text-center text-gray-500"
                  colSpan={9}
                >
                  No training plans found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {filteredRows.length > 0 && (
          <div className="w-full flex gap-5 items-center justify-end mt-4">
            <button
              onClick={handlePreviousPage}
              className={`p-2 rounded-full bg-gray-200 ${currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-300"
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
              className={`p-2 rounded-full bg-gray-200 ${currentPage === totalPages
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
      <SaveVersionPopup
        isOpen={showSavePopup}
        onClose={() => setShowSavePopup(false)}
        onConfirm={handleSaveConfirm}
        isLoading={isSaving}
      />
    </div>
  );
};

export default CustomerSatisfactionOverview;

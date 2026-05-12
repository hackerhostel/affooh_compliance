import React, { useEffect, useState } from "react";
import FormSelect from "../../../components/FormSelect.jsx";
import FormInput from "../../../components/FormInput.jsx";
import FormTextArea from "../../../components/FormTextArea.jsx";
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
import useFetchRasci from "../../../hooks/custom-hooks/compliance/useFetchRasci.jsx";
import useFetchPositions from "../../../hooks/custom-hooks/compliance/useFetchPositions.jsx";
import {
  createRasci,
  updateRasci,
  deleteRasci as deleteRasciApi,
  createRevisionHistory,
  createApproval,
} from "../../../utils/complianceApi.js";
import { useToasts } from "react-toast-notifications";
import ConfirmationDialog from "../../../components/ConfirmationDialog.jsx";
import SaveVersionPopup from "../../../components/SaveVersionPopup.jsx";
import { selectUser } from "../../../state/slice/authSlice.js";

const DOCUMENT_TYPE = "RASCI";

const RASCIOverview = () => {
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
  const { data: rasciData, refetch } = useFetchRasci(projectId);
  const { positions } = useFetchPositions(projectId);

  const positionOptions = getSelectOptions(positions);

  const [rasciRows, setRasciRows] = useState([]);
  const [showNewRow, setShowNewRow] = useState(false);
  const [newRow, setNewRow] = useState({
    taskActivity: "",
    R: "",
    A: "",
    S: "",
    C: "",
    I: "",
  });
  const [editingRowId, setEditingRowId] = useState(null);
  const [openActionRowId, setOpenActionRowId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rasciToDelete, setRasciToDelete] = useState(null);

  useEffect(() => {
    setRasciRows(rasciData || []);
  }, [rasciData]);

  const rowsPerPage = 5;
  const totalPages = Math.ceil(rasciRows.length / rowsPerPage) || 1;
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const pagedRows = rasciRows.slice(indexOfFirst, indexOfLast);

  const handleAddNewClick = () => {
    setShowNewRow(true);
    setNewRow({
      taskActivity: "",
      R: "",
      A: "",
      S: "",
      C: "",
      I: "",
    });
  };

  const handleNewChange = ({ target: { name, value } }) => {
    setNewRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNew = async () => {
    if (!projectId) {
      addToast("Project not found", { appearance: "error" });
      return;
    }
    if (!newRow.taskActivity) {
      addToast("Please enter Task/Activity", { appearance: "error" });
      return;
    }
    if (!newRow.R || !newRow.A) {
      addToast("R and A fields are required", { appearance: "error" });
      return;
    }
    try {
      await createRasci({
        projectID: projectId,
        taskActivity: newRow.taskActivity,
        R: newRow.R || null,
        A: newRow.A || null,
        S: newRow.S || null,
        C: newRow.C || null,
        I: newRow.I || null,
      });
      setShowNewRow(false);
      setNewRow({ taskActivity: "", R: "", A: "", S: "", C: "", I: "" });
      refetch();
      addToast("RASCI entry created successfully", { appearance: "success" });
    } catch (error) {
      addToast("Failed to create RASCI entry", { appearance: "error" });
    }
  };

  const handleCancelNew = () => setShowNewRow(false);

  const handleStartEdit = (id) => {
    setEditingRowId(id);
    setOpenActionRowId(null);
  };

  const handleEditChange = (id, { target: { name, value } }) => {
    setRasciRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [name]: value } : r))
    );
  };

  const handleDoneEdit = async () => {
    const row = rasciRows.find((r) => r.id === editingRowId);
    if (row) {
      if (!row.taskActivity) {
        addToast("Please enter Task/Activity", { appearance: "error" });
        return;
      }
      try {
        await updateRasci(row.id, {
          taskActivity: row.taskActivity,
          R: row.R || null,
          A: row.A || null,
          S: row.S || null,
          C: row.C || null,
          I: row.I || null,
        });
        refetch();
        addToast("RASCI entry updated successfully", { appearance: "success" });
      } catch (error) {
        addToast("Failed to update RASCI entry", { appearance: "error" });
      }
    }
    setEditingRowId(null);
  };

  const handleCloseEdit = () => setEditingRowId(null);

  const handleDeleteClick = (row) => {
    setRasciToDelete(row);
    setIsDeleteDialogOpen(true);
    setOpenActionRowId(null);
  };

  const handleConfirmDelete = async () => {
    if (!rasciToDelete) return;
    try {
      await deleteRasciApi(rasciToDelete.id);
      refetch();
      if (editingRowId === rasciToDelete.id) setEditingRowId(null);
      addToast("RASCI entry deleted successfully", { appearance: "success" });
    } catch (error) {
      addToast("Failed to delete RASCI entry", { appearance: "error" });
    }
    setIsDeleteDialogOpen(false);
    setRasciToDelete(null);
  };

  const toggleActionMenu = (id) =>
    setOpenActionRowId((prev) => (prev === id ? null : id));

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <div>
      <div className='flex justify-end items-center mt-4 space-x-2'>
        <button onClick={() => setShowSavePopup(true)} className='bg-primary-pink px-8 py-3 rounded-md text-white'>Save</button>
        <button onClick={handleApprove} disabled={isApproving} className='bg-primary-pink px-8 py-3 rounded-md text-white disabled:opacity-60'>{isApproving ? "Approving..." : "Approve"}</button>
      </div>
      <div className="mt-6">
      <div className="flex items-center gap-5">
        <span className="text-lg font-semibold">RASCI</span>
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

      <div className="bg-white rounded p-3 mt-2 overflow-x-auto">
        <table className="table-fixed w-full border-collapse min-w-max">
          <thead>
            <tr className="text-left text-secondary-grey border-b border-gray-200">
              <th className="py-3 px-4 text-center" style={{ width: '4%' }}>#</th>
              <th className="py-3 px-4" style={{ width: '20%' }}>Task/Activity</th>
              <th className="py-3 px-4" style={{ width: '13%' }}>R</th>
              <th className="py-3 px-4" style={{ width: '13%' }}>A</th>
              <th className="py-3 px-4" style={{ width: '13%' }}>S</th>
              <th className="py-3 px-4" style={{ width: '13%' }}>C</th>
              <th className="py-3 px-4" style={{ width: '13%' }}>I</th>
              <th className="py-3 px-4 text-center" style={{ width: '11%' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {showNewRow && (
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 text-center">-</td>
                <td className="py-3 px-4">
                  <FormTextArea
                    name="taskActivity"
                    formValues={{ taskActivity: newRow.taskActivity }}
                    onChange={handleNewChange}
                    placeholder="Enter task"
                  />
                </td>
                {["R", "A", "S", "C", "I"].map((field) => (
                  <td key={field} className="py-3 px-4">
                    <FormSelect
                      name={field}
                      formValues={{ [field]: newRow[field] }}
                      options={positionOptions}
                      onChange={handleNewChange}
                      placeholder="Select an option"
                    />
                  </td>
                ))}
                <td className="py-3 px-4">
                  <div className="flex gap-3 items-center justify-center">
                    <CheckCircleIcon
                      onClick={handleSaveNew}
                      className="w-5 h-5 text-primary-pink cursor-pointer"
                    />
                    <XMarkIcon
                      onClick={handleCancelNew}
                      className="w-5 h-5 text-text-color cursor-pointer"
                    />
                  </div>
                </td>
              </tr>
            )}

            {pagedRows.length === 0 && !showNewRow && (
              <tr>
                <td colSpan={8} className="text-center text-gray-500 py-4">
                  No tasks found
                </td>
              </tr>
            )}

            {pagedRows.map((row, index) => {
              const isEditing = editingRowId === row.id;
              return (
                <tr key={row.id} className="border-b border-gray-200">
                  <td className="py-3 px-4 text-center">{indexOfFirst + index + 1}</td>

                  {!isEditing ? (
                    <>
                      <td className="py-3 px-4">{row.taskActivity || "-"}</td>
                      {["R", "A", "S", "C", "I"].map((key) => (
                        <td key={key} className="py-3 px-4">
                          {row[key] || "-"}
                        </td>
                      ))}
                      <td className="py-3 px-4 text-center">
                        {openActionRowId !== row.id ? (
                          <div className="flex justify-center">
                            <EllipsisVerticalIcon
                              onClick={() => toggleActionMenu(row.id)}
                              className="w-5 h-5 text-secondary-grey cursor-pointer"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-3">
                            <PencilIcon
                              onClick={() => handleStartEdit(row.id)}
                              className="w-5 h-5 text-text-color cursor-pointer"
                            />
                            <TrashIcon
                              onClick={() => handleDeleteClick(row)}
                              className="w-5 h-5 text-text-color cursor-pointer"
                            />
                            <XMarkIcon
                              onClick={() => setOpenActionRowId(null)}
                              className="w-5 h-5 text-text-color cursor-pointer"
                            />
                          </div>
                        )}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-4">
                        <FormTextArea
                          name="taskActivity"
                          formValues={{ taskActivity: row.taskActivity }}
                          onChange={(e) => handleEditChange(row.id, e)}
                          placeholder="Enter task"
                        />
                      </td>
                      {["R", "A", "S", "C", "I"].map((field) => (
                        <td key={field} className="py-3 px-4">
                          <FormSelect
                            name={field}
                            formValues={{ [field]: row[field] }}
                            options={positionOptions}
                            onChange={(e) => handleEditChange(row.id, e)}
                            placeholder="Select an option"
                          />
                        </td>
                      ))}
                      <td className="py-3 px-4">
                        <div className="flex gap-3 items-center justify-center">
                          <CheckCircleIcon
                            onClick={handleDoneEdit}
                            className="w-5 h-5 text-primary-pink cursor-pointer"
                          />
                          <XMarkIcon
                            onClick={handleCloseEdit}
                            className="w-5 h-5 text-text-color cursor-pointer"
                          />
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>

        {rasciRows.length > 0 && (
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

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        message={
          rasciToDelete
            ? `Do you want to delete "${rasciToDelete.taskActivity}"?`
            : ""
        }
      />
      </div>
      <SaveVersionPopup isOpen={showSavePopup} onClose={() => setShowSavePopup(false)} onConfirm={handleSaveConfirm} isLoading={isSaving} />
    </div>
  );
};

export default RASCIOverview;

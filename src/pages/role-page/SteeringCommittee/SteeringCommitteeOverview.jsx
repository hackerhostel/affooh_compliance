import React, { useEffect, useState } from "react";
import FormTextArea from "../../../components/FormTextArea.jsx";
import FormSelect from "../../../components/FormSelect.jsx";
import UserSelect from "../../../components/UserSelect.jsx";
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
import { selectProjectUserList } from "../../../state/slice/projectUsersSlice.js";
import useFetchSteeringCommittees from "../../../hooks/custom-hooks/compliance/useFetchSteeringCommittees.jsx";
import {
  createSteeringCommittee,
  updateSteeringCommittee,
  deleteSteeringCommittee as deleteSteeringCommitteeApi,
  getSteeringCommitteeRoles,
  getOrganizationRoles,
  createRevisionHistory,
  createApproval,
} from "../../../utils/complianceApi.js";
import { useToasts } from "react-toast-notifications";
import ConfirmationDialog from "../../../components/ConfirmationDialog.jsx";
import SaveVersionPopup from "../../../components/SaveVersionPopup.jsx";
import { selectUser } from "../../../state/slice/authSlice.js";

const DOCUMENT_TYPE = "STEERING_COMMITTEE";

const TYPE_OPTIONS = getSelectOptions([
  { id: "ISO 9001", name: "ISO 9001" },
  { id: "ISO 27001", name: "ISO 27001" },
]);

const SteeringCommitteeOverview = () => {
  const { addToast } = useToasts();
  const selectedProject = useSelector(selectSelectedProject);
  const currentUser = useSelector(selectUser);
  const projectId = selectedProject?.id;
  const projectUserList = useSelector(selectProjectUserList) || [];
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

  const { data: committeeData, refetch } =
    useFetchSteeringCommittees(projectId);

  const [committeeRows, setCommitteeRows] = useState([]);
  const [showNewRow, setShowNewRow] = useState(false);
  const [newRow, setNewRow] = useState({
    userID: "",
    role: "",
    type: "",
    responsibilities: "",
  });
  const [editingRowId, setEditingRowId] = useState(null);
  const [openActionRowId, setOpenActionRowId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [committeeToDelete, setCommitteeToDelete] = useState(null);

  useEffect(() => {
    setCommitteeRows(committeeData || []);
  }, [committeeData]);

  useEffect(() => {
    getOrganizationRoles().then((roles) => {
      setAvailableRoles(roles.map((r) => r.name));
    });
  }, []);

  const roleOptions = getSelectOptions(
    availableRoles.map((r) => ({ id: r, name: r }))
  );


  const rowsPerPage = 5;
  const totalPages = Math.max(
    1,
    Math.ceil(committeeRows.length / rowsPerPage)
  );
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const pagedRows = committeeRows.slice(indexOfFirst, indexOfLast);

  const getDisplayName = (row) => {
    if (row.firstName || row.lastName) {
      return `${row.firstName || ""} ${row.lastName || ""}`.trim();
    }
    return "-";
  };

  const handleAddNewClick = () => {
    setShowNewRow(true);
    setNewRow({
      userID: "",
      role: "",
      type: "",
      responsibilities: "",
    });
  };

  const handleNewChange = ({ target: { name, value } }) => {
    setNewRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNew = async () => {
    if (!projectId) {
      addToast("Please select a project first", { appearance: "error" });
      return;
    }
    if (!newRow.userID || !newRow.role || !newRow.type) {
      addToast("Please fill in Name, Role and Type", { appearance: "error" });
      return;
    }
    try {
      await createSteeringCommittee({
        projectID: projectId,
        userID: Number(newRow.userID),
        role: newRow.role,
        type: newRow.type,
        responsibilities: newRow.responsibilities || undefined,
      });
      setShowNewRow(false);
      setNewRow({ userID: "", role: "", type: "", responsibilities: "" });
      refetch();
      addToast("Record created successfully", { appearance: "success" });
    } catch (error) {
      addToast("Failed to create record", { appearance: "error" });
    }
  };

  const handleCancelNew = () => {
    setShowNewRow(false);
  };

  const handleStartEdit = (id) => {
    setEditingRowId(id);
    setOpenActionRowId(null);
  };

  const handleEditChange = (id, { target: { name, value } }) => {
    setCommitteeRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [name]: value } : r))
    );
  };

  const handleDoneEdit = async () => {
    const row = committeeRows.find((r) => r.id === editingRowId);
    if (!row) return;
    if (!row.role || !row.type) {
      addToast("Please fill in Role and Type", { appearance: "error" });
      return;
    }
    try {
      await updateSteeringCommittee(row.id, {
        userID: row.userID,
        role: row.role,
        type: row.type,
        responsibilities: row.responsibilities || undefined,
      });
      setEditingRowId(null);
      refetch();
      addToast("Record updated successfully", { appearance: "success" });
    } catch (error) {
      addToast("Failed to update record", { appearance: "error" });
    }
  };

  const handleCloseEdit = () => {
    setEditingRowId(null);
  };

  const handleDeleteClick = (row) => {
    setCommitteeToDelete(row);
    setIsDeleteDialogOpen(true);
    setOpenActionRowId(null);
  };

  const handleConfirmDelete = async () => {
    if (!committeeToDelete) return;
    try {
      await deleteSteeringCommitteeApi(committeeToDelete.id);
      refetch();
      if (editingRowId === committeeToDelete.id) setEditingRowId(null);
      addToast("Record deleted successfully", { appearance: "success" });
    } catch (error) {
      addToast("Failed to delete record", { appearance: "error" });
    }
    setIsDeleteDialogOpen(false);
    setCommitteeToDelete(null);
  };

  const toggleActionMenu = (id) => {
    setOpenActionRowId((prev) => (prev === id ? null : id));
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  if (!projectId) {
    return (
      <div className="mt-6 text-gray-500 text-center">
        Please select a project from the header to view Steering Committee
      </div>
    );
  }

  return (
    <div>
      <div className='flex justify-end items-center mt-4 space-x-2'>
        <button onClick={() => setShowSavePopup(true)} className='bg-primary-pink px-8 py-3 rounded-md text-white'>Save</button>
        <button onClick={handleApprove} disabled={isApproving} className='bg-primary-pink px-8 py-3 rounded-md text-white disabled:opacity-60'>{isApproving ? "Approving..." : "Approve"}</button>
      </div>
      <div className="mt-6">
      <div className="flex items-center gap-5">
        <span className="text-lg font-semibold">Steering Committee</span>
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

      <div className="bg-white rounded p-3 mt-2">
        <table className="table-fixed w-full border-collapse">
          <thead>
            <tr className="text-left text-secondary-grey border-b border-gray-200">
              <th className="py-3 px-4 text-center" style={{ width: '4%' }}>#</th>
              <th className="py-3 px-4" style={{ width: '14%' }}>Name</th>
              <th className="py-3 px-4" style={{ width: '14%' }}>Role</th>
              <th className="py-3 px-4" style={{ width: '14%' }}>Type</th>
              <th className="py-3 px-4" style={{ width: '42%' }}>Responsibility</th>
              <th className="py-3 px-4 text-center" style={{ width: '12%' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {showNewRow && (
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 text-center">-</td>
                <td className="py-3 px-4 w-32">
                  <UserSelect
                    name="userID"
                    value={newRow.userID}
                    onChange={handleNewChange}
                    users={projectUserList}
                  />
                </td>
                <td className="py-3 px-4 w-32">
                  <FormSelect
                    name="role"
                    formValues={{ role: newRow.role }}
                    options={roleOptions}
                    onChange={handleNewChange}
                    showLabel={false}
                  />
                </td>
                <td className="py-3 px-4 w-32">
                  <FormSelect
                    name="type"
                    formValues={{ type: newRow.type }}
                    options={TYPE_OPTIONS}
                    onChange={handleNewChange}
                    showLabel={false}
                  />
                </td>
                <td className="py-3 px-4">
                  <FormTextArea
                    name="responsibilities"
                    formValues={{ responsibilities: newRow.responsibilities }}
                    onChange={handleNewChange}
                  />
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-3 items-center justify-center">
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
                <td className="py-3 px-2 text-center text-gray-500" colSpan={6}>
                  No members found
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
                      <td className="py-3 px-4 text-left">
                        {getDisplayName(row)}
                      </td>
                      <td className="py-3 px-4 text-left">{row.role || "-"}</td>
                      <td className="py-3 px-4 text-left">{row.type || "-"}</td>
                      <td className="py-3 px-4 text-left">
                        {row.responsibilities || "-"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {openActionRowId !== row.id ? (
                          <div
                            className="cursor-pointer inline-flex justify-center"
                            onClick={() => toggleActionMenu(row.id)}
                          >
                            <EllipsisVerticalIcon className="w-5 h-5 text-secondary-grey" />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-3">
                            <div
                              className="cursor-pointer"
                              onClick={() => handleStartEdit(row.id)}
                            >
                              <PencilIcon className="w-5 h-5 text-text-color" />
                            </div>
                            <div
                              className="cursor-pointer"
                              onClick={() => handleDeleteClick(row)}
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
                      <td className="py-3 px-4 w-32">
                        <UserSelect
                          name="userID"
                          value={row.userID}
                          onChange={(e) => handleEditChange(row.id, e)}
                          users={projectUserList}
                        />
                      </td>
                      <td className="py-3 px-4 w-32">
                        <FormSelect
                          name="role"
                          formValues={{ role: row.role }}
                          options={roleOptions}
                          onChange={(e) => handleEditChange(row.id, e)}
                          showLabel={false}
                        />
                      </td>
                      <td className="py-3 px-4 w-32">
                        <FormSelect
                          name="type"
                          formValues={{ type: row.type }}
                          options={TYPE_OPTIONS}
                          onChange={(e) => handleEditChange(row.id, e)}
                          showLabel={false}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <FormTextArea
                          name="responsibilities"
                          formValues={{
                            responsibilities: row.responsibilities,
                          }}
                          onChange={(e) => handleEditChange(row.id, e)}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-3 items-center justify-center">
                          <div
                            className="cursor-pointer"
                            onClick={handleDoneEdit}
                          >
                            <CheckCircleIcon className="w-5 h-5 text-primary-pink" />
                          </div>
                          <div
                            className="cursor-pointer"
                            onClick={handleCloseEdit}
                          >
                            <XMarkIcon className="w-5 h-5 text-text-color" />
                          </div>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>

        {committeeRows.length > 0 && (
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
          committeeToDelete
            ? `Do you want to delete "${getDisplayName(committeeToDelete)}"?`
            : ""
        }
      />
      </div>
      <SaveVersionPopup isOpen={showSavePopup} onClose={() => setShowSavePopup(false)} onConfirm={handleSaveConfirm} isLoading={isSaving} />
    </div>
  );
};

export default SteeringCommitteeOverview;

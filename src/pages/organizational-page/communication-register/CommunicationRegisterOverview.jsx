import React, { useEffect, useState } from "react";
import FormInput from "../../../components/FormInput.jsx";
import FormTextArea from "../../../components/FormTextArea.jsx";
import FormSelect from "../../../components/FormSelect.jsx";
import {
  EllipsisVerticalIcon,
  PencilIcon,
  CheckCircleIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { selectSelectedProject } from "../../../state/slice/projectSlice.js";
import { selectProjectUserList, doGetProjectUsers } from "../../../state/slice/projectUsersSlice.js";
import { getUserSelectOptions } from "../../../utils/commonUtils.js";
import useFetchCommunications from "../../../hooks/custom-hooks/compliance/useFetchCommunications.jsx";
import {
  createCommunication,
  deleteCommunication,
  updateCommunication,
} from "../../../utils/complianceApi.js";
import { useToasts } from "react-toast-notifications";
import ConfirmationDialog from "../../../components/ConfirmationDialog.jsx";

const CommunicationRegisterOverview = () => {
  // -------------------------------
  // INTERNAL COMMUNICATION SECTION
  // -------------------------------
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const selectedProject = useSelector(selectSelectedProject);
  const projectId = selectedProject?.id;
  const { data: communications, refetch } = useFetchCommunications(projectId);
  const projectUsers = useSelector(selectProjectUserList);

  useEffect(() => {
    if (projectId) {
      dispatch(doGetProjectUsers(projectId));
    }
  }, [projectId, dispatch]);

  const userOptions = getUserSelectOptions(projectUsers || []);

  const [internalRows, setInternalRows] = useState([]);
  const [showNewInternalRow, setShowNewInternalRow] = useState(false);
  const [newInternalRow, setNewInternalRow] = useState({
    subject: "",
    description: "",
    method: "",
    frequency: "",
    sender: "",
    recipient: "",
    communicationDate: "",
    status: "Planned",
  });
  const [editingInternalRowId, setEditingInternalRowId] = useState(null);
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [openActionMenu, setOpenActionMenu] = useState(false);
  const [openActionRowId, setOpenActionRowId] = useState(null);

  // -------------------------------
  // EXTERNAL COMMUNICATION SECTION
  // -------------------------------
  const [externalRows, setExternalRows] = useState([]);
  const [showNewExternalRow, setShowNewExternalRow] = useState(false);
  const [newExternalRow, setNewExternalRow] = useState({
    subject: "",
    description: "",
    method: "",
    frequency: "",
    sender: "",
    recipient: "",
    communicationDate: "",
    status: "Planned",
  });
  const [editingExternalRowId, setEditingExternalRowId] = useState(null);
  const [externalCurrentPage, setExternalCurrentPage] = useState(1);

  // Delete confirmation states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const statusOptions = [
    { value: "Planned", label: "Planned" },
    { value: "Completed", label: "Completed" },
    { value: "Cancelled", label: "Cancelled" },
  ];

  useEffect(() => {
    const rows = communications || [];
    setInternalRows(rows.filter((row) => row.communicationType === "Internal"));
    setExternalRows(rows.filter((row) => row.communicationType === "External"));
  }, [communications]);

  // Pagination setup
  const rowsPerPage = 5;

  // INTERNAL HANDLERS
  const handleAddNewInternalClick = () => {
    setShowNewInternalRow(true);
    setNewInternalRow({
      subject: "",
      description: "",
      method: "",
      frequency: "",
      sender: "",
      recipient: "",
      communicationDate: "",
      status: "Planned",
    });
  };

  const handleInternalChange = ({ target: { name, value } }) => {
    setNewInternalRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNewInternal = async () => {
    if (!projectId) {
      addToast("Project not found", { appearance: "error" });
      return;
    }
    if (!newInternalRow.subject || !newInternalRow.method) {
      addToast("Please fill in all required fields", { appearance: "error" });
      return;
    }
    try {
      await createCommunication({
        projectID: projectId,
        communicationType: "Internal",
        subject: newInternalRow.subject,
        description: newInternalRow.description,
        sender: newInternalRow.sender,
        recipient: newInternalRow.recipient,
        communicationDate:
          newInternalRow.communicationDate || new Date().toISOString().slice(0, 10),
        frequency: newInternalRow.frequency,
        method: newInternalRow.method,
        status: newInternalRow.status,
      });
      setShowNewInternalRow(false);
      refetch();
      addToast("Internal communication created successfully", { appearance: "success" });
    } catch (error) {
      addToast("Failed to create internal communication", { appearance: "error" });
    }
  };

  const handleDeleteInternalRow = (row) => {
    setItemToDelete(row);
    setIsDeleteDialogOpen(true);
    setOpenActionRowId(null);
  };

  const handleStartEditInternal = (id) => setEditingInternalRowId(id);
  const handleEditInternalChange = (id, { target: { name, value } }) => {
    setInternalRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [name]: value } : r))
    );
  };
  const handleDoneEditInternal = async () => {
    const row = internalRows.find((item) => item.id === editingInternalRowId);
    if (row) {
      if (!row.subject || !row.method) {
        addToast("Please fill in all required fields", { appearance: "error" });
        return;
      }
      try {
        await updateCommunication(row.id, {
          subject: row.subject,
          description: row.description,
          sender: row.sender,
          recipient: row.recipient,
          communicationDate: row.communicationDate,
          frequency: row.frequency,
          method: row.method,
          status: row.status,
        });
        refetch();
        addToast("Internal communication updated successfully", { appearance: "success" });
      } catch (error) {
        addToast("Failed to update internal communication", { appearance: "error" });
      }
    }
    setEditingInternalRowId(null);
  };

  // INTERNAL PAGINATION
  const internalTotalPages = Math.ceil(internalRows.length / rowsPerPage) || 1;
  const internalPagedRows = internalRows.slice(
    (internalCurrentPage - 1) * rowsPerPage,
    internalCurrentPage * rowsPerPage
  );
  const handlePrevInternal = () =>
    setInternalCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextInternal = () =>
    setInternalCurrentPage((p) => Math.min(p + 1, internalTotalPages));

  // EXTERNAL HANDLERS
  const handleAddNewExternalClick = () => {
    setShowNewExternalRow(true);
    setNewExternalRow({
      subject: "",
      description: "",
      method: "",
      frequency: "",
      sender: "",
      recipient: "",
      communicationDate: "",
      status: "Planned",
    });
  };

  const handleExternalChange = ({ target: { name, value } }) => {
    setNewExternalRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNewExternal = async () => {
    if (!projectId) {
      addToast("Project not found", { appearance: "error" });
      return;
    }
    if (!newExternalRow.subject || !newExternalRow.method) {
      addToast("Please fill in all required fields", { appearance: "error" });
      return;
    }
    try {
      await createCommunication({
        projectID: projectId,
        communicationType: "External",
        subject: newExternalRow.subject,
        description: newExternalRow.description,
        sender: newExternalRow.sender,
        recipient: newExternalRow.recipient,
        communicationDate:
          newExternalRow.communicationDate || new Date().toISOString().slice(0, 10),
        frequency: newExternalRow.frequency,
        method: newExternalRow.method,
        status: newExternalRow.status,
      });
      setShowNewExternalRow(false);
      refetch();
      addToast("External communication created successfully", { appearance: "success" });
    } catch (error) {
      addToast("Failed to create external communication", { appearance: "error" });
    }
  };

  const handleDeleteExternalRow = (row) => {
    setItemToDelete(row);
    setIsDeleteDialogOpen(true);
    setOpenActionRowId(null);
  };

  const handleStartEditExternal = (id) => setEditingExternalRowId(id);
  const handleEditExternalChange = (id, { target: { name, value } }) => {
    setExternalRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [name]: value } : r))
    );
  };
  const handleDoneEditExternal = async () => {
    const row = externalRows.find((item) => item.id === editingExternalRowId);
    if (row) {
      if (!row.subject || !row.method) {
        addToast("Please fill in all required fields", { appearance: "error" });
        return;
      }
      try {
        await updateCommunication(row.id, {
          subject: row.subject,
          description: row.description,
          sender: row.sender,
          recipient: row.recipient,
          communicationDate: row.communicationDate,
          frequency: row.frequency,
          method: row.method,
          status: row.status,
        });
        refetch();
        addToast("External communication updated successfully", { appearance: "success" });
      } catch (error) {
        addToast("Failed to update external communication", { appearance: "error" });
      }
    }
    setEditingExternalRowId(null);
  };

  // EXTERNAL PAGINATION
  const externalTotalPages = Math.ceil(externalRows.length / rowsPerPage) || 1;
  const externalPagedRows = externalRows.slice(
    (externalCurrentPage - 1) * rowsPerPage,
    externalCurrentPage * rowsPerPage
  );
  const handlePrevExternal = () =>
    setExternalCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextExternal = () =>
    setExternalCurrentPage((p) => Math.min(p + 1, externalTotalPages));

  const toggleActionMenu = (rowId) => {
    setOpenActionRowId((prevId) => (prevId === rowId ? null : rowId));
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteCommunication(itemToDelete.id);
      refetch();
      addToast("Communication deleted successfully", { appearance: "success" });
    } catch (error) {
      addToast("Failed to delete communication", { appearance: "error" });
    }
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleSave = () => {
    setOpenActionMenu(false);
  };

  const handleCancel = () => {
    setOpenActionMenu(false);
  };

  return (
    <div>
      {/* ---------------- INTERNAL COMMUNICATION ---------------- */}
      <div className="mt-6">
        <div className="flex items-center gap-5">
          <span className="text-lg font-semibold">Internal</span>
          <div className="flex items-center gap-1">
            <PlusCircleIcon
              onClick={handleAddNewInternalClick}
              className="w-6 h-6 text-pink-500 cursor-pointer"
            />
            <button
              className="text-text-color"
              onClick={handleAddNewInternalClick}
            >
              Add New
            </button>
          </div>
        </div>

        <div className="bg-white rounded p-3 mt-2 overflow-x-auto">
          <table className="table-fixed w-full border-collapse min-w-max">
            <thead>
              <tr className="text-left text-secondary-grey border-b border-gray-200">
                <th className="py-3 px-2" style={{ width: '40px' }}>#</th>
                <th className="py-3 px-2" style={{ width: '200px' }}>Communication Media</th>
                <th className="py-3 px-2" style={{ width: '250px' }}>What is communicate</th>
                <th className="py-3 px-2" style={{ width: '120px' }}>Method</th>
                <th className="py-3 px-2" style={{ width: '120px' }}>Frequency</th>
                <th className="py-3 px-2" style={{ width: '200px' }}>Responsibility</th>
                <th className="py-3 px-2" style={{ width: '150px' }}>Target team</th>
                <th className="py-3 px-2" style={{ width: '80px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {showNewInternalRow && (
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-2">-</td>
                  <td className="py-3 px-2">
                    <FormInput
                      name="subject"
                      formValues={{ subject: newInternalRow.subject }}
                      onChange={handleInternalChange}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <FormTextArea
                      name="description"
                      formValues={{ description: newInternalRow.description }}
                      onChange={handleInternalChange}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <FormInput
                      name="method"
                      formValues={{ method: newInternalRow.method }}
                      onChange={handleInternalChange}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <FormInput
                      name="frequency"
                      formValues={{ frequency: newInternalRow.frequency }}
                      onChange={handleInternalChange}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <FormSelect
                      name="sender"
                      formValues={{ sender: newInternalRow.sender }}
                      options={userOptions}
                      onChange={handleInternalChange}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <FormInput
                      name="recipient"
                      formValues={{ recipient: newInternalRow.recipient }}
                      onChange={handleInternalChange}
                    />
                  </td>
                  <td className="py-3 px-2 flex gap-3">
                    <CheckCircleIcon
                      className="w-5 h-5 text-primary-pink cursor-pointer"
                      onClick={handleSaveNewInternal}
                    />
                    <XMarkIcon
                      className="w-5 h-5 text-text-color cursor-pointer"
                      onClick={() => setShowNewInternalRow(false)}
                    />
                  </td>
                </tr>
              )}

              {internalPagedRows.map((row, index) => {
                const isEditing = editingInternalRowId === row.id;
                return (
                  <tr className="border-b border-gray-200" key={row.id}>
                    <td className="py-3 px-2">
                      {(internalCurrentPage - 1) * rowsPerPage + index + 1}
                    </td>
                    {!isEditing ? (
                      <>
                        <td className="py-3 px-2">{row.subject}</td>
                        <td className="py-3 px-2">{row.description}</td>
                        <td className="py-3 px-2">{row.method}</td>
                        <td className="py-3 px-2">{row.frequency}</td>
                        <td className="py-3 px-2">{userOptions.find(u => String(u.value) === String(row.sender))?.label || row.sender}</td>
                        <td className="py-3 px-2">{row.recipient}</td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-3">
                            {openActionRowId !== row.id ? (
                              <div
                                className="cursor-pointer inline-flex"
                                onClick={() => toggleActionMenu(row.id)}
                              >
                                <EllipsisVerticalIcon className="w-5 h-5 text-secondary-grey" />
                              </div>
                            ) : (
                              <>
                                <div
                                  className="cursor-pointer"
                                  onClick={() => handleStartEditInternal(row.id)}
                                >
                                  <PencilIcon className="w-5 h-5 text-text-color" />
                                </div>
                                <div
                                  className="cursor-pointer"
                                  onClick={() => handleDeleteInternalRow(row)}
                                >
                                  <TrashIcon className="w-5 h-5 text-text-color" />
                                </div>
                                <div
                                  className="cursor-pointer"
                                  onClick={() => setOpenActionRowId(null)}
                                >
                                  <XMarkIcon className="w-5 h-5 text-text-color" />
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-2">
                          <FormInput
                            name="subject"
                            formValues={{ subject: row.subject }}
                            onChange={(e) => handleEditInternalChange(row.id, e)}
                          />
                        </td>
                        <td className="py-3 px-2">
                          <FormTextArea
                            name="description"
                            formValues={{ description: row.description }}
                            onChange={(e) => handleEditInternalChange(row.id, e)}
                          />
                        </td>
                        <td className="py-3 px-2">
                          <FormInput
                            name="method"
                            formValues={{ method: row.method }}
                            onChange={(e) => handleEditInternalChange(row.id, e)}
                          />
                        </td>
                        <td className="py-3 px-2">
                          <FormInput
                            name="frequency"
                            formValues={{ frequency: row.frequency }}
                            onChange={(e) => handleEditInternalChange(row.id, e)}
                          />
                        </td>
                        <td className="py-3 px-2">
                          <FormSelect
                            name="sender"
                            formValues={{ sender: row.sender }}
                            options={userOptions}
                            onChange={(e) => handleEditInternalChange(row.id, e)}
                          />
                        </td>
                        <td className="py-3 px-2">
                          <FormInput
                            name="recipient"
                            formValues={{ recipient: row.recipient }}
                            onChange={(e) => handleEditInternalChange(row.id, e)}
                          />
                        </td>
                        <td className="py-3 px-2 flex gap-3">
                          <CheckCircleIcon
                            className="w-5 h-5 text-primary-pink cursor-pointer"
                            onClick={handleDoneEditInternal}
                          />
                          <XMarkIcon
                            className="w-5 h-5 text-text-color cursor-pointer"
                            onClick={() => setEditingInternalRowId(null)}
                          />
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {internalRows.length > 0 && (
            <div className="w-full flex gap-5 items-center justify-end mt-4">
              <button
                onClick={handlePrevInternal}
                className={`p-2 rounded-full bg-gray-200 ${internalCurrentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-300"
                  }`}
                disabled={internalCurrentPage === 1}
              >
                <ChevronLeftIcon className="w-4 h-4 text-secondary-grey" />
              </button>
              <span className="text-gray-500 text-center">
                Page {internalCurrentPage} of {internalTotalPages}
              </span>
              <button
                onClick={handleNextInternal}
                className={`p-2 rounded-full bg-gray-200 ${internalCurrentPage === internalTotalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-300"
                  }`}
                disabled={internalCurrentPage === internalTotalPages}
              >
                <ChevronRightIcon className="w-4 h-4 text-secondary-grey" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ---------------- EXTERNAL COMMUNICATION ---------------- */}
      <div className="mt-10">
        <div className="flex items-center gap-5">
          <span className="text-lg font-semibold">External</span>
          <div className="flex items-center gap-1">
            <PlusCircleIcon
              onClick={handleAddNewExternalClick}
              className="w-6 h-6 text-pink-500 cursor-pointer"
            />
            <button
              className="text-text-color"
              onClick={handleAddNewExternalClick}
            >
              Add New
            </button>
          </div>
        </div>

        <div className="bg-white rounded p-3 mt-2 overflow-x-auto">
          <table className="table-fixed w-full border-collapse min-w-max">
            <thead>
              <tr className="text-left text-secondary-grey border-b border-gray-200">
                <th className="py-3 px-2" style={{ width: '40px' }}>#</th>
                <th className="py-3 px-2" style={{ width: '220px' }}>With whom to communicate</th>
                <th className="py-3 px-2" style={{ width: '250px' }}>What is communicate</th>
                <th className="py-3 px-2" style={{ width: '180px' }}>How to communicate</th>
                <th className="py-3 px-2" style={{ width: '180px' }}>Who communicates</th>
                <th className="py-3 px-2" style={{ width: '150px' }}>When to communicate</th>
                <th className="py-3 px-2" style={{ width: '80px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {showNewExternalRow && (
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-2">-</td>
                  <td className="py-3 px-2">
                    <FormInput
                      name="subject"
                      formValues={{ subject: newExternalRow.subject }}
                      onChange={handleExternalChange}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <FormTextArea
                      name="description"
                      formValues={{ description: newExternalRow.description }}
                      onChange={handleExternalChange}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <FormInput
                      name="method"
                      formValues={{ method: newExternalRow.method }}
                      onChange={handleExternalChange}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <FormInput
                      name="sender"
                      formValues={{ sender: newExternalRow.sender }}
                      onChange={handleExternalChange}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <FormInput
                      name="frequency"
                      formValues={{ frequency: newExternalRow.frequency }}
                      onChange={handleExternalChange}
                    />
                  </td>
                  <td className="py-3 px-2 flex gap-3">
                    <CheckCircleIcon
                      className="w-5 h-5 text-primary-pink cursor-pointer"
                      onClick={handleSaveNewExternal}
                    />
                    <XMarkIcon
                      className="w-5 h-5 text-text-color cursor-pointer"
                      onClick={() => setShowNewExternalRow(false)}
                    />
                  </td>
                </tr>
              )}

              {externalPagedRows.map((row, index) => {
                const isEditing = editingExternalRowId === row.id;
                return (
                  <tr className="border-b border-gray-200" key={row.id}>
                    <td className="py-3 px-2">
                      {(externalCurrentPage - 1) * rowsPerPage + index + 1}
                    </td>
                    {!isEditing ? (
                      <>
                        <td className="py-3 px-2">{row.subject}</td>
                        <td className="py-3 px-2">{row.description}</td>
                        <td className="py-3 px-2">{row.method}</td>
                        <td className="py-3 px-2">{row.sender}</td>
                        <td className="py-3 px-2">{row.frequency}</td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-3">
                            {openActionRowId !== row.id ? (
                              <div
                                className="cursor-pointer inline-flex"
                                onClick={() => toggleActionMenu(row.id)}
                              >
                                <EllipsisVerticalIcon className="w-5 h-5 text-secondary-grey" />
                              </div>
                            ) : (
                              <>
                                <div
                                  className="cursor-pointer"
                                  onClick={() => handleStartEditExternal(row.id)}
                                >
                                  <PencilIcon className="w-5 h-5 text-text-color" />
                                </div>
                                <div
                                  className="cursor-pointer"
                                  onClick={() => handleDeleteExternalRow(row)}
                                >
                                  <TrashIcon className="w-5 h-5 text-text-color" />
                                </div>
                                <div
                                  className="cursor-pointer"
                                  onClick={() => setOpenActionRowId(null)}
                                >
                                  <XMarkIcon className="w-5 h-5 text-text-color" />
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-2">
                          <FormInput
                            name="subject"
                            formValues={{ subject: row.subject }}
                            onChange={(e) => handleEditExternalChange(row.id, e)}
                          />
                        </td>
                        <td className="py-3 px-2">
                          <FormTextArea
                            name="description"
                            formValues={{ description: row.description }}
                            onChange={(e) => handleEditExternalChange(row.id, e)}
                          />
                        </td>
                        <td className="py-3 px-2">
                          <FormInput
                            name="method"
                            formValues={{ method: row.method }}
                            onChange={(e) => handleEditExternalChange(row.id, e)}
                          />
                        </td>
                        <td className="py-3 px-2">
                          <FormInput
                            name="sender"
                            formValues={{ sender: row.sender }}
                            onChange={(e) => handleEditExternalChange(row.id, e)}
                          />
                        </td>
                        <td className="py-3 px-2">
                          <FormInput
                            name="frequency"
                            formValues={{ frequency: row.frequency }}
                            onChange={(e) => handleEditExternalChange(row.id, e)}
                          />
                        </td>
                        <td className="py-3 px-2 flex gap-3">
                          <CheckCircleIcon
                            className="w-5 h-5 text-primary-pink cursor-pointer"
                            onClick={handleDoneEditExternal}
                          />
                          <XMarkIcon
                            className="w-5 h-5 text-text-color cursor-pointer"
                            onClick={() => setEditingExternalRowId(null)}
                          />
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {externalRows.length > 0 && (
            <div className="w-full flex gap-5 items-center justify-end mt-4">
              <button
                onClick={handlePrevExternal}
                className={`p-2 rounded-full bg-gray-200 ${externalCurrentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-300"
                  }`}
                disabled={externalCurrentPage === 1}
              >
                <ChevronLeftIcon className="w-4 h-4 text-secondary-grey" />
              </button>
              <span className="text-gray-500 text-center">
                Page {externalCurrentPage} of {externalTotalPages}
              </span>
              <button
                onClick={handleNextExternal}
                className={`p-2 rounded-full bg-gray-200 ${externalCurrentPage === externalTotalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-300"
                  }`}
                disabled={externalCurrentPage === externalTotalPages}
              >
                <ChevronRightIcon className="w-4 h-4 text-secondary-grey" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        message={
          itemToDelete
            ? `Do you want to delete "${itemToDelete.subject}"?`
            : ""
        }
      />
    </div>
  );
};

export default CommunicationRegisterOverview;

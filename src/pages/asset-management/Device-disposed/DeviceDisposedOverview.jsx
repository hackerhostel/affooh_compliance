import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import {
  PlusCircleIcon,
  CheckCircleIcon,
  XMarkIcon,
  TrashIcon,
  PencilIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import FormSelect from "../../../components/FormSelect.jsx";
import FormInput from "../../../components/FormInput.jsx";
import ConfirmationDialog from "../../../components/ConfirmationDialog.jsx";
import { selectSelectedProject } from "../../../state/slice/projectSlice.js";
import {
  doGetDisposals,
  doCreateDisposal,
  doUpdateDisposal,
  doDeleteDisposal,
  doApproveDisposal,
  doGetAvailableAssets,
} from "../../../state/slice/deviceDisposalSlice.js";
import {
  doGetProjectUsers,
  selectProjectUserList,
} from "../../../state/slice/projectUsersSlice.js";
import { getSelectOptions } from "../../../utils/commonUtils.js";

const DeviceDisposedOverview = () => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const selectedProject = useSelector(selectSelectedProject);

  const disposals = useSelector(
    (state) => state.deviceDisposal?.disposals || []
  );
  const availableAssets = useSelector(
    (state) => state.deviceDisposal?.availableAssets || []
  );
  const projectUsers = useSelector(selectProjectUserList) || [];
  const isDisposalsLoading = useSelector(
    (state) => state.deviceDisposal?.isDisposalsLoading || false
  );

  const [formValues, setFormValues] = useState({
    checkedBy: "",
    status: "",
  });

  const [showNewRow, setShowNewRow] = useState(false);
  const [newRow, setNewRow] = useState({
    assetID: "",
    checkedByUserID: "",
    disposalDate: "",
    notes: "",
  });
  const [selectedAsset, setSelectedAsset] = useState(null);

  const [disposalDateError, setDisposalDateError] = useState(null);
  const [editDisposalDateError, setEditDisposalDateError] = useState(null);
  const [disposalToDelete, setDisposalToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [openActionRowId, setOpenActionRowId] = useState(null);
  const [editingDisposalId, setEditingDisposalId] = useState(null);
  const [editForms, setEditForms] = useState({});
  const [selectedEditAssets, setSelectedEditAssets] = useState({});

  useEffect(() => {
    if (selectedProject?.id) {
      const filters = {};
      if (formValues.status) filters.status = formValues.status;
      if (formValues.checkedBy) filters.checkedByUserID = Number(formValues.checkedBy);
      dispatch(doGetDisposals({ projectID: selectedProject.id, filters }));
    }
  }, [selectedProject?.id, formValues.checkedBy, formValues.status, dispatch]);

  useEffect(() => {
    if (selectedProject?.id) {
      const projectId = Number(selectedProject.id);
      if (!isNaN(projectId) && projectId > 0) {
        dispatch(
          doGetAvailableAssets({
            projectID: projectId,
          })
        );
        dispatch(doGetProjectUsers(projectId));
      }
    }
  }, [selectedProject?.id, dispatch]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const options = { day: "numeric", month: "short" };
    return date.toLocaleDateString("en-US", options);
  };

  const isFutureDate = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const today = new Date();
    d.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return d.getTime() > today.getTime();
  };

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

  const renderUserCell = (user) => {
    if (!user)
      return <span className="text-gray-400 italic">No user</span>;

    return (
      <div className="flex items-center space-x-2">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary-pink flex items-center justify-center text-white text-sm font-semibold">
            {user.firstName?.[0]}
            {user.lastName?.[0]}
          </div>
        )}
        <span>
          {user.firstName} {user.lastName}
        </span>
      </div>
    );
  };

  const handleAddNewClick = () => {
    setShowNewRow(true);
    setNewRow({
      assetID: "",
      checkedByUserID: "",
      disposalDate: "",
      notes: "",
    });
    setSelectedAsset(null);
    if (selectedProject?.id) {
      const projectId = Number(selectedProject.id);
      if (!isNaN(projectId) && projectId > 0) {
        dispatch(
          doGetAvailableAssets({
            projectID: projectId,
          })
        );
        dispatch(doGetProjectUsers(projectId));
      }
    }
  };

  const handleNewChange = ({ target: { name, value } }) => {
    setNewRow((prev) => ({ ...prev, [name]: value }));

    if (name === "disposalDate") {
      if (value && isFutureDate(value)) {
        setDisposalDateError("Disposal date cannot be in the future.");
        addToast("Disposal date cannot be in the future. Please select today or a past date.", {
          appearance: "warning",
        });
      } else {
        setDisposalDateError(null);
      }
    }

    if (name === "assetID" && value) {
      const asset = availableAssets.find((a) => a.id === Number(value));
      if (asset) {
        setSelectedAsset(asset);
      } else {
        setSelectedAsset(null);
      }
    }
  };

  const handleSaveNew = async () => {
    if (!newRow.assetID || !newRow.checkedByUserID || !newRow.disposalDate) {
      addToast("Please fill in all required fields (Asset, Checked By, Disposal Date).", {
        appearance: "warning",
      });
      return;
    }

    if (isFutureDate(newRow.disposalDate)) {
      setDisposalDateError("Disposal date cannot be in the future.");
      addToast("Disposal date cannot be in the future. Please select today or a past date.", {
        appearance: "warning",
      });
      return;
    }
    setDisposalDateError(null);

    if (!selectedProject?.id) {
      addToast("Please select a project.", { appearance: "warning" });
      return;
    }

    try {
      await dispatch(
        doCreateDisposal({
          projectID: selectedProject.id,
          assetID: Number(newRow.assetID),
          checkedByUserID: Number(newRow.checkedByUserID),
          disposalDate: newRow.disposalDate,
          notes: newRow.notes || undefined,
        })
      ).unwrap();

      addToast("Disposal created successfully.", { appearance: "success" });
      dispatch(doGetDisposals({ projectID: selectedProject.id }));
      setDisposalDateError(null);
      setShowNewRow(false);
      setNewRow({
        assetID: "",
        checkedByUserID: "",
        disposalDate: "",
        notes: "",
      });
      setSelectedAsset(null);
    } catch (error) {
      const msg = error?.message || "";
      const isDateError = /date|future|past|invalid/i.test(msg);
      addToast(isDateError ? msg : (msg || "Failed to create disposal."), {
        appearance: "error",
      });
      if (isDateError) setDisposalDateError(msg);
    }
  };

  const handleCancelNew = () => {
    setShowNewRow(false);
    setDisposalDateError(null);
    setNewRow({
      assetID: "",
      checkedByUserID: "",
      disposalDate: "",
      notes: "",
    });
    setSelectedAsset(null);
  };

  const toggleActionMenu = (id) => {
    setOpenActionRowId(openActionRowId === id ? null : id);
  };

  const handleDeleteClick = (id) => {
    setOpenActionRowId(null);
    setDisposalToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!disposalToDelete) return;
    try {
      await dispatch(doDeleteDisposal(disposalToDelete)).unwrap();
      addToast("Disposal deleted successfully.", { appearance: "success" });
      if (selectedProject?.id) {
        dispatch(doGetDisposals({ projectID: selectedProject.id }));
      }
    } catch (error) {
      addToast(error.message || "Failed to delete disposal.", {
        appearance: "error",
      });
    }
    setDeleteDialogOpen(false);
    setDisposalToDelete(null);
  };

  const handleApproveClick = async (id) => {
    try {
      await dispatch(doApproveDisposal(id)).unwrap();
      addToast("Disposal approved successfully.", { appearance: "success" });
      if (selectedProject?.id) {
        dispatch(doGetDisposals({ projectID: selectedProject.id }));
      }
    } catch (error) {
      addToast(error.message || "Failed to approve disposal.", {
        appearance: "error",
      });
    }
  };

  const handleEditClick = (row) => {
    setOpenActionRowId(null);
    setEditingDisposalId(row.id);
    setEditDisposalDateError(null);
    setEditForms({
      ...editForms,
      [row.id]: {
        assetID: String(row.asset?.id ?? ""),
        checkedByUserID: String(row.checkedBy?.id ?? ""),
        disposalDate: row.disposalDate ? row.disposalDate.toString().slice(0, 10) : "",
        notes: row.notes || "",
      },
    });
    setSelectedEditAssets({
      ...selectedEditAssets,
      [row.id]: row.asset || null,
    });
  };

  const handleCancelEdit = () => {
    setEditingDisposalId(null);
    setEditDisposalDateError(null);
    setSelectedEditAssets((prev) => {
      const newState = { ...prev };
      delete newState[editingDisposalId];
      return newState;
    });
  };

  const handleEditFormChange = (disposalId, { target: { name, value } }) => {
    setEditForms((prev) => ({
      ...prev,
      [disposalId]: {
        ...prev[disposalId],
        [name]: value,
      },
    }));
    if (name === "disposalDate") {
      if (value && isFutureDate(value)) {
        setEditDisposalDateError("Disposal date cannot be in the future.");
        addToast("Disposal date cannot be in the future. Please select today or a past date.", {
          appearance: "warning",
        });
      } else {
        setEditDisposalDateError(null);
      }
    }
  };

  const handleEditSave = async (disposalId) => {
    const editForm = editForms[disposalId];
    if (!editForm) return;
    if (!editForm.assetID || !editForm.checkedByUserID || !editForm.disposalDate) {
      addToast("Please fill in all required fields.", { appearance: "warning" });
      return;
    }
    if (isFutureDate(editForm.disposalDate)) {
      setEditDisposalDateError("Disposal date cannot be in the future.");
      addToast("Disposal date cannot be in the future. Please select today or a past date.", {
        appearance: "warning",
      });
      return;
    }
    setEditDisposalDateError(null);
    try {
      await dispatch(
        doUpdateDisposal({
          disposalID: disposalId,
          disposalData: {
            assetID: Number(editForm.assetID),
            checkedByUserID: Number(editForm.checkedByUserID),
            disposalDate: editForm.disposalDate,
            notes: editForm.notes || undefined,
          },
        })
      ).unwrap();
      addToast("Disposal updated successfully.", { appearance: "success" });
      if (selectedProject?.id) {
        dispatch(doGetDisposals({ projectID: selectedProject.id }));
      }
      setEditDisposalDateError(null);
      setEditingDisposalId(null);
      setSelectedEditAssets((prev) => {
        const newState = { ...prev };
        delete newState[disposalId];
        return newState;
      });
    } catch (error) {
      addToast(error.message || "Failed to update disposal.", {
        appearance: "error",
      });
    }
  };

  const assetOptions = availableAssets && availableAssets.length > 0
    ? getSelectOptions(
      availableAssets.map((asset) => ({
        id: asset.id,
        name: asset.assetName,
      }))
    )
    : [];

  const userOptions = useMemo(() => {
    if (!projectUsers || projectUsers.length === 0) {
      return [];
    }

    return getSelectOptions(
      projectUsers.map((user) => ({
        id: user.id,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      }))
    );
  }, [projectUsers]);

  return (
    <div className="mt-6">
      <div className="flex justify-end items-center mt-4 space-x-2">
        <button className="bg-primary-pink px-8 py-3 rounded-md text-white">
          Approved
        </button>
      </div>

      <div className="flex items-center gap-5 mt-4">
        <span className="text-lg font-semibold">Device Disposed</span>
        <div className="flex items-center gap-1">
          <PlusCircleIcon
            onClick={handleAddNewClick}
            className="w-6 h-6 text-primary-pink cursor-pointer"
          />
          <button className="text-text-color" onClick={handleAddNewClick}>
            Add New
          </button>
        </div>
      </div>

      <div className="flex items-center mt-4 justify-between">
        <div className="flex space-x-4 items-center">
          <div className="w-40">
            <FormSelect
              name="checkedBy"
              placeholder="Checked By"
              showLabel={false}
              options={userOptions}
              formValues={formValues}
              onChange={(e) =>
                setFormValues({ ...formValues, checkedBy: e.target.value })
              }
            />
          </div>
          <div className="w-40">
            <FormSelect
              name="status"
              placeholder="Status"
              showLabel={false}
              options={getSelectOptions([
                { id: "Pending", name: "Pending" },
                { id: "Approved", name: "Approved" },
              ])}
              formValues={formValues}
              onChange={(e) =>
                setFormValues({ ...formValues, status: e.target.value })
              }
            />
          </div>
          {(formValues.checkedBy || formValues.status) && (
            <span
              onClick={() => {
                setFormValues({ checkedBy: "", status: "" });
              }}
              className="text-primary-pink hover:text-pink-600 cursor-pointer transition-colors font-medium text-sm whitespace-nowrap"
            >
              Clear Filters
            </span>
          )}
        </div>
      </div>

      <div className="bg-white rounded p-3 mt-3 shadow-sm overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="text-left text-gray-600 border-b border-gray-200">
              <th className="py-4 px-2 w-10">#</th>
              <th className="py-4 px-4 w-72">Asset Name</th>
              <th className="py-4 px-4 w-32">Code</th>
              <th className="py-4 px-4 w-40">Department</th>
              <th className="py-4 px-4 w-40">Classification</th>
              <th className="py-4 px-4 w-40">Disposal Date</th>
              <th className="py-4 px-4 w-40">Notes</th>
              <th className="py-4 px-4 w-48">Checked By</th>
              <th className="py-4 px-4 w-32">Status</th>
              <th className="py-4 px-4 w-48">Approved</th>
              <th className="py-4 px-4 w-28">Action</th>
            </tr>
          </thead>
          <tbody>
            {showNewRow && (
              <tr className="border-b border-gray-200 bg-gray-50">
                <td className="py-4 px-2">-</td>
                <td className="py-4 px-2">
                  <FormSelect
                    name="assetID"
                    formValues={{ assetID: newRow.assetID }}
                    options={assetOptions}
                    onChange={handleNewChange}
                    placeholder="Select Asset"
                    showLabel={false}
                  />
                </td>
                <td className="py-4 px-4">
                  {selectedAsset?.assetCode || "-"}
                </td>
                <td className="py-4 px-4">
                  {selectedAsset?.assetDepartment?.name || "-"}
                </td>
                <td className="py-4 px-4">
                  {selectedAsset?.classification ? (
                    <span
                      className={`font-medium ${getColorClass(
                        selectedAsset.classification
                      )}`}
                    >
                      {selectedAsset.classification}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="py-4 px-2">
                  <div>
                    <FormInput
                      type="date"
                      name="disposalDate"
                      formValues={{ disposalDate: newRow.disposalDate }}
                      onChange={handleNewChange}
                      placeholder="Disposal Date"
                      showLabel={false}
                    />
                    {disposalDateError && (
                      <p className="mt-1 text-sm text-red-600">{disposalDateError}</p>
                    )}
                  </div>
                </td>
                <td className="py-4 px-2">
                  <FormInput
                    name="notes"
                    formValues={{ notes: newRow.notes }}
                    onChange={handleNewChange}
                    placeholder="Notes"
                    showLabel={false}
                  />
                </td>
                <td className="py-4 px-2">
                  <FormSelect
                    name="checkedByUserID"
                    formValues={{ checkedByUserID: newRow.checkedByUserID }}
                    options={userOptions}
                    onChange={handleNewChange}
                    placeholder="Select User"
                    showLabel={false}
                  />
                </td>
                <td className="py-4 px-4">Pending</td>
                <td className="py-4 px-4">-</td>
                <td className="py-4 px-4">
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

            {disposals.length === 0 && !showNewRow && (
              <tr>
                <td colSpan={11} className="text-center text-gray-500 py-4">
                  {isDisposalsLoading ? "Loading..." : "No records found"}
                </td>
              </tr>
            )}

            {disposals.map((row, index) => {
              const isEditing = editingDisposalId === row.id;
              const editForm = editForms[row.id] || {};
              const selectedEditAsset = selectedEditAssets[row.id];

              return (
                <tr
                  key={row.id}
                  className={`border-b border-gray-200 ${isEditing ? "bg-blue-50" : "hover:bg-gray-50"}`}
                >
                  <td className="py-4 px-2">{index + 1}</td>
                  <td className="py-4 px-4">
                    {isEditing ? (
                      <FormSelect
                        name="assetID"
                        formValues={{ assetID: editForm.assetID || "" }}
                        options={assetOptions}
                        onChange={(e) => {
                          handleEditFormChange(row.id, e);
                          if (e.target.value) {
                            const asset = availableAssets.find((a) => a.id === Number(e.target.value));
                            setSelectedEditAssets({
                              ...selectedEditAssets,
                              [row.id]: asset,
                            });
                          } else {
                            setSelectedEditAssets({
                              ...selectedEditAssets,
                              [row.id]: null,
                            });
                          }
                        }}
                        placeholder="Select Asset"
                        showLabel={false}
                      />
                    ) : (
                      row.asset?.assetName || "-"
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {isEditing ? (
                      selectedEditAsset?.assetCode || row.asset?.assetCode || "-"
                    ) : (
                      row.asset?.assetCode || "-"
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {isEditing ? (
                      selectedEditAsset?.assetDepartment?.name || row.asset?.assetDepartment?.name || "-"
                    ) : (
                      row.asset?.assetDepartment?.name || "-"
                    )}
                  </td>
                  <td
                    className={`py-4 px-4 font-medium ${getColorClass(
                      isEditing ? (selectedEditAsset?.classification || row.asset?.classification) : row.asset?.classification
                    )}`}
                  >
                    {isEditing ? (
                      selectedEditAsset?.classification || row.asset?.classification || "-"
                    ) : (
                      row.asset?.classification || "-"
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {isEditing ? (
                      <div>
                        <FormInput
                          type="date"
                          name="disposalDate"
                          formValues={{ disposalDate: editForm.disposalDate || "" }}
                          onChange={(e) => handleEditFormChange(row.id, e)}
                          showLabel={false}
                        />
                        {editDisposalDateError && (
                          <p className="mt-1 text-sm text-red-600">{editDisposalDateError}</p>
                        )}
                      </div>
                    ) : (
                      formatDate(row.disposalDate)
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {isEditing ? (
                      <FormInput
                        name="notes"
                        formValues={{ notes: editForm.notes || "" }}
                        onChange={(e) => handleEditFormChange(row.id, e)}
                        placeholder="Notes"
                        showLabel={false}
                      />
                    ) : (
                      row.notes || "-"
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {isEditing ? (
                      <FormSelect
                        name="checkedByUserID"
                        formValues={{ checkedByUserID: editForm.checkedByUserID || "" }}
                        options={userOptions}
                        onChange={(e) => handleEditFormChange(row.id, e)}
                        placeholder="Select User"
                        showLabel={false}
                      />
                    ) : (
                      renderUserCell(row.checkedBy)
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded ${row.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {row.status === "Pending" ? (
                      <button
                        onClick={() => handleApproveClick(row.id)}
                        className="px-3 py-1.5 text-sm font-medium bg-primary-pink text-white rounded hover:opacity-90"
                      >
                        Approve
                      </button>
                    ) : row.approvedBy ? (
                      renderUserCell(row.approvedBy)
                    ) : (
                      formatDate(row.approvedDate) || "-"
                    )}
                  </td>
                  <td className="py-3 px-2">
                    {isEditing ? (
                      <div className="flex items-center gap-3 justify-center">
                        <CheckCircleIcon
                          onClick={() => handleEditSave(row.id)}
                          className="w-5 h-5 text-primary-pink cursor-pointer"
                        />
                        <XMarkIcon
                          onClick={handleCancelEdit}
                          className="w-5 h-5 text-text-color cursor-pointer"
                        />
                      </div>
                    ) : openActionRowId !== row.id ? (
                      <div
                        className="cursor-pointer inline-flex"
                        onClick={() => toggleActionMenu(row.id)}
                      >
                        <EllipsisVerticalIcon className="w-5 h-5 text-secondary-grey" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        {row.status === "Pending" && (
                          <>
                            <div
                              className="cursor-pointer"
                              onClick={() => handleEditClick(row)}
                            >
                              <PencilIcon className="w-5 h-5 text-text-color" />
                            </div>
                            <div
                              className="cursor-pointer"
                              onClick={() => handleDeleteClick(row.id)}
                            >
                              <TrashIcon className="w-5 h-5 text-text-color" />
                            </div>
                          </>
                        )}
                        <div
                          className="cursor-pointer"
                          onClick={() => setOpenActionRowId(null)}
                        >
                          <XMarkIcon className="w-5 h-5 text-text-color" />
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDisposalToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Disposal?"
        message="Are you sure you want to delete this disposal? This action cannot be undone."
      />
    </div>
  );
};

export default DeviceDisposedOverview;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  EllipsisVerticalIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { useToasts } from "react-toast-notifications";
import FormSelect from "../../../components/FormSelect.jsx";
import SearchableDropdown from "../../../components/DeviceMovement/SearchableDropdown.jsx";
import ConfirmationDialog from "../../../components/ConfirmationDialog.jsx";
import {
  doGetMovements,
  doCreateMovement,
  doUpdateMovement,
  doDeleteMovement,
  doApproveMovement,
  doGetAvailableAssets,
} from "../../../state/slice/deviceMovementSlice.js";
import { doGetProjectUsers } from "../../../state/slice/projectUsersSlice.js";

const DeviceMovedOverview = () => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const selectedProject = useSelector((state) => state.project.selectedProject);
  const movements = useSelector((state) => state.deviceMovement.movements);
  const availableAssets = useSelector(
    (state) => state.deviceMovement.availableAssets
  );
  const projectUsers = useSelector(
    (state) => state.projectUsers.projectUserList || []
  );
  const isMovementsLoading = useSelector(
    (state) => state.deviceMovement.isMovementsLoading
  );

  // Filter form state
  const [filters, setFilters] = useState({
    movedBy: "",
    approvedBy: "",
  });

  // New row form state
  const [newRow, setNewRow] = useState({
    assetID: "",
    code: "",
    moveDate: "",
    returnDate: "",
    reason: "",
    movedByUserID: "",
    approvedBy: "",
  });

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [openActionRowId, setOpenActionRowId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [movementToDelete, setMovementToDelete] = useState(null);

  // Load movements when project changes or filters change
  useEffect(() => {
    if (selectedProject?.id) {
      const cleanedFilters = {};
      if (filters.movedBy) {
        cleanedFilters.movedBy = filters.movedBy;
      }
      if (filters.approvedBy) {
        cleanedFilters.approvedBy = filters.approvedBy;
      }
      dispatch(doGetMovements({ projectID: selectedProject.id, filters: cleanedFilters }));
    }
  }, [selectedProject?.id, dispatch, filters]);

  // Load available assets and users when project changes
  useEffect(() => {
    if (selectedProject?.id) {
      dispatch(doGetAvailableAssets({ projectID: selectedProject.id }));
      dispatch(doGetProjectUsers(selectedProject.id));
    }
  }, [selectedProject?.id, dispatch]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = { day: "numeric", month: "short" };
    return date.toLocaleDateString("en-US", options);
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Handle asset search
  const handleAssetSearch = (searchTerm) => {
    if (selectedProject?.id && searchTerm.length >= 2) {
      dispatch(
        doGetAvailableAssets({
          projectID: selectedProject.id,
          searchTerm,
        })
      );
    }
  };

  // Handle user search - reload users with search term
  const handleUserSearch = (searchTerm) => {
    if (selectedProject?.id && searchTerm.length >= 2) {
      dispatch(doGetProjectUsers(selectedProject.id));
    }
  };

  // Handle asset selection - auto-populate code
  const handleAssetSelect = (assetID) => {
    const selectedAsset = availableAssets.find((a) => a.id === assetID);
    if (selectedAsset) {
      if (isAddingNew) {
        setNewRow((prev) => ({
          ...prev,
          assetID: assetID.toString(),
          code: selectedAsset.assetCode,
        }));
      } else if (editingId) {
        setEditForm((prev) => ({
          ...prev,
          assetID: assetID.toString(),
          code: selectedAsset.assetCode,
        }));
      }
    }
  };

  // Handle Add New button click
  const handleAddNew = () => {
    setIsAddingNew(true);
    setNewRow({
      assetID: "",
      code: "",
      moveDate: "",
      returnDate: "",
      reason: "",
      movedByUserID: "",
      approvedBy: "",
    });
  };

  // Handle Save new row
  const handleSaveNew = async () => {
    if (!selectedProject?.id) {
      addToast("Please select a project", { appearance: "warning" });
      return;
    }

    if (!newRow.assetID || !newRow.moveDate || !newRow.movedByUserID) {
      addToast("Please fill in all required fields (Asset Name, Move Date, Moved By)", {
        appearance: "warning",
      });
      return;
    }

    // Validate movement date is not in the future
    const movementDate = new Date(newRow.moveDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (movementDate > today) {
      addToast("Movement date cannot be in the future", {
        appearance: "warning",
      });
      return;
    }

    // Validate return date if provided
    if (newRow.returnDate) {
      const returnDate = new Date(newRow.returnDate);
      if (returnDate < movementDate) {
        addToast("Return date cannot be before movement date", {
          appearance: "warning",
        });
        return;
      }
    }

    try {
      await dispatch(
        doCreateMovement({
          projectID: selectedProject.id,
          assetID: Number(newRow.assetID),
          movedByUserID: Number(newRow.movedByUserID),
          movementDate: newRow.moveDate,
          returnDate: newRow.returnDate || undefined,
          reason: newRow.reason || undefined,
          approvedBy: newRow.approvedBy ? Number(newRow.approvedBy) : undefined,
        })
      ).unwrap();

      setIsAddingNew(false);
      setNewRow({
        assetID: "",
        code: "",
        moveDate: "",
        returnDate: "",
        reason: "",
        movedByUserID: "",
        approvedBy: "",
      });

      addToast("Device movement created successfully!", {
        appearance: "success",
      });

      // Reload movements
      dispatch(doGetMovements({ projectID: selectedProject.id, filters }));
    } catch (error) {
      const errorMessage =
        error?.error?.message ||
        error?.error ||
        error?.message ||
        "Failed to create movement";
      addToast(errorMessage, { appearance: "error" });
    }
  };

  // Handle Cancel new row
  const handleCancelNew = () => {
    setIsAddingNew(false);
    setNewRow({
      assetID: "",
      code: "",
      moveDate: "",
      returnDate: "",
      reason: "",
      movedByUserID: "",
      approvedBy: "",
    });
  };

  // Handle Edit
  const handleEdit = (movement) => {
    setEditingId(movement.id);
    setOpenActionRowId(null);
    setEditForm({
      assetID: movement.assetID.toString(),
      code: movement.asset.assetCode,
      moveDate: movement.movementDate,
      returnDate: movement.returnDate || "",
      reason: movement.reason || "",
      movedByUserID: movement.movedByUserID.toString(),
      approvedBy: movement.approvedBy?.toString() || "",
      isApproved: movement.status === "Approved", // Track if movement is approved
    });
  };

  // Handle Save edit
  const handleSaveEdit = async () => {
    if (!editingId) return;

    // If movement is approved, only allow editing reason and returnDate
    const isApproved = editForm.isApproved;

    // Validate movement date if provided and not approved
    if (!isApproved && editForm.moveDate) {
      const movementDate = new Date(editForm.moveDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (movementDate > today) {
        addToast("Movement date cannot be in the future", {
          appearance: "warning",
        });
        return;
      }
    }

    // Validate return date if provided
    if (editForm.returnDate) {
      const returnDate = new Date(editForm.returnDate);
      const movementDate = isApproved
        ? new Date(editForm.moveDate)
        : new Date(editForm.moveDate);
      if (returnDate < movementDate) {
        addToast("Return date cannot be before movement date", {
          appearance: "warning",
        });
        return;
      }
    }

    try {
      // Prepare update data - if approved, only send reason and returnDate
      const updateData = isApproved
        ? {
            returnDate: editForm.returnDate || undefined,
            reason: editForm.reason || undefined,
          }
        : {
            assetID: Number(editForm.assetID),
            movedByUserID: Number(editForm.movedByUserID),
            movementDate: editForm.moveDate,
            returnDate: editForm.returnDate || undefined,
            reason: editForm.reason || undefined,
          };

      await dispatch(
        doUpdateMovement({
          movementID: editingId,
          movementData: updateData,
        })
      ).unwrap();

      setEditingId(null);
      setEditForm({});

      addToast("Device movement updated successfully!", {
        appearance: "success",
      });

      // Reload movements
      if (selectedProject?.id) {
        dispatch(doGetMovements({ projectID: selectedProject.id, filters }));
      }
    } catch (error) {
      const errorMessage =
        error?.error?.message ||
        error?.error ||
        error?.message ||
        "Failed to update movement";
      addToast(errorMessage, { appearance: "error" });
    }
  };

  // Handle Cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  // Handle Delete - Open confirmation dialog
  const handleDelete = (movementID) => {
    const movement = movements.find((m) => m.id === movementID);
    setMovementToDelete(movement);
    setDeleteDialogOpen(true);
    setOpenActionRowId(null);
  };

  // Handle Delete Dialog Close
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setMovementToDelete(null);
  };

  // Handle Delete Confirm
  const handleDeleteConfirm = async () => {
    if (!movementToDelete) return;

    try {
      await dispatch(doDeleteMovement(movementToDelete.id)).unwrap();

      addToast("Device movement deleted successfully!", {
        appearance: "success",
      });

      // Reload movements
      if (selectedProject?.id) {
        dispatch(doGetMovements({ projectID: selectedProject.id, filters }));
      }

      setDeleteDialogOpen(false);
      setMovementToDelete(null);
    } catch (error) {
      const errorMessage =
        error?.error?.message ||
        error?.error ||
        error?.message ||
        "Failed to delete movement";
      addToast(errorMessage, { appearance: "error" });
      setDeleteDialogOpen(false);
      setMovementToDelete(null);
    }
  };

  // Handle Approve
  const handleApprove = async (movementID) => {
    try {
      await dispatch(doApproveMovement(movementID)).unwrap();

      addToast("Device movement approved successfully!", {
        appearance: "success",
      });

      // Reload movements
      if (selectedProject?.id) {
        dispatch(doGetMovements({ projectID: selectedProject.id, filters }));
      }
    } catch (error) {
      const errorMessage =
        error?.error?.message ||
        error?.error ||
        error?.message ||
        "Failed to approve movement";
      addToast(errorMessage, { appearance: "error" });
    }
  };

  // Get unique filter options from movements
  const getFilterOptions = () => {
    const movedByOptions = [];
    const approvedByOptions = [];

    // Get unique movedBy users from movements
    const movedByMap = new Map();
    movements.forEach((movement) => {
      if (movement.movedBy && movement.movedBy.id) {
        if (!movedByMap.has(movement.movedBy.id)) {
          movedByMap.set(movement.movedBy.id, movement.movedBy);
          movedByOptions.push({
            value: movement.movedBy.id.toString(),
            label: `${movement.movedBy.firstName} ${movement.movedBy.lastName}`,
          });
        }
      }
    });

    // Also add project users who haven't moved anything yet
    projectUsers.forEach((user) => {
      if (!movedByMap.has(user.id)) {
        movedByMap.set(user.id, user);
        movedByOptions.push({
          value: user.id.toString(),
          label: `${user.firstName} ${user.lastName}`,
        });
      }
    });

    // Get unique approved users 
    const approvedByMap = new Map();
    movements.forEach((movement) => {
      if (movement.status === "Approved" && movement.approvedByUser && movement.approvedByUser.id) {
        if (!approvedByMap.has(movement.approvedByUser.id)) {
          approvedByMap.set(movement.approvedByUser.id, movement.approvedByUser);
          approvedByOptions.push({
            value: movement.approvedByUser.id.toString(),
            label: `${movement.approvedByUser.firstName} ${movement.approvedByUser.lastName}`,
          });
        }
      }
    });

    return {
      movedBy: movedByOptions,
      approvedBy: approvedByOptions,
    };
  };

  const filterOptions = getFilterOptions();

  // Render user cell
  const renderUserCell = (user) => {
    if (!user) return <span className="text-gray-400 italic text-sm">No user</span>;

    return (
      <div className="flex items-center space-x-1.5">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-6 h-6 rounded-full object-cover"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-primary-pink flex items-center justify-center text-white text-xs font-semibold">
            {user.firstName?.[0]}
            {user.lastName?.[0]}
          </div>
        )}
        <span className="text-sm whitespace-nowrap">
          {user.firstName} {user.lastName}
        </span>
      </div>
    );
  };

  // Render approve cell
  const renderApproveCell = (movement) => {
    if (movement.status === "Approved") {
      return renderUserCell(movement.approvedByUser);
    } else {
      return (
        <button
          onClick={() => handleApprove(movement.id)}
          className="bg-primary-pink text-white px-2 py-1 rounded-md hover:bg-pink-600 transition text-sm whitespace-nowrap"
        >
          Approve
        </button>
      );
    }
  };

  return (
    <div className="mt-6">
      {/* Header */}
      <div className="flex items-center gap-5 mt-4">
        <span className="text-lg font-semibold">Device Moved</span>
        <div className="flex items-center gap-1">
          <PlusCircleIcon
            onClick={handleAddNew}
            className="w-6 h-6 text-pink-500 cursor-pointer hover:text-pink-600 transition"
          />
          <button className="text-gray-700 hover:text-gray-900" onClick={handleAddNew}>
            Add New
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex items-center mt-4 justify-between">
        <div className="flex space-x-4">
          <div className="w-40">
            <FormSelect
              name="movedBy"
              placeholder="Moved By"
              showLabel={false}
              options={filterOptions.movedBy}
              formValues={filters}
              onChange={(e) =>
                setFilters({ ...filters, movedBy: e.target.value })
              }
            />
          </div>
          <div className="w-40">
            <FormSelect
              name="approvedBy"
              placeholder="Approved By"
              showLabel={false}
              options={filterOptions.approvedBy}
              formValues={filters}
              onChange={(e) =>
                setFilters({ ...filters, approvedBy: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded p-3 mt-3 shadow-sm">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="text-left text-gray-600 border-b border-gray-200">
              <th className="py-3 px-2 w-12">ID</th>
              <th className="py-3 px-2 w-32">Asset Name</th>
              <th className="py-3 px-2 w-20">Code</th>
              <th className="py-3 px-2 w-28">Move Date</th>
              <th className="py-3 px-2 w-28">Return Date</th>
              <th className="py-3 px-2 w-32">Reason</th>
              <th className="py-3 px-2 w-36">Moved By</th>
              <th className="py-3 px-2 w-36">Approved</th>
              <th className="py-3 px-2 w-20 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {isMovementsLoading ? (
              <tr>
                <td colSpan={9} className="text-center text-gray-500 py-4">
                  Loading...
                </td>
              </tr>
            ) : movements.length === 0 && !isAddingNew ? (
              <tr>
                <td colSpan={9} className="text-center text-gray-500 py-4">
                  No records found
                </td>
              </tr>
            ) : (
              <>
                {/* Existing rows */}
                {movements.map((row, index) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    {editingId === row.id ? (
                      <>
                        <td className="py-3 px-2">{index + 1}</td>
                        <td className="py-3 px-2">
                          {editForm.isApproved ? (
                            <span className="text-gray-700">
                              {row.asset.assetName}
                            </span>
                          ) : (
                            <SearchableDropdown
                              name="assetID"
                              value={editForm.assetID}
                              onChange={(e) => {
                                handleAssetSelect(e.target.value);
                              }}
                              options={availableAssets}
                              placeholder="Select Asset"
                              displayKey="assetName"
                              valueKey="id"
                              onSearch={handleAssetSearch}
                              className="w-40"
                            />
                          )}
                        </td>
                        <td className="py-3 px-2">
                          <input
                            type="text"
                            value={editForm.code}
                            readOnly
                            className="w-24 p-1.5 border border-gray-300 rounded bg-gray-100 cursor-not-allowed text-sm"
                          />
                        </td>
                        <td className="py-3 px-2">
                          {editForm.isApproved ? (
                            <span className="text-gray-700">
                              {formatDate(row.movementDate)}
                            </span>
                          ) : (
                            <input
                              type="date"
                              value={editForm.moveDate}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  moveDate: e.target.value,
                                })
                              }
                              max={getTodayDate()}
                              className="w-28 p-1.5 border border-gray-300 rounded text-sm"
                            />
                          )}
                        </td>
                        <td className="py-3 px-2">
                          <input
                            type="date"
                            value={editForm.returnDate}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                returnDate: e.target.value,
                              })
                            }
                            className="w-28 p-1.5 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="py-3 px-2">
                          <input
                            type="text"
                            value={editForm.reason}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                reason: e.target.value,
                              })
                            }
                            className="w-36 p-1.5 border border-gray-300 rounded text-sm"
                            placeholder="Reason"
                          />
                        </td>
                        <td className="py-3 px-2">
                          {editForm.isApproved ? (
                            renderUserCell(row.movedBy)
                          ) : (
                            <SearchableDropdown
                              name="movedByUserID"
                              value={editForm.movedByUserID}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  movedByUserID: e.target.value,
                                })
                              }
                              options={projectUsers}
                              placeholder="Select User"
                              displayKey={(user) =>
                                `${user.firstName} ${user.lastName}`
                              }
                              valueKey="id"
                              onSearch={handleUserSearch}
                              className="w-32"
                            />
                          )}
                        </td>
                        <td className="py-3 px-2">
                          {row.status === "Approved"
                            ? renderUserCell(row.approvedByUser)
                            : "-"}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={handleSaveEdit}
                              className="text-green-600 hover:text-green-800"
                            >
                              <CheckIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-red-600 hover:text-red-800"
                            >
                              <XMarkIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-2">{index + 1}</td>
                        <td className="py-3 px-2">{row.asset.assetName}</td>
                        <td className="py-3 px-2">{row.asset.assetCode}</td>
                        <td className="py-3 px-2">
                          {formatDate(row.movementDate)}
                        </td>
                        <td className="py-3 px-2">
                          {formatDate(row.returnDate)}
                        </td>
                        <td className="py-3 px-2">{row.reason || "-"}</td>
                        <td className="py-3 px-2">
                          {renderUserCell(row.movedBy)}
                        </td>
                        <td className="py-3 px-2">
                          {renderApproveCell(row)}
                        </td>
                        <td className="py-3 px-2">
                          {openActionRowId !== row.id ? (
                            <div
                              className="cursor-pointer inline-flex justify-center"
                              onClick={() =>
                                setOpenActionRowId(
                                  openActionRowId === row.id ? null : row.id
                                )
                              }
                            >
                              <EllipsisVerticalIcon className="w-5 h-5 text-gray-600 hover:text-gray-800" />
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 justify-center">
                              {/* Edit button - available for both Pending and Approved */}
                              <div
                                className="cursor-pointer"
                                onClick={() => {
                                  handleEdit(row);
                                  setOpenActionRowId(null);
                                }}
                                title="Edit"
                              >
                                <PencilIcon className="w-5 h-5 text-blue-600 hover:text-blue-800" />
                              </div>
                              {/* Delete button - only for Pending */}
                              {row.status === "Pending" && (
                                <div
                                  className="cursor-pointer"
                                  onClick={() => {
                                    handleDelete(row.id);
                                    setOpenActionRowId(null);
                                  }}
                                  title="Delete"
                                >
                                  <TrashIcon className="w-5 h-5 text-red-600 hover:text-red-800" />
                                </div>
                              )}
                              <div
                                className="cursor-pointer"
                                onClick={() => setOpenActionRowId(null)}
                                title="Close"
                              >
                                <XMarkIcon className="w-5 h-5 text-gray-600 hover:text-gray-800" />
                              </div>
                            </div>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))}

                {/* New row */}
                {isAddingNew && (
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-2">-</td>
                    <td className="py-3 px-2">
                      <SearchableDropdown
                        name="assetID"
                        value={newRow.assetID}
                        onChange={(e) => {
                          handleAssetSelect(e.target.value);
                        }}
                        options={availableAssets}
                        placeholder="Select Asset"
                        displayKey="assetName"
                        valueKey="id"
                        onSearch={handleAssetSearch}
                        className="w-40"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <input
                        type="text"
                        value={newRow.code}
                        readOnly
                        className="w-24 p-1.5 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed text-gray-600 text-sm"
                        placeholder="Auto-filled"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <input
                        type="date"
                        value={newRow.moveDate}
                        onChange={(e) =>
                          setNewRow({ ...newRow, moveDate: e.target.value })
                        }
                        max={getTodayDate()}
                        className="w-28 p-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        required
                      />
                    </td>
                    <td className="py-3 px-2">
                      <input
                        type="date"
                        value={newRow.returnDate}
                        onChange={(e) =>
                          setNewRow({ ...newRow, returnDate: e.target.value })
                        }
                        className="w-28 p-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <input
                        type="text"
                        value={newRow.reason}
                        onChange={(e) =>
                          setNewRow({ ...newRow, reason: e.target.value })
                        }
                        className="w-36 p-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Reason"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <SearchableDropdown
                        name="movedByUserID"
                        value={newRow.movedByUserID}
                        onChange={(e) =>
                          setNewRow({
                            ...newRow,
                            movedByUserID: e.target.value,
                          })
                        }
                        options={projectUsers}
                        placeholder="Select User"
                        displayKey={(user) =>
                          `${user.firstName} ${user.lastName}`
                        }
                        valueKey="id"
                        onSearch={handleUserSearch}
                        className="w-32"
                        required
                      />
                    </td>
                    <td className="py-3 px-2">
                      <SearchableDropdown
                        name="approvedBy"
                        value={newRow.approvedBy}
                        onChange={(e) =>
                          setNewRow({
                            ...newRow,
                            approvedBy: e.target.value,
                          })
                        }
                        options={projectUsers}
                        placeholder="Select Approver"
                        displayKey={(user) =>
                          `${user.firstName} ${user.lastName}`
                        }
                        valueKey="id"
                        onSearch={handleUserSearch}
                        className="w-32"
                      />
                    </td>
                    <td className="py-3 px-2 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={handleSaveNew}
                          className="text-green-600 hover:text-green-800"
                        >
                          <CheckIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleCancelNew}
                          className="text-red-600 hover:text-red-800"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
        title="Delete Device Movement"
        message={
          movementToDelete
            ? `Are you sure you want to delete the movement record for "${movementToDelete.asset?.assetName}"? This action cannot be undone.`
            : "Are you sure you want to delete this movement record?"
        }
      />
    </div>
  );
};

export default DeviceMovedOverview;

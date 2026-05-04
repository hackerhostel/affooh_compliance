import React, { useState, useEffect } from "react";
import FormTextArea from "../../../components/FormTextArea.jsx";
import {
  PencilIcon,
  EllipsisVerticalIcon,
  CheckCircleIcon,
  XMarkIcon,
  TrashIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { useToasts } from "react-toast-notifications";
import { getSupplierCriteria, createSupplierCriteria, updateSupplierCriteria, deleteSupplierCriteria } from "../../../utils/supplierApi";
import ConfirmationDialog from "../../../components/ConfirmationDialog.jsx";

const SupplierCriteria = () => {
  const { addToast } = useToasts();
  const [criteriaRows, setCriteriaRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Row state
  const [showNewRow, setShowNewRow] = useState(false);
  const [newRow, setNewRow] = useState({ name: "", weight: "", description: "" });

  // Edit/Action states
  const [editingRowId, setEditingRowId] = useState(null);
  const [openActionRowId, setOpenActionRowId] = useState(null);

  // Delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [criteriaToDelete, setCriteriaToDelete] = useState(null);

  const fetchCriteria = async () => {
    try {
      setLoading(true);
      const data = await getSupplierCriteria();
      setCriteriaRows(data);
    } catch (error) {
      addToast("Failed to fetch criteria", { appearance: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCriteria();
  }, []);

  const handleAddNewClick = () => {
    setShowNewRow(true);
    setNewRow({ name: "", weight: "", description: "" });
  };

  const handleNewChange = ({ target: { name, value } }) => {
    setNewRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNew = async () => {
    if (!newRow.name) {
      addToast("Criteria name is required", { appearance: "warning" });
      return;
    }
    try {
      await createSupplierCriteria({ ...newRow, organizationID: 1 });
      addToast("Criteria added successfully", { appearance: "success" });
      setShowNewRow(false);
      fetchCriteria();
    } catch (error) {
      addToast("Failed to add criteria", { appearance: "error" });
    }
  };

  const handleCancelNew = () => setShowNewRow(false);

  const handleStartEdit = (id) => {
    setEditingRowId(id);
    setOpenActionRowId(null);
  };

  const handleEditChange = (id, { target: { name, value } }) => {
    setCriteriaRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [name]: value } : r))
    );
  };

  const handleDoneEdit = async (id) => {
    const row = criteriaRows.find(r => r.id === id);
    if (!row) return;

    try {
      await updateSupplierCriteria(id, {
        name: row.name,
        weight: row.weight,
        description: row.description
      });
      addToast("Criteria updated successfully", { appearance: "success" });
      setEditingRowId(null);
      fetchCriteria();
    } catch (error) {
      addToast("Failed to update criteria", { appearance: "error" });
    }
  };

  const confirmDelete = (row) => {
    setCriteriaToDelete(row);
    setDeleteDialogOpen(true);
    setOpenActionRowId(null);
  };

  const handleDeleteRow = async () => {
    if (!criteriaToDelete) return;
    try {
      await deleteSupplierCriteria(criteriaToDelete.id);
      addToast("Criteria deleted successfully", { appearance: "success" });
      setDeleteDialogOpen(false);
      setCriteriaToDelete(null);
      fetchCriteria();
    } catch (error) {
      addToast("Failed to delete criteria", { appearance: "error" });
    }
  };

  const toggleActionMenu = (id) =>
    setOpenActionRowId((prev) => (prev === id ? null : id));

  return (
    <div className="p-4">
      {/* Title + Add New */}
      <div className="flex items-center space-x-4 mt-5">
        <span className="text-lg font-semibold">Evaluation Criteria</span>
        <div className="flex items-center gap-1">
          <PlusCircleIcon
            onClick={handleAddNewClick}
            className="w-6 h-6 text-pink-500 cursor-pointer"
          />
          <button className="text-text-color" onClick={handleAddNewClick}>
            Add New Criteria
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded p-3 mt-4 overflow-x-auto">
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading...</div>
        ) : (
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="text-left text-secondary-grey border-b border-gray-200">
                <th className="py-3 px-2 w-10">#</th>
                <th className="py-3 px-2 w-1/4">Criteria</th>
                <th className="py-3 px-2 w-20">Weight</th>
                <th className="py-3 px-2">Description</th>
                <th className="py-3 px-2 w-16 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {criteriaRows.map((row, index) => {
                const isEditing = editingRowId === row.id;
                return (
                  <tr key={row.id} className="border-b border-gray-200 align-top">
                    <td className="py-3 px-2">{index + 1}</td>

                    {!isEditing ? (
                      <>
                        <td className="py-3 px-2">{row.name}</td>
                        <td className="py-3 px-2">{row.weight}%</td>
                        <td className="py-3 px-2">
                          <div className="whitespace-pre-wrap text-sm text-gray-600">
                            {row.description}
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center">
                          {openActionRowId !== row.id ? (
                            <div
                              className="cursor-pointer inline-flex"
                              onClick={() => toggleActionMenu(row.id)}
                            >
                              <EllipsisVerticalIcon className="w-5 h-5 text-secondary-grey" />
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-3">
                              <div
                                className="cursor-pointer"
                                onClick={() => handleStartEdit(row.id)}
                                title="Edit"
                              >
                                <PencilIcon className="w-5 h-5 text-text-color" />
                              </div>
                              <div
                                className="cursor-pointer"
                                onClick={() => confirmDelete(row)}
                                title="Delete"
                              >
                                <TrashIcon className="w-5 h-5 text-text-color" />
                              </div>
                              <div
                                className="cursor-pointer"
                                onClick={() => setOpenActionRowId(null)}
                                title="Cancel"
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
                          <input
                            name="name"
                            className="border p-2 w-full rounded"
                            value={row.name}
                            onChange={(e) => handleEditChange(row.id, e)}
                          />
                        </td>
                        <td className="py-3 px-2">
                          <input
                            name="weight"
                            type="number"
                            className="border p-2 w-full rounded"
                            value={row.weight}
                            onChange={(e) => handleEditChange(row.id, e)}
                          />
                        </td>
                        <td className="py-3 px-2">
                          <textarea
                            name="description"
                            rows={3}
                            className="border p-2 w-full rounded text-sm"
                            value={row.description}
                            onChange={(e) => handleEditChange(row.id, e)}
                          />
                        </td>
                        <td className="py-3 px-2 text-center">
                          <div className="flex gap-3 items-center justify-center">
                            <div className="cursor-pointer" onClick={() => handleDoneEdit(row.id)}>
                              <CheckCircleIcon className="w-5 h-5 text-primary-pink" />
                            </div>
                            <div className="cursor-pointer" onClick={() => setEditingRowId(null)}>
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
                <tr className="border-b border-gray-200 align-top">
                  <td className="py-3 px-2">-</td>
                  <td className="py-3 px-2">
                    <input
                      name="name"
                      placeholder="Criteria name"
                      className="border p-2 w-full rounded"
                      value={newRow.name}
                      onChange={handleNewChange}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <input
                      name="weight"
                      type="number"
                      placeholder="%"
                      className="border p-2 w-full rounded"
                      value={newRow.weight}
                      onChange={handleNewChange}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <textarea
                      name="description"
                      placeholder="Criteria description (scores)"
                      rows={3}
                      className="border p-2 w-full rounded text-sm"
                      value={newRow.description}
                      onChange={handleNewChange}
                    />
                  </td>
                  <td className="py-3 px-2 text-center">
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

              {criteriaRows.length === 0 && !showNewRow && (
                <tr>
                  <td className="py-3 px-2 text-center text-gray-500" colSpan={5}>
                    No criteria data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteRow}
        message={
          criteriaToDelete
            ? `Are you sure you want to delete criteria "${criteriaToDelete.name}"?`
            : "Are you sure you want to delete this criteria?"
        }
      />
    </div>
  );
};

export default SupplierCriteria;

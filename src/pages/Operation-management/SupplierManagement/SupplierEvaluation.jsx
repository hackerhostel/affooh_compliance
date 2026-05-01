import React, { useState, useEffect } from "react";
import {
  PencilIcon,
  EllipsisVerticalIcon,
  CheckCircleIcon,
  XMarkIcon,
  TrashIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { useToasts } from "react-toast-notifications";
import {
  getSupplierEvaluations,
  createSupplierEvaluation,
  updateSupplierEvaluation,
  deleteSupplierEvaluation,
} from "../../../utils/supplierApi";
import ConfirmationDialog from "../../../components/ConfirmationDialog.jsx";

const SupplierEvaluation = ({ supplierId, assignedCriteria = [] }) => {
  const { addToast } = useToasts();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Evaluation state
  const [showNewRow, setShowNewRow] = useState(false);
  const [newRow, setNewRow] = useState({
    quarter: "Q1",
    evaluationDate: new Date().toISOString().split("T")[0],
    reference: "",
    criteriaID: "",
    weight: 0,
    value: "",
  });

  // Edit/Action states
  const [editingRowId, setEditingRowId] = useState(null);
  const [openActionRowId, setOpenActionRowId] = useState(null);

  // Delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [evaluationToDelete, setEvaluationToDelete] = useState(null);

  const fetchEvaluations = async () => {
    try {
      setLoading(true);
      const data = await getSupplierEvaluations(supplierId);
      setEvaluations(data);
    } catch (error) {
      addToast("Failed to fetch evaluations", { appearance: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (supplierId) {
      fetchEvaluations();
    }
  }, [supplierId]);

  const handleAddNewClick = () => {
    setShowNewRow(true);
    setNewRow({
      quarter: "Q1",
      evaluationDate: new Date().toISOString().split("T")[0],
      reference: "",
      criteriaID: "",
      weight: 0,
      value: "",
    });
  };

  const handleNewChange = ({ target: { name, value } }) => {
    if (name === "criteriaID") {
      const selected = assignedCriteria.find((c) => String(c.id) === String(value));
      setNewRow((prev) => ({
        ...prev,
        criteriaID: value,
        weight: selected ? selected.weight : 0,
      }));
    } else {
      setNewRow((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveNew = async () => {
    if (!newRow.criteriaID || !newRow.evaluationDate || !newRow.value) {
      addToast("Date, Criteria and Value are required", { appearance: "warning" });
      return;
    }
    try {
      await createSupplierEvaluation(supplierId, newRow);
      addToast("Evaluation added successfully", { appearance: "success" });
      setShowNewRow(false);
      fetchEvaluations();
    } catch (error) {
      addToast("Failed to add evaluation", { appearance: "error" });
    }
  };

  const handleCancelNew = () => setShowNewRow(false);

  const handleStartEdit = (row) => {
    setEditingRowId(row.id);
    setOpenActionRowId(null);
  };

  const handleEditChange = (id, { target: { name, value } }) => {
    setEvaluations((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          if (name === "criteriaID") {
            const selected = assignedCriteria.find((c) => String(c.id) === String(value));
            return { ...r, criteriaID: value, weight: selected ? selected.weight : 0 };
          }
          return { ...r, [name]: value };
        }
        return r;
      })
    );
  };

  const handleDoneEdit = async (id) => {
    const row = evaluations.find((r) => r.id === id);
    if (!row) return;

    try {
      await updateSupplierEvaluation(id, {
        quarter: row.quarter,
        evaluationDate: row.evaluationDate.split("T")[0],
        reference: row.reference,
        criteriaID: row.criteriaID,
        weight: row.weight,
        value: row.value,
      });
      addToast("Evaluation updated successfully", { appearance: "success" });
      setEditingRowId(null);
      fetchEvaluations();
    } catch (error) {
      addToast("Failed to update evaluation", { appearance: "error" });
    }
  };

  const confirmDelete = (row) => {
    setEvaluationToDelete(row);
    setDeleteDialogOpen(true);
    setOpenActionRowId(null);
  };

  const handleDeleteRow = async () => {
    if (!evaluationToDelete) return;
    try {
      await deleteSupplierEvaluation(evaluationToDelete.id);
      addToast("Evaluation deleted successfully", { appearance: "success" });
      setDeleteDialogOpen(false);
      setEvaluationToDelete(null);
      fetchEvaluations();
    } catch (error) {
      addToast("Failed to delete evaluation", { appearance: "error" });
    }
  };

  const toggleActionMenu = (id) =>
    setOpenActionRowId((prev) => (prev === id ? null : id));

  return (
    <div className="bg-white p-6 rounded shadow mt-6">
      <div className="flex justify-between items-center mb-6">
        <h5 className="text-lg font-semibold">Supplier Evaluation</h5>
        <button
          onClick={handleAddNewClick}
          className="flex items-center gap-1 bg-primary-pink text-white px-4 py-2 rounded text-sm hover:bg-pink-600 transition-colors"
        >
          <PlusCircleIcon className="w-5 h-5" />
          Add Evaluation
        </button>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading evaluations...</div>
        ) : (
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="text-left text-secondary-grey border-b border-gray-200 bg-gray-50">
                <th className="py-3 px-2 w-10">#</th>
                <th className="py-3 px-2">Quarter</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Reference</th>
                <th className="py-3 px-2">Criteria</th>
                <th className="py-3 px-2">Weight</th>
                <th className="py-3 px-2">Value</th>
                <th className="py-3 px-2 w-16 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.map((row, index) => {
                const isEditing = editingRowId === row.id;
                return (
                  <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50 align-top">
                    <td className="py-3 px-2">{index + 1}</td>

                    {!isEditing ? (
                      <>
                        <td className="py-3 px-2">{row.quarter}</td>
                        <td className="py-3 px-2">{row.evaluationDate?.split("T")[0]}</td>
                        <td className="py-3 px-2">{row.reference || "-"}</td>
                        <td className="py-3 px-2 font-medium">{row.criteriaName}</td>
                        <td className="py-3 px-2">{row.weight}%</td>
                        <td className="py-3 px-2">{row.value}</td>
                        <td className="py-3 px-2 text-center">
                          {openActionRowId !== row.id ? (
                            <div
                              className="cursor-pointer inline-flex"
                              onClick={() => toggleActionMenu(row.id)}
                            >
                              <EllipsisVerticalIcon className="w-5 h-5 text-secondary-grey" />
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <div
                                className="cursor-pointer text-blue-500 hover:text-blue-700"
                                onClick={() => handleStartEdit(row)}
                                title="Edit"
                              >
                                <PencilIcon className="w-5 h-5" />
                              </div>
                              <div
                                className="cursor-pointer text-red-500 hover:text-red-700"
                                onClick={() => confirmDelete(row)}
                                title="Delete"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </div>
                              <div
                                className="cursor-pointer text-gray-500 hover:text-gray-700"
                                onClick={() => setOpenActionRowId(null)}
                                title="Cancel"
                              >
                                <XMarkIcon className="w-5 h-5" />
                              </div>
                            </div>
                          )}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-2">
                          <select
                            name="quarter"
                            className="border p-1 w-full rounded text-sm"
                            value={row.quarter}
                            onChange={(e) => handleEditChange(row.id, e)}
                          >
                            <option value="Q1">Q1</option>
                            <option value="Q2">Q2</option>
                            <option value="Q3">Q3</option>
                            <option value="Q4">Q4</option>
                          </select>
                        </td>
                        <td className="py-3 px-2">
                          <input
                            name="evaluationDate"
                            type="date"
                            className="border p-1 w-full rounded text-sm"
                            value={row.evaluationDate?.split("T")[0]}
                            onChange={(e) => handleEditChange(row.id, e)}
                          />
                        </td>
                        <td className="py-3 px-2">
                          <input
                            name="reference"
                            className="border p-1 w-full rounded text-sm"
                            value={row.reference || ""}
                            onChange={(e) => handleEditChange(row.id, e)}
                          />
                        </td>
                        <td className="py-3 px-2">
                          <select
                            name="criteriaID"
                            className="border p-1 w-full rounded text-sm"
                            value={row.criteriaID}
                            onChange={(e) => handleEditChange(row.id, e)}
                          >
                            <option value="">Select</option>
                            {assignedCriteria.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-2">
                          <input
                            readOnly
                            name="weight"
                            className="border p-1 w-20 rounded text-sm bg-gray-50"
                            value={row.weight + "%"}
                          />
                        </td>
                        <td className="py-3 px-2">
                          <input
                            name="value"
                            className="border p-1 w-full rounded text-sm"
                            value={row.value || ""}
                            onChange={(e) => handleEditChange(row.id, e)}
                          />
                        </td>
                        <td className="py-3 px-2 text-center">
                          <div className="flex gap-2 items-center justify-center">
                            <div className="cursor-pointer text-green-500 hover:text-green-700" onClick={() => handleDoneEdit(row.id)}>
                              <CheckCircleIcon className="w-5 h-5" />
                            </div>
                            <div className="cursor-pointer text-gray-500 hover:text-gray-700" onClick={() => setEditingRowId(null)}>
                              <XMarkIcon className="w-5 h-5" />
                            </div>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}

              {showNewRow && (
                <tr className="border-b border-gray-200 bg-blue-50/30 align-top">
                  <td className="py-3 px-2 font-bold text-blue-600">*</td>
                  <td className="py-3 px-2">
                    <select
                      name="quarter"
                      className="border p-1 w-full rounded text-sm"
                      value={newRow.quarter}
                      onChange={handleNewChange}
                    >
                      <option value="Q1">Q1</option>
                      <option value="Q2">Q2</option>
                      <option value="Q3">Q3</option>
                      <option value="Q4">Q4</option>
                    </select>
                  </td>
                  <td className="py-3 px-2">
                    <input
                      name="evaluationDate"
                      type="date"
                      className="border p-1 w-full rounded text-sm"
                      value={newRow.evaluationDate}
                      onChange={handleNewChange}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <input
                      name="reference"
                      placeholder="Ref..."
                      className="border p-1 w-full rounded text-sm"
                      value={newRow.reference}
                      onChange={handleNewChange}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <select
                      name="criteriaID"
                      className="border p-1 w-full rounded text-sm"
                      value={newRow.criteriaID}
                      onChange={handleNewChange}
                    >
                      <option value="">Select Criteria</option>
                      {assignedCriteria.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-2">
                    <input
                      readOnly
                      name="weight"
                      className="border p-1 w-20 rounded text-sm bg-gray-50"
                      value={newRow.weight + "%"}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <input
                      name="value"
                      placeholder="Score/Value"
                      className="border p-1 w-full rounded text-sm"
                      value={newRow.value}
                      onChange={handleNewChange}
                    />
                  </td>
                  <td className="py-3 px-2 text-center">
                    <div className="flex gap-2 items-center justify-center">
                      <div className="cursor-pointer text-green-500 hover:text-green-700" onClick={handleSaveNew}>
                        <CheckCircleIcon className="w-5 h-5" />
                      </div>
                      <div className="cursor-pointer text-gray-500 hover:text-gray-700" onClick={handleCancelNew}>
                        <XMarkIcon className="w-5 h-5" />
                      </div>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && evaluations.length === 0 && !showNewRow && (
                <tr>
                  <td className="py-6 px-2 text-center text-gray-400 italic" colSpan={8}>
                    No evaluations recorded yet. Click "Add Evaluation" to begin.
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
        message="Are you sure you want to delete this evaluation record?"
      />
    </div>
  );
};

export default SupplierEvaluation;

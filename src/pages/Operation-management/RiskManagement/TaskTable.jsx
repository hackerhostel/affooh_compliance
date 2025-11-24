import React, { useState } from 'react';
import FormInput from '../../../components/FormInput.jsx';
import FormSelect from '../../../components/FormSelect.jsx';
import {
  PencilIcon,
  EllipsisVerticalIcon,
  CheckBadgeIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { getSelectOptions } from "../../../utils/commonUtils.js";

const ResidualRiskTable = () => {
  // Numeric dropdown options (1–5)
  const numberOptions = getSelectOptions([
    { id: 1, name: "1" },
    { id: 2, name: "2" },
    { id: 3, name: "3" },
    { id: 4, name: "4" },
    { id: 5, name: "5" },
  ]);

  // Table data
  const [rows, setRows] = useState([
    {
      id: 1,
      reassessmentDate: "2025-01-10",
      comments: "Initial assessment passed",
      probability: 3,
      impact1: 2,
      impact2: 4,
    },
    {
      id: 2,
      reassessmentDate: "2025-02-01",
      comments: "Review required",
      probability: 4,
      impact1: 3,
      impact2: 2,
    },
  ]);

  const [showNewRow, setShowNewRow] = useState(false);
  const [newRow, setNewRow] = useState({
    reassessmentDate: "",
    comments: "",
    probability: "",
    impact1: "",
    impact2: "",
  });

  const [editingRowId, setEditingRowId] = useState(null);
  const [openActionRowId, setOpenActionRowId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 5;
  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const pagedRows = rows.slice(indexOfFirst, indexOfLast);

  // Handlers
  const handleAddNewClick = () => {
    setShowNewRow(true);
    setNewRow({
      reassessmentDate: "",
      comments: "",
      probability: "",
      impact1: "",
      impact2: "",
    });
  };

  const handleNewChange = ({ target: { name, value } }) => {
    setNewRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNew = () => {
    const { reassessmentDate, comments, probability, impact1, impact2 } = newRow;

    if (!reassessmentDate || !comments || !probability || !impact1 || !impact2) return;

    const newEntry = { id: Date.now(), ...newRow };
    setRows((prev) => [...prev, newEntry]);
    setShowNewRow(false);
  };

  const handleCancelNew = () => setShowNewRow(false);

  const handleStartEdit = (id) => {
    setEditingRowId(id);
    setOpenActionRowId(null);
  };

  const handleEditChange = (id, { target: { name, value } }) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [name]: value } : r))
    );
  };

  const handleDoneEdit = () => setEditingRowId(null);

  const handleCloseEdit = () => setEditingRowId(null);

  const handleDeleteRow = (id) =>
    setRows((prev) => prev.filter((r) => r.id !== id));

  const toggleActionMenu = (id) =>
    setOpenActionRowId((prev) => (prev === id ? null : id));

  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage((p) => p + 1);

  const handlePreviousPage = () =>
    currentPage > 1 && setCurrentPage((p) => p - 1);

  return (
    <div className="mt-6">
      <div className="flex items-center gap-5">
        <span className="text-lg font-semibold">Residual Risk</span>

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
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="text-left text-secondary-grey border-b border-gray-200">
              <th className="py-3 px-2 w-10">#</th>
              <th className="py-3 px-2 text-center">Re-Assessment Date</th>
              <th className="py-3 px-2 text-center">Comments</th>
              <th className="py-3 px-2 text-center">Probability</th>
              <th className="py-3 px-2 text-center">Impact 1</th>
              <th className="py-3 px-2 text-center">Impact 2</th>
              <th className="py-3 px-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {/* ADD NEW ROW */}
            {showNewRow && (
              <tr className="border-b border-gray-200">
                <td className="py-3 px-2">-</td>

                <td className="py-3 px-2">
                  <FormInput
                    name="reassessmentDate"
                    type="date"
                    formValues={{ reassessmentDate: newRow.reassessmentDate }}
                    onChange={handleNewChange}
                  />
                </td>

                <td className="py-3 px-2">
                  <FormInput
                    name="comments"
                    type="text"
                    formValues={{ comments: newRow.comments }}
                    onChange={handleNewChange}
                  />
                </td>

                <td className="py-3 px-2">
                  <FormSelect
                    name="probability"
                    formValues={{ probability: newRow.probability }}
                    options={numberOptions}
                    onChange={handleNewChange}
                  />
                </td>

                <td className="py-3 px-2">
                  <FormSelect
                    name="impact1"
                    formValues={{ impact1: newRow.impact1 }}
                    options={numberOptions}
                    onChange={handleNewChange}
                  />
                </td>

                <td className="py-3 px-2">
                  <FormSelect
                    name="impact2"
                    formValues={{ impact2: newRow.impact2 }}
                    options={numberOptions}
                    onChange={handleNewChange}
                  />
                </td>

                <td className="py-3 px-2">
                  <div className="flex gap-3 items-center">
                    <div className="cursor-pointer" onClick={handleSaveNew}>
                      <CheckBadgeIcon className="w-5 h-5 text-pink-700" />
                    </div>

                    <div className="cursor-pointer" onClick={handleCancelNew}>
                      <XMarkIcon className="w-5 h-5 text-text-color" />
                    </div>
                  </div>
                </td>
              </tr>
            )}

            {/* DISPLAY ROWS */}
            {pagedRows.length === 0 && !showNewRow && (
              <tr>
                <td colSpan={7} className="py-3 px-2 text-center text-gray-500">
                  No data found
                </td>
              </tr>
            )}

            {pagedRows.map((row, index) => {
              const isEditing = editingRowId === row.id;
              return (
                <tr key={row.id} className="border-b border-gray-200">
                  <td className="py-3 px-2">{indexOfFirst + index + 1}</td>

                  {!isEditing ? (
                    <>
                      <td className="py-3 px-2 text-center">{row.reassessmentDate}</td>
                      <td className="py-3 px-2 text-center">{row.comments}</td>
                      <td className="py-3 px-2 text-center">{row.probability}</td>
                      <td className="py-3 px-2 text-center">{row.impact1}</td>
                      <td className="py-3 px-2 text-center">{row.impact2}</td>

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
                        <FormInput
                          name="reassessmentDate"
                          type="date"
                          formValues={{ reassessmentDate: row.reassessmentDate }}
                          onChange={(e) => handleEditChange(row.id, e)}
                        />
                      </td>

                      <td className="py-3 px-2">
                        <FormInput
                          name="comments"
                          type="text"
                          formValues={{ comments: row.comments }}
                          onChange={(e) => handleEditChange(row.id, e)}
                        />
                      </td>

                      <td className="py-3 px-2">
                        <FormSelect
                          name="probability"
                          formValues={{ probability: row.probability }}
                          options={numberOptions}
                          onChange={(e) => handleEditChange(row.id, e)}
                        />
                      </td>

                      <td className="py-3 px-2">
                        <FormSelect
                          name="impact1"
                          formValues={{ impact1: row.impact1 }}
                          options={numberOptions}
                          onChange={(e) => handleEditChange(row.id, e)}
                        />
                      </td>

                      <td className="py-3 px-2">
                        <FormSelect
                          name="impact2"
                          formValues={{ impact2: row.impact2 }}
                          options={numberOptions}
                          onChange={(e) => handleEditChange(row.id, e)}
                        />
                      </td>

                      <td className="py-3 px-2">
                        <div className="flex gap-3 items-center">
                          <div className="cursor-pointer" onClick={handleDoneEdit}>
                            <CheckBadgeIcon className="w-5 h-5 text-text-color" />
                          </div>

                          <div className="cursor-pointer" onClick={handleCloseEdit}>
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

        {/* Pagination */}
        {rows.length > 0 && (
          <div className="w-full flex gap-5 items-center justify-end mt-4">
            <button
              onClick={handlePreviousPage}
              className={`p-2 rounded-full bg-gray-200 ${
                currentPage === 1
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
};

export default ResidualRiskTable;

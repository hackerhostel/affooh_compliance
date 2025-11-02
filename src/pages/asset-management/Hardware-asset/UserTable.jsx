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

const UserTable = () => {
  // Dummy select options
  const assignToOptions = getSelectOptions([
    { id: "Alice Johnson", name: "Alice Johnson" },
    { id: "Bob Smith", name: "Bob Smith" },
    { id: "Carol Lee", name: "Carol Lee" },
    { id: "David Brown", name: "David Brown" },
    { id: "Nipun Sandeepa", name: "Nipun Sandeepa" },
  ]);

  // Dummy table data
  const [rows, setRows] = useState([
    { id: 1, assignTo: "Alice Johnson", assignDate: "2025-01-10", returnDate: "2025-02-10" },
    { id: 2, assignTo: "Bob Smith", assignDate: "2025-01-15", returnDate: "2025-03-01" },
    { id: 3, assignTo: "Carol Lee", assignDate: "2025-02-05", returnDate: "2025-03-05" },
    { id: 4, assignTo: "David Brown", assignDate: "2025-02-20", returnDate: "2025-04-01" },
  ]);

  const [showNewRow, setShowNewRow] = useState(false);
  const [newRow, setNewRow] = useState({ assignTo: "", assignDate: "", returnDate: "" });
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
    setNewRow({ assignTo: "", assignDate: "", returnDate: "" });
  };

  const handleNewChange = ({ target: { name, value } }) => {
    setNewRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNew = () => {
    if (!newRow.assignTo || !newRow.assignDate || !newRow.returnDate) return;
    const newEntry = { id: Date.now(), ...newRow };
    setRows((prev) => [...prev, newEntry]);
    setShowNewRow(false);
  };

  const handleCancelNew = () => {
    setShowNewRow(false);
  };

  const handleStartEdit = (id) => {
    setEditingRowId(id);
    setOpenActionRowId(null);
  };

  const handleEditChange = (id, { target: { name, value } }) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [name]: value } : r))
    );
  };

  const handleDoneEdit = () => {
    setEditingRowId(null);
  };

  const handleCloseEdit = () => {
    setEditingRowId(null);
  };

  const handleDeleteRow = (id) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
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

  return (
    <div className="mt-6">
      <div className="flex items-center gap-5">
        <span className="text-lg font-semibold">Users</span>
        <div className="flex items-center gap-1">
          <PlusCircleIcon onClick={handleAddNewClick} className="w-6 h-6 text-pink-500 cursor-pointer" />
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
              <th className="py-3 px-10 text-center">Assign To</th>
              <th className="py-3 px-4 text-center">Assign Date</th>
              <th className="py-3 px-10 text-center">Return Date</th>
              <th className="py-3 px-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {showNewRow && (
              <tr className="border-b border-gray-200">
                <td className="py-3 px-2">-</td>
                <td className="py-3 px-2 w-40">
                  <FormSelect
                    name="assignTo"
                    formValues={{ assignTo: newRow.assignTo }}
                    options={assignToOptions}
                    onChange={handleNewChange}
                  />
                </td>
                <td className="py-3 px-2">
                  <FormInput
                    name="assignDate"
                    type="date"
                    formValues={{ assignDate: newRow.assignDate }}
                    onChange={handleNewChange}
                  />
                </td>
                <td className="py-3 px-2">
                  <FormInput
                    name="returnDate"
                    type="date"
                    formValues={{ returnDate: newRow.returnDate }}
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

            {pagedRows.length === 0 && !showNewRow && (
              <tr>
                <td className="py-3 px-2 text-center text-gray-500" colSpan={5}>
                  No assigned assets found
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
                      <td className="py-3 px-2 text-center">{row.assignTo}</td>
                      <td className="py-3 px-2 text-center">{row.assignDate}</td>
                      <td className="py-3 px-2 text-center">{row.returnDate}</td>
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
                      <td className="py-3 px-2 w-40">
                        <FormSelect
                          name="assignTo"
                          formValues={{ assignTo: row.assignTo }}
                          options={assignToOptions}
                          onChange={(e) => handleEditChange(row.id, e)}
                        />
                      </td>
                      <td className="py-3 px-2">
                        <FormInput
                          name="assignDate"
                          type="date"
                          formValues={{ assignDate: row.assignDate }}
                          onChange={(e) => handleEditChange(row.id, e)}
                        />
                      </td>
                      <td className="py-3 px-2">
                        <FormInput
                          name="returnDate"
                          type="date"
                          formValues={{ returnDate: row.returnDate }}
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

        {rows.length > 0 && (
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
                currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
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

export default UserTable;

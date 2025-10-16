import React, { useState } from "react";
import FormSelect from "../../../components/FormSelect.jsx";
import FormInput from "../../../components/FormInput.jsx";
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

const RASCIOverview = () => {
  // Dummy select options for roles
  const peopleOptions = getSelectOptions([
    { id: "Alice Johnson", name: "Alice Johnson" },
    { id: "Bob Smith", name: "Bob Smith" },
    { id: "Carol Lee", name: "Carol Lee" },
    { id: "David Brown", name: "David Brown" },
    { id: "Evelyn White", name: "Evelyn White" },
  ]);

  // Dummy table data
  const [rasciRows, setRasciRows] = useState([
    {
      id: 1,
      task: "Define project scope",
      R: "Alice Johnson",
      A: "Bob Smith",
      S: "Carol Lee",
      C: "David Brown",
      I: "Evelyn White",
    },
    {
      id: 2,
      task: "Develop project plan",
      R: "Bob Smith",
      A: "Alice Johnson",
      S: "David Brown",
      C: "Carol Lee",
      I: "Evelyn White",
    },
    {
      id: 3,
      task: "Conduct risk assessment",
      R: "Carol Lee",
      A: "Alice Johnson",
      S: "Evelyn White",
      C: "Bob Smith",
      I: "David Brown",
    },
    {
      id: 4,
      task: "Review deliverables",
      R: "David Brown",
      A: "Carol Lee",
      S: "Alice Johnson",
      C: "Evelyn White",
      I: "Bob Smith",
    },
  ]);

  const [showNewRow, setShowNewRow] = useState(false);
  const [newRow, setNewRow] = useState({
    task: "",
    R: "",
    A: "",
    S: "",
    C: "",
    I: "",
  });
  const [editingRowId, setEditingRowId] = useState(null);
  const [openActionRowId, setOpenActionRowId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 5;
  const totalPages = Math.ceil(rasciRows.length / rowsPerPage);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const pagedRows = rasciRows.slice(indexOfFirst, indexOfLast);

  // Handlers
  const handleAddNewClick = () => {
    setShowNewRow(true);
    setNewRow({ task: "", R: "", A: "", S: "", C: "", I: "" });
  };

  const handleNewChange = ({ target: { name, value } }) => {
    setNewRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNew = () => {
    if (!newRow.task || !newRow.R || !newRow.A) return;
    const newEntry = { id: Date.now(), ...newRow };
    setRasciRows((prev) => [...prev, newEntry]);
    setShowNewRow(false);
    setNewRow({ task: "", R: "", A: "", S: "", C: "", I: "" });
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

  const handleDoneEdit = () => setEditingRowId(null);
  const handleCloseEdit = () => setEditingRowId(null);
  const handleDeleteRow = (id) =>
    setRasciRows((prev) => prev.filter((r) => r.id !== id));

  const toggleActionMenu = (id) =>
    setOpenActionRowId((prev) => (prev === id ? null : id));

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
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

      <div className="bg-white rounded p-3 mt-2">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="text-left text-secondary-grey border-b border-gray-200">
              <th className="py-3 px-2 w-10">#</th>
              <th className="py-3 px-4">Task/Activity</th>
              <th className="py-3 px-4">R</th>
              <th className="py-3 px-4">A</th>
              <th className="py-3 px-4">S</th>
              <th className="py-3 px-4">C</th>
              <th className="py-3 px-4">I</th>
              <th className="py-3 px-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {showNewRow && (
              <tr className="border-b border-gray-200">
                <td className="py-3 px-2">-</td>
                <td className="py-3 px-2">
                  <FormInput
                    name="task"
                    formValues={{ task: newRow.task }}
                    onChange={handleNewChange}
                    placeholder="Enter task"
                  />
                </td>
                {["R", "A", "S", "C", "I"].map((field) => (
                  <td key={field} className="py-3 px-2 w-40">
                    <FormSelect
                      name={field}
                      formValues={{ [field]: newRow[field] }}
                      options={peopleOptions}
                      onChange={handleNewChange}
                    />
                  </td>
                ))}
                <td className="py-3 px-2">
                  <div className="flex gap-3 items-center">
                    <CheckBadgeIcon
                      onClick={handleSaveNew}
                      className="w-5 h-5 text-pink-700 cursor-pointer"
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
                  <td className="py-3 px-2">{indexOfFirst + index + 1}</td>

                  {!isEditing ? (
                    <>
                      <td className="py-3 px-2">{row.task}</td>
                      {["R", "A", "S", "C", "I"].map((key) => (
                        <td key={key} className="py-3 px-2">
                          {row[key]}
                        </td>
                      ))}
                      <td className="py-3 px-2">
                        {openActionRowId !== row.id ? (
                          <EllipsisVerticalIcon
                            onClick={() => toggleActionMenu(row.id)}
                            className="w-5 h-5 text-secondary-grey cursor-pointer"
                          />
                        ) : (
                          <div className="flex items-center gap-3">
                            <PencilIcon
                              onClick={() => handleStartEdit(row.id)}
                              className="w-5 h-5 text-text-color cursor-pointer"
                            />
                            <TrashIcon
                              onClick={() => handleDeleteRow(row.id)}
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
                      <td className="py-3 px-2">
                        <FormInput
                          name="task"
                          formValues={{ task: row.task }}
                          onChange={(e) => handleEditChange(row.id, e)}
                        />
                      </td>
                      {["R", "A", "S", "C", "I"].map((field) => (
                        <td key={field} className="py-3 px-2 w-40">
                          <FormSelect
                            name={field}
                            formValues={{ [field]: row[field] }}
                            options={peopleOptions}
                            onChange={(e) => handleEditChange(row.id, e)}
                          />
                        </td>
                      ))}
                      <td className="py-3 px-2">
                        <div className="flex gap-3 items-center">
                          <CheckBadgeIcon
                            onClick={handleDoneEdit}
                            className="w-5 h-5 text-text-color cursor-pointer"
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

export default RASCIOverview;

import React, { useState } from 'react';
import FormTextArea from "../../../components/FormTextArea.jsx";
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

const SteeringCommitteeOverview = () => {
  // Dummy select options
  const nameOptions = getSelectOptions([
    { id: "Alice Johnson", name: "Alice Johnson" },
    { id: "Bob Smith", name: "Bob Smith" },
    { id: "Carol Lee", name: "Carol Lee" },
    { id: "David Brown", name: "David Brown" },
  ]);

  const roleOptions = getSelectOptions([
    { id: "Chairperson", name: "Chairperson" },
    { id: "Vice Chair", name: "Vice Chair" },
    { id: "Secretary", name: "Secretary" },
    { id: "Member", name: "Member" },
  ]);

  const typeOptions = getSelectOptions([
    { id: "Internal", name: "Internal" },
    { id: "External", name: "External" },
    { id: "Advisory", name: "Advisory" },
  ]);

  // Steering Committee table
  const [committeeRows, setCommitteeRows] = useState([
    { id: 1, name: "Alice Johnson", role: "Chairperson", type: "Internal", responsibility: "Lead steering meetings and approve strategic decisions." },
    { id: 2, name: "Bob Smith", role: "Vice Chair", type: "Internal", responsibility: "Assist chairperson and oversee implementation progress." },
    { id: 3, name: "Carol Lee", role: "Secretary", type: "Internal", responsibility: "Record meeting minutes and manage communication." },
    { id: 4, name: "David Brown", role: "Member", type: "External", responsibility: "Provide expert advice on quality assurance and compliance." },
  ]);

  const [showNewRow, setShowNewRow] = useState(false);
  const [newRow, setNewRow] = useState({ name: "", role: "", type: "", responsibility: "" });
  const [editingRowId, setEditingRowId] = useState(null);
  const [openActionRowId, setOpenActionRowId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 5;
  const totalPages = Math.ceil(committeeRows.length / rowsPerPage);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const pagedRows = committeeRows.slice(indexOfFirst, indexOfLast);

  // Handlers
  const handleAddNewClick = () => {
    setShowNewRow(true);
    setNewRow({ name: "", role: "", type: "", responsibility: "" });
  };

  const handleNewChange = ({ target: { name, value } }) => {
    setNewRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNew = () => {
    if (!newRow.name || !newRow.role || !newRow.type || !newRow.responsibility) return;
    const newEntry = { id: Date.now(), ...newRow };
    setCommitteeRows((prev) => [...prev, newEntry]);
    setShowNewRow(false);
    setNewRow({ name: "", role: "", type: "", responsibility: "" });
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

  const handleDoneEdit = () => {
    setEditingRowId(null);
  };

  const handleCloseEdit = () => {
    setEditingRowId(null);
  };

  const handleDeleteRow = (id) => {
    setCommitteeRows((prev) => prev.filter((r) => r.id !== id));
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
        <span className="text-lg font-semibold">Steering Committee</span>
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
              <th className="py-3 px-10">Name</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-10">Type</th>
              <th className="py-3 px-5">Responsibility</th>
              <th className="py-3 px-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {showNewRow && (
              <tr className="border-b border-gray-200">
                <td className="py-3 px-2">-</td>
                <td className="py-3 px-2 w-40">
                  <FormSelect
                    name="name"
                    formValues={{ name: newRow.name }}
                    options={nameOptions}
                    onChange={handleNewChange}
                  />
                </td>
                <td className="py-3 px-2 w-40">
                  <FormSelect
                    name="role"
                    formValues={{ role: newRow.role }}
                    options={roleOptions}
                    onChange={handleNewChange}
                  />
                </td>
                <td className="py-3 px-2 w-40">
                  <FormSelect
                    name="type"
                    formValues={{ type: newRow.type }}
                    options={typeOptions}
                    onChange={handleNewChange}
                  />
                </td>
                <td className="py-3 px-2">
                  <FormTextArea
                    name="responsibility"
                    formValues={{ responsibility: newRow.responsibility }}
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
                <td className="py-3 px-2 text-center text-gray-500" colSpan={6}>
                  No members found
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
                      <td className="py-3 px-2 text-left">{row.name}</td>
                      <td className="py-3 px-2 text-left">{row.role}</td>
                      <td className="py-3 px-2 tex-left" >{row.type}</td>
                      <td className="py-3 px-2 text-left">{row.responsibility}</td>
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
                          name="name"
                          formValues={{ name: row.name }}
                          options={nameOptions}
                          onChange={(e) => handleEditChange(row.id, e)}
                        />
                      </td>
                      <td className="py-3 px-2 w-40">
                        <FormSelect
                          name="role"
                          formValues={{ role: row.role }}
                          options={roleOptions}
                          onChange={(e) => handleEditChange(row.id, e)}
                        />
                      </td>
                      <td className="py-3 px-2 w-40">
                        <FormSelect
                          name="type"
                          formValues={{ type: row.type }}
                          options={typeOptions}
                          onChange={(e) => handleEditChange(row.id, e)}
                        />
                      </td>
                      <td className="py-3 px-2">
                        <FormTextArea
                          name="responsibility"
                          formValues={{ responsibility: row.responsibility }}
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

        {committeeRows.length > 0 && (
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

export default SteeringCommitteeOverview;

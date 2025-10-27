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

const StandardOverview = () => {
  // Dummy select options
  const classificationOptions = getSelectOptions([
    { id: "Confidential", name: "Confidential" },
    { id: "Internal", name: "Internal" },
    { id: "Public", name: "Public" },
  ]);

  const ownerOptions = getSelectOptions([
    { id: "Alice Johnson", name: "Alice Johnson" },
    { id: "Bob Smith", name: "Bob Smith" },
    { id: "Carol Lee", name: "Carol Lee" },
    { id: "David Brown", name: "David Brown" },
  ]);

  // Table data
  const [documentRows, setDocumentRows] = useState([
    {
      id: 1,
      code: "DOC-001",
      documentName: "Quality Policy",
      version: "1.0",
      classification: "Confidential",
      owner: { firstName: "Alice", lastName: "Johnson" },
    },
    {
      id: 2,
      code: "DOC-002",
      documentName: "Safety Procedures",
      version: "2.1",
      classification: "Internal",
      owner: { firstName: "Bob", lastName: "Smith" },
    },
    {
      id: 3,
      code: "DOC-003",
      documentName: "IT Usage Guidelines",
      version: "3.0",
      classification: "Public",
      owner: { firstName: "Carol", lastName: "Lee" },
    },
  ]);


  const [showNewRow, setShowNewRow] = useState(false);
  const [newRow, setNewRow] = useState({
    code: "",
    documentName: "",
    version: "",
    classification: "",
    owner: "",
  });
  const [editingRowId, setEditingRowId] = useState(null);
  const [openActionRowId, setOpenActionRowId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 5;
  const totalPages = Math.ceil(documentRows.length / rowsPerPage);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const pagedRows = documentRows.slice(indexOfFirst, indexOfLast);

  // Handlers
  const handleAddNewClick = () => {
    setShowNewRow(true);
    setNewRow({
      code: "",
      documentName: "",
      version: "",
      classification: "",
      owner: "",
    });
  };

  const handleNewChange = ({ target: { name, value } }) => {
    setNewRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNew = () => {
    if (!newRow.code || !newRow.documentName || !newRow.version || !newRow.classification || !newRow.owner) return;
    const newEntry = { id: Date.now(), ...newRow };
    setDocumentRows((prev) => [...prev, newEntry]);
    setShowNewRow(false);
    setNewRow({ code: "", documentName: "", version: "", classification: "", owner: "" });
  };

  const handleCancelNew = () => {
    setShowNewRow(false);
  };

  const handleStartEdit = (id) => {
    setEditingRowId(id);
    setOpenActionRowId(null);
  };

  const handleEditChange = (id, { target: { name, value } }) => {
    setDocumentRows((prev) =>
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
    setDocumentRows((prev) => prev.filter((r) => r.id !== id));
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

  const renderUserCell = (user) => {
    if (!user)
      return <span className="text-gray-400 italic">No user</span>;

    return (
      <div className="flex items-center justify-center space-x-2">
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
        <span>{user.firstName} {user.lastName}</span>
      </div>
    );
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

  return (
    <div className="mt-6">
      <div className="flex justify-end items-center mt-4 space-x-2">
        <button className="bg-primary-pink px-8 py-3 rounded-md text-white">Archived</button>
        <button className="bg-primary-pink px-8 py-3 rounded-md text-white">Approved</button>
        <button className="bg-primary-pink px-8 py-3 rounded-md text-white">Save</button>
      </div>

      <div className="flex items-center gap-5">
        <span className="text-lg font-semibold">Standards</span>
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
              <th className="py-3 px-2 w-10">ID</th>
              <th className="py-3 px-4 text-center">Code</th>
              <th className="py-3 px-4 text-center">Document Name</th>
              <th className="py-3 px-4 text-center">Version</th>
              <th className="py-3 px-4 text-center">Classification</th>
              <th className="py-3 px-4 text-center">Owner</th>
              <th className="py-3 px-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {showNewRow && (
              <tr className="border-b border-gray-200">
                <td className="py-3 px-2">-</td>
                <td className="py-3 px-2 w-44">
                  <FormInput name="code" formValues={{ code: newRow.code }} onChange={handleNewChange} />
                </td>
                <td className="py-3 px-2 w-44">
                  <FormInput name="documentName" formValues={{ documentName: newRow.documentName }} onChange={handleNewChange} />
                </td>
                <td className="py-3 px-2 w-44">
                  <FormInput name="version" formValues={{ version: newRow.version }} onChange={handleNewChange} />
                </td>
                <td className="py-3 px-2 w-44">
                  <FormSelect name="classification" formValues={{ classification: newRow.classification }} options={classificationOptions} onChange={handleNewChange} />
                </td>
                <td className="py-3 px-2 w-44">
                  <FormSelect name="owner" formValues={{ owner: newRow.owner }} options={ownerOptions} onChange={handleNewChange} />
                </td>
                <td className="py-3 px-2 ">
                  <div className="flex gap-3 items-center justify-center">
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
                <td className="py-3 px-2 text-center text-gray-500" colSpan={7}>
                  No documents found
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
                      <td className="py-3 px-2 text-center">{row.code}</td>
                      <td className="py-3 px-2 text-center">{row.documentName}</td>
                      <td className="py-3 px-2 text-center">{row.version}</td>
                      <td
                        className={`py-4 px-4 font-medium text-center ${getColorClass(
                          row.classification
                        )}`}
                      >
                        {row.classification}
                      </td>
                      <td className="py-3 px-2 text-center">{renderUserCell(row.owner)}</td>
                      <td className="py-3 px-2">
                        {openActionRowId !== row.id ? (
                          <div className="cursor-pointer inline-flex" onClick={() => toggleActionMenu(row.id)}>
                            <EllipsisVerticalIcon className="w-5 h-5 text-secondary-grey" />
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="cursor-pointer" onClick={() => handleStartEdit(row.id)}>
                              <PencilIcon className="w-5 h-5 text-text-color" />
                            </div>
                            <div className="cursor-pointer" onClick={() => handleDeleteRow(row.id)}>
                              <TrashIcon className="w-5 h-5 text-text-color" />
                            </div>
                            <div className="cursor-pointer" onClick={() => setOpenActionRowId(null)}>
                              <XMarkIcon className="w-5 h-5 text-text-color" />
                            </div>
                          </div>
                        )}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-2">
                        <FormInput name="code" formValues={{ code: row.code }} onChange={(e) => handleEditChange(row.id, e)} />
                      </td>
                      <td className="py-3 px-2">
                        <FormInput name="documentName" formValues={{ documentName: row.documentName }} onChange={(e) => handleEditChange(row.id, e)} />
                      </td>
                      <td className="py-3 px-2">
                        <FormInput name="version" formValues={{ version: row.version }} onChange={(e) => handleEditChange(row.id, e)} />
                      </td>
                      <td className="py-3 px-2">
                        <FormSelect name="classification" formValues={{ classification: row.classification }} options={classificationOptions} onChange={(e) => handleEditChange(row.id, e)} />
                      </td>
                      <td className="py-3 px-2">
                        <FormSelect name="owner" formValues={{ owner: row.owner }} options={ownerOptions} onChange={(e) => handleEditChange(row.id, e)} />
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

        {documentRows.length > 0 && (
          <div className="w-full flex gap-5 items-center justify-end mt-4">
            <button
              onClick={handlePreviousPage}
              className={`p-2 rounded-full bg-gray-200 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
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
              className={`p-2 rounded-full bg-gray-200 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
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

export default StandardOverview;

import React, { useState } from "react";
import FormInput from "../../../components/FormInput.jsx";
import FormTextArea from "../../../components/FormTextArea.jsx";
import {
  EllipsisVerticalIcon,
  PencilIcon,
  CheckBadgeIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

const CommunicationRegisterOverview = () => {
  // -------------------------------
  // INTERNAL COMMUNICATION SECTION
  // -------------------------------
  const [internalRows, setInternalRows] = useState([
    {
      id: 1,
      media: "Email",
      communication: "Project updates",
      method: "Weekly summary email",
      frequency: "Weekly",
      responsibility: "Project Manager",
      targetTeam: "All Employees",
    },
    {
      id: 2,
      media: "Meeting",
      communication: "Operational reviews",
      method: "Team meetings",
      frequency: "Monthly",
      responsibility: "Operations Head",
      targetTeam: "Operations Team",
    },
  ]);
  const [showNewInternalRow, setShowNewInternalRow] = useState(false);
  const [newInternalRow, setNewInternalRow] = useState({
    media: "",
    communication: "",
    method: "",
    frequency: "",
    responsibility: "",
    targetTeam: "",
  });
  const [editingInternalRowId, setEditingInternalRowId] = useState(null);
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [openActionMenu, setOpenActionMenu] = useState(false);
  const [openActionRowId, setOpenActionRowId] = useState(null);

  // -------------------------------
  // EXTERNAL COMMUNICATION SECTION
  // -------------------------------
  const [externalRows, setExternalRows] = useState([
    {
      id: 1,
      withWhom: "Customers",
      communication: "Product availability and updates",
      how: "Email / Newsletter",
      who: "Sales Department",
      when: "Monthly",
    },
    {
      id: 2,
      withWhom: "Suppliers",
      communication: "Material requirements",
      how: "Supplier portal / phone call",
      who: "Procurement Team",
      when: "As required",
    },
  ]);
  const [showNewExternalRow, setShowNewExternalRow] = useState(false);
  const [newExternalRow, setNewExternalRow] = useState({
    withWhom: "",
    communication: "",
    how: "",
    who: "",
    when: "",
  });
  const [editingExternalRowId, setEditingExternalRowId] = useState(null);
  const [externalCurrentPage, setExternalCurrentPage] = useState(1);

  // Pagination setup
  const rowsPerPage = 5;

  // INTERNAL HANDLERS
  const handleAddNewInternalClick = () => {
    setShowNewInternalRow(true);
    setNewInternalRow({
      media: "",
      communication: "",
      method: "",
      frequency: "",
      responsibility: "",
      targetTeam: "",
    });
  };

  const handleInternalChange = ({ target: { name, value } }) => {
    setNewInternalRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNewInternal = () => {
    if (
      !newInternalRow.media ||
      !newInternalRow.communication ||
      !newInternalRow.method
    )
      return;
    const newRow = { id: Date.now(), ...newInternalRow };
    setInternalRows((prev) => [...prev, newRow]);
    setShowNewInternalRow(false);
  };

  const handleDeleteInternalRow = (id) => {
    setInternalRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleStartEditInternal = (id) => setEditingInternalRowId(id);
  const handleEditInternalChange = (id, { target: { name, value } }) => {
    setInternalRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [name]: value } : r))
    );
  };
  const handleDoneEditInternal = () => setEditingInternalRowId(null);

  // INTERNAL PAGINATION
  const internalTotalPages = Math.ceil(internalRows.length / rowsPerPage);
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
      withWhom: "",
      communication: "",
      how: "",
      who: "",
      when: "",
    });
  };

  const handleExternalChange = ({ target: { name, value } }) => {
    setNewExternalRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNewExternal = () => {
    if (!newExternalRow.withWhom || !newExternalRow.communication) return;
    const newRow = { id: Date.now(), ...newExternalRow };
    setExternalRows((prev) => [...prev, newRow]);
    setShowNewExternalRow(false);
  };

  const handleDeleteExternalRow = (id) => {
    setExternalRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleStartEditExternal = (id) => setEditingExternalRowId(id);
  const handleEditExternalChange = (id, { target: { name, value } }) => {
    setExternalRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [name]: value } : r))
    );
  };
  const handleDoneEditExternal = () => setEditingExternalRowId(null);

  // EXTERNAL PAGINATION
  const externalTotalPages = Math.ceil(externalRows.length / rowsPerPage);
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

  const handleSave = () => {
    onSave();
    setOpenActionMenu(false);
  };

  const handleCancel = () => {
    onCancel();
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

        <div className="bg-white rounded p-3 mt-2">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="text-left text-secondary-grey border-b border-gray-200">
                <th className="py-3 px-2 w-10">#</th>
                <th className="py-3 px-2">Communication Media</th>
                <th className="py-3 px-2">What is Communicated</th>
                <th className="py-3 px-2">Method</th>
                <th className="py-3 px-2">Frequency</th>
                <th className="py-3 px-2">Responsibility</th>
                <th className="py-3 px-2">Target Team</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {showNewInternalRow && (
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-2">-</td>
                  {Object.keys(newInternalRow).map((key) => (
                    <td key={key} className="py-3 px-2">
                      <FormInput
                        name={key}
                        formValues={{ [key]: newInternalRow[key] }}
                        onChange={handleInternalChange}
                      />
                    </td>
                  ))}
                  <td className="py-3 px-2 flex gap-3">
                    <CheckBadgeIcon
                      className="w-5 h-5 text-pink-700 cursor-pointer"
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
                        <td className="py-3 px-2">{row.media}</td>
                        <td className="py-3 px-2">{row.communication}</td>
                        <td className="py-3 px-2">{row.method}</td>
                        <td className="py-3 px-2">{row.frequency}</td>
                        <td className="py-3 px-2">{row.responsibility}</td>
                        <td className="py-3 px-2">{row.targetTeam}</td>
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
                                  onClick={() => handleDeleteInternalRow(row.id)}
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
                        {Object.keys(row)
                          .filter((key) => key !== "id")
                          .map((key) => (
                            <td key={key} className="py-3 px-2">
                              <FormInput
                                name={key}
                                formValues={{ [key]: row[key] }}
                                onChange={(e) =>
                                  handleEditInternalChange(row.id, e)
                                }
                              />
                            </td>
                          ))}
                        <td className="py-3 px-2 flex gap-3">
                          <CheckBadgeIcon
                            className="w-5 h-5 text-pink-700 cursor-pointer"
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

        <div className="bg-white rounded p-3 mt-2">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="text-left text-secondary-grey border-b border-gray-200">
                <th className="py-3 px-2 w-10">#</th>
                <th className="py-3 px-2">With Whom</th>
                <th className="py-3 px-2">What is Communicated</th>
                <th className="py-3 px-2">How</th>
                <th className="py-3 px-2">Who</th>
                <th className="py-3 px-2">When</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {showNewExternalRow && (
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-2">-</td>
                  {Object.keys(newExternalRow).map((key) => (
                    <td key={key} className="py-3 px-2">
                      <FormInput
                        name={key}
                        formValues={{ [key]: newExternalRow[key] }}
                        onChange={handleExternalChange}
                      />
                    </td>
                  ))}
                  <td className="py-3 px-2 flex gap-3">
                    <CheckBadgeIcon
                      className="w-5 h-5 text-pink-700 cursor-pointer"
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
                        <td className="py-3 px-2">{row.withWhom}</td>
                        <td className="py-3 px-2">{row.communication}</td>
                        <td className="py-3 px-2">{row.how}</td>
                        <td className="py-3 px-2">{row.who}</td>
                        <td className="py-3 px-2">{row.when}</td>
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
                                  onClick={() => handleDeleteInternalRow(row.id)}
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
                        {Object.keys(row)
                          .filter((key) => key !== "id")
                          .map((key) => (
                            <td key={key} className="py-3 px-2">
                              <FormInput
                                name={key}
                                formValues={{ [key]: row[key] }}
                                onChange={(e) =>
                                  handleEditExternalChange(row.id, e)
                                }
                              />
                            </td>
                          ))}
                        <td className="py-3 px-2 flex gap-3">
                          <CheckBadgeIcon
                            className="w-5 h-5 text-pink-700 cursor-pointer"
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
    </div>
  );
};

export default CommunicationRegisterOverview;

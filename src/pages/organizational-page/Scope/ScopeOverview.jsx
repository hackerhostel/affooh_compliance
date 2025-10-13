import React, { useState } from "react";
import FormInput from "../../../components/FormInput.jsx";
import FormTextArea from "../../../components/FormTextArea.jsx";
import FormSelect from "../../../components/FormSelect.jsx";
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

const ScopeOverview = () => {
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
  const [openInternalActionRowId, setOpenInternalActionRowId] = useState(null);
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);

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
  const [openExternalActionRowId, setOpenExternalActionRowId] = useState(null);
  const [externalCurrentPage, setExternalCurrentPage] = useState(1);

  // -------------------------------
  // HANDLERS - INTERNAL COMMUNICATION
  // -------------------------------
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

  const handleStartEditInternal = (id) => {
    setEditingInternalRowId(id);
    setOpenInternalActionRowId(null);
  };

  const handleEditInternalChange = (id, { target: { name, value } }) => {
    setInternalRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [name]: value } : r))
    );
  };

  const handleDoneEditInternal = () => {
    setEditingInternalRowId(null);
  };

  const rowsPerPage = 5;
  const internalTotalPages = Math.ceil(internalRows.length / rowsPerPage);
  const internalPagedRows = internalRows.slice(
    (internalCurrentPage - 1) * rowsPerPage,
    internalCurrentPage * rowsPerPage
  );

  // -------------------------------
  // HANDLERS - EXTERNAL COMMUNICATION
  // -------------------------------
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

  const handleStartEditExternal = (id) => {
    setEditingExternalRowId(id);
    setOpenExternalActionRowId(null);
  };

  const handleEditExternalChange = (id, { target: { name, value } }) => {
    setExternalRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [name]: value } : r))
    );
  };

  const handleDoneEditExternal = () => {
    setEditingExternalRowId(null);
  };

  const externalTotalPages = Math.ceil(externalRows.length / rowsPerPage);
  const externalPagedRows = externalRows.slice(
    (externalCurrentPage - 1) * rowsPerPage,
    externalCurrentPage * rowsPerPage
  );

  // -------------------------------
  // RENDER
  // -------------------------------
  return (
    <div>
      {/* ---------------- INTERNAL COMMUNICATION ---------------- */}
      <div className="mt-6">
        <div className="flex items-center gap-5">
          <span className="text-lg font-semibold">
            Internal Communication
          </span>
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
                  <td className="py-3 px-2">
                    <FormInput
                      name="media"
                      formValues={{ media: newInternalRow.media }}
                      onChange={handleInternalChange}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <FormTextArea
                      name="communication"
                      formValues={{
                        communication: newInternalRow.communication,
                      }}
                      onChange={handleInternalChange}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <FormInput
                      name="method"
                      formValues={{ method: newInternalRow.method }}
                      onChange={handleInternalChange}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <FormInput
                      name="frequency"
                      formValues={{ frequency: newInternalRow.frequency }}
                      onChange={handleInternalChange}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <FormInput
                      name="responsibility"
                      formValues={{
                        responsibility: newInternalRow.responsibility,
                      }}
                      onChange={handleInternalChange}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <FormInput
                      name="targetTeam"
                      formValues={{ targetTeam: newInternalRow.targetTeam }}
                      onChange={handleInternalChange}
                    />
                  </td>
                  <td className="py-3 px-2 flex gap-3">
                    <CheckBadgeIcon
                      onClick={handleSaveNewInternal}
                      className="w-5 h-5 text-pink-700 cursor-pointer"
                    />
                    <XMarkIcon
                      onClick={() => setShowNewInternalRow(false)}
                      className="w-5 h-5 text-text-color cursor-pointer"
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
                        <td className="py-3 px-2 flex gap-3">
                          <PencilIcon
                            className="w-5 h-5 cursor-pointer text-text-color"
                            onClick={() => handleStartEditInternal(row.id)}
                          />
                          <TrashIcon
                            className="w-5 h-5 cursor-pointer text-text-color"
                            onClick={() => handleDeleteInternalRow(row.id)}
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-2">
                          <FormInput
                            name="media"
                            formValues={{ media: row.media }}
                            onChange={(e) => handleEditInternalChange(row.id, e)}
                          />
                        </td>
                        <td className="py-3 px-2">
                          <FormTextArea
                            name="communication"
                            formValues={{
                              communication: row.communication,
                            }}
                            onChange={(e) => handleEditInternalChange(row.id, e)}
                          />
                        </td>
                        <td className="py-3 px-2">
                          <FormInput
                            name="method"
                            formValues={{ method: row.method }}
                            onChange={(e) => handleEditInternalChange(row.id, e)}
                          />
                        </td>
                        <td className="py-3 px-2">
                          <FormInput
                            name="frequency"
                            formValues={{ frequency: row.frequency }}
                            onChange={(e) =>
                              handleEditInternalChange(row.id, e)
                            }
                          />
                        </td>
                        <td className="py-3 px-2">
                          <FormInput
                            name="responsibility"
                            formValues={{
                              responsibility: row.responsibility,
                            }}
                            onChange={(e) =>
                              handleEditInternalChange(row.id, e)
                            }
                          />
                        </td>
                        <td className="py-3 px-2">
                          <FormInput
                            name="targetTeam"
                            formValues={{ targetTeam: row.targetTeam }}
                            onChange={(e) =>
                              handleEditInternalChange(row.id, e)
                            }
                          />
                        </td>
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
        </div>
      </div>

      {/* ---------------- EXTERNAL COMMUNICATION ---------------- */}
      <div className="mt-10">
        <div className="flex items-center gap-5">
          <span className="text-lg font-semibold">
            External Communication
          </span>
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
                <th className="py-3 px-2">With Whom to Communicate</th>
                <th className="py-3 px-2">What is Communicated</th>
                <th className="py-3 px-2">How to Communicate</th>
                <th className="py-3 px-2">Who Communicates</th>
                <th className="py-3 px-2">When to Communicate</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {showNewExternalRow && (
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-2">-</td>
                  <td className="py-3 px-2">
                    <FormInput
                      name="withWhom"
                      formValues={{ withWhom: newExternalRow.withWhom }}
                      onChange={handleExternalChange}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <FormTextArea
                      name="communication"
                      formValues={{
                        communication: newExternalRow.communication,
                      }}
                      onChange={handleExternalChange}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <FormInput
                      name="how"
                      formValues={{ how: newExternalRow.how }}
                      onChange={handleExternalChange}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <FormInput
                      name="who"
                      formValues={{ who: newExternalRow.who }}
                      onChange={handleExternalChange}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <FormInput
                      name="when"
                      formValues={{ when: newExternalRow.when }}
                      onChange={handleExternalChange}
                    />
                  </td>
                  <td className="py-3 px-2 flex gap-3">
                    <CheckBadgeIcon
                      onClick={handleSaveNewExternal}
                      className="w-5 h-5 text-pink-700 cursor-pointer"
                    />
                    <XMarkIcon
                      onClick={() => setShowNewExternalRow(false)}
                      className="w-5 h-5 text-text-color cursor-pointer"
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
                        <td className="py-3 px-2 flex gap-3">
                          <PencilIcon
                            className="w-5 h-5 cursor-pointer text-text-color"
                            onClick={() => handleStartEditExternal(row.id)}
                          />
                          <TrashIcon
                            className="w-5 h-5 cursor-pointer text-text-color"
                            onClick={() => handleDeleteExternalRow(row.id)}
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-2">
                          <FormInput
                            name="withWhom"
                            formValues={{ withWhom: row.withWhom }}
                            onChange={(e) => handleEditExternalChange(row.id, e)}
                          />
                        </td>
                        <td className="py-3 px-2">
                          <FormTextArea
                            name="communication"
                            formValues={{
                              communication: row.communication,
                            }}
                            onChange={(e) => handleEditExternalChange(row.id, e)}
                          />
                        </td>
                        <td className="py-3 px-2">
                          <FormInput
                            name="how"
                            formValues={{ how: row.how }}
                            onChange={(e) => handleEditExternalChange(row.id, e)}
                          />
                        </td>
                        <td className="py-3 px-2">
                          <FormInput
                            name="who"
                            formValues={{ who: row.who }}
                            onChange={(e) => handleEditExternalChange(row.id, e)}
                          />
                        </td>
                        <td className="py-3 px-2">
                          <FormInput
                            name="when"
                            formValues={{ when: row.when }}
                            onChange={(e) => handleEditExternalChange(row.id, e)}
                          />
                        </td>
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
        </div>
      </div>
    </div>
  );
};

export default ScopeOverview;

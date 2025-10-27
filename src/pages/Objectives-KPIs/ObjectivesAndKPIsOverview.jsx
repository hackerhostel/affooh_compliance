import React, { useState } from "react";
import FormTextArea from "../../components/FormTextArea.jsx";
import FormSelect from "../../components/FormSelect.jsx";
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
import { getSelectOptions } from "../../utils/commonUtils.js";

const ObjectivesAndKPIsOverview = () => {
  // Dummy select options
  const departmentOptions = getSelectOptions([
    { id: "HR", name: "HR" },
    { id: "Finance", name: "Finance" },
    { id: "Operations", name: "Operations" },
    { id: "IT", name: "IT" },
  ]);

  const typeOptions = getSelectOptions([
    { id: "Strategic", name: "Strategic" },
    { id: "Operational", name: "Operational" },
    { id: "Compliance", name: "Compliance" },
  ]);

  const frequencyOptions = getSelectOptions([
    { id: "Monthly", name: "Monthly" },
    { id: "Quarterly", name: "Quarterly" },
    { id: "Annually", name: "Annually" },
  ]);

  // Dummy data
  const [kpiRows, setKpiRows] = useState([
    {
      id: 1,
      department: "HR",
      type: "Strategic",
      objective: "Improve employee retention",
      kpi: "Employee turnover rate below 10%",
      initialStatus: "15%",
      target: "10%",
      monitoringFrequency: "Quarterly",
      howToMeasure: "Monthly HR reports and exit interviews",
    },
    {
      id: 2,
      department: "Finance",
      type: "Operational",
      objective: "Optimize budget utilization",
      kpi: "Reduce unused budget funds by 5%",
      initialStatus: "8%",
      target: "3%",
      monitoringFrequency: "Monthly",
      howToMeasure: "Monthly financial reports",
    },
  ]);

  const [showNewRow, setShowNewRow] = useState(false);
  const [newRow, setNewRow] = useState({
    department: "",
    type: "",
    objective: "",
    kpi: "",
    initialStatus: "",
    target: "",
    monitoringFrequency: "",
    howToMeasure: "",
  });
  const [editingRowId, setEditingRowId] = useState(null);
  const [openActionRowId, setOpenActionRowId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 5;
  const totalPages = Math.ceil(kpiRows.length / rowsPerPage);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const pagedRows = kpiRows.slice(indexOfFirst, indexOfLast);

  // Handlers
  const handleAddNewClick = () => {
    setShowNewRow(true);
    setNewRow({
      department: "",
      type: "",
      objective: "",
      kpi: "",
      initialStatus: "",
      target: "",
      monitoringFrequency: "",
      howToMeasure: "",
    });
  };

  const handleNewChange = ({ target: { name, value } }) => {
    setNewRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNew = () => {
    if (
      !newRow.department ||
      !newRow.type ||
      !newRow.objective ||
      !newRow.kpi ||
      !newRow.initialStatus ||
      !newRow.target ||
      !newRow.monitoringFrequency ||
      !newRow.howToMeasure
    )
      return;

    const newEntry = { id: Date.now(), ...newRow };
    setKpiRows((prev) => [...prev, newEntry]);
    setShowNewRow(false);
    setNewRow({
      department: "",
      type: "",
      objective: "",
      kpi: "",
      initialStatus: "",
      target: "",
      monitoringFrequency: "",
      howToMeasure: "",
    });
  };

  const handleCancelNew = () => setShowNewRow(false);

  const handleStartEdit = (id) => {
    setEditingRowId(id);
    setOpenActionRowId(null);
  };

  const handleEditChange = (id, { target: { name, value } }) => {
    setKpiRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [name]: value } : r))
    );
  };

  const handleDoneEdit = () => setEditingRowId(null);
  const handleCloseEdit = () => setEditingRowId(null);
  const handleDeleteRow = (id) => setKpiRows((prev) => prev.filter((r) => r.id !== id));
  const toggleActionMenu = (id) => setOpenActionRowId((prev) => (prev === id ? null : id));

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <div className="p-4">
         <div className="flex justify-end items-center mt-4 space-x-2">
        <button className="bg-primary-pink px-8 py-3 rounded-md text-white">
          Archived
        </button>
        <button className="bg-primary-pink px-8 py-3 rounded-md text-white">
          Approved
        </button>
        <button className="bg-primary-pink px-8 py-3 rounded-md text-white">
          Save
        </button>
      </div>
      <div className="flex items-center gap-5">
        <span className="text-lg font-semibold">Objectives and KPIs</span>
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
              <th className="py-3 px-2">Department</th>
              <th className="py-3 px-2">Type</th>
              <th className="py-3 px-2">Objective</th>
              <th className="py-3 px-2">KPI</th>
              <th className="py-3 px-2">Initial Status</th>
              <th className="py-3 px-2">Target</th>
              <th className="py-3 px-2">Monitoring Frequency</th>
              <th className="py-3 px-2">How to Measure</th>
              <th className="py-3 px-2">Action</th>
            </tr>
          </thead>
          <tbody>

            {pagedRows.map((row, index) => {
              const isEditing = editingRowId === row.id;
              return (
                <tr key={row.id} className="border-b border-gray-200">
                  <td className="py-3 px-2">{indexOfFirst + index + 1}</td>

                  {!isEditing ? (
                    <>
                      <td className="py-3 px-2">{row.department}</td>
                      <td className="py-3 px-2">{row.type}</td>
                      <td className="py-3 px-2">{row.objective}</td>
                      <td className="py-3 px-2">{row.kpi}</td>
                      <td className="py-3 px-2">{row.initialStatus}</td>
                      <td className="py-3 px-2">{row.target}</td>
                      <td className="py-3 px-2">{row.monitoringFrequency}</td>
                      <td className="py-3 px-2">{row.howToMeasure}</td>
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
                      <td className="py-3 px-2 w-40">
                        <FormSelect
                          name="department"
                          formValues={{ department: row.department }}
                          options={departmentOptions}
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
                        <FormTextArea name="objective" formValues={{ objective: row.objective }} onChange={(e) => handleEditChange(row.id, e)} />
                      </td>
                      <td className="py-3 px-2">
                        <FormTextArea name="kpi" formValues={{ kpi: row.kpi }} onChange={(e) => handleEditChange(row.id, e)} />
                      </td>
                      <td className="py-3 px-2">
                        <FormTextArea name="initialStatus" formValues={{ initialStatus: row.initialStatus }} onChange={(e) => handleEditChange(row.id, e)} />
                      </td>
                      <td className="py-3 px-2">
                        <FormTextArea name="target" formValues={{ target: row.target }} onChange={(e) => handleEditChange(row.id, e)} />
                      </td>
                      <td className="py-3 px-2 w-40">
                        <FormSelect
                          name="monitoringFrequency"
                          formValues={{ monitoringFrequency: row.monitoringFrequency }}
                          options={frequencyOptions}
                          onChange={(e) => handleEditChange(row.id, e)}
                        />
                      </td>
                      <td className="py-3 px-2">
                        <FormTextArea name="howToMeasure" formValues={{ howToMeasure: row.howToMeasure }} onChange={(e) => handleEditChange(row.id, e)} />
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


            {showNewRow && (
              <tr className="border-b border-gray-200">
                <td className="py-3 px-2">-</td>
                <td className="py-3 px-2 w-40">
                  <FormSelect
                    name="department"
                    formValues={{ department: newRow.department }}
                    options={departmentOptions}
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
                  <FormTextArea name="objective" formValues={{ objective: newRow.objective }} onChange={handleNewChange} />
                </td>
                <td className="py-3 px-2">
                  <FormTextArea name="kpi" formValues={{ kpi: newRow.kpi }} onChange={handleNewChange} />
                </td>
                <td className="py-3 px-2">
                  <FormTextArea name="initialStatus" formValues={{ initialStatus: newRow.initialStatus }} onChange={handleNewChange} />
                </td>
                <td className="py-3 px-2">
                  <FormTextArea name="target" formValues={{ target: newRow.target }} onChange={handleNewChange} />
                </td>
                <td className="py-3 px-2 w-40">
                  <FormSelect
                    name="monitoringFrequency"
                    formValues={{ monitoringFrequency: newRow.monitoringFrequency }}
                    options={frequencyOptions}
                    onChange={handleNewChange}
                  />
                </td>
                <td className="py-3 px-2">
                  <FormTextArea name="howToMeasure" formValues={{ howToMeasure: newRow.howToMeasure }} onChange={handleNewChange} />
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
                <td className="py-3 px-2 text-center text-gray-500" colSpan={10}>
                  No objectives found
                </td>
              </tr>
            )}

            
          </tbody>
        </table>

        {kpiRows.length > 0 && (
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

export default ObjectivesAndKPIsOverview;

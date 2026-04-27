import React, { useState } from "react";
import FormTextArea from "../../components/FormTextArea.jsx";
import FormSelect from "../../components/FormSelect.jsx";
import {
  PencilIcon,
  EllipsisVerticalIcon,
  CheckCircleIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { getSelectOptions } from "../../utils/commonUtils.js";
import ConfirmationDialog from "../../components/ConfirmationDialog.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { selectSelectedProject } from "../../state/slice/projectSlice.js";
import { selectProjectUserList } from "../../state/slice/projectUsersSlice.js";
import { selectUser } from "../../state/slice/authSlice.js";
import trainingPlanApi from "../../utils/trainingPlanApi.js";
import { useEffect } from "react";

const DATE_INPUT_CLS =
  "border border-gray-300 rounded px-2 py-1 text-sm w-full focus:outline-none focus:border-pink-400";
const YEAR_INPUT_CLS =
  "border border-gray-300 rounded px-2 py-1 text-sm w-24 focus:outline-none focus:border-pink-400";

const TrainingPlansOverview = () => {
  const { addToast } = useToasts();
  const audienceOptions = getSelectOptions([
    { id: "Employees", name: "Employees" },
    { id: "Managers", name: "Managers" },
    { id: "Executives", name: "Executives" },
  ]);

  const statusOptions = getSelectOptions([
    { id: "Planned", name: "Planned" },
    { id: "In Progress", name: "In Progress" },
    { id: "Completed", name: "Completed" },
  ]);

  const frequencyOptions = getSelectOptions([
    { id: "Monthly", name: "Monthly" },
    { id: "Quarterly", name: "Quarterly" },
    { id: "Bi-Annually", name: "Bi-Annually" },
    { id: "Annually", name: "Annually" },
    { id: "One-Time", name: "One-Time" },
  ]);

  const currentYear = new Date().getFullYear();
  const yearOptions = getSelectOptions(
    Array.from({ length: 10 }, (_, i) => {
      const year = (currentYear - 2 + i).toString();
      return { id: year, name: year };
    })
  );

  const selectedProject = useSelector(selectSelectedProject);
  const projectUserList = useSelector(selectProjectUserList);
  const currentUser = useSelector(selectUser);
  const organizationID = currentUser?.organization?.id;

  const [trainingRows, setTrainingRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTrainingPlans = async () => {
    if (!organizationID) return;
    setLoading(true);
    try {
      const response = await trainingPlanApi.listTrainingPlans(organizationID);
      setTrainingRows(response.data.body || []);
    } catch (error) {
      console.error("Failed to fetch training plans:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainingPlans();
  }, [organizationID]);

  const userOptions = getSelectOptions(
    projectUserList.map((u) => ({
      id: u.id.toString(),
      name: `${u.firstName} ${u.lastName}`,
    }))
  );

  // Year filter options derived from data — only years that exist in the table
  const yearFilterOptions = getSelectOptions(
    [...new Set(trainingRows.map((r) => r.year))]
      .filter(Boolean)
      .sort()
      .map((y) => ({ id: y, name: y }))
  );

  const emptyRow = {
    year: "",
    date: "",
    trainingModule: "",
    targetAudience: "",
    duration: "",
    frequency: "",
    objective: "",
    evaluationMethodology: "",
    evaluation: "",
    resourcePerson: "",
    status: "",
  };

  const [showNewRow, setShowNewRow] = useState(false);
  const [newRow, setNewRow] = useState(emptyRow);
  const [editingRowId, setEditingRowId] = useState(null);
  // Snapshot of the row before editing starts — used to restore on cancel
  const [editingOriginal, setEditingOriginal] = useState(null);
  const [openActionRowId, setOpenActionRowId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  const [filters, setFilters] = useState({ year: "", targetAudience: "", status: "" });

  const rowsPerPage = 5;
  const filteredRows = trainingRows.filter(
    (row) =>
      (filters.year === "" || row.year === filters.year) &&
      (filters.targetAudience === "" || row.targetAudience === filters.targetAudience) &&
      (filters.status === "" || row.status === filters.status)
  );

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const pagedRows = filteredRows.slice(indexOfFirst, indexOfLast);

  const handleAddNewClick = () => {
    setShowNewRow(true);
    setNewRow(emptyRow);
  };

  const handleNewChange = ({ target: { name, value } }) => {
    setNewRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNew = async () => {
    const required = ["year", "trainingModule", "targetAudience", "status"];
    if (required.some((k) => !newRow[k])) return;
    if (!organizationID) {
      console.error("Organization ID is missing. Cannot save.");
      return;
    }

    try {
      const payload = {
        ...newRow,
        organizationID: organizationID,
        createdBy: currentUser?.id,
        // Convert resourcePerson to INT if it's set
        resourcePerson: newRow.resourcePerson ? parseInt(newRow.resourcePerson) : null
      };
      await trainingPlanApi.createTrainingPlan(payload);
      addToast("Training plan created successfully", { appearance: "success" });
      fetchTrainingPlans();
      setShowNewRow(false);
      setNewRow(emptyRow);
    } catch (error) {
      console.error("Failed to save training plan:", error);
      addToast("Failed to create training plan", { appearance: "error" });
    }
  };

  const handleCancelNew = () => setShowNewRow(false);

  const handleStartEdit = (id) => {
    const original = trainingRows.find((r) => r.id === id);
    setEditingOriginal({ ...original });
    setEditingRowId(id);
    setOpenActionRowId(null);
  };

  const handleCancelEdit = () => {
    if (editingOriginal) {
      setTrainingRows((prev) =>
        prev.map((r) => (r.id === editingOriginal.id ? editingOriginal : r))
      );
    }
    setEditingRowId(null);
    setEditingOriginal(null);
  };

  const handleEditChange = (id, { target: { name, value } }) => {
    setTrainingRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [name]: value } : r))
    );
  };

  const handleDoneEdit = async (id) => {
    const row = trainingRows.find(r => r.id === id);
    if (!row) return;

    try {
      const payload = {
        ...row,
        organizationID: organizationID,
        updatedBy: currentUser?.id,
        resourcePerson: row.resourcePerson ? parseInt(row.resourcePerson) : null
      };
      await trainingPlanApi.updateTrainingPlan(id, payload);
      addToast("Training plan updated successfully", { appearance: "success" });
      setEditingRowId(null);
      setEditingOriginal(null);
      fetchTrainingPlans();
    } catch (error) {
      console.error("Failed to update training plan:", error);
      addToast("Failed to update training plan", { appearance: "error" });
    }
  };

  const handleDeleteRow = (id) => {
    setRowToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!rowToDelete) return;
    try {
      await trainingPlanApi.deleteTrainingPlan(rowToDelete);
      addToast("Training plan deleted successfully", { appearance: "success" });
      fetchTrainingPlans();
      setIsDeleteDialogOpen(false);
      setRowToDelete(null);
    } catch (error) {
      console.error("Failed to delete training plan:", error);
      addToast("Failed to delete training plan", { appearance: "error" });
    }
  };

  const toggleActionMenu = (id) =>
    setOpenActionRowId((prev) => (prev === id ? null : id));

  const handleFilterChange = ({ target: { name, value } }) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const COLS = 13;

  return (
    <div className="p-4">
      {/* Title + Filters + Add New */}
      <div className="items-center gap-5 mt-5">
        <span className="text-lg font-semibold">Training Plans</span>
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          {/* Year filter — only years present in the table */}
          <FormSelect
            name="year"
            formValues={filters}
            placeholder="Year"
            showLabel={false}
            options={yearFilterOptions}
            onChange={handleFilterChange}
            className="w-[150px]"
          />
          <FormSelect
            name="targetAudience"
            formValues={filters}
            placeholder="Target Audience"
            showLabel={false}
            options={audienceOptions}
            onChange={handleFilterChange}
            className="w-[150px]"
          />
          <FormSelect
            name="status"
            formValues={filters}
            placeholder="Status"
            showLabel={false}
            options={statusOptions}
            onChange={handleFilterChange}
            className="w-[150px]"
          />
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
      </div>

      {/* Table */}
      <div className="bg-white rounded p-3 mt-2 overflow-x-auto">
        <table className="table-auto w-full border-collapse min-w-[1200px]">
          <thead>
            <tr className="text-left text-secondary-grey border-b border-gray-200">
              <th className="py-3 px-2 w-10">#</th>
              <th className="py-3 px-2">Year</th>
              <th className="py-3 px-2">Date</th>
              <th className="py-3 px-2">Training Module</th>
              <th className="py-3 px-2">Target Audience</th>
              <th className="py-3 px-2">Duration</th>
              <th className="py-3 px-2">Frequency</th>
              <th className="py-3 px-2">Objective</th>
              <th className="py-3 px-2">Evaluation Methodology</th>
              <th className="py-3 px-2">Evaluation</th>
              <th className="py-3 px-2">Resource Person</th>
              <th className="py-3 px-2">Status</th>
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
                      <td className="py-3 px-2">{row.year}</td>
                      <td className="py-3 px-2">{row.date ? new Date(row.date).toISOString().split('T')[0] : "-"}</td>
                      <td className="py-3 px-2">{row.trainingModule}</td>
                      <td className="py-3 px-2">{row.targetAudience}</td>
                      <td className="py-3 px-2">{row.duration}</td>
                      <td className="py-3 px-2">{row.frequency}</td>
                      <td className="py-3 px-2">{row.objective}</td>
                      <td className="py-3 px-2">{row.evaluationMethodology}</td>
                      <td className="py-3 px-2">{row.evaluation}</td>
                      <td className="py-3 px-2">
                        {row.resourcePersonFirstName
                          ? `${row.resourcePersonFirstName} ${row.resourcePersonLastName}`
                          : row.resourcePerson}
                      </td>
                      <td className="py-3 px-2">{row.status}</td>
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
                      {/* Year — free number input, not a hardcoded list */}
                      <td className="py-3 px-2">
                        <select
                          name="year"
                          value={row.year}
                          onChange={(e) => handleEditChange(row.id, e)}
                          className={YEAR_INPUT_CLS}
                        >
                          <option value="" disabled>Year</option>
                          {yearOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </td>
                      {/* Date picker */}
                      <td className="py-3 px-2">
                        <input
                          type="date"
                          name="date"
                          value={row.date}
                          onChange={(e) => handleEditChange(row.id, e)}
                          className={DATE_INPUT_CLS}
                        />
                      </td>
                      <td className="py-3 px-2">
                        <FormTextArea
                          name="trainingModule"
                          formValues={{ trainingModule: row.trainingModule }}
                          onChange={(e) => handleEditChange(row.id, e)}
                        />
                      </td>
                      <td className="py-3 px-2">
                        <FormTextArea
                          name="targetAudience"
                          formValues={{ targetAudience: row.targetAudience }}
                          onChange={(e) => handleEditChange(row.id, e)}
                        />
                      </td>
                      <td className="py-3 px-2">
                        <FormTextArea
                          name="duration"
                          formValues={{ duration: row.duration }}
                          onChange={(e) => handleEditChange(row.id, e)}
                        />
                      </td>
                      <td className="py-3 px-2 w-36">
                        <FormSelect
                          name="frequency"
                          formValues={{ frequency: row.frequency }}
                          options={frequencyOptions}
                          onChange={(e) => handleEditChange(row.id, e)}
                        />
                      </td>
                      <td className="py-3 px-2">
                        <FormTextArea
                          name="objective"
                          formValues={{ objective: row.objective }}
                          onChange={(e) => handleEditChange(row.id, e)}
                        />
                      </td>
                      <td className="py-3 px-2">
                        <FormTextArea
                          name="evaluationMethodology"
                          formValues={{ evaluationMethodology: row.evaluationMethodology }}
                          onChange={(e) => handleEditChange(row.id, e)}
                        />
                      </td>
                      <td className="py-3 px-2">
                        <FormTextArea
                          name="evaluation"
                          formValues={{ evaluation: row.evaluation }}
                          onChange={(e) => handleEditChange(row.id, e)}
                        />
                      </td>
                      <td className="py-3 px-2 w-48">
                        <FormSelect
                          name="resourcePerson"
                          formValues={{ resourcePerson: row.resourcePerson }}
                          options={userOptions}
                          onChange={(e) => handleEditChange(row.id, e)}
                        />
                      </td>
                      <td className="py-3 px-2 w-40">
                        <FormSelect
                          name="status"
                          formValues={{ status: row.status }}
                          options={statusOptions}
                          onChange={(e) => handleEditChange(row.id, e)}
                        />
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-3 items-center">
                          <div className="cursor-pointer" onClick={() => handleDoneEdit(row.id)}>
                            <CheckCircleIcon className="w-5 h-5 text-primary-pink" />
                          </div>
                          {/* Cancel restores original row values */}
                          <div className="cursor-pointer" onClick={handleCancelEdit}>
                            <XMarkIcon className="w-5 h-5 text-text-color" />
                          </div>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}

            {/* New Row */}
            {showNewRow && (
              <tr className="border-b border-gray-200">
                <td className="py-3 px-2">-</td>
                {/* Year — free number input */}
                <td className="py-3 px-2">
                  <select
                    name="year"
                    value={newRow.year}
                    onChange={handleNewChange}
                    className={YEAR_INPUT_CLS}
                  >
                    <option value="" disabled>Year</option>
                    {yearOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </td>
                {/* Date picker */}
                <td className="py-3 px-2">
                  <input
                    type="date"
                    name="date"
                    value={newRow.date}
                    onChange={handleNewChange}
                    className={DATE_INPUT_CLS}
                  />
                </td>
                <td className="py-3 px-2">
                  <FormTextArea
                    name="trainingModule"
                    formValues={{ trainingModule: newRow.trainingModule }}
                    onChange={handleNewChange}
                  />
                </td>
                <td className="py-3 px-2">
                  <FormTextArea
                    name="targetAudience"
                    formValues={{ targetAudience: newRow.targetAudience }}
                    onChange={handleNewChange}
                  />
                </td>
                <td className="py-3 px-2">
                  <FormTextArea
                    name="duration"
                    formValues={{ duration: newRow.duration }}
                    onChange={handleNewChange}
                  />
                </td>
                <td className="py-3 px-2 w-36">
                  <FormSelect
                    name="frequency"
                    formValues={{ frequency: newRow.frequency }}
                    options={frequencyOptions}
                    onChange={handleNewChange}
                  />
                </td>
                <td className="py-3 px-2">
                  <FormTextArea
                    name="objective"
                    formValues={{ objective: newRow.objective }}
                    onChange={handleNewChange}
                  />
                </td>
                <td className="py-3 px-2">
                  <FormTextArea
                    name="evaluationMethodology"
                    formValues={{ evaluationMethodology: newRow.evaluationMethodology }}
                    onChange={handleNewChange}
                  />
                </td>
                <td className="py-3 px-2">
                  <FormTextArea
                    name="evaluation"
                    formValues={{ evaluation: newRow.evaluation }}
                    onChange={handleNewChange}
                  />
                </td>
                <td className="py-3 px-2 w-48">
                  <FormSelect
                    name="resourcePerson"
                    formValues={{ resourcePerson: newRow.resourcePerson }}
                    options={userOptions}
                    onChange={handleNewChange}
                  />
                </td>
                <td className="py-3 px-2 w-40">
                  <FormSelect
                    name="status"
                    formValues={{ status: newRow.status }}
                    options={statusOptions}
                    onChange={handleNewChange}
                  />
                </td>
                <td className="py-3 px-2">
                  <div className="flex gap-3 items-center">
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

            {pagedRows.length === 0 && !showNewRow && (
              <tr>
                <td className="py-3 px-2 text-center text-gray-500" colSpan={COLS}>
                  No training plans found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {filteredRows.length > 0 && (
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

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Training Plan?"
        message="Are you sure you want to delete this training plan? This action cannot be undone."
      />
    </div>
  );
};

export default TrainingPlansOverview;

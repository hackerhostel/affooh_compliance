import React, { useState, useEffect } from "react";
import FormTextArea from "../../components/FormTextArea.jsx";
import FormSelect from "../../components/FormSelect.jsx";
import ConfirmationDialog from "../../components/ConfirmationDialog.jsx";
import {
  PencilIcon,
  EllipsisVerticalIcon,
  CheckCircleIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
  PlusCircleIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { getSelectOptions } from "../../utils/commonUtils.js";
import { useToasts } from "react-toast-notifications";
import {
  getObjectives,
  createObjective,
  updateObjective,
  deleteObjective,
  getObjectiveMasterData,
} from "../../utils/objectiveApi.js";

const ObjectivesAndKPIsOverview = ({ selectedDocument, onView }) => {
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(false);
  
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [frequencyOptions, setFrequencyOptions] = useState([]);

  useEffect(() => {
    const fetchMasterData = async () => {
      const projectID = localStorage.getItem("projectID");
      try {
        const data = await getObjectiveMasterData(projectID);
        if (data.departments) setDepartmentOptions(getSelectOptions(data.departments));
        if (data.types) setTypeOptions(getSelectOptions(data.types));
        if (data.frequencies) setFrequencyOptions(getSelectOptions(data.frequencies));
      } catch (error) {
        console.error("Failed to fetch objective master data", error);
      }
    };
    fetchMasterData();
  }, []);

  const [kpiRows, setKpiRows] = useState([]);

  const fetchObjectives = async () => {
    if (!selectedDocument) {
      setKpiRows([]);
      return;
    }
    setLoading(true);
    try {
      const data = await getObjectives(selectedDocument.keyId || selectedDocument.id);
      setKpiRows(data);
    } catch (err) {
      addToast("Failed to fetch objectives", { appearance: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObjectives();
  }, [selectedDocument]);

  const [showNewRow, setShowNewRow] = useState(false);
  const [newRow, setNewRow] = useState({
    departmentID: "",
    typeID: "",
    objectiveText: "",
    kpi: "",
    initialStatus: "",
    target: "",
    frequencyID: "",
    howToMeasure: "",
  });
  const [editingRowId, setEditingRowId] = useState(null);
  const [openActionRowId, setOpenActionRowId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rowToDeleteId, setRowToDeleteId] = useState(null);

  const rowsPerPage = 5;
  const totalPages = Math.ceil(kpiRows.length / rowsPerPage);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const pagedRows = kpiRows.slice(indexOfFirst, indexOfLast);

  // Handlers
  const handleAddNewClick = () => {
    setShowNewRow(true);
    setNewRow({
      departmentID: "",
      typeID: "",
      objectiveText: "",
      kpi: "",
      initialStatus: "",
      target: "",
      frequencyID: "",
      howToMeasure: "",
    });
  };

  const handleNewChange = ({ target: { name, value } }) => {
    setNewRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNew = async () => {
    if (
      !newRow.departmentID ||
      !newRow.typeID ||
      !newRow.objectiveText ||
      !newRow.kpi ||
      !newRow.initialStatus ||
      !newRow.target ||
      !newRow.frequencyID ||
      !newRow.howToMeasure
    ) {
      addToast("Please fill all fields", { appearance: "warning" });
      return;
    }

    if (!selectedDocument) {
      addToast("Please select a collection first", { appearance: "warning" });
      return;
    }

    try {
      await createObjective({
        collectionID: selectedDocument.keyId || selectedDocument.id,
        departmentID: parseInt(newRow.departmentID),
        typeID: parseInt(newRow.typeID),
        objectiveText: newRow.objectiveText,
        kpi: newRow.kpi,
        initialStatus: newRow.initialStatus,
        target: newRow.target,
        frequencyID: parseInt(newRow.frequencyID),
        howToMeasure: newRow.howToMeasure,
      });
      addToast("Objective created", { appearance: "success" });
      setShowNewRow(false);
      fetchObjectives();
    } catch (err) {
      addToast("Failed to create objective", { appearance: "error" });
    }
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

  const handleDoneEdit = async (row) => {
    if (!editingRowId) return;

    try {
      // Find the row to update
      const updatedRow = kpiRows.find((r) => r.id === editingRowId);
      if (updatedRow) {
        await updateObjective(editingRowId, {
          departmentID: parseInt(updatedRow.departmentID),
          typeID: parseInt(updatedRow.typeID),
          objectiveText: updatedRow.objectiveText,
          kpi: updatedRow.kpi,
          initialStatus: updatedRow.initialStatus,
          target: updatedRow.target,
          frequencyID: parseInt(updatedRow.frequencyID),
          howToMeasure: updatedRow.howToMeasure,
        });
        addToast("Objective updated", { appearance: "success" });
        fetchObjectives();
      }
    } catch (err) {
      addToast("Failed to update objective", { appearance: "error" });
    } finally {
      setEditingRowId(null);
    }
  };

  const handleCloseEdit = () => setEditingRowId(null);

  const handleDeleteRow = (id) => {
    setRowToDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!rowToDeleteId) return;
    try {
      await deleteObjective(rowToDeleteId);
      addToast("Objective deleted", { appearance: "success" });
      fetchObjectives();
    } catch (err) {
      addToast("Failed to delete objective", { appearance: "error" });
    } finally {
      setIsDeleteDialogOpen(false);
      setRowToDeleteId(null);
    }
  };

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
          Approved
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
                      <td className="py-3 px-2">{row.departmentName || row.department}</td>
                      <td className="py-3 px-2">{row.typeName || row.type}</td>
                      <td className="py-3 px-2">{row.objectiveText || row.objective}</td>
                      <td className="py-3 px-2">{row.kpi}</td>
                      <td className="py-3 px-2">{row.initialStatus}</td>
                      <td className="py-3 px-2">{row.target}</td>
                      <td className="py-3 px-2">{row.frequencyName || row.monitoringFrequency}</td>
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
                              <PencilIcon className="w-5 h-5 text-text-color" title="Edit" />
                            </div>
                            <div className="cursor-pointer" onClick={() => onView(row.id)}>
                              <EyeIcon className="w-5 h-5 text-text-color" title="View KPI Tracking" />
                            </div>
                            <div className="cursor-pointer" onClick={() => handleDeleteRow(row.id)}>
                              <TrashIcon className="w-5 h-5 text-text-color" title="Delete" />
                            </div>
                            <div className="cursor-pointer" onClick={() => setOpenActionRowId(null)}>
                              <XMarkIcon className="w-5 h-5 text-text-color" title="Close" />
                            </div>
                          </div>
                        )}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-2 w-40">
                        <FormSelect
                          name="departmentID"
                          formValues={row}
                          options={departmentOptions}
                          onChange={(e) => handleEditChange(row.id, e)}
                        />
                      </td>
                      <td className="py-3 px-2 w-40">
                        <FormSelect
                          name="typeID"
                          formValues={row}
                          options={typeOptions}
                          onChange={(e) => handleEditChange(row.id, e)}
                        />
                      </td>
                      <td className="py-3 px-2">
                        <FormTextArea name="objectiveText" formValues={{ objectiveText: row.objectiveText || row.objective }} onChange={(e) => handleEditChange(row.id, e)} />
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
                          name="frequencyID"
                          formValues={row}
                          options={frequencyOptions}
                          onChange={(e) => handleEditChange(row.id, e)}
                        />
                      </td>
                      <td className="py-3 px-2">
                        <FormTextArea name="howToMeasure" formValues={{ howToMeasure: row.howToMeasure }} onChange={(e) => handleEditChange(row.id, e)} />
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-3 items-center">
                          <div className="cursor-pointer" onClick={() => handleDoneEdit(row)}>
                            <CheckCircleIcon className="w-5 h-5 text-primary-pink" />
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
                <td className="py-3 px-2"></td>
                <td className="py-3 px-2 w-40">
                  <FormSelect
                    name="departmentID"
                    formValues={newRow}
                    options={departmentOptions}
                    onChange={handleNewChange}
                  />
                </td>
                <td className="py-3 px-2 w-40">
                  <FormSelect
                    name="typeID"
                    formValues={newRow}
                    options={typeOptions}
                    onChange={handleNewChange}
                  />
                </td>
                <td className="py-3 px-2">
                  <FormTextArea name="objectiveText" formValues={newRow} onChange={handleNewChange} />
                </td>
                <td className="py-3 px-2">
                  <FormTextArea name="kpi" formValues={newRow} onChange={handleNewChange} />
                </td>
                <td className="py-3 px-2">
                  <FormTextArea name="initialStatus" formValues={newRow} onChange={handleNewChange} />
                </td>
                <td className="py-3 px-2">
                  <FormTextArea name="target" formValues={newRow} onChange={handleNewChange} />
                </td>
                <td className="py-3 px-2 w-40">
                  <FormSelect
                    name="frequencyID"
                    formValues={newRow}
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
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this objective? This action cannot be undone."
      />
    </div>
  );
};

export default ObjectivesAndKPIsOverview;

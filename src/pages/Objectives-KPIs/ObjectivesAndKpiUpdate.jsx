import React, { useState } from 'react';
import FormTextArea from '../../components/FormTextArea.jsx';
import FormInput from '../../components/FormInput.jsx';
import FormSelect from '../../components/FormSelect.jsx';
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
import ManagementProgramsTable from './ManagementProgramsTable.jsx'

const ObjectivesAndKpiUpdate = ({ row, onBack }) => {
    const [formValues, setFormValues] = useState({
        routeCaseAnalysis: '',
        containmentAction: '',
        correctiveAction: ''
    });

    // Status dropdown options
    const statusOptions = getSelectOptions([
        { id: "Completed", name: "Completed" },
        { id: "In Progress", name: "In Progress" },
        { id: "Pending", name: "Pending" },
        { id: "Delayed", name: "Delayed" },
    ]);

    // Dummy KPI table data
    const [rows, setRows] = useState([
        { id: 1, date: "2025-01-10", target: "Increase Sales by 10%", value: "8%", status: "In Progress", comments: "Need more campaigns" },
        { id: 2, date: "2025-02-01", target: "Improve QA process", value: "Completed", status: "Completed", comments: "QA checklist finalized" },
    ]);

    const [showNewRow, setShowNewRow] = useState(false);
    const [newRow, setNewRow] = useState({ date: "", target: "", value: "", status: "", comments: "" });
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
        setNewRow({ date: "", target: "", value: "", status: "", comments: "" });
    };

    const handleNewChange = ({ target: { name, value } }) => {
        setNewRow((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveNew = () => {
        if (!newRow.date || !newRow.target || !newRow.value || !newRow.status) return;
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

    const handleDoneEdit = () => setEditingRowId(null);
    const handleCloseEdit = () => setEditingRowId(null);
    const handleDeleteRow = (id) => setRows((prev) => prev.filter((r) => r.id !== id));
    const toggleActionMenu = (id) => setOpenActionRowId((prev) => (prev === id ? null : id));

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((p) => p + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage((p) => p - 1);
    };

    const handleFormChange = (name, value) => {
        setFormValues({ ...formValues, [name]: value });
    };

    return (
        <div className="rounded-lg">
            <div className="w-full h-full text-left p-4">
                {/* Header */}
                <div className="mb-4 flex justify-between">
                    <div>
                        <button onClick={onBack} className="text-blue-600 hover:underline mb-4">←</button>
                        <span className="text-black font-semibold mt-4 block">
                            Objectives and KPIs / ...........
                        </span>
                        <div className="flex-col mt-2 text-text-color space-x-10 text-sm">
                            <span>Create Date: 2024/10/04</span>
                            <span>Created By: Nilanga Pathirana</span>
                        </div>
                    </div>
                    <div>
                        <button className="btn-primary h-10 rounded-md w-36" type="button">
                            Update
                        </button>
                    </div>
                </div>

                {/* KPI Table */}
                <div className="flex items-center gap-5 mb-3">
                    <span className="text-lg font-semibold">KPI Tracking</span>
                    <div className="flex items-center gap-1">
                        <PlusCircleIcon onClick={handleAddNewClick} className="w-6 h-6 text-pink-500 cursor-pointer" />
                        <button className="text-text-color" onClick={handleAddNewClick}>
                            Add New
                        </button>
                    </div>
                </div>

                <div className="flex-col space-y-6 bg-white h-auto rounded-lg p-4">
                    <table className="table-auto w-full border-collapse">
                        <thead>
                            <tr className="text-left text-secondary-grey border-b border-gray-200">
                                <th className="py-3 px-2 w-10">#</th>
                                <th className="py-3 px-2 text-center">Date</th>
                                <th className="py-3 px-2 text-center">Target</th>
                                <th className="py-3 px-2 text-center">Value</th>
                                <th className="py-3 px-2 text-center">Status</th>
                                <th className="py-3 px-2 text-center">Comments</th>
                                <th className="py-3 px-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {showNewRow && (
                                <tr className="border-b border-gray-200">
                                    <td className="py-3 px-2">-</td>
                                    <td className="py-3 px-2">
                                        <FormInput name="date" type="date" formValues={newRow} onChange={handleNewChange} />
                                    </td>
                                    <td className="py-3 px-2">
                                        <FormInput name="target" type="text" formValues={newRow} onChange={handleNewChange} />
                                    </td>
                                    <td className="py-3 px-2">
                                        <FormInput name="value" type="text" formValues={newRow} onChange={handleNewChange} />
                                    </td>
                                    <td className="py-3 px-2">
                                        <FormSelect name="status" options={statusOptions} formValues={newRow} onChange={handleNewChange} />
                                    </td>
                                    <td className="py-3 px-2">
                                        <FormTextArea name="comments" formValues={newRow} onChange={handleNewChange} />
                                    </td>
                                    <td className="py-3 px-2 text-center">
                                        <div className="flex gap-3 items-center justify-center">
                                            <CheckBadgeIcon onClick={handleSaveNew} className="w-5 h-5 text-pink-700 cursor-pointer" />
                                            <XMarkIcon onClick={handleCancelNew} className="w-5 h-5 text-text-color cursor-pointer" />
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {pagedRows.length === 0 && !showNewRow && (
                                <tr>
                                    <td className="py-3 px-2 text-center text-gray-500" colSpan={7}>
                                        No KPI records found
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
                                                <td className="py-3 px-2 text-center">{row.date}</td>
                                                <td className="py-3 px-2 text-center">{row.target}</td>
                                                <td className="py-3 px-2 text-center">{row.value}</td>
                                                <td className="py-3 px-2 text-center">{row.status}</td>
                                                <td className="py-3 px-2 text-center">{row.comments}</td>
                                                <td className="py-3 px-2 text-center">
                                                    {openActionRowId !== row.id ? (
                                                        <EllipsisVerticalIcon
                                                            className="w-5 h-5 text-secondary-grey cursor-pointer inline-flex"
                                                            onClick={() => toggleActionMenu(row.id)}
                                                        />
                                                    ) : (
                                                        <div className="flex justify-center gap-3">
                                                            <PencilIcon
                                                                className="w-5 h-5 text-text-color cursor-pointer"
                                                                onClick={() => handleStartEdit(row.id)}
                                                            />
                                                            <TrashIcon
                                                                className="w-5 h-5 text-text-color cursor-pointer"
                                                                onClick={() => handleDeleteRow(row.id)}
                                                            />
                                                            <XMarkIcon
                                                                className="w-5 h-5 text-text-color cursor-pointer"
                                                                onClick={() => setOpenActionRowId(null)}
                                                            />
                                                        </div>
                                                    )}
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="py-3 px-2">
                                                    <FormInput
                                                        name="date"
                                                        type="date"
                                                        formValues={row}
                                                        onChange={(e) => handleEditChange(row.id, e)}
                                                    />
                                                </td>
                                                <td className="py-3 px-2">
                                                    <FormInput
                                                        name="target"
                                                        type="text"
                                                        formValues={row}
                                                        onChange={(e) => handleEditChange(row.id, e)}
                                                    />
                                                </td>
                                                <td className="py-3 px-2">
                                                    <FormInput
                                                        name="value"
                                                        type="text"
                                                        formValues={row}
                                                        onChange={(e) => handleEditChange(row.id, e)}
                                                    />
                                                </td>
                                                <td className="py-3 px-2">
                                                    <FormSelect
                                                        name="status"
                                                        options={statusOptions}
                                                        formValues={row}
                                                        onChange={(e) => handleEditChange(row.id, e)}
                                                    />
                                                </td>
                                                <td className="py-3 px-2">
                                                    <FormTextArea
                                                        name="comments"
                                                        formValues={row}
                                                        onChange={(e) => handleEditChange(row.id, e)}
                                                    />
                                                </td>
                                                <td className="py-3 px-2 text-center">
                                                    <div className="flex justify-center gap-3 items-center">
                                                        <CheckBadgeIcon
                                                            className="w-5 h-5 text-pink-700 cursor-pointer"
                                                            onClick={handleDoneEdit}
                                                        />
                                                        <XMarkIcon
                                                            className="w-5 h-5 text-text-color cursor-pointer"
                                                            onClick={handleCloseEdit}
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

                    {/* Pagination */}
                    {rows.length > 0 && (
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

                <div className='mt-24'>
                    <ManagementProgramsTable />
                </div>


            </div>
        </div>
    );
};

export default ObjectivesAndKpiUpdate;

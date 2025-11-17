import React, { useState } from "react";
import FormTextArea from "../../../components/FormTextArea.jsx";
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

const ServiceProviderCriteria = () => {
    // Sample Description Text
    const sampleDescription = `
· Score 01 – Correct documentation, delivery conditions are very well, Service Agreement and Quality  
· Score 02 – Correct documentation, delivery conditions are very well, Service Agreement and Quality  
· Score 03 – Correct documentation, delivery conditions are very well, Service Agreement and Quality
`;

    // Dummy Data
    const [rows, setRows] = useState([
        {
            id: 1,
            criteria: "Delivery Time",
            weight: "20%",
            description: sampleDescription,
        },
        {
            id: 2,
            criteria: "Product Quality",
            weight: "40%",
            description: sampleDescription,
        },
    ]);

    const [showNewRow, setShowNewRow] = useState(false);
    const [newRow, setNewRow] = useState({
        criteria: "",
        weight: "",
        description: "",
    });

    const [editingRowId, setEditingRowId] = useState(null);
    const [openActionRowId, setOpenActionRowId] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
    const totalPages = Math.ceil(rows.length / rowsPerPage);

    const indexOfLast = currentPage * rowsPerPage;
    const indexOfFirst = indexOfLast - rowsPerPage;
    const pagedRows = rows.slice(indexOfFirst, indexOfLast);

    // Handlers
    const handleAddNew = () => {
        setShowNewRow(true);
        setNewRow({ criteria: "", weight: "", description: "" });
    };

    const handleNewChange = ({ target: { name, value } }) => {
        setNewRow((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveNew = () => {
        if (!newRow.criteria || !newRow.weight || !newRow.description) return;
        const newEntry = { id: Date.now(), ...newRow };
        setRows((prev) => [...prev, newEntry]);
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

    const handleDelete = (id) =>
        setRows((prev) => prev.filter((r) => r.id !== id));

    const toggleActionMenu = (id) =>
        setOpenActionRowId((prev) => (prev === id ? null : id));

    return (
        <div className="p-4">
            {/* Buttons */}
            <div className="flex justify-end items-center mt-4 space-x-2">
                <button className="bg-primary-pink px-8 py-3 rounded-md text-white">
                    Approved
                </button>
            </div>
            {/* Header */}
            <div className="flex items-center space-x-4 mt-5">
                <span className="text-lg font-semibold">Supplier Criteria</span>
                <div className="flex items-center gap-1">
                    <PlusCircleIcon
                        onClick={handleAddNew}
                        className="w-6 h-6 text-pink-500 cursor-pointer"
                    />
                    <button className="text-text-color" onClick={handleAddNew}>
                        Add New
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded p-3 mt-3">
                <table className="table-auto w-full border-collapse">
                    <thead>
                        <tr className="text-left text-secondary-grey border-b border-gray-200">
                            <th className="py-3 px-2 w-10">#</th>
                            <th className="py-3 px-2">Criteria</th>
                            <th className="py-3 px-2">Weight</th>
                            <th className="py-3 px-2">Description</th>
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
                                            <td className="py-3 px-2">{row.criteria}</td>
                                            <td className="py-3 px-2">{row.weight}</td>
                                            <td className="py-3 px-2 whitespace-pre-line">{row.description}</td>

                                            <td className="py-3 px-2">
                                                {openActionRowId !== row.id ? (
                                                    <div
                                                        className="cursor-pointer inline-flex"
                                                        onClick={() => toggleActionMenu(row.id)}
                                                    >
                                                        <EllipsisVerticalIcon className="w-5 h-5 text-secondary-grey" />
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-3">
                                                        <PencilIcon
                                                            onClick={() => handleStartEdit(row.id)}
                                                            className="w-5 h-5 cursor-pointer text-text-color"
                                                        />
                                                        <TrashIcon
                                                            onClick={() => handleDelete(row.id)}
                                                            className="w-5 h-5 cursor-pointer text-text-color"
                                                        />
                                                        <XMarkIcon
                                                            onClick={() => setOpenActionRowId(null)}
                                                            className="w-5 h-5 cursor-pointer text-text-color"
                                                        />
                                                    </div>
                                                )}
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            {["criteria", "weight", "description"].map((field) => (
                                                <td key={field} className="py-3 px-2">
                                                    <FormTextArea
                                                        name={field}
                                                        formValues={{ [field]: row[field] }}
                                                        onChange={(e) => handleEditChange(row.id, e)}
                                                    />
                                                </td>
                                            ))}
                                            <td className="py-3 px-2">
                                                <div className="flex gap-3">
                                                    <CheckBadgeIcon
                                                        onClick={handleDoneEdit}
                                                        className="w-5 h-5 cursor-pointer text-text-color"
                                                    />
                                                    <XMarkIcon
                                                        onClick={() => setEditingRowId(null)}
                                                        className="w-5 h-5 cursor-pointer text-text-color"
                                                    />
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

                                {["criteria", "weight", "description"].map((field) => (
                                    <td key={field} className="py-3 px-2">
                                        <FormTextArea
                                            name={field}
                                            formValues={{ [field]: newRow[field] }}
                                            onChange={handleNewChange}
                                        />
                                    </td>
                                ))}

                                <td className="py-3 px-2">
                                    <div className="flex gap-3">
                                        <CheckBadgeIcon
                                            onClick={handleSaveNew}
                                            className="w-5 h-5 cursor-pointer text-pink-700"
                                        />
                                        <XMarkIcon
                                            onClick={() => setShowNewRow(false)}
                                            className="w-5 h-5 cursor-pointer text-text-color"
                                        />
                                    </div>
                                </td>
                            </tr>
                        )}

                        {pagedRows.length === 0 && !showNewRow && (
                            <tr>
                                <td colSpan={5} className="py-3 px-2 text-center text-gray-500">
                                    No criteria found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {rows.length > 0 && (
                    <div className="w-full flex gap-5 justify-end mt-4">
                        <button
                            onClick={() => currentPage > 1 && setCurrentPage((p) => p - 1)}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-full bg-gray-200 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
                                }`}
                        >
                            <ChevronLeftIcon className="w-4 h-4 text-secondary-grey" />
                        </button>

                        <span className="text-gray-500">
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            onClick={() => currentPage < totalPages && setCurrentPage((p) => p + 1)}
                            disabled={currentPage === totalPages}
                            className={`p-2 rounded-full bg-gray-200 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
                                }`}
                        >
                            <ChevronRightIcon className="w-4 h-4 text-secondary-grey" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceProviderCriteria;

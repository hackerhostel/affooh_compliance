import React, { useState } from "react";
import FormInput from "../../components/FormInput.jsx";
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

const ManagementProgramsTable = () => {
    const statusOptions = getSelectOptions([
        { id: "To Do", name: "To Do" },
        { id: "In Progress", name: "In Progress" },
        { id: "Done", name: "Done" },
    ]);

    const assigneeOptions = getSelectOptions([
        { id: "Alice Johnson", name: "Alice Johnson" },
        { id: "Bob Smith", name: "Bob Smith" },
        { id: "Carol Lee", name: "Carol Lee" },
        { id: "David Brown", name: "David Brown" },
    ]);

    const [rows, setRows] = useState([
        {
            id: 1,
            task: "Prepare risk analysis",
            assignee: { firstName: "David", lastName: "Brown", avatar: "" },
            startDate: "2025-01-10",
            endDate: "2025-02-10",
            status: "In Progress",
        },
        {
            id: 2,
            task: "Conduct team meeting",
            assignee: { firstName: "David", lastName: "Brown", avatar: "" },
            startDate: "2025-02-01",
            endDate: "2025-02-15",
            status: "To Do",
        },
    ]);

    const [showNewRow, setShowNewRow] = useState(false);
    const [newRow, setNewRow] = useState({
        task: "",
        assignee: "",
        startDate: "",
        endDate: "",
        status: "",
    });
    const [editingRowId, setEditingRowId] = useState(null);
    const [openActionRowId, setOpenActionRowId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const rowsPerPage = 5;
    const totalPages = Math.ceil(rows.length / rowsPerPage);
    const indexOfLast = currentPage * rowsPerPage;
    const indexOfFirst = indexOfLast - rowsPerPage;
    const pagedRows = rows.slice(indexOfFirst, indexOfLast);

    const handleAddNewClick = () => {
        setShowNewRow(true);
        setNewRow({
            task: "",
            assignee: "",
            startDate: "",
            endDate: "",
            status: "",
        });
    };

    const handleNewChange = ({ target: { name, value } }) => {
        setNewRow((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveNew = () => {
        if (
            !newRow.task ||
            !newRow.assignee ||
            !newRow.startDate ||
            !newRow.endDate ||
            !newRow.status
        )
            return;

        const newEntry = { id: Date.now(), ...newRow };
        setRows((prev) => [...prev, newEntry]);
        setShowNewRow(false);
    };

    const handleCancelNew = () => setShowNewRow(false);

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
    if (!user) return <span className="text-gray-400 italic">No user</span>;
    return (
      <div className="flex items-center space-x-2">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary-pink flex items-center justify-center text-white text-sm font-semibold">
            {user.firstName?.[0]}
            {user.lastName?.[0]}
          </div>
        )}
        <span>
          {user.firstName} {user.lastName}
        </span>
      </div>
    );
  };

    return (
        <div className="mt-6">
            <div className="flex items-center gap-5">
                <span className="text-lg font-semibold">Management Programs</span>
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
                            <th className="py-3 px-4 text-center">Task</th>
                            <th className="py-3 px-4 text-center">Assignee</th>
                            <th className="py-3 px-4 text-center">Start Date</th>
                            <th className="py-3 px-4 text-center">End Date</th>
                            <th className="py-3 px-4 text-center">Status</th>
                            <th className="py-3 px-2 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {showNewRow && (
                            <tr className="border-b border-gray-200">
                                <td className="py-3 px-2">-</td>
                                <td className="py-3 px-2">
                                    <FormInput
                                        name="task"
                                        placeholder="Enter task"
                                        formValues={{ task: newRow.task }}
                                        onChange={handleNewChange}
                                    />
                                </td>
                                <td className="py-3 px-2">
                                    <FormSelect
                                        name="assignee"
                                        formValues={{ assignee: newRow.assignee }}
                                        options={assigneeOptions}
                                        onChange={handleNewChange}
                                    />
                                </td>
                                <td className="py-3 px-2">
                                    <FormInput
                                        name="startDate"
                                        type="date"
                                        formValues={{ startDate: newRow.startDate }}
                                        onChange={handleNewChange}
                                    />
                                </td>
                                <td className="py-3 px-2">
                                    <FormInput
                                        name="endDate"
                                        type="date"
                                        formValues={{ endDate: newRow.endDate }}
                                        onChange={handleNewChange}
                                    />
                                </td>
                                <td className="py-3 px-2">
                                    <FormSelect
                                        name="status"
                                        formValues={{ status: newRow.status }}
                                        options={statusOptions}
                                        onChange={handleNewChange}
                                    />
                                </td>
                                <td className="py-3 px-2 text-center">
                                    <div className="flex gap-3 justify-center">
                                        <CheckBadgeIcon
                                            onClick={handleSaveNew}
                                            className="w-5 h-5 text-pink-700 cursor-pointer"
                                        />
                                        <XMarkIcon
                                            onClick={handleCancelNew}
                                            className="w-5 h-5 text-gray-500 cursor-pointer"
                                        />
                                    </div>
                                </td>
                            </tr>
                        )}

                        {pagedRows.length === 0 && !showNewRow && (
                            <tr>
                                <td colSpan={7} className="text-center text-gray-500 py-3">
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
                                            <td className="text-center">{row.task}</td>
                                            <td className="text-center">{renderUserCell(row.assignee)}</td>
                                            <td className="text-center">{row.startDate}</td>
                                            <td className="text-center">{row.endDate}</td>
                                            <td className="text-center">{row.status}</td>
                                            <td className="text-center">
                                                {openActionRowId !== row.id ? (
                                                    <EllipsisVerticalIcon
                                                        className="w-5 h-5 text-gray-500 cursor-pointer inline-flex"
                                                        onClick={() => toggleActionMenu(row.id)}
                                                    />
                                                ) : (
                                                    <div className="flex justify-center gap-3">
                                                        <PencilIcon
                                                            className="w-5 h-5 text-gray-600 cursor-pointer"
                                                            onClick={() => handleStartEdit(row.id)}
                                                        />
                                                        <TrashIcon
                                                            className="w-5 h-5 text-gray-600 cursor-pointer"
                                                            onClick={() => handleDeleteRow(row.id)}
                                                        />
                                                        <XMarkIcon
                                                            className="w-5 h-5 text-gray-600 cursor-pointer"
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
                                                    name="task"
                                                    formValues={{ task: row.task }}
                                                    onChange={(e) => handleEditChange(row.id, e)}
                                                />
                                            </td>
                                            <td className="py-3 px-2">
                                                <FormSelect
                                                    name="assignee"
                                                    formValues={{ assignee: row.assignee }}
                                                    options={assigneeOptions}
                                                    onChange={(e) => handleEditChange(row.id, e)}
                                                />
                                            </td>
                                            <td className="py-3 px-2">
                                                <FormInput
                                                    name="startDate"
                                                    type="date"
                                                    formValues={{ startDate: row.startDate }}
                                                    onChange={(e) => handleEditChange(row.id, e)}
                                                />
                                            </td>
                                            <td className="py-3 px-2">
                                                <FormInput
                                                    name="endDate"
                                                    type="date"
                                                    formValues={{ endDate: row.endDate }}
                                                    onChange={(e) => handleEditChange(row.id, e)}
                                                />
                                            </td>
                                            <td className="py-3 px-2">
                                                <FormSelect
                                                    name="status"
                                                    formValues={{ status: row.status }}
                                                    options={statusOptions}
                                                    onChange={(e) => handleEditChange(row.id, e)}
                                                />
                                            </td>
                                            <td className="text-center">
                                                <div className="flex justify-center gap-3">
                                                    <CheckBadgeIcon
                                                        className="w-5 h-5 text-pink-600 cursor-pointer"
                                                        onClick={handleDoneEdit}
                                                    />
                                                    <XMarkIcon
                                                        className="w-5 h-5 text-gray-500 cursor-pointer"
                                                        onClick={handleCloseEdit}
                                                    />
                                                </div>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            );
                        })}

                        <tr className="border-t border-gray-200 ">
                            
                            <td colSpan={7} className="py-3 px-2 text-center">
                                <FormSelect
                                    name="assignee"
                                    formValues={{ assignee: newRow.assignee }}
                                    options={assigneeOptions}
                                    onChange={handleNewChange}
                                />
                            </td>
                        </tr>
                    </tbody>


                </table>

                {rows.length > 0 && (
                    <div className="flex justify-end items-center gap-4 mt-4">
                        <button
                            onClick={handlePreviousPage}
                            className={`p-2 rounded-full bg-gray-200 ${currentPage === 1
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-gray-300"
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
                            className={`p-2 rounded-full bg-gray-200 ${currentPage === totalPages
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-gray-300"
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

export default ManagementProgramsTable;

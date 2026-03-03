import React, { useState, useEffect } from "react";
import {
    ChevronLeftIcon,
    PlusCircleIcon,
    EllipsisVerticalIcon,
    CheckCircleIcon,
    XMarkIcon,
    TrashIcon,
    PencilIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useToasts } from "react-toast-notifications";
import moment from "moment";
import { useSelector } from "react-redux";
import { selectSelectedProject } from "../../state/slice/projectSlice.js";
import {
    getObjectiveDetails,
    getObjectiveKPIs,
    createObjectiveKPI,
    updateObjectiveKPI,
    deleteObjectiveKPI,
    getLinkedObjectiveTasks,
    linkObjectiveTask,
    unlinkObjectiveTask,
} from "../../utils/objectiveApi.js";
import FormInput from "../../components/FormInput.jsx";
import FormSelect from "../../components/FormSelect.jsx";
import FormTextArea from "../../components/FormTextArea.jsx";
import ConfirmationDialog from "../../components/ConfirmationDialog.jsx";
import Modal from "../../components/Modal.jsx";
import { getAvailableTasks } from "../../utils/objectiveApi.js";

const ObjectiveDetailView = ({ objectiveId, onBack }) => {
    const { addToast } = useToasts();
    const [objective, setObjective] = useState(null);
    const [kpis, setKpis] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // States for new KPI
    const [showNewKpi, setShowNewKpi] = useState(false);
    const [newKpi, setNewKpi] = useState({
        date: moment().format("YYYY-MM-DD"),
        target: "",
        value: "",
        statusID: 1, // Default to 'To Do' ID
        comments: "",
    });

    // States for Management Programs
    const [showLinkTaskModal, setShowLinkTaskModal] = useState(false);
    const [availableTasks, setAvailableTasks] = useState([]);
    const [taskSearch, setTaskSearch] = useState("");
    const [isLinking, setIsLinking] = useState(false);
    const selectedProject = useSelector(selectSelectedProject);

    // State for actions
    const [openActionRowId, setOpenActionRowId] = useState(null);
    const [openTaskActionRowId, setOpenTaskActionRowId] = useState(null);
    const [editingKpiId, setEditingKpiId] = useState(null);
    const [editingKpiData, setEditingKpiData] = useState({});

    // State for delete confirmation
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteItem, setDeleteItem] = useState({ id: null, type: null }); // type: 'kpi' or 'task'

    const fetchData = async () => {
        setLoading(true);
        try {
            const [objData, kpiData, taskData] = await Promise.all([
                getObjectiveDetails(objectiveId),
                getObjectiveKPIs(objectiveId),
                getLinkedObjectiveTasks(objectiveId),
            ]);
            const normalizedTasks = taskData.map(t => {
                // The API can return the task object in various nested formats
                const taskObj = t.task || t.Task || t.taskDetail || t.task_detail || t;
                const attributes = taskObj.attributes || {};

                // 1. Assignee Extraction
                let assigneeName = "Unassigned";
                const rawAssignee = taskObj.assignee || t.assignee || taskObj.User || t.User;

                if (rawAssignee) {
                    if (typeof rawAssignee === 'string') {
                        assigneeName = rawAssignee;
                    } else if (rawAssignee.firstName) {
                        assigneeName = `${rawAssignee.firstName} ${rawAssignee.lastName || ""}`.trim();
                    } else if (rawAssignee.name) {
                        assigneeName = rawAssignee.name;
                    }
                } else if (t.firstName || taskObj.firstName || t.assigneeFirstName || taskObj.assigneeFirstName) {
                    const fname = t.firstName || taskObj.firstName || t.assigneeFirstName || taskObj.assigneeFirstName;
                    const lname = t.lastName || taskObj.lastName || t.assigneeLastName || taskObj.assigneeLastName || "";
                    assigneeName = `${fname} ${lname}`.trim();
                }

                // 2. Dates and Status Extraction - Backend now returns these directly
                const startDate = t.start_date || taskObj.start_date || taskObj.startDate || attributes.startDate?.value || t.startDate;
                const endDate = t.end_date || taskObj.end_date || taskObj.endDate || attributes.endDate?.value || t.endDate;
                const status = t.status || taskObj.status || attributes.status?.value || taskObj.status_name || taskObj.statusName || t.status_name || t.statusName || "N/A";

                return {
                    ...t,
                    id: t.taskId || t.id || taskObj.id,
                    code: t.task_key || t.taskCodeString || taskObj.code || t.taskCode || t.code || "N/A",
                    name: t.taskName || taskObj.name || t.task_name || t.name || t.title || "N/A",
                    assignee: assigneeName,
                    startDate: startDate,
                    endDate: endDate,
                    status: status
                };
            });
            setObjective(objData);
            setKpis(kpiData);
            setTasks(normalizedTasks);
        } catch (err) {
            addToast("Failed to fetch objective details", { appearance: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (objectiveId) fetchData();
    }, [objectiveId]);

    const handleAddKpi = async () => {
        if (!newKpi.target || !newKpi.value) {
            addToast("Please fill target and value", { appearance: "warning" });
            return;
        }
        try {
            await createObjectiveKPI(objectiveId, {
                trackDate: newKpi.date,
                target: newKpi.target,
                value: newKpi.value,
                statusID: newKpi.statusID,
                comments: newKpi.comments,
            });
            addToast("KPI added", { appearance: "success" });
            setShowNewKpi(false);
            fetchData();
        } catch (err) {
            addToast("Failed to add KPI", { appearance: "error" });
        }
    };

    const handleStartEdit = (kpi) => {
        setEditingKpiId(kpi.id);
        setEditingKpiData({
            trackDate: moment(kpi.trackDate).format("YYYY-MM-DD"),
            target: kpi.target,
            value: kpi.value,
            statusID: kpi.statusID,
            comments: kpi.comments,
        });
        setOpenActionRowId(null);
    };

    const handleCancelEdit = () => {
        setEditingKpiId(null);
        setEditingKpiData({});
    };

    const handleSaveEdit = async () => {
        try {
            await updateObjectiveKPI(objectiveId, editingKpiId, editingKpiData);
            addToast("KPI updated", { appearance: "success" });
            setEditingKpiId(null);
            fetchData();
        } catch (err) {
            addToast("Failed to update KPI", { appearance: "error" });
        }
    };

    const handleDeleteKpi = (id) => {
        setDeleteItem({ id, type: "kpi" });
        setIsDeleteDialogOpen(true);
    };

    const handleUnlinkTask = (id) => {
        setDeleteItem({ id, type: "task" });
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            if (deleteItem.type === "kpi") {
                await deleteObjectiveKPI(objectiveId, deleteItem.id);
                addToast("KPI deleted", { appearance: "success" });
            } else if (deleteItem.type === "task") {
                await unlinkObjectiveTask(objectiveId, deleteItem.id);
                addToast("Task unlinked", { appearance: "success" });
            }
            fetchData();
        } catch (err) {
            addToast(`Failed to delete ${deleteItem.type}`, { appearance: "error" });
        } finally {
            setIsDeleteDialogOpen(false);
        }
    };

    const handleOpenLinkModal = async () => {
        setShowLinkTaskModal(true);
        try {
            const data = await getAvailableTasks(selectedProject?.id);
            // Filter out already linked tasks
            const linkedTaskIds = tasks.map(t => t.taskId);
            const filtered = data.filter(t => !linkedTaskIds.includes(t.id));
            setAvailableTasks(filtered);
        } catch (err) {
            addToast("Failed to fetch tasks", { appearance: "error" });
        }
    };

    const handleLinkTaskAction = async (taskId) => {
        setIsLinking(true);
        try {
            await linkObjectiveTask(objectiveId, taskId);
            addToast("Task linked successfully", { appearance: "success" });
            setShowLinkTaskModal(false);
            fetchData();
        } catch (err) {
            addToast("Failed to link task", { appearance: "error" });
        } finally {
            setIsLinking(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading details...</div>;
    if (!objective) return <div className="p-8 text-center text-gray-500">Objective not found.</div>;

    return (
        <div className="flex flex-col gap-6 p-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-gray-200 pb-4 px-2">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-gray-900 font-bold text-xl mb-1">
                        <ChevronLeftIcon
                            onClick={onBack}
                            className="w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-900 transition mr-1"
                        />
                        <span
                            onClick={onBack}
                            className="text-gray-400 font-normal cursor-pointer hover:text-gray-600 transition"
                        >
                            Objectives and KPIs
                        </span>
                        <span className="text-gray-400 font-normal">/</span>
                        <span className="text-gray-900">{objective.objectiveText}</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-500 ml-9">
                        <span>
                            Created Date :{" "}
                            {objective.createdAt ? moment(objective.createdAt).format("Do MMMM YYYY") : "-"}
                        </span>
                        <span>Created By : Scott Wagon</span>
                    </div>
                </div>
                <button
                    onClick={onBack}
                    className="bg-primary-pink text-white px-8 py-2 rounded-md hover:bg-pink-700 transition font-medium"
                >
                    Update
                </button>
            </div>

            {/* KPI Tracking */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-5 mb-6">
                    <h5 className="text-sm font-bold text-gray-900">KPI Tracking</h5>
                    <div
                        className="flex items-center gap-2 cursor-pointer text-pink-600 hover:text-pink-700"
                        onClick={() => setShowNewKpi(true)}
                    >
                        <PlusCircleIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">Add New</span>
                    </div>
                </div>

                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="text-gray-400 border-b border-gray-100 uppercase tracking-wider">
                            <th className="pb-3 px-4 font-normal">Date</th>
                            <th className="pb-3 px-4 font-normal">Target</th>
                            <th className="pb-3 px-4 font-normal">Value</th>
                            <th className="pb-3 px-4 font-normal">Status</th>
                            <th className="pb-3 px-4 font-normal">Comments</th>
                            <th className="pb-3 px-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {kpis.map((kpi) => (
                            <tr key={kpi.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                {editingKpiId === kpi.id ? (
                                    <>
                                        <td className="py-2 px-2">
                                            <FormInput
                                                type="date"
                                                name="trackDate"
                                                showLabel={false}
                                                formValues={editingKpiData}
                                                onChange={(e) => setEditingKpiData({ ...editingKpiData, trackDate: e.target.value })}
                                                className="!p-2 !shadow-none text-sm"
                                            />
                                        </td>
                                        <td className="py-2 px-2">
                                            <FormInput
                                                placeholder="Target"
                                                name="target"
                                                showLabel={false}
                                                formValues={editingKpiData}
                                                onChange={(e) => setEditingKpiData({ ...editingKpiData, target: e.target.value })}
                                                className="!p-2 !shadow-none text-sm"
                                            />
                                        </td>
                                        <td className="py-2 px-2">
                                            <FormInput
                                                placeholder="Value"
                                                name="value"
                                                showLabel={false}
                                                formValues={editingKpiData}
                                                onChange={(e) => setEditingKpiData({ ...editingKpiData, value: e.target.value })}
                                                className="!p-2 !shadow-none text-sm"
                                            />
                                        </td>
                                        <td className="py-2 px-2">
                                            <FormSelect
                                                name="statusID"
                                                showLabel={false}
                                                formValues={editingKpiData}
                                                options={[
                                                    { value: 1, label: "To Do" },
                                                    { value: 2, label: "In Progress" },
                                                    { value: 3, label: "Done" },
                                                ]}
                                                onChange={(e) => setEditingKpiData({ ...editingKpiData, statusID: parseInt(e.target.value) })}
                                                className="!p-2 !shadow-none text-sm"
                                            />
                                        </td>
                                        <td className="py-2 px-2">
                                            <FormInput
                                                name="comments"
                                                showLabel={false}
                                                formValues={editingKpiData}
                                                placeholder="Comments..."
                                                onChange={(e) => setEditingKpiData({ ...editingKpiData, comments: e.target.value })}
                                                className="!p-2 !shadow-none text-sm"
                                            />
                                        </td>
                                        <td className="py-2 px-2 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <CheckCircleIcon
                                                    className="w-7 h-7 text-primary-pink cursor-pointer hover:text-pink-700 transition"
                                                    onClick={handleSaveEdit}
                                                />
                                                <XMarkIcon
                                                    className="w-7 h-7 text-gray-400 cursor-pointer hover:text-gray-600 transition"
                                                    onClick={handleCancelEdit}
                                                />
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="py-4 px-4">{moment(kpi.trackDate).format("DD - MMM")}</td>
                                        <td className="py-4 px-4">{kpi.target}</td>
                                        <td className="py-4 px-4">{kpi.value}</td>
                                        <td className="py-4 px-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${kpi.statusName === "Done"
                                                    ? "bg-green-100 text-green-700"
                                                    : kpi.statusName === "In Progress"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-gray-100 text-gray-600"
                                                    }`}
                                            >
                                                {kpi.statusName}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-gray-500 italic max-w-xs truncate">{kpi.comments}</td>
                                        <td className="py-2 px-4 text-center">
                                            <div className="flex items-center justify-center min-w-[100px]">
                                                {openActionRowId === kpi.id ? (
                                                    <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-md border border-gray-100 shadow-sm animate-in fade-in zoom-in duration-200">
                                                        <PencilIcon
                                                            className="w-5 h-5 text-blue-500 cursor-pointer hover:text-blue-700 transition"
                                                            onClick={() => handleStartEdit(kpi)}
                                                        />
                                                        <TrashIcon
                                                            className="w-5 h-5 text-pink-600 cursor-pointer hover:text-pink-800 transition"
                                                            onClick={() => handleDeleteKpi(kpi.id)}
                                                        />
                                                        <XMarkIcon
                                                            className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600 transition"
                                                            onClick={() => setOpenActionRowId(null)}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="cursor-pointer p-1 hover:bg-gray-100 rounded-full transition"
                                                        onClick={() => setOpenActionRowId(kpi.id)}
                                                    >
                                                        <EllipsisVerticalIcon className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}

                        {showNewKpi && (
                            <tr className="bg-pink-50/10 border-b border-pink-100">
                                <td className="py-2 px-2">
                                    <FormInput
                                        type="date"
                                        name="date"
                                        showLabel={false}
                                        formValues={newKpi}
                                        onChange={(e) => setNewKpi({ ...newKpi, date: e.target.value })}
                                        className="!p-2 !shadow-none text-sm"
                                    />
                                </td>
                                <td className="py-2 px-2">
                                    <FormInput
                                        placeholder="Target"
                                        name="target"
                                        showLabel={false}
                                        formValues={newKpi}
                                        onChange={(e) => setNewKpi({ ...newKpi, target: e.target.value })}
                                        className="!p-2 !shadow-none text-sm"
                                    />
                                </td>
                                <td className="py-2 px-2">
                                    <FormInput
                                        placeholder="Value"
                                        name="value"
                                        showLabel={false}
                                        formValues={newKpi}
                                        onChange={(e) => setNewKpi({ ...newKpi, value: e.target.value })}
                                        className="!p-2 !shadow-none text-sm"
                                    />
                                </td>
                                <td className="py-2 px-2">
                                    <FormSelect
                                        name="statusID"
                                        showLabel={false}
                                        formValues={newKpi}
                                        options={[
                                            { value: 1, label: "To Do" },
                                            { value: 2, label: "In Progress" },
                                            { value: 3, label: "Done" },
                                        ]}
                                        onChange={(e) => setNewKpi({ ...newKpi, statusID: parseInt(e.target.value) })}
                                        className="!p-2 !shadow-none text-sm"
                                    />
                                </td>
                                <td className="py-2 px-2">
                                    <FormInput
                                        name="comments"
                                        showLabel={false}
                                        formValues={newKpi}
                                        placeholder="Comments..."
                                        onChange={(e) => setNewKpi({ ...newKpi, comments: e.target.value })}
                                        className="!p-2 !shadow-none text-sm"
                                    />
                                </td>
                                <td className="py-2 px-2">
                                    <div className="flex items-center gap-2">
                                        <CheckCircleIcon
                                            className="w-7 h-7 text-primary-pink cursor-pointer hover:text-pink-700 transition"
                                            onClick={handleAddKpi}
                                        />
                                        <XMarkIcon
                                            className="w-7 h-7 text-gray-400 cursor-pointer hover:text-gray-600 transition"
                                            onClick={() => setShowNewKpi(false)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        )}

                        {kpis.length === 0 && !showNewKpi && (
                            <tr>
                                <td colSpan={6} className="py-12 text-center text-gray-400 italic">
                                    No KPI tracking data available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Management Programs */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-5 mb-6">
                    <h5 className="text-sm font-bold text-gray-900">Management Programs</h5>
                    <div
                        className="flex items-center gap-2 cursor-pointer text-pink-600 hover:text-pink-700 transition"
                        onClick={handleOpenLinkModal}
                    >
                        <PlusCircleIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">Add New</span>
                    </div>
                </div>

                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="text-gray-400 border-b border-gray-100 uppercase tracking-wider">
                            <th className="pb-3 px-4 font-normal">Key</th>
                            <th className="pb-3 px-4 font-normal">Task</th>
                            <th className="pb-3 px-4 font-normal">Assigned</th>
                            <th className="pb-3 px-4 font-normal">Start Date</th>
                            <th className="pb-3 px-4 font-normal">End Date</th>
                            <th className="pb-3 px-4 font-normal">Status</th>
                            <th className="pb-3 px-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                            <tr key={task.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                <td className="py-4 px-4 font-medium text-gray-900">{task.code || task.id}</td>
                                <td className="py-4 px-4">{task.name}</td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 text-xs font-bold">
                                            {(task.assignee && task.assignee !== "Unassigned") ? task.assignee[0] : "U"}
                                        </div>
                                        <span>{task.assignee}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4">{task.startDate ? moment(task.startDate).format("DD-MMM") : "-"}</td>
                                <td className="py-4 px-4">{task.endDate ? moment(task.endDate).format("DD-MMM") : "-"}</td>
                                <td className="py-4 px-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${task.status === "Done" ? "bg-green-100 text-green-700" :
                                        task.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                                            "bg-gray-100 text-gray-600"
                                        }`}>
                                        {task.status}
                                    </span>
                                </td>
                                <td className="py-2 px-4 text-center">
                                    <div className="flex items-center justify-center min-w-[100px]">
                                        {openTaskActionRowId === task.id ? (
                                            <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-md border border-gray-100 shadow-sm animate-in fade-in zoom-in duration-200">
                                                <TrashIcon
                                                    className="w-5 h-5 text-pink-600 cursor-pointer hover:text-pink-800 transition"
                                                    onClick={() => handleUnlinkTask(task.taskId)}
                                                />
                                                <XMarkIcon
                                                    className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600 transition"
                                                    onClick={() => setOpenTaskActionRowId(null)}
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                className="cursor-pointer p-1 hover:bg-gray-100 rounded-full transition"
                                                onClick={() => setOpenTaskActionRowId(task.id)}
                                            >
                                                <EllipsisVerticalIcon className="w-6 h-6 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {tasks.length === 0 && (
                            <tr>
                                <td colSpan={7} className="py-12 text-center text-gray-400 italic">
                                    No management programs linked.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <ConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                message={`Are you sure you want to delete this ${deleteItem.type}?`}
            />

            {/* Link Task Modal */}
            <Modal
                isOpen={showLinkTaskModal}
                onClose={() => setShowLinkTaskModal(false)}
                title=""
            >
                <div className="flex flex-col gap-4">
                    <h4 className="text-md font-bold text-gray-900">Link Management Program</h4>
                    <p className="text-sm text-gray-500 -mt-2">Select a task from the list to link it as a management program for this objective.</p>

                    <div className="relative mt-2">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            value={taskSearch}
                            onChange={(e) => setTaskSearch(e.target.value)}
                        />
                    </div>

                    <div className="max-h-60 overflow-y-auto border border-gray-100 rounded-lg divide-y divide-gray-100">
                        {availableTasks
                            .filter(t => t.name.toLowerCase().includes(taskSearch.toLowerCase()) || t.code.toLowerCase().includes(taskSearch.toLowerCase()))
                            .map((task) => (
                                <div
                                    key={task.id}
                                    className="p-3 hover:bg-pink-50 flex justify-between items-center group cursor-pointer transition"
                                    onClick={() => handleLinkTaskAction(task.id)}
                                >
                                    <div>
                                        <div className="text-xs font-bold text-pink-600">{task.code}</div>
                                        <div className="text-sm text-gray-900 font-medium">{task.name}</div>
                                    </div>
                                    <button
                                        className="text-xs bg-white border border-pink-200 text-pink-600 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-pink-600 hover:text-white"
                                        disabled={isLinking}
                                    >
                                        Link
                                    </button>
                                </div>
                            ))
                        }
                        {availableTasks.length === 0 && (
                            <div className="p-8 text-center text-gray-400 text-sm">No available tasks found.</div>
                        )}
                    </div>

                    <div className="flex justify-end mt-2">
                        <button
                            onClick={() => setShowLinkTaskModal(false)}
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ObjectiveDetailView;

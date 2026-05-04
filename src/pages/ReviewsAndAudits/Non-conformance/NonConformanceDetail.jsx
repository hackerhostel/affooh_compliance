import { useState, useEffect } from "react";
import FormTextArea from "../../../components/FormTextArea.jsx";
import FormSelect from "../../../components/FormSelect.jsx";
import { reviewAuditApi } from "../../../utils/reviewAuditApi.js";
import { useToasts } from "react-toast-notifications";
import { useSelector } from "react-redux";
import axios from "axios";
import { selectSelectedProject } from "../../../state/slice/projectSlice.js";
import {
    PlusIcon,
    XMarkIcon,
    CheckCircleIcon,
    PencilIcon,
    TrashIcon,
    ArrowLeftIcon
} from "@heroicons/react/24/outline";
import ConfirmationDialog from "../../../components/ConfirmationDialog.jsx";

const NonConformanceDetail = ({ evaluationId, onBack }) => {
    const { addToast } = useToasts();
    const selectedProject = useSelector(selectSelectedProject);

    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        rootCause: "",
        containmentAction: "",
        correctiveAction: ""
    });

    const [tasks, setTasks] = useState([]);
    const [projectTasks, setProjectTasks] = useState([]);
    const [selectedTaskId, setSelectedTaskId] = useState("");
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [taskToDeleteId, setTaskToDeleteId] = useState(null);

    useEffect(() => {
        fetchDetail();
        if (selectedProject?.id) {
            fetchProjectTasks();
        }
    }, [evaluationId, selectedProject]);

    const fetchDetail = async () => {
        setLoading(true);
        try {
            const res = await reviewAuditApi.getNonConformanceDetail(evaluationId);
            const data = res.data?.body;
            setDetail(data);
            if (data) {
                setFormData({
                    rootCause: data.rootCause || "",
                    containmentAction: data.containmentAction || "",
                    correctiveAction: data.correctiveAction || ""
                });
                setTasks(data.tasks || []);
            }
        } catch (e) {
            addToast("Failed to fetch detail", { appearance: "error" });
        } finally {
            setLoading(false);
        }
    };

    const fetchProjectTasks = async () => {
        try {
            const res = await axios.get(`/tasks/by-project/${selectedProject.id}`);
            const body = res.data?.body;
            setProjectTasks(Array.isArray(body) ? body : (body?.data ?? body?.tasks ?? []));
        } catch (e) {
            // ignore
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await reviewAuditApi.updateNonConformance(evaluationId, formData);
            addToast("Non conformance details saved successfully", { appearance: "success" });
        } catch (e) {
            addToast("Failed to save", { appearance: "error" });
        } finally {
            setSaving(false);
        }
    };

    const handleLinkTask = async () => {
        if (!selectedTaskId) {
            addToast("Please select a task", { appearance: "warning" });
            return;
        }
        try {
            await reviewAuditApi.linkTaskToEvaluation(evaluationId, { taskId: selectedTaskId });
            addToast("Task linked successfully", { appearance: "success" });
            setSelectedTaskId("");
            setIsAddingTask(false);
            fetchDetail();
        } catch (e) {
            addToast("Failed to link task", { appearance: "error" });
        }
    };

    const handleCancelAdd = () => {
        setIsAddingTask(false);
        setSelectedTaskId("");
    };

    const handleDeleteTask = (taskId) => {
        setTaskToDeleteId(taskId);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDeleteTask = async () => {
        if (!taskToDeleteId) return;
        try {
            await reviewAuditApi.unlinkTaskFromEvaluation(evaluationId, taskToDeleteId);
            addToast("Task unlinked successfully", { appearance: "success" });
            fetchDetail();
        } catch (e) {
            addToast("Failed to unlink task", { appearance: "error" });
        } finally {
            setIsDeleteDialogOpen(false);
            setTaskToDeleteId(null);
        }
    };

    if (loading || !detail) return <div className="p-10 text-gray-500 font-medium">Loading details...</div>;

    const ownerName = [detail.ownerFirstName, detail.ownerLastName].filter(Boolean).join(" ") || "N/A";

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header section */}
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30 rounded-t-3xl">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-white rounded-full transition-all text-gray-400 hover:text-gray-600 shadow-sm"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                            <span>Non Conformance</span>
                            <span>/</span>
                            <span className="text-gray-900 font-bold"># NCR-{detail.evaluationId}</span>
                        </div>
                        <div className="flex gap-6 mt-1 text-[11px] font-bold uppercase tracking-wider">
                            <div className="flex gap-2 items-center">
                                <span className="text-gray-400">Created Date :</span>
                                <span className="text-gray-600">{detail.createdAt ? new Date(detail.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <span className="text-gray-400">Created By :</span>
                                <span className="text-gray-600">{ownerName}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-primary-pink text-white px-10 py-3 rounded-xl font-bold shadow-lg hover:bg-pink-600 transition-all active:scale-95 shadow-pink-100 uppercase tracking-widest text-xs disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Update"}
                    </button>
                </div>
            </div>

            {/* Info Cards */}
            <div className="p-10 grid grid-cols-4 gap-6">
                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-50">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">NCR No</p>
                    <p className="text-lg font-bold text-gray-800">NCR-{detail.evaluationId}</p>
                </div>
                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-50">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Source</p>
                    <p className="text-lg font-bold text-gray-800">{detail.source || detail.standardType || "N/A"}</p>
                </div>
                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-50">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Clause No</p>
                    <p className="text-lg font-bold text-gray-800">{detail.clauseReference || "N/A"}</p>
                </div>
                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-50">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Severity</p>
                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${detail.severity === 'Major' ? 'bg-red-100 text-red-600' :
                            detail.severity === 'Minor' ? 'bg-orange-100 text-orange-600' :
                                'bg-blue-100 text-blue-600'
                        }`}>
                        {detail.severity || "N/A"}
                    </span>
                </div>
            </div>

            {/* Content Sections */}
            <div className="px-10 space-y-8 max-w-7xl">
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Description of NC</label>
                    <div className="bg-gray-50/30 border border-gray-100 rounded-2xl p-6 text-gray-600 text-sm leading-relaxed">
                        {detail.descriptionOfNC || detail.controlDescription || "N/A"}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Root Cause Analysis</label>
                    <textarea
                        className="w-full bg-white border border-gray-200 rounded-2xl p-5 text-base h-32 focus:ring-4 focus:ring-primary-pink/10 focus:border-primary-pink outline-none shadow-sm resize-none transition-all leading-relaxed"
                        value={formData.rootCause}
                        onChange={(e) => setFormData({ ...formData, rootCause: e.target.value })}
                        placeholder="Describe the root cause..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Containment Action</label>
                    <textarea
                        className="w-full bg-white border border-gray-200 rounded-2xl p-5 text-base h-32 focus:ring-4 focus:ring-primary-pink/10 focus:border-primary-pink outline-none shadow-sm resize-none transition-all leading-relaxed"
                        value={formData.containmentAction}
                        onChange={(e) => setFormData({ ...formData, containmentAction: e.target.value })}
                        placeholder="Describe the containment action..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Corrective Action</label>
                    <textarea
                        className="w-full bg-white border border-gray-200 rounded-2xl p-5 text-base h-32 focus:ring-4 focus:ring-primary-pink/10 focus:border-primary-pink outline-none shadow-sm resize-none transition-all leading-relaxed"
                        value={formData.correctiveAction}
                        onChange={(e) => setFormData({ ...formData, correctiveAction: e.target.value })}
                        placeholder="Describe the corrective action..."
                    />
                </div>
            </div>

            {/* Tasks section */}
            <div className="p-10 border-t border-gray-100 mt-10">
                <div className="flex items-center gap-4 mb-8">
                    <h5 className="text-2xl font-bold text-gray-800">Tasks</h5>
                    <button
                        onClick={() => setIsAddingTask(true)}
                        className="flex items-center gap-1.5 text-primary-pink hover:text-pink-600 transition-colors group"
                    >
                        <div className="w-6 h-6 rounded-full border-2 border-primary-pink flex items-center justify-center group-hover:bg-primary-pink group-hover:text-white transition-all">
                            <PlusIcon className="w-3.5 h-3.5 stroke-[3px]" />
                        </div>
                        <span className="font-bold text-xs uppercase tracking-wider">Add New</span>
                    </button>
                </div>

                {/* Tasks table */}
                <div className="overflow-hidden border border-gray-100 rounded-3xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                                <th className="px-6 py-5 w-20">#</th>
                                <th className="px-6 py-5">Task Name</th>
                                <th className="px-6 py-5 w-32">Status</th>
                                <th className="px-6 py-5">Assignee</th>
                                <th className="px-6 py-5 w-32">Due</th>
                                <th className="px-6 py-5 w-32 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {tasks.map((t, idx) => (
                                <tr key={t.taskID || idx} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-6 py-6 font-bold text-gray-400 text-sm">{(idx + 1).toString().padStart(2, '0')}</td>
                                    <td className="px-6 py-6 text-sm text-blue-600 font-medium">
                                        Task #{t.taskID} - {t.title || "Linked Task"}
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${t.status === 'Done' ? 'bg-emerald-100 text-emerald-600' :
                                                t.status === 'In Progress' ? 'bg-blue-100 text-blue-600' :
                                                    'bg-gray-100 text-gray-600'
                                            }`}>
                                            {t.status || "—"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 text-sm text-gray-600 font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-500 font-bold uppercase">
                                                {([t.assigneeFirstName, t.assigneeLastName].filter(Boolean).join(" ") || "U")[0]}
                                            </div>
                                            {[t.assigneeFirstName, t.assigneeLastName].filter(Boolean).join(" ") || "—"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-sm text-gray-500 font-medium whitespace-nowrap">
                                        {t.dueDate ? new Date(t.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : "—"}
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button 
                                                onClick={() => handleDeleteTask(t.taskID)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                                                title="Unlink Task"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {/* Inline Add Row */}
                            {isAddingTask && (
                                <tr className="bg-gray-50/20">
                                    <td className="px-6 py-6 font-bold text-gray-300 text-sm">{(tasks.length + 1).toString().padStart(2, '0')}</td>
                                    <td className="px-6 py-6" colSpan={4}>
                                        <select
                                            className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 focus:ring-2 focus:ring-primary-pink/20 outline-none w-full"
                                            value={selectedTaskId}
                                            onChange={(e) => setSelectedTaskId(e.target.value)}
                                        >
                                            <option value="">Select a task to link...</option>
                                            {projectTasks.filter(pt => !tasks.some(t => String(t.taskID) === String(pt.id))).map(t => (
                                                <option key={t.id} value={t.id}>#{t.id} - {t.title || t.name}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={handleLinkTask}
                                                className="p-1.5 text-white bg-primary-pink hover:bg-pink-600 rounded transition-all"
                                                title="Save"
                                            >
                                                <CheckCircleIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={handleCancelAdd}
                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                                                title="Cancel"
                                            >
                                                <XMarkIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {!isAddingTask && tasks.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-gray-400 text-sm italic">
                                        No tasks linked yet. Click "Add New" to link a task.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setTaskToDeleteId(null);
                }}
                onConfirm={handleConfirmDeleteTask}
                title="Unlink Task"
                message="Are you sure you want to unlink this task? This will remove the connection between the task and this non-conformance evaluation."
            />
        </div>
    );
};

export default NonConformanceDetail;

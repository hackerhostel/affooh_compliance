import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import { selectSelectedProject } from "../../../state/slice/projectSlice.js";
import { useToasts } from "react-toast-notifications";
import { reviewAuditApi } from "../../../utils/reviewAuditApi.js";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";

const AddTaskModal = ({ isOpen, onClose, evaluationId, existingTasks = [], onTasksUpdated }) => {
    const selectedProject = useSelector(selectSelectedProject);
    const { addToast } = useToasts();

    const [taskOptions, setTaskOptions] = useState([]);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && selectedProject?.id) fetchTasks();
    }, [isOpen, selectedProject?.id]);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/tasks/by-project/${selectedProject.id}`);
            const body = res.data?.body;
            const list = Array.isArray(body) ? body : (body?.tasks ?? body?.data ?? []);
            const existingIds = new Set(existingTasks.map(t => String(t.taskID ?? t.id)));
            setTaskOptions(list.map(t => ({
                label: `${t.code || "#" + t.id} - ${t.name || t.title}`,
                value: String(t.id),
                isDisabled: existingIds.has(String(t.id))
            })));
        } catch {
            addToast("Failed to fetch tasks", { appearance: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedTasks([]);
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedTasks.length === 0) return;
        setSubmitting(true);
        try {
            for (const task of selectedTasks) {
                await reviewAuditApi.linkTaskToEvaluation(evaluationId, { taskId: task.value });
            }
            addToast("Tasks linked successfully", { appearance: "success" });
            if (onTasksUpdated) onTasksUpdated();
            handleClose();
        } catch {
            addToast("Failed to link tasks", { appearance: "error" });
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const customStyles = {
        control: (provided) => ({
            ...provided,
            borderRadius: "0.75rem",
            padding: "4px",
            borderColor: "#e2e8f0",
            boxShadow: "none",
            "&:hover": { borderColor: "#ec4899" }
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? "#ec4899" : state.isFocused ? "#fce7f3" : "white",
            color: state.isSelected ? "white" : "#374151",
            cursor: state.isDisabled ? "not-allowed" : "pointer"
        })
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-[1000]">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl mx-4">
                <div className="flex justify-between items-center mb-8">
                    <h4 className="text-lg font-bold text-[#1E293B]">Link Tasks</h4>
                    <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <XMarkIcon className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block text-center">
                            Select Tasks
                        </label>
                        <Select
                            isMulti
                            options={taskOptions}
                            value={selectedTasks}
                            onChange={(val) => setSelectedTasks(val || [])}
                            placeholder="Search and select tasks..."
                            styles={customStyles}
                            isLoading={loading}
                            isDisabled={submitting}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={submitting}
                            className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || selectedTasks.length === 0}
                            className="px-8 py-2.5 rounded-xl bg-primary-pink text-white font-semibold shadow-lg shadow-pink-200 hover:bg-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Linking..." : "Link Tasks"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTaskModal;
